import { Container, Group, Title, Grid, Text, Card } from "@mantine/core";
import Link from "next/link";
import { useCallback } from "react";

import Header from "~/components/Header";

const models = [
  {
    name: "New test",
    symbol: "TEST09",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Donec et odio pellentesque diam volutpat. Ante in nibh mauris cursus mattis. Mauris commodo",
    address: "0x17a280ebd642ecb57a3a6c10b32f41cda4625612",
  },
  {
    name: "GPT-3",
    symbol: "GPT3",
    description:
      "GPT-3 is a language model that uses deep learning to produce human-like text. It takes in a prompt, and attempts to complete it.",
    address: "0xf78856f617f8395f6eb7b82bc903ad36a60b77c4",
  },
  {
    name: "GPT-3",
    symbol: "GPT3",
    description:
      "GPT-3 is a language model that uses deep learning to produce human-like text. It takes in a prompt, and attempts to complete it.",
    address: "0xf78856f617f8395f6eb7b82bc903ad36a60b77c4",
  },
  {
    name: "GPT-3",
    symbol: "GPT3",
    description:
      "GPT-3 is a language model that uses deep learning to produce human-like text. It takes in a prompt, and attempts to complete it.",
    address: "0xf78856f617f8395f6eb7b82bc903ad36a60b77c4",
  },
];

export default function NFTSuccess() {
  const renderModel = useCallback(
    ({
      name,
      description,
      address,
      value,
    }: {
      name: string;
      description: string;
      address: string;
      value: string;
    }) => {
      return (
        <Link
          href={`/market/${address}`}
          passHref
          style={{
            textDecoration: "none",
          }}
        >
          <Card
            shadow="sm"
            padding="sm"
            radius="md"
            withBorder
            sx={{
              transition: "transform 150ms ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Text weight={500} mb={4}>
              {name}
            </Text>

            <Text size="xs" color="dimmed" mb={8}>
              {description}
            </Text>

            <Group position="apart">
              <Text size="xs" color="dimmed">
                {address.slice(0, 6)}...{address.slice(-4)}
              </Text>
              <Text size="xs" color="dimmed">
                {value}
              </Text>
            </Group>
          </Card>
        </Link>
      );
    },
    []
  );

  return (
    <>
      <Header />

      <Container size="md" px="md" py="sm">
        <Title order={1}>Model NFT Market</Title>
        <Grid pt="xl">
          {models.map((model) => (
            <Grid.Col span={4} key={model.address}>
              {renderModel({
                name: model.name,
                description: model.description,
                address: model.address,
                value: model.symbol,
              })}
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </>
  );
}
