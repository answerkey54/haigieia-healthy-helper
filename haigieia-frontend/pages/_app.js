import { AuthUserProvider } from "../context/authUserContext";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import "animate.css";
import "../styles/globals.css";
import { ApplicationContainer } from "../components/ApplicationContainer";
import "regenerator-runtime/runtime";

function MyApp({ Component, pageProps }) {
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: "light",
                fontFamily: "Inter, sans-serif",
                headings: {
                    fontFamily: "Poppins, sans-serif",
                },
            }}
        >
            <NotificationsProvider
                position="bottom-center"
                limit={5}
                zIndex={2077}
            >
                <AuthUserProvider>
                    <ApplicationContainer>
                        <Component {...pageProps} />
                    </ApplicationContainer>
                </AuthUserProvider>
            </NotificationsProvider>
        </MantineProvider>
    );
}

export default MyApp;
