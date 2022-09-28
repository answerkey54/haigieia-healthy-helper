import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "../../context/authUserContext";
import { getMessageFromErrorCode } from "../../components/ErrorCodes";
import {
  Group,
  PasswordInput,
  TextInput,
  Button,
  Text,
  Container,
  Title,
  Anchor,
  Paper,
  Checkbox,
  Divider,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconAt, IconLock, IconMoodSad } from "@tabler/icons";
import { GoogleButton } from "../../components/SocialButtons/SocialButtons";

function Login() {
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errorShake, setErrorShake] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { authUser, loading, enrolled, signInPassword, googleLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authUser && enrolled) {
      console.info("user already logged in.");
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, loading]);

  useEffect(() => {
    if (failedAttempts > 4) {
      showNotification({
        title: "Too many failed login attempts",
        message: "Please try again later.",
        color: "red",
        icon: <IconMoodSad />,
        radius: "md",
        autoClose: 10000,
        disallowClose: true,
      });
    }
  }, [failedAttempts]);

  const onSubmit = (data) => {
    signInPassword(data.email, data.password)
      .then((data) => {
        if (data["error"]) {
          console.log("error occured");
          setErrorShake(true)
          let response = getMessageFromErrorCode(data.code);
          showNotification({
            title: response,
            message: "Please try again.",
            color: "red",
            icon: <IconMoodSad />,
            radius: "md",
          });
        } else {
          router.push(data.route);
        }
      })
      .catch((error) => {
        console.log("HERE");
        alert(getMessageFromErrorCode(error.code));
      });
  };

  const handleGoogleLogin = () => {
    googleLogin().then((data) => {
      if (data['error']) {
        console.log("Google error occured");
        console.log(data.code, data.message)
      }else{
        console.log('trigger')
        router.replace(data.route)
      }
    });
  };

  return (
    <Container size={450} my={40}>
      <Title align="center" sx={(theme) => ({ fontWeight: 900 })}>
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" fontWeight="thinner" mt={5}>
        Don&apos;t have an account yet?{" "}
        <Anchor href="/auth/create" size="sm">
          Create Account
        </Anchor>
      </Text>
      <Paper withBorder shadow="lg" p="xl" mt={30} radius="lg">
        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl" onClick={handleGoogleLogin}>
            Google
          </GoogleButton>
        </Group>
        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            placeholder="Email"
            label="Email"
            radius="lg"
            size="md"
            icon={<IconAt size={18} />}
            error={errors["email"] ? errors["email"].message : ""}
            {...register("email", {
              required: "required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Must be a valid email.",
              },
            })}
          />
          <PasswordInput
            placeholder="Password"
            label="Password"
            radius="lg"
            size="md"
            mt="md"
            icon={<IconLock size={18} />}
            error={errors["password"] ? errors["password"].message : ""}
            {...register("password", { required: "required" })}
          />
          <Group position="apart" mt="md">
            <Checkbox label="Remember me" />
            <Anchor href="/404" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button
            className={errorShake ? "animate__animated animate__shakeX" : ""}
            onAnimationEnd={() => setErrorShake(false)}
            fullWidth
            mt="xl"
            mb="md"
            type="submit"
            radius="lg"
            disabled={failedAttempts > 4}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;
