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
    useMantineTheme,
    Collapse,
    ActionIcon,
} from "@mantine/core";
import { IconMicrophone, IconX } from "@tabler/icons";
import Dictaphone from "../components/Dictaphone";



function Dashboard() {
    const { authUser, loading, enrolled } = useAuth();
    const theme = useMantineTheme();
    const router = useRouter();
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const [activeListening, setActiveListening] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [Type, setType] = useState(false);

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

    // Generate a response to the user's input text using the Dialogflow API. Then display the response using Typed.js
    useEffect(() => {
        console.log("active listening triggered");
        if (text !== "" && !activeListening) {
            console.log("Completed: " + text);
            setConversation((conversation) => [
                { text: text, type: "user" },
                ...conversation,
            ]);
            var response = "Hello, how are you?";
            // wait 2 seconds to simulate a delay in the response
            setTimeout(() => {
                setConversation((conversation) => [
                    { text: response, type: "bot" },
                    ...conversation,
                ]);
                setType(true);
            }, 2000);
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
                                setOpen={setOpen}
                                open={open}
                                setActiveListening={setActiveListening}
                            />
                        }
                    />
                    <Collapse in={open}>
                        <Container size="lg">
                            <Paper p="md">
                                <Container
                                    size="md"
                                    p="sm"
                                    mb="sm"
                                    style={{
                                        backgroundColor: "#f6f6f6",
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
                                            style={{
                                                backgroundColor: "#ffffff",
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
                                            }}
                                        >
                                            <Text size="sm">
                                                {text}
                                                <Loader
                                                    color="dark"
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
                </>
            )}
        </Container>
    );
}

export default Dashboard;

/*
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
                        >
                            <Text id="typed-text" align="right"></Text>
                        </Paper>
*/
