import React from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { Text, ActionIcon, MantineProvider, Button } from "@mantine/core";
import { IconMicrophone } from "@tabler/icons";

const Dictaphone = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn&apos;t support speech recognition.</span>;
    }

    return (
        <MantineProvider theme={{ loader: "bars" }}>
            <div>
                <Text
                    component="span"
                    align="center"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                    size="xl"
                    weight={700}
                >
                    Microphone: {listening ? "on" : "off"}
                </Text>
                <ActionIcon
                    color="blue"
                    size="xl"
                    radius="lg"
                    variant="filled"
                    onClick={SpeechRecognition.startListening}
                    loading={listening}
                >
                    <IconMicrophone size={16} />
                </ActionIcon>
                <p>{transcript}</p>
                <Button onClick={resetTranscript}>Reset Text</Button>
            </div>
        </MantineProvider>
    );
};
export default Dictaphone;
