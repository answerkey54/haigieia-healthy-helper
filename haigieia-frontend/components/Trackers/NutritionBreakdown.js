import {
    Center,
    Container,
    Group,
    Loader,
    RingProgress,
    Stack,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";
import React, { useState } from "react";
import { useDatabase } from "../../context/userDataContext";
import EmojiIcon from "../../shared/EmojiIcon";

function NutritionBreakdown() {
    const theme = useMantineTheme();
    const { nutritionLog, loading } = useDatabase();

    const goals = [
        {
            title: "Protein",
            color: theme.colors.blue[4],
            checkColor: "blue",
            emoji: "🥩",
        },
        {
            title: "Carbohydrates",
            color: theme.colors.red[5],
            checkColor: "red",
            emoji: "🍞",
        },
        {
            title: "Fat",
            color: theme.colors.yellow[4],
            checkColor: "yellow",
            emoji: "🥑",
        },
    ];
    const [hovered, setHovered] = useState(-1);
    const reset = () => setHovered(-1);

    return (
        <Container
            sx={(theme) => ({
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[6]
                        : theme.fn.lighten(theme.colors.gray[1], 0.1),
                borderRadius: "10px",
                minHeight: "100%",
            })}
            p="sm"
        >
            <Title order={3} align="center">
                Nutrition Breakdown
            </Title>
            {!loading ? (
                <Stack justify="space-around">
                    <Center>
                        <RingProgress
                            onMouseLeave={() => setHovered(-1)}
                            size={180}
                            thickness={27}
                            sections={goals.map((goal, index) => ({
                                value: nutritionLog[index].value,
                                color: goal.color,
                                tooltip: `${goal.title}: ${nutritionLog[index].value}%`,
                                onMouseEnter: () => setHovered(index),
                                onMouseLeave: reset,
                            }))}
                            label={
                                hovered === -1 ? (
                                    ""
                                ) : (
                                    <Center>
                                        <EmojiIcon
                                            size="xl"
                                            emoji={goals[hovered].emoji}
                                            color={goals[hovered].color}
                                        />
                                    </Center>
                                )
                            }
                        />
                    </Center>

                    {hovered === -1 ? (
                        <Title order={2} align="center" weight={500}>
                            hover chart for info
                        </Title>
                    ) : (
                        <Group
                            position="center"
                            spacing={0}
                            styles={(theme) => ({
                                backgroundColor:
                                    theme.colorScheme === "dark"
                                        ? theme.colors.dark[6]
                                        : theme.colors.gray[0],
                            })}
                        >
                            <Text size={25} color={nutritionLog[hovered].value > nutritionLog[hovered].goal ? 'red.6' : 'green.6'}  >{nutritionLog[hovered].value}</Text>
                            <Title order={2} color={nutritionLog[hovered].value > nutritionLog[hovered].goal ? 'red.5' : 'green.5'}>
                                /
                            </Title>
                            <Text
                                size={25}
                                style={{ transform: "translateY(40%)" }}
                                color={nutritionLog[hovered].value > nutritionLog[hovered].goal ? 'red.4' : 'green.4'}
                            >
                                {nutritionLog[hovered].goal}%
                            </Text>
                        </Group>
                    )}
                </Stack>
            ) : (
                <Center>
                    <Loader size={40} />
                </Center>
            )}
        </Container>
    );
}

export default NutritionBreakdown;
