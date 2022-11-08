import React, { useEffect, useState } from "react";
import { useRouter, withRouter } from "next/router";
import Typed from "typed.js";
import { useAuth } from "../context/authUserContext";
import {
    Container,
    Center,
    Loader,
    Divider,
    Title,
    Text,
    Paper,
    useMantineTheme,
    Collapse,
    ActionIcon,
    Grid,
    Button,
} from "@mantine/core";
import { IconX } from "@tabler/icons";
import Dictaphone from "../components/Dictaphone";
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
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const [activeListening, setActiveListening] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [Type, setType] = useState(false);
    const theme = useMantineTheme();

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

    // Generate a response to the user's input text using the Dialogflow API. Then display the response using Typed.js
    useEffect(() => {
        if (text !== "" && !activeListening) {
            console.log("Completed: " + text);
            setConversation((conversation) => [
                { text: text, type: "user" },
                ...conversation,
            ]);
            // if text contains 'water' call updateWaterGoal from useDatabase
            var response = "Sorry, I didn't understand that.";
            if (text.includes("water")) {
                updateWaterLevel(1);
                response = "Okay, I'm adding a glass of water to your log.";
            }
            if (text.includes("quesadilla")) {
                const meal = {
                    item: "Quesadilla",
                    calories: 500,
                    protein: 50,
                    carbs: 30,
                    fat: 25,
                    weight: 250,
                };
                updateMealLog(meal);
                updateMainGoal("calories", 500);
                updateMainGoal("protein", 50);
                updateMainGoal("carbs", 30);
                updateMainGoal("fat", 25);
                response = "Okay, I'm adding a quesadilla to your meal log.";
            }

            // wait 2 seconds to simulate a delay in the response
            setTimeout(() => {
                setConversation((conversation) => [
                    { text: response, type: "bot" },
                    ...conversation,
                ]);
                setType(true);
            }, 1000);
            console.log(conversation);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeListening]);

    const Conversation = conversation.map((item, index) => (
        <Paper
            key={index}
            shadow="md"
            radius="md"
            p="xs"
            m="xs"
            style={{
                backgroundColor:
                    item.type === "user" ? "#ffffff" : "lightsteelblue",
                maxWidth: "80%",
                float: item.type === "user" ? "left" : "right",
                marginLeft:
                    item.type === "user"
                        ? "0"
                        : `calc(50% - ${
                              (1 -
                                  (250 - Math.min(item.text.length, 250)) /
                                      250) *
                              50
                          }%)`,
                marginRight:
                    item.type === "user"
                        ? `calc(50% - ${
                              (1 -
                                  (250 - Math.min(item.text.length, 250)) /
                                      250) *
                              50
                          }%)`
                        : "0",
            }}
        >
            <Text size="sm">{item.text}</Text>
        </Paper>
    ));

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
                    <Title order={4}>
                        Welcome,{" "}
                        <span style={{ color: "steelblue" }}>
                            {authUser.displayName}
                        </span>{" "}
                    </Title>
                    <Divider
                        my={20}
                        labelPosition="center"
                        label={
                            <Dictaphone
                                setText={setText}
                                setOpen={setOpen}
                                open={open}
                                setActiveListening={setActiveListening}
                            />
                        }
                    />
                    <Collapse in={open} mb={40}>
                        <Container size="lg">
                            <Paper p="md">
                                <Container
                                    size="md"
                                    p="sm"
                                    mb="sm"
                                    style={{
                                        borderRadius: "10px",
                                        maxHeight: "400px",
                                        overflowY: "scroll",
                                    }}
                                >
                                    {activeListening ? (
                                        <Paper
                                            shadow="md"
                                            radius="md"
                                            p="xs"
                                            m="xs"
                                            styles={(theme) => ({
                                               
                                                maxWidth: "80%",
                                                float: "left",
                                                marginRight: `calc(50% - ${
                                                    (1 -
                                                        (250 -
                                                            Math.min(
                                                                text.length,
                                                                250
                                                            )) /
                                                            250) *
                                                    50
                                                }%)`,
                                            })}
                                        >
                                            <Text size="sm">
                                                {text}
                                                <Loader
                                                    color={theme.colors.blue[5]}
                                                    size="xs"
                                                    variant="dots"
                                                    pl={1}
                                                />
                                            </Text>
                                        </Paper>
                                    ) : (
                                        <></>
                                    )}
                                    {Conversation}
                                </Container>
                                <Center>
                                    <ActionIcon
                                        onClick={() => setOpen(false)}
                                        color="dark"
                                        size="lg"
                                    >
                                        <IconX size={16} />
                                    </ActionIcon>
                                </Center>
                            </Paper>
                        </Container>
                    </Collapse>
                    <Container size="xl" mb={50}>
                        <Grid grow>
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
