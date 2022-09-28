import React, { useEffect } from 'react'
import { useRouter } from "next/router";
import { useAuth } from "../context/authUserContext";

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
        <div>Dashboard, welcome authenticated user!</div>
    )
}

export default Dashboard