/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { createStyles, Title, Text, Button, Container, Group } from '@mantine/core';
import Link from 'next/link';
import { useAuth } from "../context/authUserContext";

const useStyles = createStyles((theme) => ({
    root: {
      paddingTop: 20,
      paddingBottom: 80,
    },
  
    label: {
      textAlign: 'center',
      fontWeight: 900,
      fontSize: 220,
      lineHeight: 1,
      marginBottom: theme.spacing.xl * 1.5,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
  
      [theme.fn.smallerThan('sm')]: {
        fontSize: 120,
      },
    },
  
    title: {
      textAlign: 'center',
      fontWeight: 900,
      fontSize: 46,
  
      [theme.fn.smallerThan('sm')]: {
        fontSize: 40,
      },
    },
  
    description: {
      maxWidth: 500,
      margin: 'auto',
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xl * 1.5,
    },
  }));


function fourOhFour() {
    const { authUser } = useAuth();
    const { classes } = useStyles();
    return (
        <Container className={classes.root}>
        <div className={classes.label}>404</div>
        <Title className={classes.title}>You have found a secret place.</Title>
        <Text color="dimmed" size="lg" align="center" className={classes.description}>
          Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
          been moved to another URL.
        </Text>
        <Group position="center">
            <Link href={authUser ? "/dashboard" : "/"} passHref>
          <Button component="a" variant="subtle" size="md" radius="lg"> 
            Take me back home
          </Button>
          </Link>
        </Group>
      </Container>
  )
}

export default fourOhFour