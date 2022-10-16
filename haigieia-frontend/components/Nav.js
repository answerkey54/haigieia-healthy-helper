import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authUserContext";
import {
    Navbar,
    Center,
    Tooltip,
    UnstyledButton,
    createStyles,
    Stack,
    ActionIcon,
    Avatar,
    Popover,
    Text,
    Card,
} from "@mantine/core";
import {
    TablerIcon,
    IconHome2,
    IconGauge,
    IconDeviceDesktopAnalytics,
    IconFingerprint,
    IconCalendarStats,
    IconUser,
    IconSettings,
    IconLogout,
    IconSwitchHorizontal,
} from "@tabler/icons";
import { NextLink } from "@mantine/next";

const useStyles = createStyles((theme) => ({
    link: {
        width: 40,
        height: 40,
        borderRadius: theme.radius.sm,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.colors.gray[0],
        },
    },

    active: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).background,
            color: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).color,
        },
    },
}));

function NavbarLink({ icon, label, active, onClick, href }) {
    const { classes, cx } = useStyles();

    return (
        <Tooltip label={label} position="right" transitionDuration={0}>
            <UnstyledButton
                component={NextLink}
                href={href}
                onClick={onClick}
                className={cx(classes.link, { [classes.active]: active })}
            >
                <Icon icon={icon} />
            </UnstyledButton>
        </Tooltip>
    );
}

const data = [
    { icon: IconHome2, label: "Home", href: "/" },
    { icon: IconGauge, label: "Dashboard", href: "/dashboard" },
    { icon: IconSettings, label: "Settings", href: "/settings" },
];

const Icon = (props) => {
    const { icon } = props;
    const TheIcon = icon;
    return <TheIcon stroke={1.5} />;
};

export function NavbarMinimal(props) {
    const [active, setActive] = useState(2);
    const [opened, setOpened] = useState(false);
    const { authUser, loading, signOutUser } = useAuth();

    const links = data.map((link, index) => (
        <NavbarLink
            {...link}
            href={link.href}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    return (
        <Navbar width={{ xs: 70, lg: 70 }} p="md" {...props}>
            <Navbar.Section grow mt={10}>
                <Stack justify="center" spacing={10}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify="center" spacing={0}>
                    {loading || !authUser ? (
                        <NavbarLink
                            icon={IconUser}
                            label={"account"}
                            href={authUser ? "/account" : "/auth/login"}
                        />
                    ) : (
                        <Popover
                            width={200}
                            position="right-end"
                            withArrow
                            shadow="md"
                            opened={opened}
                            onChange={setOpened}
                        >
                            <Popover.Target>
                                <UnstyledButton radius="md" onClick={() => setOpened((o) => !o)}>
                                    <Avatar radius="xl" color="blue" src={authUser ? authUser.photoURL : ""} />
                                </UnstyledButton>
                            </Popover.Target>
                            <Popover.Dropdown>
                               
                                    <Stack padding={0} spacing={0}>
                                        <Text size="md" weight={500}>
                                            {authUser ? authUser.displayName : ""}
                                        </Text>
                                        <Text size="xs" color="gray">
                                            {authUser ? authUser.email: ""}
                                        </Text>
                                        <ActionIcon
                                            onClick={() => signOutUser()}
                                            color="red"
                                            size="sm" variant="light"
                                            
                                        >
                                            <IconLogout size={14} />
                                        </ActionIcon>
                                    </Stack>
                            </Popover.Dropdown>
                        </Popover>
                    )}
                </Stack>
            </Navbar.Section>
        </Navbar>
    );
}
