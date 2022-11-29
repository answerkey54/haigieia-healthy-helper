import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/authUserContext";
import {
    Container,
    Center,
    Loader,
    Title,
    Text,
    Paper,
    useMantineTheme,
    Grid,
    Button,
} from "@mantine/core";
import DashboardCard from "../components/DashboardCard";
import MainGoal from "../components/Trackers/MainGoal";
import WaterGoal from "../components/Trackers/WaterGoal";
import NutritionBreakdown from "../components/Trackers/NutritionBreakdown";
import EmojiIcon from "../shared/EmojiIcon";
import MealLog from "../components/Trackers/MealLog";
import { useDatabase } from "../context/userDataContext";
import Link from "next/link";

function Dashboard() {
    const { authUser, loading, enrolled } = useAuth();
    const { updateWaterLevel, updateMealLog, updateMainGoal } = useDatabase();
    const router = useRouter();
    const [conversation, setConversation] = useState([]);

    //console.log(authUser, loading, enrolled);

    useEffect(() => {
        if (!loading && !authUser && !enrolled) {
            console.warn("Not Authorized");
            router.push("/auth/login");
        }
        if (!loading && authUser && !enrolled) {
            console.log(authUser, enrolled, loading);
            console.info("Not enrolled");
            router.push("/auth/enroll");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, loading]);


    return (
        <Container size="xl">
            {loading || !authUser ? (
                <Center style={{ height: "80vh" }}>
                    {loading ? (
                        <Loader size="xl" />
                    ) : (
                        <>
                            <Text size="xl">
                                You are not authorized to view this page.
                            </Text>
                            <Link href={authUser ? "/dashboard" : "/"} passHref>
                                <Button
                                    component="a"
                                    variant="subtle"
                                    size="md"
                                    radius="lg"
                                >
                                    Take me back home
                                </Button>
                            </Link>
                        </>
                    )}
                </Center>
            ) : (
                <>
                    <Title order={3} mb={30}>
                        Welcome,{" "}
                        <span style={{color: "#7aa6d2"}} >
                            {authUser.displayName}
                        </span>{" "}
                    </Title>
                    
                    <Container size="xl" mb={50}>
                        <Grid grow >
                            <DashboardCard component={<MainGoal />} span={4} />
                            <DashboardCard component={<WaterGoal />} span={4} />
                            <DashboardCard
                                component={<NutritionBreakdown />}
                                span={4}
                            />
                            <DashboardCard component={<MealLog />} span={4} />
                        </Grid>
                    </Container>
                </>
            )}
        </Container>
    );
}

export default Dashboard;
