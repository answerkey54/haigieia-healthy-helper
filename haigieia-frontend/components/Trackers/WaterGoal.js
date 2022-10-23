import {
    ActionIcon,
    Center,
    Container,
    createStyles,
    Group,
    RingProgress,
    SimpleGrid,
    Space,
    Text,
    ThemeIcon,
    Title,
    UnstyledButton,
    useMantineTheme,
} from "@mantine/core";
import { useCountUp } from "react-countup";
import React, { useEffect, useState } from "react";
import { IconBottle, IconGlassFull } from "@tabler/icons";

const useStyles = createStyles((theme, _params, getRef) => ({
    container: {
        marginLeft: "auto",
        marginRight: "auto",
        minWidth: "250px",
        padding: "10px",
        backgroundColor: "#f6f6f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px",

        [theme.fn.smallerThan("xs")]: {
            minWidth: "0px",
        }
    },
    water: {
        ref: getRef("water"),
        backgroundColor: theme.colors.blue[4],
        width: "150px",
        height: "0px",
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
        width: "160px",
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
function WaterBottle({ width = 24, height = 24, left = 0, right = 24, style }) {
    const theme = useMantineTheme();

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-bottle"
            width={24}
            height={24}
            style={style}
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

function BottleView({ water, goal }) {
    const conversion = [
        { left: -3, right: 1 },
        { left: -2, right: 1 },
        { left: -1, right: 1 },
        { left: 0, right: 1 },
        { left: 0, right: 3 },
        { left: 0, right: 5 },
        { left: 0, right: 7 },
        { left: 0, right: 24 },
    ];
    const num = water / goal;
    const decimal = water - Math.floor(water);
    // convert decimal to closest 0.125
    console.log(decimal);
    const eigth = parseInt((Math.round(decimal * 8) / 8) * 8);
    console.log(eigth);
    // for num render a bottle
    const bottles = [];
    for (let i = 0; i < Math.floor(water); i++) {
        bottles.push(
            <Center>
                <WaterBottle />
            </Center>
        );
    }
    // for decimal render a bottle with a custom viewbox
    if (eigth > 0) {
        bottles.push(
            <Center>
                <WaterBottle
                    left={conversion[eigth - 1].left}
                    right={conversion[eigth - 1].right}
                    style={{ transform: "translateX(-50%)" }}
                />
            </Center>
        );
    }
    for (let i = 0; i < goal - Math.ceil(water); i++) {
        bottles.push(
            <Center>
                <WaterBottle style={{ opacity: 0.25 }} />
            </Center>
        );
    }
    return (
        <SimpleGrid
            cols={4}
            spacing="xs"
            verticalSpacing="sm"
            breakpoints={[
                { maxWidth: "sm", cols: 3 },
                { maxWidth: "md", cols: 4 },
            ]}
        >
            {bottles}
        </SimpleGrid>
    );
}

function WaterGoal() {
    const theme = useMantineTheme();
    const { classes } = useStyles();
    const [view, setView] = useState(true);

    const water_goal = {
        title: "Water",
        value: 7.5,
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
        preserveValue: true,
        redraw: true,
        suffix: "%",
        onReset: () => console.log("Resetted!"),
        onUpdate: () => console.log("Updated!"),
        onPauseResume: () => console.log("Paused or resumed!"),
        onStart: () => console.log("Started! 💨"),
        onEnd: () => console.log("Ended! 👏"),
    });

    useEffect(() => {
        if (view) {
            const water = document.getElementById("water");
            water.style.transition = "none";
            water.style.height = `0px`;
            setTimeout(() => {
                const waterHeight = (water_goal.value / water_goal.goal) * 150;
                water.style.transition = "height 3s ease-out";
                water.style.height = `${waterHeight}px`;
                const percent = parseInt(
                    (water_goal.value / water_goal.goal) * 100
                );
                update(percent);
            }, 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [water_goal]);

    const toggleView = () => {
        if (view) {
            setView(false);
        }else{
            setView(true);
            reset();
        }
    };


    return (
        <Container style={{ backgroundColor: "#f6f6f6", minWidth: "200px" }} p="sm" >
            <Title order={3} align="center">
            Water Goal
        </Title>
            <Center>
                {view ? (
                    <div id="container" className={classes.container}>
                        <div id="glass" className={classes.glass}>
                            <div id="water" className={classes.water}></div>
                            <div id="cover" className={classes.cover}></div>
                            <Title order={2} className={classes.countup}>
                                <div id="counter">0%</div>
                            </Title>
                        </div>
                    </div>
                ) : (
                    <BottleView
                        water={water_goal.value}
                        goal={water_goal.goal}
                    />
                )}
            </Center>
            <ActionIcon
                onClick={() => toggleView()}
            >
                {view ? <IconBottle /> : <IconGlassFull />}
            </ActionIcon>
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
        </Container>
    );
}

export default WaterGoal;
