import React, { useState } from "react";
import {
    Navbar,
    Center,
    Tooltip,
    UnstyledButton,
    createStyles,
    Stack,
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

function NavbarLink({ icon, label, active, onClick }) {
    const { classes, cx } = useStyles();
    return (
        <Tooltip label={label} position="right" transitionDuration={0}>
            <UnstyledButton
                onClick={onClick}
                className={cx(classes.link, { [classes.active]: active })}
            >
                <Icon icon={icon} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconHome2, label: "Home" },
    { icon: IconGauge, label: "Dashboard" },
    { icon: IconUser, label: "Account" },
    { icon: IconSettings, label: "Settings" },
];

const Icon = (props) => {
    const { icon } = props;
    const TheIcon = icon;
    return <TheIcon stroke={1.5} />;
};

export function NavbarMinimal(props) {
    const [active, setActive] = useState(2);

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    return (
        <Navbar width={{ xs: 70, lg: 70 }} p="md" {...props}>
            <Navbar.Section grow mt={10}>
                <Stack justify="center" spacing={0}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify="center" spacing={0}>
                    <NavbarLink icon={IconLogout} label="Logout" />
                </Stack>
            </Navbar.Section>
        </Navbar>
    );
}
