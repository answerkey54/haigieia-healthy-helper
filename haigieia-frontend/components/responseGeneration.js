import { useDatabase } from "../components/useDatabase";


export const generateResponse = (text) => {
    const { updateWaterLevel, updateMealLog, updateMainGoal } = useDatabase();
    var response = "Sorry, I didn't understand that.";
    if (text.includes("water")) {
        updateWaterLevel(1);
        response = "Okay, I'm adding a glass of water to your log.";
    }
    if (text.includes("quesadilla")) {
        const meal = {
            item: "Quesadilla",
            calories: 500,
            protein: 50,
            carbs: 30,
            fat: 25,
            weight: 250,
        };
        updateMealLog(meal);
        updateMainGoal("calories", 500);
        updateMainGoal("protein", 50);
        updateMainGoal("carbs", 30);
        updateMainGoal("fat", 25);
        response = "Okay, I'm adding a quesadilla to your meal log.";
    }
    return response;
};