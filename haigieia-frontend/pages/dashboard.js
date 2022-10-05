import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
    createStyles,
    Space,
} from "@mantine/core";
import Dictaphone from "../components/Dictaphone";

const useStyles = createStyles((theme) => ({
    response: {
        float: "right",
    },
}));

function Dashboard() {
    const { authUser, loading, enrolled, createUserPassword } = useAuth();
    const router = useRouter();
    const [text, setText] = useState("");
    const [listening, setListening] = useState(false);
    const [activeListening, setActiveListening] = useState(false);
    const { classes } = useStyles();

    const [Type, setType] = useState(false);

    useEffect(() => {
        if (!loading) {
            const typed = new Typed("#typed-text", {
                strings: [
                    "Hi, I'm Haigieia. I'm here to help you with your physical health",
                ],
                startDelay: 100,
                backSpeed: 40,
                typeSpeed: 70,
                backDelay: 250,
                showCursor: false,
            });

            return () => {
                typed.reset(false);
            };
        }
    }, [loading]);

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
            {loading ? (
                <Center style={{ height: "80vh" }}>
                    <Loader size="xl" />
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
                                setListening={setListening}
                                listeningProp={listening}
                                setActiveListening={setActiveListening}
                            />
                        }
                    />
                    <Container
                        visible={listening}
                        size="sm"
                        p="xl"
                        style={{
                            backgroundColor: "#d6d6d6",
                            borderRadius: "10px",
                        }}
                    >
                        <Paper
                            shadow="md"
                            radius="md"
                            p="md"
                            style={{ maxWidth: "fit-content", display: "flex" }}
                        >
                            <Text>
                                {text}
                                {activeListening ? (
                                    <Loader
                                        color="dark"
                                        size="xs"
                                        variant="dots"
                                        pl={1}
                                    />
                                ) : (
                                    <></>
                                )}
                            </Text>
                        </Paper>
                        <Space h="md" />
                        <Paper
                            shadow="md"
                            radius="md"
                            p="md"
                            style={{
                                maxWidth: "fit-context",
                                backgroundColor: "lightsteelblue",
                            }}
                            onClick={() => {
                                setType(!Type);
                            }}
                        >
                            <Text id="typed-text" align="right"></Text>
                        </Paper>
                    </Container>
                </>
            )}
        </Container>
    );
}

export default Dashboard;
