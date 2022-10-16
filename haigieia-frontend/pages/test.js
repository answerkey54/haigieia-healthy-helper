import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/authUserContext";
import {
    Container,
    Grid,
    Group,
    Button,
    Modal,
    createStyles,
    Center,
    keyframes,
    Title,
} from "@mantine/core";
import CountUp, { useCountUp } from "react-countup";
import DashboardCard from "../components/DashboardCard";
import MainGoal from "../components/Trackers/MainGoal";
import WaterGoal from "../components/Trackers/WaterGoal";

const useStyles = createStyles((theme, _params, getRef) => ({
    container: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "150px",
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
        background: "rgba(255, 255, 255, 0.5)",
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
        backgroundColor: "white",
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
        color: theme.colors.gray[7],
        mixBlendMode: "difference",
    },
}));

function Test() {
    const { authUser, loading, enrolled } = useAuth();
    const router = useRouter();
    const { classes } = useStyles();
    const input = 100;
    const goal = 200;

    useEffect(() => {
        if (!loading && !authUser && !enrolled) {
            console.warn("Not Authorized");
            router.push("/auth/login");
        }
        if (!loading && authUser && !enrolled) {
            console.info("Not enrolled");
            router.push("/auth/enroll");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, loading]);

    const handleGrow = () => {
        // fake input value and goal
        const height = (input / goal) * 150;
        const water = document.getElementById("water");
        const percent = parseInt(height/150 * 100);
        update(percent);
        water.style.height = `${height}px`;
    };

    const handleReset = () => {
        const water = document.getElementById("water");
        reset();
        water.style.height = "0px";
    };


    return (
        <Container size="xl">
            
            <Center p="md">
                <Button onClick={() => handleGrow()}>Grow</Button>
                <Button onClick={() => handleReset()}>reset</Button>
            </Center>
            <Grid grow>
                <DashboardCard component={<MainGoal/>} span={4}/>
                <DashboardCard component={<WaterGoal/>} span={4}/>
                <DashboardCard component={<MainGoal/>} span={4}/>
            </Grid>
        </Container>
    );
}

export default Test;

/*

<Title order={2}>
                    <CountUp end={100} duration={5} />
                </Title>
*/
