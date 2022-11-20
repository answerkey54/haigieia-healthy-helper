import {
    AppShell, Navbar,
} from "@mantine/core"
import FooterComponent from "./Footer"
import HeaderComponent from "./Header"
import { useState, useEffect } from 'react';
import { NavbarMinimal } from "./Nav";
import { useAuth } from "../context/authUserContext";

export const ApplicationContainer = ({children}) => {

    const [opened, setOpened] = useState(false);
    const { authUser, loading } = useAuth();
    const [navbarViz, setNavbar] = useState(false);

    useEffect(() => {
      if (!loading && authUser) {
        setNavbar(true)
      }
    
    }, [loading, authUser])
    

    return (
        <AppShell
        styles={(theme) => ({
            main: {
                background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                width: "100vw",
                position: "relative",
                zIndex: 1,
            }
        })}
        fixed
        navbarOffsetBreakpoint="xs"
        header={<HeaderComponent opened={opened} setOpened={setOpened} />}
        footer={<FooterComponent/>}
        navbar={  <NavbarMinimal hidden={!opened} p="md" hiddenBreakpoint="xs"  /> }
       
        >
            {children}
        </AppShell>
    )
}

