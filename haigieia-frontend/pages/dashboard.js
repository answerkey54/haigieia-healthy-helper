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

function Dashboard() {
    const { authUser, loading, enrolled } = useAuth();
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
            var response = "Hello, how are you?";
            const options = {
                strings: [response],
                typeSpeed: 50,
                backSpeed: 50,
                loop: false,
                onComplete: () => {
                    // append the user's input to the chat
                    setConversation((conversation) => [
                        ...conversation,
                        { text: text, type: "user" },
                        { text: response, type: "bot" },
                    ]);
                    setText("");
                    Type.destroy()
                },
            };
            setType(new Typed("#typed-text", options));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeListening]);

    const Conversation = conversation.map((item, index) => (
        <Paper
            key={index}
            shadow="md"
            radius="md"
            p="xs"
            style={{
                maxWidth: "fit-context",
                backgroundColor:
                    item.type === "user" ? "#ffffff" : "lightsteelblue",
            }}
        >
            <Text size="md">{item.text}</Text>
            <Divider />
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
                    <Container
                        size="sm"
                        p="xl"
                        style={{
                            backgroundColor: "#f6f6f6",
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
                        >
                            <Text id="typed-text" align="right"></Text>
                        </Paper>
                        <Container fluid>{Conversation}</Container>
                    </Container>
                </>
            )}
        </Container>
    );
}

export default Dashboard;

/* NOTE: This is where you would send the text to the Dialogflow API and get a response. 
            fetch("/api/dialogflow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: text,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Response: " + data.response);
                    if (data.response !== "") {
                        strings = [data.response];
                    } else {
                        strings = ["Sorry, I didn't get that."];
                    }
                    const options = {
                        strings: [data.response],
                        typeSpeed: 50,
                        backSpeed: 50,
                        loop: false,
                        onComplete: () => {
                            setType(false);
                            setText("");
                        },
                    };
                    setType(new Typed("#typed", options));
                });
            */