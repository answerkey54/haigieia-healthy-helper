import { Avatar, Group, Modal, Title, Text, Button, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { IconGhost } from "@tabler/icons";
import React from "react";

function EnrollModal({ opened, setOpened }) {
  const theme = useMantineTheme();

  return (
    <Modal
      centered
      opened={opened}
      size="lg"
      radius="md"
      padding="md"
      margin="md"
      onClose={() => setOpened(false)}
      withCloseButton={false}
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      transition="fade"
      transitionDuration={600}
      transitionTimingFunction="ease"
    >
      <Group noWrap>
        <Avatar color="yellow" size={150} radius="lg">
          <IconGhost size="90%" />
        </Avatar>
        <div>
          <Title size="md">Whoops!</Title>
          <Text mt="sm" mb="md" size="lg">You need to finish enrolling to use this app.</Text>
          <Link href="/auth/enroll" passHref><Button component="a">Enroll now</Button></Link> 
        </div>
      </Group>
    </Modal>
  );
}

export default EnrollModal;
