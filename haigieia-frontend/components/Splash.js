import {
    Button,
    Container,
    createStyles,
    Group,
    Stack,
    Text,
} from "@mantine/core";
import Link from "next/link";
import React from "react";

const BREAKPOINT = "@media (max-width: 755px)";

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: "relative",
        boxSizing: "border-box",
    },

    inner: {
        position: "relative",
        paddingTop: 200,
        paddingBottom: 120,

        [BREAKPOINT]: {
            paddingBottom: 80,
            paddingTop: 80,
        },
    },

    title: {
        fontSize: 62,
        fontWeight: 900,
        lineHeight: 1.1,
        margin: 0,
        padding: 0,
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [BREAKPOINT]: {
            fontSize: 42,
            lineHeight: 1.2,
        },
    },

    description: {
        marginTop: theme.spacing.xl,
        fontSize: 24,

        [BREAKPOINT]: {
            fontSize: 18,
        },
    },

    controls: {
        marginTop: theme.spacing.xl * 2,

        [BREAKPOINT]: {
            marginTop: theme.spacing.xl,
        },
    },

    control: {
        height: 54,
        paddingLeft: 38,
        paddingRight: 38,

        [BREAKPOINT]: {
            height: 54,
            paddingLeft: 18,
            paddingRight: 18,
            flex: 1,
        },
    },
}));

function Splash() {
    const { classes } = useStyles();

    return (
        <div className={classes.wrapper}>
            <Container size={700} className={classes.inner}>
                <h1 className={classes.title}>
                    A{" "}
                    <Text
                        component="span"
                        variant="gradient"
                        gradient={{ from: "primary.4", to: "primary.2" }}
                        inherit
                    >
                        fully featured
                    </Text>
                    <br /> Diet Tracker and Meal Log
                </h1>

                <Text className={classes.description} color="dimmed">
                    Track your caloric and macronutrient intake throughout the
                    day with your voice using our custom conversational AI.
                </Text>

                <Stack className={classes.controls} align="flex-start">
                    <Button
                        size="xl"
                        className={classes.control}
                        variant="gradient"
                        gradient={{ from: "primary.2", to: "primary.4" }}
                        component="a"
                        href="/auth/create"
                    >
                        Get started
                    </Button>
                    <Text size="sm" color="dimmed">
                        Already have an account?{"  "}
                        <Link href="/auth/login" passHref>
                        <Text size="sm" component="a" color="primary.5">
                            Login
                        </Text>
                    </Link>
                    </Text>
                    
                </Stack>
            </Container>
        </div>
    );
}

export default Splash;

/*
    <Stack align="center">
        <Link href="/auth/create" passHref>
            <Button component="a">Create Account</Button>
        </Link>
        <Link href="/auth/login" passHref>
            <Button component="a">Login</Button>
        </Link>
    </Stack>
*/
