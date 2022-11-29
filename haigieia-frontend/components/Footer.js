import React from "react";
import { createStyles, Title } from "@mantine/core";
import { Footer, Group, Text } from "@mantine/core";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
    root: {
        paddingRight: theme.spacing.xs * 1.5,
        paddingTop: theme.spacing.xs * 1.5,
        paddingBottom: theme.spacing.xs * 1.5,
        paddingLeft: "calc(var(--mantine-navbar-width, 0px) + 16px)",
        height: "80px",
        position: "sticky",
        bottom: 0,
        left: 0,
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[7]
                : theme.colors.gray[2],

        [theme.fn.smallerThan("xs")]: {
            height: "40px",
            paddingLeft: theme.spacing.xs * 1.5,
        },
    },
}));

function FooterComponent() {
    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            <Group position="apart" spacing="xl">
                <Link href="/">
                    <Title order={1}>
                        <span
                            style={{
                                color: "lightSteelBlue",
                                fontWeight: "bolder",
                                fontFamily: "Orbitron, sans-serif",
                            }}
                        >
                            hA<span style={{ fontSize: "2.25rem" }}>i</span>
                            gieia
                        </span>
                    </Title>
                </Link>
                <Text size="sm">
                    <span style={{ fontWeight: "bolder" }}>© 2022</span>
                </Text>
            </Group>
        </div>
    );
}

export default FooterComponent;
