import React, {useEffect} from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { Text, ActionIcon, MantineProvider, Button, Center } from "@mantine/core";
import { IconMicrophone } from "@tabler/icons";

const Dictaphone = ({text, setText, setOpen, open, setActiveListening}) => {

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        setText(transcript);
        if(!open && listening){
            setOpen(true)
        }
        setActiveListening(listening)
      }, [listening, transcript])

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn&apos;t support speech recognition.</span>;
    }

    return (
        <MantineProvider theme={{ loader: "bars" }}>
            <Center>
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
                
            </Center>
        </MantineProvider>
    );
};
export default Dictaphone;
