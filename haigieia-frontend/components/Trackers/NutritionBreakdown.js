import { Center, Container, RingProgress, Title } from "@mantine/core";
import React from "react";

function NutritionBreakdown() {
    const goals = [
        {
            title: "Protein",
            value: 25,
            goal: 30,
            unit: "g",
            color: theme.colors.blue[4],
            checkColor: "blue",
        },
        {
            title: "Carbohydrates",
            value: 56,
            goal: 55,
            unit: "g",
            color: theme.colors.red[5],
            checkColor: "red",
        },
        {
            title: "Fat",
            value: 19,
            goal: 15,
            unit: "g",
            color: theme.colors.yellow[4],
            checkColor: "yellow",
        },
    ];

    return (
        <Container style={{ backgroundColor: "#f6f6f6" }} p="sm">
            <Title order={3} align="center">
                Nutrition
            </Title>
            <Center>
                <RingProgress
                    size={150}
                    thickness={40}
                    sections={[
                        {
                            value: 40,
                            color: "cyan",
                            tooltip: "Documents – 40 Gb",
                        },
                        { value: 25, color: "orange", tooltip: "Apps – 25 Gb" },
                        { value: 15, color: "grape", tooltip: "Other – 15 Gb" },
                    ]}
                />
            </Center>
        </Container>
    );
}

export default NutritionBreakdown;
