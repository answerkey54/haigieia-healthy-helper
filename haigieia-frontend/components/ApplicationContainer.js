import {
    AppShell,
} from "@mantine/core"
import FooterComponent from "./Footer"
import HeaderComponent from "./Header"

export const ApplicationContainer = ({children}) => {
    return (
        <AppShell
        styles={{
            main: {
                background: "#f0f0f0",
                width: "100vw",
                height: "100vh",
            }
        }}
        fixed
        header={<HeaderComponent/>}
        footer={<FooterComponent/>}
        >
            {children}
        </AppShell>
    )
}