import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/authUserContext";
import {
    Container,
    Grid,
} from "@mantine/core";
import DashboardCard from "../components/DashboardCard";
import MainGoal from "../components/Trackers/MainGoal";
import WaterGoal from "../components/Trackers/WaterGoal";

function Test() {
    const { authUser, loading, enrolled } = useAuth();
    const router = useRouter();

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

    return (
        <Container size="xl">
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
