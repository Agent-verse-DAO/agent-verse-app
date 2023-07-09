import {
  Container,
  Button,
  Group,
  Title,
  Stack,
  Grid,
  Text,
  Card,
} from "@mantine/core";
import { ConnectKitButton } from "connectkit";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import Header from "~/components/Header";

export default function NFTSuccess() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const { isConnected } = useAccount();

  const renderPlan = useCallback(
    ({ title, value }: { title: string; value: string }) => {
      return (
        <Card shadow="sm" padding="sm" radius="md" withBorder>
          <Group position="apart">
            <Text weight={500}>{title}</Text>
            <Text weight={400} color="dimmed">
              {value}
            </Text>
          </Group>
        </Card>
      );
    },
    []
  );

  return (
    <>
      <Header />

      <Container size="md" px="md" py="sm">
        <Title order={1} mb={32}>
          You’ve created an NFT for your model!
        </Title>
        <Grid gutter={48}>
          <Grid.Col span={7}>
            <Title order={2} size="1rem" mb={8}>
              Now its time to create Access Tokens.
            </Title>
            <Text>
              <p>
                These access tokens will be automatically listed for sale on the
                Agent-verse marketplace. An access token gives the buyer the
                right to immediately generate an API key for the fine-tuned
                model you’ve just created. The API key is valid until the
                subscription period ends. Once a time-bound access token
                expires, the API key will be de-activated.
              </p>
              <p>
                The price for each type of subscription is pre-set at the
                moment. As a model creator, you will be able to customize the
                prices in the near future when these features are released.
              </p>
            </Text>
          </Grid.Col>
          <Grid.Col span={5}>
            <Title order={2} size="1rem">
              Pricing
            </Title>
            <Title
              order={3}
              size=".875rem"
              color="dimmed"
              weight="normal"
              mb={18}
            >
              3 subscription plans for users
            </Title>
            <Stack mb={24}>
              {renderPlan({
                title: "7-day free trial",
                value: "0 ETH",
              })}
              {renderPlan({
                title: "30-day subscription",
                value: "0.03 ETH",
              })}
              {renderPlan({
                title: "1-year subscription",
                value: "0.05 ETH",
              })}
            </Stack>
            {hydrated && !isConnected ? (
              <ConnectKitButton />
            ) : (
              <Button fullWidth>Create access token</Button>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
