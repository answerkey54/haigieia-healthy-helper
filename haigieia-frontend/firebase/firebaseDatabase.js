import { useState, useEffect } from "react";
import { onValue, ref, child, get, set, push } from "firebase/database";
import { useAuth } from "../context/authUserContext";
import { database } from "./firebaseAuth";

export function useFirebaseDatabase() {
    const { authUser } = useAuth();
    const [waterGoal, setWaterGoal] = useState(null);
    const [mealLog, setMealLog] = useState(null);
    const [mainGoal, setMainGoal] = useState(null);
    const [nutritionLog, setNutritionLog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authUser) {
            fetchUserData(authUser);
            startListeners(authUser);
        }
    }, [authUser]);

    const fetchUserData = async (authUser) => {
        const userRef = ref(database);
        const user = await get(child(userRef, `data/${authUser.uid}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
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
        setMainGoal(user.main_goal);
        setMealLog(user.meal_log || []);
        setNutritionLog(user.nutrition_log);
        setLoading(false);
    };

    const startListeners = (authUser) => {
        const waterGoalRef = ref(database, `data/${authUser.uid}/water_goal`);
        onValue(waterGoalRef, (snapshot) => {
            const data = snapshot.val();
            setWaterGoal(data);
        });
        const mainGoalRef = ref(database, `data/${authUser.uid}/main_goal`);
        onValue(mainGoalRef, (snapshot) => {
            const data = snapshot.val();
            setMainGoal(data);
        });
        const mealLogRef = ref(database, `data/${authUser.uid}/meal_log`);
        onValue(mealLogRef, (snapshot) => {
            const data = snapshot.val();
            setMealLog(data);
        });
        const nutritionLogRef = ref(
            database,
            `data/${authUser.uid}/nutrition_log`
        );
        onValue(nutritionLogRef, (snapshot) => {
            const data = snapshot.val();
            setNutritionLog(data);
        });
    };

    const setWaterLevel = async (waterGoal) => {
        const userRef = ref(database);
        await set(
            child(userRef, `data/${authUser.uid}/water_goal/value`),
            waterGoal
        );
        setWaterGoal(waterGoal);
    };

    const updateWaterLevel = async (waterLevel) => {
        const userRef = ref(database);
        await set(
            child(userRef, `data/${authUser.uid}/water_goal/value`),
            waterGoal.value + waterLevel
        );
    };

    /*
    meal = {
        item: "string",
        calories: "number",
        protein: "number",
        carbs: "number",
        fat: "number",
        weight: "number",
    }
    */
    const addMeal = async (meal) => {
        const userRef = ref(database);
        await addMealLog(meal);
        const categories = ["calories", "protein", "carbs", "fat"];
        categories.forEach(async (category) => {
            await updateMainGoal(category, meal[category], "add");
        });
    };

    const removeMeal = async (meal) => {
        const userRef = ref(database);
        await removeMealLog(meal);
        const categories = ["calories", "protein", "carbs", "fat"];
        categories.forEach(async (category) => {
            await updateMainGoal(category, meal[category], "subtract");
        });
    };

    const addMealLog = async (meal) => {
        const userRef = ref(database);
        const index = mealLog ? mealLog.length : 0;
        console.log('adding a meal to meallog', index, meal)
        await set(
            child(userRef, `data/${authUser.uid}/meal_log/${index}`),
            meal
        );
    };

    const removeMealLog = async (meal) => {
        const userRef = ref(database);
        // remove meal from local mealLog
        const newMealLog = mealLog.filter((item) => item !== meal);
        await set(
            child(userRef, `data/${authUser.uid}/meal_log/`),
            newMealLog
        );
    };

    const updateMainGoal = async (category, newVal, operation) => {
        const categories = ["calories", "protein", "carbs", "fat"];
        // get index of category
        const index = categories.indexOf(category);
        const userRef = ref(database);
        console.log('updating main goal', category, newVal, operation)
        if (operation === "subtract") {
            await set(
                child(userRef, `data/${authUser.uid}/main_goal/${index}/value`),
                mainGoal[index].value - newVal
            );
        } else {
            await set(
                child(userRef, `data/${authUser.uid}/main_goal/${index}/value`),
                mainGoal[index].value + newVal
            );
        }
    };

    const updateNutritionLog = async (index, newVal) => {
        const userRef = ref(database);
        console.log('updating nutrition log', index, newVal)
        await set(
            child(userRef, `data/${authUser.uid}/nutrition_log/${index}/value`),
            newVal
        );
    };

    return {
        waterGoal,
        mainGoal,
        mealLog,
        nutritionLog,
        loading,
        setWaterLevel,
        updateWaterLevel,
        addMeal,
        removeMeal,
    };
}
