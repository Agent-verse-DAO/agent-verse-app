import {
  Container,
  Button,
  Group,
  Title,
  Stack,
  Grid,
  Text,
  Card,
  Anchor,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";

import abiERC6551Registry from "~/contracts/abiERC6551Registry";
import abiSubscriptionFactory from "~/contracts/abiSubscriptionFactory";
import Header from "~/components/Header";
import { env } from "~/env.mjs";

export default function NFTSuccess() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const { isConnected } = useAccount();

  const newAccount = useMemo(
    () => [
      env.NEXT_PUBLIC_ADDRESS_ERC6551_ACCOUNT as `0x${string}`,
      BigInt(5), // Goerli
      router.query.address as `0x${string}`,
      BigInt(1), // tokenId
      BigInt(1), // salt
      "0x",
    ],
    [router.query.address]
  );

  const createAccount = useContractWrite({
    address: env.NEXT_PUBLIC_ADDRESS_ERC6551_REGISTRY as `0x${string}`,
    abi: abiERC6551Registry,
    functionName: "createAccount",

    onSuccess: (result) => {
      console.log("createAccount result", result);
      void router.replace(`${router.asPath}&createAccountTx=${result.hash}`);
    },
  });

  const deploySubscriptionContract = useContractWrite({
    address: env.NEXT_PUBLIC_ADDRESS_SUBSCRIPTION_FACTORY as `0x${string}`,
    abi: abiSubscriptionFactory,
    functionName: "deploySubscriptionContract",

    onSuccess: (result) => {
      void router.replace(`${router.asPath}&deploySubTx=${result.hash}`);
    },
  });

  const createAccountTxState = useWaitForTransaction({
    hash: router.query.createAccountTx as `0x${string}` | undefined,
  });

  console.log("createAccountTxState", createAccountTxState);

  const deploySubTxState = useWaitForTransaction({
    hash: router.query.deploySubTx as `0x${string}` | undefined,
  });

  console.log("deploySubTxState", deploySubTxState);

  useEffect(() => {
    if (router.query.deploySubTx && deploySubTxState.data) {
      void router.push(`/access_token_success`);
    }
  }, [router, router.query.deploySubTx, deploySubTxState]);

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
        <Title order={1}>You’ve created an NFT for your model!</Title>
        <Title order={3} size="0.875rem" mb={32}>
          <Anchor
            href={`https://goerli.etherscan.io/address/${
              router.query.address as string
            }`}
            target="_blank"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            {router.query.address} <IconExternalLink size={12} />
          </Anchor>
        </Title>
        <Grid gutter={48}>
          <Grid.Col span={7}>
            <Title order={2} size="1rem" mb={8}>
              Now it’s time to create Access Tokens.
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
              <Stack>
                <Button
                  fullWidth
                  loading={
                    createAccount.isLoading || createAccountTxState.isLoading
                  }
                  disabled={createAccountTxState.data !== undefined}
                  onClick={() => {
                    createAccount.write({
                      args: newAccount,
                    });
                  }}
                >
                  Create access token
                </Button>
                {!!router.query.createAccountTx &&
                  !!createAccountTxState.data && (
                    <Button
                      fullWidth
                      loading={
                        deploySubscriptionContract.isLoading ||
                        deploySubTxState.isLoading
                      }
                      onClick={() => {
                        deploySubscriptionContract.write({
                          args: [env.NEXT_PUBLIC_ADDRESS_ERC6551_REGISTRY],
                        });
                      }}
                    >
                      Deploy subscription contract
                    </Button>
                  )}
              </Stack>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
