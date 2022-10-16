import {
    Center,
    Container,
    createStyles,
    RingProgress,
    Space,
    Text,
    ThemeIcon,
    Title,
    UnstyledButton,
    useMantineTheme,
} from "@mantine/core";
import { useCountUp } from "react-countup";
import React, { useEffect } from "react";

const useStyles = createStyles((theme, _params, getRef) => ({
    container: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "180px",
        padding: "10px",
        backgroundColor: "#f6f6f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px",
    },
    water: {
        ref: getRef("water"),
        backgroundColor: theme.colors.blue[5],
        width: "150px",
        height: "0px",
        borderRadius: "10px",
        transition: "height 3s ease-out",
    },
    glass: {
        background: "white",
        width: "150px",
        height: "150px",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
    },
    cover: {
        position: "absolute",
        bottom: 0,
        backgroundColor: "#f6f6f6",
        width: "150px",
        height: "150px",
        clipPath:
            "polygon(0% 0%, 0% 100%, 25% 100%, 15% 0, 85% 0, 75% 100%, 25% 100%, 25% 100%, 100% 100%, 100% 0%)",
    },
    countup: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        color: theme.colors.gray[9],
        mixBlendMode: "difference",
    },
}));

// create a component that returns a water bottle icon
function WaterBottle({ width = 24, height = 24, left = 0, right = 1 }) {
    const theme = useMantineTheme();

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-bottle"
            width={24}
            height={24}
            viewBox={`${left} 0 ${right} 24`}
            strokeWidth="2"
            stroke={theme.colors.blue[4]}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M10 5h4v-2a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v2z"></path>
            <path d="M14 3.5c0 1.626 .507 3.212 1.45 4.537l.05 .07a8.093 8.093 0 0 1 1.5 4.694v6.199a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2v-6.2c0 -1.682 .524 -3.322 1.5 -4.693l.05 -.07a7.823 7.823 0 0 0 1.45 -4.537"></path>
            <path d="M7.003 14.803a2.4 2.4 0 0 0 .997 -.803a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 1 -.805"></path>
        </svg>
    );
}

function WaterGoal() {
    const theme = useMantineTheme();
    const { classes } = useStyles();

    const water_goal = {
        title: "Water",
        value: 7.25,
        goal: 12,
        unit: "glasses",
        color: theme.colors.blue[4],
    };

    const { countUp, start, pauseResume, reset, update } = useCountUp({
        ref: "counter",
        start: 0,
        end: 100,
        delay: 0,
        duration: 3,
        startOnMount: false,
        suffix: "%",
        onReset: () => console.log("Resetted!"),
        onUpdate: () => console.log("Updated!"),
        onPauseResume: () => console.log("Paused or resumed!"),
        onStart: () => console.log("Started! 💨"),
        onEnd: () => console.log("Ended! 👏"),
    });

    useEffect(() => {
        const water = document.getElementById("water");
        
    }, []);

    useEffect(() => {
        const water = document.getElementById("water");
        water.style.transition = "none";
        water.style.height = `0px`;
        setTimeout(() => {
            const waterHeight = (water_goal.value / water_goal.goal) * 150;
            water.style.transition = "height 3s ease-out";
            water.style.height = `${waterHeight}px`;
            const percent = parseInt((water_goal.value / water_goal.goal) * 100);
            update(percent);
        }, 100);
    }, [water_goal]);

    return (
        <Container style={{ backgroundColor: "#f6f6f6" }} p="sm">
            <Text size="md" align="center">
                Water Goal
            </Text>
            <Center>
                <div id="container" className={classes.container}>
                    <div id="glass" className={classes.glass}>
                        <div id="water" className={classes.water}></div>
                        <div id="cover" className={classes.cover}></div>
                        <Title order={2} className={classes.countup}>
                            <div id="counter">0%</div>
                        </Title>
                    </div>
                </div>
            </Center>
            <Center mb={10}>
                <Text
                    weight={400}
                    style={{ fontSize: "30px" }}
                    color={water_goal.color}
                >
                    {water_goal.value}
                </Text>
                <Space w={4} />
                <Text weight={400} size="xs" color={water_goal.color}>
                    {water_goal.unit}
                    <Space h={0} />/{water_goal.goal}
                </Text>
            </Center>

            <WaterBottle left={-3} right={1} />
            <WaterBottle left={-2} right={1} />
            <WaterBottle left={-1} right={1} />
            <WaterBottle left={0} right={1} />
            <WaterBottle left={0} right={3} />
            <WaterBottle left={0} right={5} />
            <WaterBottle left={0} right={7} />
            <WaterBottle left={0} right={24} />
        </Container>
    );
}

export default WaterGoal;

// 16 increments from 0 to half
/*
<RingProgress
                    size={150}
                    thickness={13}
                    roundCaps
                    sections={[
                        {
                            value: (water_goal.value / water_goal.goal) * 100,
                            color: water_goal.color,
                        },
                    ]}
                    label={
                        water_goal.value < water_goal.goal ? (
                            <Text
                                color={water_goal.color}
                                weight={700}
                                align="center"
                                size="xl"
                            >
                                {parseInt(
                                    (water_goal.value / water_goal.goal) * 100
                                )}
                                %
                            </Text>
                        ) : (
                            <Center>
                                <ThemeIcon
                                    color="blue"
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
*/
