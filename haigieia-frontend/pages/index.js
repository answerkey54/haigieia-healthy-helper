import React, { useState } from 'react'
import Link from "next/link";
import { useAuth } from "../context/authUserContext";
import { Button, Card, Center, Container, Loader, Stack, Text, Title } from "@mantine/core";
import EnrollModal from "../components/EnrollModal";

export default function Home() {
  const { authUser, loading, enrolled, signOutUser } = useAuth();
  const [opened, setOpened] = useState(!enrolled);

  return (
    <>
    {loading ?
    <Center style={{ width: '100%', height: '100%' }}>
      <Loader size="100" />
    </Center> 
    :
    <Container size="lg">
      <Title align='center' mb={30} order={3}>Under Construction 🚧</Title>
      {!authUser ?
        <Stack align="center">
          <Link href="/auth/create" passHref><Button component="a">Create Account</Button></Link>
          <Link href="/auth/login" passHref><Button component="a">Login</Button></Link> 
        </Stack>
      :
      <div>
        <p>{authUser.displayName}</p>
        {!enrolled ? 
          <EnrollModal opened={opened} setOpened={setOpened}/>
        :
        <></>}
        <button onClick={signOutUser}>Sign out</button>
      </div>
      }
    </Container>
    }
    </>
  )
}
