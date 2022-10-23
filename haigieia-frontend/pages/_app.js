import { AuthUserProvider } from "../context/authUserContext";
import { UserDataProvider } from "../context/userDataContext";
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
                    <UserDataProvider>
                        <ApplicationContainer>
                            <Component {...pageProps} />
                        </ApplicationContainer>
                    </UserDataProvider>
                </AuthUserProvider>
            </NotificationsProvider>
        </MantineProvider>
    );
}

export default MyApp;
