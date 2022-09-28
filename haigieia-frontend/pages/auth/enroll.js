import React, { forwardRef, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "../../context/authUserContext";
import {
  Group,
  Paper,
  Title,
  Container,
  Button,
  Select,
  Avatar,
  Text,
} from "@mantine/core";
import { IconUsers } from "@tabler/icons";
import { GoogleButton } from "../../components/SocialButtons/SocialButtons";

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

function Enroll() {
  const { authUser, loading, enrolled, enrollGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authUser && enrolled) {
      console.warn("user already logged in.");
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, loading, enrolled]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("form data", data);
    enrollGoogle(data)
      .then((res) => {
        console.log("res", res);
        router.push(res.route);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <Container size={450} my={40}>
      <Title align="center" sx={(theme) => ({ fontWeight: 900 })}>
        Welcome to Timelines!
      </Title>
      <Text color="dimmed" size="sm" align="center" fontWeight="thinner" mt={5}>
        Pick the role that best describes you
      </Text>
      <Paper withBorder shadow="lg" p="xl" mt={30} radius="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                rules={{ required: true }}
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
          <GoogleButton fullWidth mt="xl" mb="md" radius="lg" type="submit">
            Continue with Google
          </GoogleButton>
        </form>
      </Paper>
    </Container>
  );
}

export default Enroll;
