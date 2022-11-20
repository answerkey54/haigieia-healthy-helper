import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  getAdditionalUserInfo,
} from "firebase/auth";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";

const app = initializeApp(firebaseConfig);
/* Firebase authentication mechanism */
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* Firebase Realtime Database mechanism */
export const database = getDatabase(app);

const init_data = {
  water_goal: {
    value: 0,
    goal: 10,
  },
  main_goal: [
    {
      "goal": 2200,
      "title": "Calories",
      "value": 0
    },
    {
      "goal": 100,
      "title": "Protein",
      "value ": 0
    },
    {
      "goal": 200,
      "title": "Carbs",
      "value": 0
    },
    {
      "goal": 100,
      "title": "Fat",
      "value": 0
    }
  ],
  meal_log: []
}

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  /* add more props as needed */
});

export function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  const authStateChanged = async (authState) => {
    if (!authState) {
      // invalid authState, logged out
      setAuthUser(null);
      setLoading(false);
      setEnrolled(false);
      return;
    }
    // valid authState, logged in
    setLoading(true);

    const userRef = ref(database);
    const user = await get(child(userRef, `users/${authState.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          return snapshot.val();
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });

    user['uid'] = authState.uid;
    if ('role' in user) {
        setEnrolled(true);
    }

    var formattedUser = formatAuthUser(user);
    console.log("formatted user", formattedUser);
    setAuthUser(formattedUser);
    setLoading(false); // authentication complete
  };

  // firebase state change listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  const clear = () => {
    console.log("clearing provider");
    setAuthUser(null);
    setLoading(false);
    setEnrolled(false);
  };

  const signInPassword = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log(result);
        // TODO: fetch user db entry and manually set authUser here or should we use the formattedUser to fetch db entry?
        setEnrolled(true);
        return {
          error: false,
          route: "/dashboard",
        };
      })
      .catch((error) => {
        return {
          error: true,
          code: error.code,
          message: error.message,
        };
      });

  const createUserPassword = (data) =>
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((result) => {
        set(ref(database, `users/${result.user.uid}`), {
          email: data.email,
          displayName: data.displayName,
          photoURL: null,
          metadata: {
            creationTime: result.user.metadata.creationTime,
            lastSignInTime: result.user.metadata.lastSignInTime,
          },
          enrolled: true,
          role: data.role,
        }).then(() => {
          console.log("user db created");
        });
        set(ref(database, `data/${result.user.uid}/`), init_data);
        setEnrolled(true);
        return {
          error: false,
          route: "/dashboard",
        };
      })
      .catch((error) => {
        return {
          error: true,
          code: error.code,
          message: error.message,
        };
      });

  const googleLogin = async () =>
    signInWithPopup(auth, provider)
      .then((result) => {
        const additionalUserInfo = getAdditionalUserInfo(result);
        if (additionalUserInfo.isNewUser) {
          console.log("creating new user");
          set(ref(database, `users/${result.user.uid}`), {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            metadata: {
              creationTime: result.user.metadata.creationTime,
              lastSignInTime: result.user.metadata.lastSignInTime,
            },
            enrolled: false,
            role: null,
          });
          set(ref(database, `data/${result.user.uid}/`), init_data);
          return {
            error: false,
            route: "/auth/enroll",
          };
        } else {
          // TODO: fetch user db entry and manually set authUser here or should we use the formattedUser to fetch db entry?
          // Extra logic here if not-persistent and user quit while enrolling
          /*  Flow:
                    first time login -> enrolling -> quits (sign-out due to persistence) -> regular login (HERE) -> force enrollment
                */
          setEnrolled(true);
          return {
            error: false,
            route: "/dashboard",
          };
        }
      })
      .catch((error) => {
        console.log("here");
        return {
          error: true,
          code: error.code,
          message: error.message,
        };
      });

  const enrollGoogle = async (data) => {
    // if not signed in, sign in first
    if (!authUser) {
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("creating new user");
          set(ref(database, `users/${result.user.uid}`), {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            metadata: {
              creationTime: result.user.metadata.creationTime,
              lastSignInTime: result.user.metadata.lastSignInTime,
            },
            enrolled: true,
            role: data.title,
          });
          set(ref(database, `data/${result.user.uid}/`), init_data);
          setEnrolled(true);
          return {
            error: false,
            route: "/auth/enroll",
          };
        })
        .catch((error) => {
          console.log("here in enroll");
          return {
            error: true,
            code: error.code,
            message: error.message,
          };
        });
    } else {
      set(ref(database, `users/${authUser.uid}/role`), data.title);
      setEnrolled(true);
      return {
        error: false,
        route: "/dashboard",
      };
    }
  };

  const signOutUser = () =>
    signOut(auth).then(() => {
      console.log("Signing out!");
      clear();
    });

  return {
    authUser,
    loading,
    enrolled,
    signInPassword,
    createUserPassword,
    googleLogin,
    enrollGoogle,
    signOutUser,
  };
}
