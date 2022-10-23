import { createContext, useContext } from 'react'
import { useFirebaseDatabase } from '../firebase/firebaseDatabase';

const userDataContext = createContext({
  waterGoal: null,
  mealLog: null,
  nutritionLog: null,
  loading: true,
  setWaterGoal: async () => {},
  appendMealLog: async () => {},
  updateNutritionLog: async () => {},
});

export function UserDataProvider({ children }) {
  const data = useFirebaseDatabase();
  return <userDataContext.Provider value={data}>{children}</userDataContext.Provider>;
}

export const useDatabase = () => useContext(userDataContext);