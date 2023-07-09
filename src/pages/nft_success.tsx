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
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";

import Header from "~/components/Header";
import { env } from "~/env.mjs";

export default function NFTSuccess() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const { isConnected } = useAccount();

  const { isLoading, write } = useContractWrite({
    address: env.NEXT_PUBLIC_ADDRESS_ERC6551_REGISTRY as `0x${string}`,
    abi: [
      {
        inputs: [],
        name: "InitializationFailed",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "implementation",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "tokenContract",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
        ],
        name: "AccountCreated",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "implementation",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
        ],
        name: "account",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "implementation",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "initData",
            type: "bytes",
          },
        ],
        name: "createAccount",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "createAccount",

    onSuccess: (result) => {
      void router.replace(`${router.asPath}&tx=${result.hash}`);
    },
  });

  const waitForTransaction = useWaitForTransaction({
    hash: router.query.tx as `0x${string}` | undefined,
  });

  useEffect(() => {
    if (router.query.tx && waitForTransaction.data) {
      void router.push(`/access_token_success`);
    }
  }, [router, router.query.tx, waitForTransaction]);

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
              <Button
                fullWidth
                loading={isLoading || waitForTransaction.isLoading}
                onClick={() => {
                  write({
                    args: [
                      env.NEXT_PUBLIC_ADDRESS_ERC6551_ACCOUNT as `0x${string}`,
                      BigInt(5), // Goerli
                      router.query.address as `0x${string}`,
                      BigInt(1), // tokenId
                      BigInt(1), // salt
                      "0x",
                    ],
                  });
                }}
              >
                Create access token
              </Button>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
