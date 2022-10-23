import { getDatabase, ref, child, get, set } from "firebase/database";
import { useAuth } from '../context/authUserContext';
import { database } from "./firebaseAuth";


export const WriteMealData = async (meal) => {
    const { authUser }  = useAuth();
    set(ref(database, `users/${authUser.uid}/meals`), {
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
}
