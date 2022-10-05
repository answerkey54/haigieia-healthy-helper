import React, { useEffect } from 'react'
import { useRouter } from "next/router";
import { useAuth } from "../context/authUserContext";
import { Container, Center, Loader } from '@mantine/core';
import Dictaphone from '../components/Dictaphone';

function Dashboard() {
    const { authUser, loading, enrolled, createUserPassword } = useAuth();
    const router = useRouter();

    console.log(loading, authUser, enrolled);

    useEffect(() => {
      if (!loading && !authUser && !enrolled) {
        console.warn("Not Authorized");
        router.push("/auth/login");
      }
      if(!loading && authUser && !enrolled) {
        console.info("Not enrolled");
        router.push("/auth/enroll");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, loading]);

    return (
        <Container size="xl" >
          { loading ? <Center style={{height: "80vh"}}><Loader size="xl"/></Center> : 
            <> 
            <h1>Dashboard</h1>
            <h3>Welcome, {authUser.displayName} </h3>
            <Dictaphone />
            </>
        }
        </Container>
      
    )
}

export default Dashboard