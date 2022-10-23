import {
    Box,
    Center,
    Container,
    Group,
    RingProgress,
    Select,
    Space,
    Stack,
    Text,
    ThemeIcon,
    Title,
    useMantineTheme,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import React, { useState } from "react";

function MainGoal() {
    const [goal, setGoal] = useState(0);
    const theme = useMantineTheme();

    const goals = [
        {
            title: "Calories",
            value: 3200,
            goal: 2500,
            unit: "kcal",
            color: theme.colors.green[4],
            checkColor: "green",
        },
        {
            title: "Protein",
            value: 100,
            goal: 150,
            unit: "g",
            color: theme.colors.blue[4],
            checkColor: "blue",
        },
        {
            title: "Carbs",
            value: 200,
            goal: 200,
            unit: "g",
            color: theme.colors.red[5],
            checkColor: "red",
        },
        {
            title: "Fat",
            value: 50,
            goal: 100,
            unit: "g",
            color: theme.colors.yellow[4],
            checkColor: "yellow",
        },
    ];

    // get index of goal with title
    const getGoalIndex = (title) => {
        return goals.findIndex((goal) => goal.title === title);
    };

    // get indecies of all goals not selected
    const getOtherGoals = (title) => {
        return goals
            .map((goal, index) => {
                if (goal.title !== title) {
                    return index;
                }
            })
            .filter((index) => index !== undefined);
    };

    return (
        <Container style={{ backgroundColor: "#f6f6f6" }} p="sm">
            <Select
                data={goals.map((goal) => goal.title)}
                value={goals[goal].title}
                onChange={(value) => setGoal(getGoalIndex(value))}
                label={<Title order={3} align="center">
                Nutrition
            </Title>}
                variant="filled"
                radius="xl"
                size="sm"
            />
            <Center>
                <RingProgress
                    size={150}
                    thickness={13}
                    roundCaps
                    sections={[
                        {
                            value: (goals[goal].value / goals[goal].goal) * 100,
                            color: goals[goal].color,
                        },
                    ]}
                    label={
                        goals[goal].value < goals[goal].goal ? (
                            <Text
                                color={goals[goal].color}
                                weight={700}
                                align="center"
                                size="xl"
                            >
                                {parseInt(
                                    (goals[goal].value / goals[goal].goal) * 100
                                )}
                                %
                            </Text>
                        ) : (
                            <Center>
                                <ThemeIcon
                                    color={goals[goal].checkColor}
                                    variant="light"
                                    radius="xl"
                                    size="xl"
                                >
                                    <IconCheck size={28} />
                                </ThemeIcon>
                            </Center>
                        )
                    }
                />
            </Center>
            <Center mb={10}>
                <Text weight={400} style={{ fontSize: "30px" }} color={goals[goal].color}>
                    {goals[goal].value}
                </Text>
                <Space w={4} />
                <Text weight={400} size="xs" color={goals[goal].color}>
                    {goals[goal].unit}
                    <Space h={0} />/{goals[goal].goal}
                    {goals[goal].unit}
                </Text>
            </Center>
            <Group position="apart" style={{ backgroundColor: "#fafafa" }} p="md" noWrap>
                {getOtherGoals(goals[goal].title).map((cur,index) => (
                    <Stack spacing={0} key={index}>
                        <Text weight={700} size="xs" 
                            color={goals[cur].color}>
                            {goals[cur].title}
                        </Text>
                        <Text weight={300} style={{ fontSize: "20px" }}  color={goals[cur].color}>
                            {goals[cur].value}
                        <span style={{ fontSize: "8px" }}>
                            {goals[cur].unit}
                        </span>
                        </Text>
                    </Stack>
                ))}
            </Group>
        </Container>
    );
}

export default MainGoal;
