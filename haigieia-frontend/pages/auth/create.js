import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "../../context/authUserContext";
import {
  Group,
  Anchor,
  Paper,
  Divider,
  Title,
  Container,
  Box,
  Button,
  PasswordInput,
  Select,
  TextInput,
  Avatar,
  Text,
} from "@mantine/core";
import { IconAt, IconLock, IconMoodSad, IconUsers } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { GoogleButton } from "../../components/SocialButtons/SocialButtons";
import { getMessageFromErrorCode } from "../../components/ErrorCodes";

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef(
  ({ image, label, description, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

const data = [
  {
    value: "advanced",
    label: "Advanced",
    image: "https://cdn-icons-png.flaticon.com/512/3043/3043888.png",
    description: "Primarily for advanced users tracking detailed meal plans.",
  },
  {
    value: "basic",
    label: "Basic",
    image: "https://cdn-icons-png.flaticon.com/512/2756/2756716.png",
    description:
      "Primarily for creating meal plans and staying on track.",
  },
];

export default function CreateUser() {
  const { authUser, loading, createUserPassword } = useAuth();
  const router = useRouter();
  const [errorShake, setErrorShake] = useState(false);

  useEffect(() => {
    if (!loading && authUser) {
      console.warn("user already logged in.");
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, loading]);

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = (data) => {
    console.log("data", data);
    if (data.password == data.confirm_password) {
      const submission = {
        email: data.email,
        password: data.password,
        role: data.title,
        displayName: data.first_name + " " + data.last_name,
      };
      createUserPassword(submission)
        .then((authUser) => {
          if (authUser["error"]) {
            console.log("error occured");
            setErrorShake(true);
            let response = getMessageFromErrorCode(authUser.code);
            showNotification({
              title: response,
              message: "Please try again.",
              color: "red",
              icon: <IconMoodSad />,
              radius: "md",
            });
          } else {
            router.push(authUser.route);
          }
        })
        .catch((error) => {
          console.log("error occured", error.code);
          setErrorShake(true);
          let response = getMessageFromErrorCode(error.code);
          showNotification({
            title: response,
            message: "Please try again.",
            color: "red",
            icon: <IconMoodSad />,
            radius: "md",
          });
        });
    }
  };

  return (
    <Container size={450} my={40}>
      <Title align="center" sx={(theme) => ({ fontWeight: 900 })}>
        Welcome to Haigieia!
      </Title>
      <Text color="dimmed" size="sm" align="center" fontWeight="thinner" mt={5}>
        Already have an account?{" "}
        <Anchor href="/auth/login" size="sm">
          Login
        </Anchor>
      </Text>
      <Paper withBorder shadow="lg" p="xl" mt={30} radius="lg">
        <Group grow mb="md" mt="md">
          <GoogleButton
            radius="xl"
            onClick={() => {
              router.push("/auth/enroll");
            }}
          >
            Google
          </GoogleButton>
        </Group>
        <Divider
          label="Or register with email"
          labelPosition="center"
          my="lg"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group grow mb="md" mt="md">
            <TextInput
              placeholder="First name"
              label="First name"
              radius="lg"
              size="md"
              error={errors["first_name"] ? "required" : ""}
              {...register("first_name", { required: true, maxLength: 80 })}
            />
            <TextInput
              placeholder="Last name"
              label="Last name"
              radius="lg"
              size="md"
              error={errors["last_name"] ? "required" : ""}
              {...register("last_name", { required: true, maxLength: 100 })}
            />
          </Group>
          <Controller
            name="title"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                styles={{
                  label: { fontSize: "16px" },
                }}
                itemComponent={SelectItem}
                label="Choose your account role"
                placeholder="Pick one"
                radius="lg"
                size="md"
                maxDropdownHeight={200}
                icon={<IconUsers size={18} />}
                error={errors["title"] ? "required" : ""}
                data={data}
              />
            )}
          />
          <TextInput
            placeholder="Email"
            label="Email"
            radius="lg"
            size="md"
            mt="md"
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
            description="Password must be at least 6 characters including at least one letter, number and special character"
            radius="lg"
            size="md"
            my="md"
            icon={<IconLock size={18} />}
            error={errors["password"] ? errors["password"].message : ""}
            {...register("password", {
              required: "required",
              minLength: {
                value: 6,
                message: "Must be at least 6 characters.",
              },
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                message:
                  "Must be at least 6 characters including at least one letter, number and special character.",
              },
            })}
          />
          <PasswordInput
            placeholder="Password"
            label="Confirm Password"
            radius="lg"
            size="md"
            icon={<IconLock size={18} />}
            error={
              errors["confirm_password"]
                ? errors["confirm_password"].message
                : ""
            }
            {...register("confirm_password", {
              required: "required",
              validate: (value) =>
                value === password.current || "Passwords don't match",
            })}
          />
          <Button fullWidth mt="xl" mb="md" radius="lg" type="submit">
            Create Account
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
