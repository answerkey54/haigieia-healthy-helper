import {
    Box,
    Center,
    Container,
    Group,
    RingProgress,
    Select,
    Skeleton,
    Space,
    Stack,
    Text,
    ThemeIcon,
    Title,
    useMantineTheme,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import React, { useState } from "react";
import { useDatabase } from "../../context/userDataContext";

function MainGoal() {
    const [goal, setGoal] = useState(0);
    const theme = useMantineTheme();
    const { mainGoal, loading } = useDatabase();
    console.log(mainGoal,goal);

    const GOAL_CONST = [
        {
            unit: "kcal",
            color: theme.colors.green[4],
            checkColor: "green",
        },
        {
            unit: "g",
            color: theme.colors.blue[4],
            checkColor: "blue",
        },
        {
            unit: "g",
            color: theme.colors.red[5],
            checkColor: "red",
        },
        {
            unit: "g",
            color: theme.colors.yellow[4],
            checkColor: "yellow",
        },
    ];

    // get index of goal with title
    const getGoalIndex = (title) => {
        return mainGoal.findIndex((goal) => goal.title === title);
    };

    // get indecies of all goals not selected
    const getOtherGoals = (title) => {
        return mainGoal
            .map((goal, index) => {
                if (goal.title !== title) {
                    return index;
                }
            })
            .filter((index) => index !== undefined);
    };

    return (
        <Container sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.fn.lighten(theme.colors.gray[1], 0.1), borderRadius: '10px' })} p="sm" >
            {loading ? (
                <Center>
                    <Skeleton height={10} radius="md" mb="lg" />
                    <Skeleton height={120} circle mb="xl" />
                    <Skeleton height={24} radius="xl" mb="lg" />
                </Center>
            ) : (
                <>
                    <Select
                        data={mainGoal.map((goal) => goal.title)}
                        value={mainGoal[goal].title}
                        onChange={(value) => setGoal(getGoalIndex(value))}
                        label={
                            <Title order={3} align="center">
                                Nutrition
                            </Title>
                        }
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
                                    value:
                                        (mainGoal[goal].value / mainGoal[goal].goal) *
                                        100,
                                    color: GOAL_CONST[goal].color,
                                },
                            ]}
                            label={
                                mainGoal[goal].value < mainGoal[goal].goal ? (
                                    <Text
                                        color={GOAL_CONST[goal].color}
                                        weight={700}
                                        align="center"
                                        size="xl"
                                    >
                                        {parseInt(
                                            (mainGoal[goal].value /
                                                mainGoal[goal].goal) *
                                                100
                                        )}
                                        %
                                    </Text>
                                ) : (
                                    <Center>
                                        <ThemeIcon
                                            color={GOAL_CONST[goal].checkColor}
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
                        <Text
                            weight={400}
                            style={{ fontSize: "30px" }}
                            color={GOAL_CONST[goal].color}
                        >
                            {mainGoal[goal].value}
                        </Text>
                        <Space w={4} />
                        <Text weight={400} size="xs" color={GOAL_CONST[goal].color}>
                            {GOAL_CONST[goal].unit}
                            <Space h={0} />/{mainGoal[goal].goal}
                            {GOAL_CONST[goal].unit}
                        </Text>
                    </Center>
                    <Group
                        position="apart"
                        sx = {(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.fn.lighten(theme.colors.gray[0], 0.1), borderRadius: '10px', })}
                        p="md"
                        noWrap
                    >
                        {getOtherGoals(mainGoal[goal].title).map((cur, index) => (
                            <Stack spacing={0} key={index}>
                                <Text
                                    weight={700}
                                    size="xs"
                                    color={GOAL_CONST[cur].color}
                                >
                                    {mainGoal[cur].title}
                                </Text>
                                <Text
                                    weight={300}
                                    style={{ fontSize: "20px" }}
                                    color={GOAL_CONST[cur].color}
                                >
                                    {mainGoal[cur].value}
                                    <span style={{ fontSize: "8px" }}>
                                        {GOAL_CONST[cur].unit}
                                    </span>
                                </Text>
                            </Stack>
                        ))}
                    </Group>
                </>
            )}
        </Container>
    );
}

export default MainGoal;
