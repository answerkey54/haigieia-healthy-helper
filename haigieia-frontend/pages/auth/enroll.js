import React, { forwardRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/authUserContext";
import {
    Group,
    Paper,
    Title,
    Container,
    Select,
    Avatar,
    Text,
    Stepper,
    Button,
    NumberInput,
    Stack,
    RangeSlider,
} from "@mantine/core";
import { IconUsers } from "@tabler/icons";
import { GoogleButton } from "../../components/SocialButtons/SocialButtons";
import { useForm } from "@mantine/form";

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
        description:
            "Primarily for advanced users tracking detailed meal plans.",
    },
    {
        value: "basic",
        label: "Basic",
        image: "https://cdn-icons-png.flaticon.com/512/2756/2756716.png",
        description: "Primarily for creating meal plans and staying on track.",
    },
];

function Enroll() {
    const { authUser, loading, enrolled, enrollGoogle } = useAuth();
    const router = useRouter();

    const [active, setActive] = useState(0);

    useEffect(() => {
        if (!loading && authUser && enrolled) {
            console.warn("user already logged in.");
            router.push("/dashboard");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, loading, enrolled]);

    const form = useForm({
        initialValues: {
            role: "",
            calories_goal: 2000,
            protein_goal: 100,
            fat_goal: 100,
            carb_goal: 100,
            macros_range: [25, 80],
        },
        validate: (values) => {
            if (active === 0) {
                return {
                    role: values.role === "" ? "You must select a role" : null,
                };
            }
            return {};
        },
    });

    const nextStep = () =>
        setActive((current) => {
            if (form.validate().hasErrors) {
                return current;
            }
            if (form.values["role"] === "basic") {
                return 3;
            }
            return current < 3 ? current + 1 : current;
        });

    const prevStep = () =>
        setActive((current) => {
            if (current == 3 && form.values["role"] === "basic") {
                return 0;
            }
            if (current > 0) {
                return current - 1;
            } else {
                return current;
            }
        });

    const onSubmit = (data) => {
        console.log("form data", data);
        const submission = {
            role: data.role,
            init_data: {
                water_goal: {
                    value: 0,
                    goal: 10,
                },
                main_goal: [
                    {
                        goal: data.calories_goal,
                        title: "Calories",
                        value: 0,
                    },
                    {
                        goal: data.protein_goal,
                        title: "Protein",
                        value: 0,
                    },
                    {
                        goal: data.carb_goal,
                        title: "Carbs",
                        value: 0,
                    },
                    {
                        goal: data.fat_goal,
                        title: "Fat",
                        value: 0,
                    },
                ],
                nutrition_log: [
                  {
                      value: data.macros_range[0],
                      goal: data.macros_range[0],
                  },
                  {
                      value: data.macros_range[1]-data.macros_range[0],
                      goal: data.macros_range[1]-data.macros_range[0],
                  },
                  {
                      value: 100-data.macros_range[1],
                      goal: 100-data.macros_range[1],
                  },
              ],
              meal_log: [],
            },
        };
        enrollGoogle(submission)
            .then((res) => {
                console.log("res", res);
                router.push(res.route);
            })
            .catch((err) => {
                console.log("err", err);
            });
    };

    return (
        <Container size="md" my={40}>
            <Title align="center" sx={(theme) => ({ fontWeight: 900 })}>
                Welcome to Timelines!
            </Title>

            <Paper withBorder shadow="lg" p="xl" mt={30} radius="lg">
                <Stepper
                    active={active}
                    onStepClick={setActive}
                    breakpoint="md"
                >
                    <Stepper.Step
                        py="md"
                        label="First step"
                        description="Choose a plan"
                    >
                        <Text size="md" weight={500}>
                            Select a plan that best fits your needs.
                        </Text>
                        <Text color="dimmed" size="sm" mt={5} mb={20}>
                            You can change your plan at any time.
                        </Text>
                        <Select
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
                            data={data}
                            {...form.getInputProps("role")}
                        />
                    </Stepper.Step>
                    <Stepper.Step
                        label="Second step"
                        description="Choose goal values"
                    >
                        <Text size="md" weight={500}>
                            Enter your goal values.
                        </Text>
                        <Group position="center" spacing="xl">
                            <Stack>
                                <NumberInput
                                    defaultValue={2200}
                                    label="Calories goal"
                                    parser={(value) => parseInt(value, 10) || 0}
                                    formatter={(value) => `${value} kcal`}
                                    style={{ maxWidth: 200 }}
                                    {...form.getInputProps("calories_goal")}
                                />
                                <NumberInput
                                    defaultValue={100}
                                    label="Protein goal"
                                    parser={(value) => parseInt(value, 10) || 0}
                                    formatter={(value) => `${value} g`}
                                    style={{ maxWidth: 200 }}
                                    {...form.getInputProps("protein_goal")}
                                />
                            </Stack>
                            <Stack>
                                <NumberInput
                                    defaultValue={200}
                                    label="Carbohydrates goal"
                                    parser={(value) => parseInt(value, 10) || 0}
                                    formatter={(value) => `${value} g`}
                                    style={{ maxWidth: 200 }}
                                    {...form.getInputProps("carb_goal")}
                                />
                                <NumberInput
                                    defaultValue={100}
                                    label="Fat goal"
                                    parser={(value) => parseInt(value, 10) || 0}
                                    formatter={(value) => `${value} g`}
                                    style={{ maxWidth: 200 }}
                                    {...form.getInputProps("fat_goal")}
                                />
                            </Stack>
                        </Group>
                    </Stepper.Step>
                    <Stepper.Step
                        label="Final step"
                        description="Set macro portions"
                    >
                        <Text size="md" weight={500} mb={15}>
                            Set your macro percentages.
                        </Text>

                        <RangeSlider
                            size="lg"
                            labelAlwaysOn
                            inverted
                            defaultValue={[25, 80]}
                            p="xl"
                            {...form.getInputProps("macros_range")}
                        />
                        <Group
                            position="apart"
                            style={{
                                maxWidth: "80%",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            <Stack align="center" spacing={1}>
                                <Text size="md" weight={500}>
                                    Protein
                                </Text>
                                <Text size="sm" color="dimmed">
                                    {form.values.macros_range[0]}%
                                </Text>
                            </Stack>
                            <Stack align="center" spacing={1}>
                                <Text size="md" weight={500}>
                                    Carbohydrates
                                </Text>
                                <Text size="sm" color="dimmed">
                                    {form.values.macros_range[1] -
                                        form.values.macros_range[0]}
                                    %
                                </Text>
                            </Stack>
                            <Stack align="center" spacing={1}>
                                <Text size="md" weight={500}>
                                    Fat
                                </Text>
                                <Text size="sm" color="dimmed">
                                    {100 - form.values.macros_range[1]}%
                                </Text>
                            </Stack>
                        </Group>
                    </Stepper.Step>
                    <Stepper.Completed>
                        <Text size="md" weight={500}>
                            You&apos;re all set!
                        </Text>
                        <Text color="dimmed" size="sm" mt={5} mb={20}>
                            Click the button below to complete the process.
                        </Text>
                        <GoogleButton
                            fullWidth
                            mt="xl"
                            mb="md"
                            radius="lg"
                            onClick={() => onSubmit(form.values)}
                        >
                            Continue with Google
                        </GoogleButton>
                    </Stepper.Completed>
                </Stepper>

                <Group position="center" mt="xl">
                    {active !== 0 && (
                        <Button variant="default" onClick={prevStep}>
                            Back
                        </Button>
                    )}
                    {active !== 3 && (
                        <Button onClick={nextStep}>Next step</Button>
                    )}
                </Group>
            </Paper>
        </Container>
    );
}

export default Enroll;
