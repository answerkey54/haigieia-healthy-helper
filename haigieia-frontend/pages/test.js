import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Typed from "typed.js";
import { useAuth } from "../context/authUserContext";
import {
    Container,
    Group,
    Button,
    Divider,
    Title,
    Text,
    Paper,
    useMantineTheme,
    Space,
    Modal,
} from "@mantine/core";
import Dictaphone from "../components/Dictaphone";

function Test() {
    const { authUser, loading, enrolled } = useAuth();
    const router = useRouter();
    const theme = useMantineTheme();
    const [conversation, setConversation] = useState([{text: "Added one glass of water to your day. You drank 95 fl oz of water today and are 85% of the way through your goal!", type: "bot"},{text: "Hello, how are you?", type: "user"}, {text: "Shorter response from the bot", type: "bot"},{text: "Hello, how are you?", type: "user"}, {text: "Added one glass of water to your day. You have drank 95 fl oz of water today and are 85% of the way through your goal!", type: "bot"},{text: "Hello, how are you?", type: "user"}, {text: "Added one glass of water to your day. You have drank 95 fl oz of water today and are 85% of the way through your goal!", type: "bot"},{text: "Hello, how are you?", type: "user"}, {text: "Added one glass of water to your day. You have drank 95 fl oz of water today and are 85% of the way through your goal!", type: "bot"},{text: "Hello, how are you?", type: "user"}]);
    const [opened, setOpened] = useState(false);

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

    const Conversation = conversation.reverse().map((item, index) => (
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
                marginLeft: item.type === "user" ? "0" : `calc(50% - ${(1 - ((250 - Math.min(item.text.length, 250))/250)) * 50}%)`,
                marginRight: item.type === "user" ? `calc(50% - ${(1 - ((250 - Math.min(item.text.length, 250))/250)) * 50}%)` : "0",
            }}
        >
            <Text size="sm">{item.text}</Text>
        </Paper>
    ));

    return (
        <Container size="xl" fluid>
            <Modal
                overlayColor={theme.colors.gray[2]}
                overlayOpacity={0.25}
                overlayBlur={2}
                centered
                opened={opened}
                onClose={() => setOpened(false)}
                size="lg"
            >
                <Container
                        size="md"
                        p="sm"
                        style={{
                            backgroundColor: "#f6f6f6",
                            borderRadius: "10px",
                            maxHeight: "500px",
                            overflowY: "scroll",
                        }}
                    >
                {Conversation}
                </Container>
            </Modal>
            <Group position="center">
                <Button onClick={() => setOpened(true)}>Open Modal</Button>
            </Group>
        </Container>
    );
}

export default Test;
