import React from "react";
import { createStyles, Header, Center, Title, MediaQuery, Burger, useMantineTheme } from "@mantine/core";
import "../styles/Header.module.css";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
    responsiveHeadings: {
        fontSize: theme.headings.xl,

        [theme.fn.smallerThan("lg")]: {
            fontSize: theme.headings.lg,
        },

        [theme.fn.smallerThan("sm")]: {
            fontSize: theme.fontSizes.xl,
        },

        [theme.fn.smallerThan(500)]: {
            fontSize: theme.headings.sm,
        },
    },
}));

function HeaderComponent({ opened, setOpened }) {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    return (
        <Header height={70} p="md">
            <Center position="apart" spacing="xl">
                <MediaQuery largerThan="xs" styles={{ display: "none" }}>
                    <Burger
                        opened={opened}
                        onClick={() => setOpened((o) => !o)}
                        size="sm"
                        color={theme.colors.gray[6]}
                        mr="xl"
                    />
                </MediaQuery>
                <Link href="/">
                    <Title order={1}>
                        <span
                            style={{
                                color: "lightSteelBlue",
                                fontWeight: "bolder",
                            }}
                        >
                            Haigieia
                        </span>
                    </Title>
                </Link>
            </Center>
        </Header>
    );
}

export default HeaderComponent;
