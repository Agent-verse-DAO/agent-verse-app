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
  Breadcrumbs,
  Box,
  Space,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import abiERC6551Registry from "~/contracts/abiERC6551Registry";
import abiERC721 from "~/contracts/abiERC721";
import Header from "~/components/Header";
import { env } from "~/env.mjs";
import Link from "next/link";

export default function NFTCreateAccessToken() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const { isConnected } = useAccount();

  const nftName = useContractRead({
    address: router.query.address as `0x${string}`,
    abi: abiERC721,
    functionName: "name",
  });

  const nftDescription = useContractRead({
    address: router.query.address as `0x${string}`,
    abi: abiERC721,
    functionName: "description",
  });

  const { isLoading, write } = useContractWrite({
    address: env.NEXT_PUBLIC_ADDRESS_ERC6551_REGISTRY as `0x${string}`,
    abi: abiERC6551Registry,
    functionName: "createAccount",

    onSuccess: (result) => {
      void router.replace(`${router.asPath}&tx=${result.hash}`);
    },
  });

  const waitForTransaction = useWaitForTransaction({
    hash: router.query.address as `0x${string}` | undefined,
  });

  useEffect(() => {
    if (router.query.address && waitForTransaction.data) {
      void router.push(`/access_token_success`);
    }
  }, [router, router.query.tx, waitForTransaction]);

  const renderPlan = useCallback(
    ({ title, value }: { title: string; value: string }) => {
      return (
        <Button
          variant="outline"
          sx={{
            ".mantine-Button-inner .mantine-Button-label": {
              width: "100%",
            },
            transition: "transform 100ms ease",
            "&:hover": {
              transform: "scale(1.03)",
            },
            "&:active": {
              transform: "scale(.99)",
            },
          }}
        >
          <Group position="apart" sx={{ width: "100%" }}>
            <Text weight={600}>{title}</Text>
            <Text weight={400} color="primary">
              {value}
            </Text>
          </Group>
        </Button>
      );
    },
    []
  );

  return (
    <>
      <Header />

      <Container size="md" px="md" py="sm">
        <Breadcrumbs
          mb="xs"
          sx={{
            fontSize: "0.875rem",
          }}
        >
          <Link
            href="/market"
            style={{
              textDecoration: "none",
            }}
          >
            <Anchor>Markets</Anchor>
          </Link>
          <Link
            href={`/market/${router.query.address as string}`}
            style={{
              textDecoration: "none",
            }}
          >
            <Anchor>{nftName?.data as string}</Anchor>
          </Link>
        </Breadcrumbs>
        <Title order={1}>{nftName?.data as string}</Title>
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
              Model description
            </Title>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              eget odio euismod, aliquam nisl quis, ultricies nunc. Donec
              aliquam, nisl quis, ultricies nunc.
            </Text>
          </Grid.Col>
          <Grid.Col span={5}>
            <Title order={2} size="1rem" mb={12}>
              Subscription
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

            <Title order={2} size="1rem" mb={12}>
              Purchase
            </Title>
            <Stack mb={24}>
              <Button variant="outline" disabled>
                Buy now
              </Button>
              <Button variant="outline" disabled>
                Make offer
              </Button>
            </Stack>
            {/* {hydrated && !isConnected ? (
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
            )} */}
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
