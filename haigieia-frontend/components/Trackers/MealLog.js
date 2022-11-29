import {
    Avatar,
    Button,
    Center,
    Collapse,
    ColorPicker,
    Container,
    Group,
    Paper,
    Progress,
    Skeleton,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useElementSize, useHover } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import React, { useRef } from "react";
import { useDatabase } from "../../context/userDataContext";

function MealLog() {
    const { mealLog, mainGoal, loading, updateMealLog } = useDatabase();
    //FIXME - This is a placeholder for the meal log. It will be replaced with a firebase call

    const MealCard = ({ meal, color }) => {
        const { hovered, ref } = useHover();

        // get first letter of each word in item name limit to 2 letters
        const initials = meal.item
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2);

        return (
            <Paper shadow={hovered ? "lg" : "xs"} radius="md" p="sm" ref={ref}>
                <Group spacing="sm" style={{ minWidth: "200px" }}>
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
                    <Group position="center" spacing="md" grow mt={20} noWrap>
                        <Stack spacing={0} pl={10}>
                            <Title order={6}>{meal.protein}g</Title>
                            <Text size="xs" color="gray">
                                Protein
                            </Text>
                            <Progress
                                color={color}
                                value={parseInt(
                                    (meal.protein / mainGoal[1].goal) * 100
                                )}
                                style={{ width: "50px" }}
                            />
                        </Stack>
                        <Stack spacing={0} pl={10}>
                            <Title order={6}>{meal.carbs}g</Title>
                            <Text size="xs" color="gray">
                                Carbs
                            </Text>
                            <Progress
                                color={color}
                                value={parseInt(
                                    (meal.carbs / mainGoal[2].goal) * 100
                                )}
                                style={{ width: "50px" }}
                            />
                        </Stack>
                        <Stack spacing={0} pl={10} style={{ width: "50px" }}>
                            <Title order={6}>{meal.fat}g</Title>
                            <Text size="xs" color="gray">
                                Fat
                            </Text>
                            <Progress
                                color={color}
                                value={parseInt(
                                    (meal.fat / mainGoal[3].goal) * 100
                                )}
                                style={{ width: "50px" }}
                            />
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
        <Container sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.fn.lighten(theme.colors.gray[1], 0.1), borderRadius: '10px' })} p="sm">
            <Title order={3} align="center" mb={30}>
                Recent Meals
            </Title>
            {loading ? (
                <Center>
                    <Skeleton height={16} radius="md" />
                    <Skeleton height={120} circle mb="xl" />
                    <Skeleton height={8} radius="xl" />
                </Center>
            ) : (
                <Stack
                    style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        padding: "0 10px 0 10px",
                    }}
                >
                    {mealLog.length > 0 ? (
                    mealLog.slice(0).reverse().map((meal, index) => (
                        <MealCard
                            key={index}
                            meal={meal}
                            color={randomColor()}
                        />
                    )))
                     : (
                        <Stack>
                        <Text align="center" color="gray">
                            No meals logged yet.
                        </Text> 
                        <Text align="center" color="gray">
                            Add a meal to get started
                        </Text>
                        <Button component={NextLink} href="/">
                            Add Meal
                        </Button>
                        </Stack>
                    )}
                </Stack>
            )}
        </Container>
    );
}

export default MealLog;
