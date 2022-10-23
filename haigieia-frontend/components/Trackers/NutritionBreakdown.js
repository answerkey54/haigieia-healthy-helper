import {
    Center,
    Container,
    RingProgress,
    Title,
    useMantineTheme,
} from "@mantine/core";
import React, { useState } from "react";
import EmojiIcon from "../../shared/EmojiIcon";

function NutritionBreakdown() {
    const theme = useMantineTheme();
    const goals = [
        {
            title: "Protein",
            value: 25,
            goal: 30,
            unit: "g",
            color: theme.colors.blue[4],
            checkColor: "blue",
            emoji: "🥩",
        },
        {
            title: "Carbohydrates",
            value: 56,
            goal: 55,
            unit: "g",
            color: theme.colors.red[5],
            checkColor: "red",
            emoji: "🍞",
        },
        {
            title: "Fat",
            value: 19,
            goal: 15,
            unit: "g",
            color: theme.colors.yellow[4],
            checkColor: "yellow",
            emoji: "🥑",
        },
    ];
    const [hovered, setHovered] = useState(-1);
    const reset = () => setHovered(-1);

    return (
        <Container style={{ backgroundColor: "#f6f6f6" }} p="sm">
            <Title order={3} align="center">
                Nutrition Breakdown
            </Title>
            <Center>
                <RingProgress
                    onMouseLeave={() => setHovered(-1)}
                    size={180}
                    thickness={27}
                    sections={goals.map((goal, index) => ({
                        value: goal.value,
                        color: goal.color,
                        tooltip: `${goal.title}: ${goal.value}%`,
                        onMouseEnter: () => setHovered(index),
                        onMouseLeave: reset,
                    }))}
                    label={
                        hovered === -1
                            ? ""
                            : <Center><EmojiIcon size="xl" emoji={goals[hovered].emoji} color={goals[hovered].color} /></Center>
                    }
                />
            </Center>
            <Title order={3} align="center" weight={500}>
                {hovered === -1 ? (
                    "hover chart for info"
                ) : (

                        `${goals[hovered].value}/${goals[hovered].goal}%`
                )}
            </Title>
        </Container>
    );
}

export default NutritionBreakdown;
