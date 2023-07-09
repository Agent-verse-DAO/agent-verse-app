import {
  Box,
  Button,
  Card,
  Container,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { IconSquareRoundedCheckFilled } from "@tabler/icons-react";

import Header from "~/components/Header";

export default function NFTSuccess() {
  return (
    <>
      <Header />

      <Container size="md" px="md" py="sm">
        <Title order={1} mb={96}>
          You’ve created access tokens!
        </Title>

        <Card
          shadow="sm"
          padding={32}
          radius="md"
          withBorder
          sx={{
            overflow: "visible",
          }}
        >
          <Box
            sx={(theme) => ({
              position: "absolute",
              top: -48,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              backgroundColor: "#fff",
              color: theme.colors.cyan[5],
              lineHeight: 0,
            })}
          >
            <IconSquareRoundedCheckFilled size={96} enableBackground="#fff" />
          </Box>

          <Group position="center" mt="md" mb="xs">
            <Text weight={500}>You’ve created access tokens!</Text>
          </Group>

          <Group position="center">
            <Button variant="light" color="primary" mt="md" radius="md">
              Switch to Subscriber Mode
            </Button>
            <Button variant="filled" color="primary" mt="md" radius="md">
              Go to dashboard
            </Button>
          </Group>
        </Card>
      </Container>
    </>
  );
}
