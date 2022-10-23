import { useState, useEffect } from "react";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { useAuth } from "../context/authUserContext";
import { database } from "./firebaseAuth";

export function useFirebaseDatabase() {
    const { authUser } = useAuth();
    const [waterGoal, setWaterGoal] = useState(null);
    const [mealLog, setMealLog] = useState(null);
    const [nutritionLog, setNutritionLog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authUser) {
            fetchUserData(authUser);
        }
    }, [authUser]);

    const fetchUserData = async (authUser) => {
        const userRef = ref(database);
        const user = await get(child(userRef, `data/${authUser.uid}`))
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
        setWaterGoal(user.water_goal);
        setMealLog(user.mealLog);
        setNutritionLog(user.nutritionLog);
        setLoading(false);
    };

    const updateWaterGoal = async (waterGoal) => {
        const userRef = ref(database);
        await set(child(userRef, `users/${authUser.uid}/waterGoal`), waterGoal);
        setWaterGoal(waterGoal);
    };

    const appendMealLog = async (mealLog) => {
        const userRef = ref(database);
        await set(child(userRef, `users/${authUser.uid}/mealLog`), mealLog);
        setMealLog(mealLog);
    };

    const updateNutritionLog = async (nutritionLog) => {
        const userRef = ref(database);
        await set(
            child(userRef, `users/${authUser.uid}/nutritionLog`),
            nutritionLog
        );
        setNutritionLog(nutritionLog);
    };

    return {
        waterGoal,
        mealLog,
        nutritionLog,
        loading,
        updateWaterGoal,
        appendMealLog,
        updateNutritionLog,
    };
}
