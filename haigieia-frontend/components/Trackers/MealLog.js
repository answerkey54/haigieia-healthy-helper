import {
    Avatar,
    Center,
    Collapse,
    ColorPicker,
    Container,
    Group,
    Paper,
    Progress,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useElementSize, useHover } from "@mantine/hooks";
import React, { useRef } from "react";

function MealLog() {
    //FIXME - This is a placeholder for the meal log. It will be replaced with a firebase call
    const meals = [
        {
            item: "Chicken Breast",
            weight: 250,
            calories: 200,
            protein: 30,
            carbs: 0,
            fat: 4,
        },
        {
            item: "Rice",
            weight: 100,
            calories: 200,
            protein: 4,
            carbs: 40,
            fat: 1,
        },
        {
            item: "Broccoli",
            weight: 100,
            calories: 50,
            protein: 2,
            carbs: 10,
            fat: 0,
        },
    ];
    const goals = [
        {
            title: "Calories",
            value: 3200,
            goal: 2500,
            unit: "kcal",
            checkColor: "green",
        },
        {
            title: "Protein",
            value: 100,
            goal: 150,
            unit: "g",
            checkColor: "blue",
        },
        {
            title: "Carbs",
            value: 200,
            goal: 200,
            unit: "g",
            checkColor: "red",
        },
        {
            title: "Fat",
            value: 50,
            goal: 100,
            unit: "g",
            checkColor: "yellow",
        },
    ];

    const MealCard = ({ meal, color }) => {
        const { hovered, ref } = useHover();
        const { sizeRef, width, height } = useElementSize();

        // get first letter of each word in item name limit to 2 letters
        const initials = meal.item
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2);

        return (
            <Paper shadow="xs" radius="md" p="sm" ref={ref}>
                <Group spacing="sm">
                    <Avatar
                        src={"image" in meal ? meal.image : null}
                        variant="filled"
                        radius="xl"
                        size="lg"
                        color={color}
                    >
                        {initials}
                    </Avatar>
                    <Stack spacing={0}>
                        <Title order={4}>{meal.item}</Title>
                        <Group>
                            <Text color="red.3">🔥{meal.calories}kcal</Text>
                            <Text color="gray">⚖️{meal.weight}g</Text>
                        </Group>
                    </Stack>
                </Group>
                <Collapse in={hovered}>
                    <Group position="center" spacing="sm" grow mt={20}>
                        <Stack spacing={0} pl={10}>
                            <Title order={6}>{meal.protein}g</Title>
                            <Text size="xs" color="gray">
                                Protein
                            </Text>
                            <Progress color={color} value={parseInt((meal.protein/goals[1].goal)*100)} style={{width: '50px', transform: ''}} />
                        </Stack>
                        <Stack spacing={0} pl={10}>
                            <Title order={6}>{meal.carbs}g</Title>
                            <Text size="xs" color="gray">
                                Carbs
                            </Text>
                            <Progress color={color} value={parseInt((meal.carbs/goals[2].goal)*100)} style={{width: '50px'}}/>
                        </Stack>
                        <Stack spacing={0} pl={10} style={{ width: '50px'}}>
                            <Title order={6}>{meal.fat}g</Title>
                            <Text size="xs" color="gray">
                                Fat
                            </Text>
                            <Progress color={color} value={parseInt((meal.fat/goals[3].goal)*100)} style={{width: '50px'}}/>
                        </Stack>
                    </Group>
                </Collapse>
            </Paper>
        );
    };

    // function to get random color and number string
    const randomColor = () => {
        const colors = [
            "blue",
            "red",
            "yellow",
            "green",
            "indigo",
            "teal",
            "pink",
            "gray",
            "orange",
            "grape",
            "cyan",
            "violet",
            "lime",
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        // get randomNuber 2 through 9
        const randomNumber = Math.floor(Math.random() * 8) + 2;
        return `${randomColor}.${randomNumber}`;
    };

    return (
        <Container style={{ backgroundColor: "#f6f6f6" }} p="sm">
            <Title order={3} align="center" mb={30}>
                Recent Meals
            </Title>
            <Stack>
                {meals.map((meal, index) => (
                    <MealCard key={index} meal={meal} color={randomColor()} />
                ))}
            </Stack>
        </Container>
    );
}

export default MealLog;
