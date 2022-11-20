import { AuthUserProvider } from "../context/authUserContext";
import { UserDataProvider } from "../context/userDataContext";
import { MantineProvider, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import "animate.css";
import "../styles/globals.css";
import { ApplicationContainer } from "../components/ApplicationContainer";
import "regenerator-runtime/runtime";
import { useState } from "react";

function MyApp({ Component, pageProps }) {

  const [colorScheme, setColorScheme] = useState('light');
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));


    return (
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme,
                colors: {
                  primary: [
                    "#b3cce5",
                    "#9ebede",
                    "#8db2d8",
                    "#7aa6d2",
                    "#417fbe",
                    "#3a73ab",
                    "#346698",
                    "#2d5985",
                    "#274c72",
                    "#1a334c"
                  ],
                  gradientFrom: [
                    "#afcde9",
                    "#9bc1e3",
                    "#87b4de",
                    "#73a7d8",
                    "#3782c8",
                    "#3275b4",
                    "#2c68a0",
                    "#275b8c",
                    "#214e78",
                    "#163450"
                  ],
                  gradientTo: [
                    "#9999ff",
                    "#8080ff",
                    "#6666ff",
                    "#4d4dff",
                    "#0000ff",
                    "#0000e6",
                    "#0000cc",
                    "#0000b3",
                    "#000099",
                    "#000066"
                  ]
                },
                primaryShade: 6,
                primaryColor: "primary",
                defaultRadius: "md",
                defaultGradient: {
                  deg: 45,
                  to: "gradientTo",
                  from: "gradientFrom"
                },
                components: {
                  Button: {
                    styles: {
                      root: {
                        borderWidth: 2
                      }
                    }
                  },
                  Chip: {
                    styles: {
                      label: {
                        borderWidth: 2
                      }
                    }
                  },
                  Input: {
                    styles: {
                      input: {
                        borderWidth: 2
                      }
                    }
                  },
                  Pagination: {
                    styles: {
                      item: {
                        borderWidth: 2
                      }
                    }
                  },
                  Switch: {
                    styles: {
                      track: {
                        borderWidth: 2
                      }
                    }
                  }
                },
                other: {
                  customFontFamily: "Poppins"
                },
                activeStyles: {
                  transform: "scale(0.95)"
                },
                fontFamily: "Poppins"
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
      </ColorSchemeProvider>
    );
}

export default MyApp;
