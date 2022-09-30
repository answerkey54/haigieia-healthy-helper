import {
    AppShell, Navbar,
} from "@mantine/core"
import FooterComponent from "./Footer"
import HeaderComponent from "./Header"
import { useState } from 'react';
import { NavbarMinimal } from "./Nav";

export const ApplicationContainer = ({children}) => {

    const [opened, setOpened] = useState(false);

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
        navbarOffsetBreakpoint="xs"
        header={<HeaderComponent opened={opened} setOpened={setOpened} />}
        footer={<FooterComponent/>}
        navbar={<NavbarMinimal hidden={!opened} p="md" hiddenBreakpoint="xs"  />}
        >
            {children}
        </AppShell>
    )
}