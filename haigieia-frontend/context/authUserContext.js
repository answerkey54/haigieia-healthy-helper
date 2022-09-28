import { createContext, useContext } from 'react'
import { useFirebaseAuth } from '../firebase/firebaseAuth';

const authUserContext = createContext({
  authUser: null,
  loading: true,
  enrolled: false,
  signInPassword: async () => {},
  createUserPassword: async () => {},
  googleLogin: async () => {},
  enrollGoogle: async () => {},
  signOutUser: async () => {}
});

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}

export const useAuth = () => useContext(authUserContext);