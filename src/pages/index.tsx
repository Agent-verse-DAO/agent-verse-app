import {
  TextInput,
  Container,
  Button,
  Group,
  Title,
  Textarea,
  Stack,
  Grid,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWaitForTransaction } from "wagmi";
import { useAccount, useContractWrite } from "wagmi";

import Header from "~/components/Header";
import { env } from "~/env.mjs";

export default function CreateNFT() {
  const router = useRouter();
  const { isConnected } = useAccount();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const { isLoading, write } = useContractWrite({
    address: env.NEXT_PUBLIC_ADDRESS_NFT_FACTORY as `0x${string}`,
    abi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "nftContract",
            type: "address",
          },
        ],
        name: "NFTDeployed",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
        ],
        name: "deployNFT",
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
    functionName: "deployNFT",

    onSuccess: (result) => {
      void router.replace(`/?tx=${result.hash}`);
    },
  });

  const waitForTransaction = useWaitForTransaction({
    hash: router.query.tx as `0x${string}` | undefined,
  });

  useEffect(() => {
    if (
      router.query.tx &&
      waitForTransaction.data &&
      waitForTransaction.data?.logs?.[0]?.address
    ) {
      void router.push(
        `/nft_success?address=${waitForTransaction.data.logs[0].address}`
      );
    }
  }, [router, router.query.tx, waitForTransaction]);

  const form = useForm({
    initialValues: {
      name: "",
      symbol: "",
      description: "",
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Name is required"),
      symbol: (value) =>
        value.trim().length > 0 ? null : "Symbol is required",
      description: (value) =>
        value.trim().length > 0 ? null : "Description is required",
    },
  });

  return (
    <>
      <Header />

      <Container size="md" px="md" py="sm">
        <Title order={1} mb={32}>
          Create NFT
        </Title>
        <Grid gutter={48}>
          <Grid.Col span={7}>
            <Title order={2} size="1rem" mb={8}>
              NFT Details
            </Title>
            <Text>
              <p>
                The NFT governs the issuance of time-bound access tokens and
                resale of the entire model (i.e. transfer of IP).
              </p>
              <p>
                When other users of Agent-verse subscribe to your fine-tuned
                model, the recurring revenue accumulates in the token-bound
                account (TBA) of this NFT. You can always withdraw the balance
                from the TBA to your own crypto wallet. Note that all the
                free-trial and paid subscription records are verifiable
                on-chain.
              </p>
              You may also make the NFT available for sale or accept offers if
              you wish to transfer the IP of the fine-tuned model for a lump-sum
              payment. As the original creator of the model, you are entitled to
              5% royalties for all the subsequent secondary sales.
              <p>
                All the subscription, resale and royalty payments are settled in ETH.
              </p>
            </Text>
          </Grid.Col>
          <Grid.Col span={5}>
            <Title order={2} size="1rem" mb={8}>
              NFT Settings
            </Title>
            <form
              onSubmit={form.onSubmit((values) => {
                if (form.isValid()) {
                  write({
                    args: [values.name, values.symbol, values.description],
                  });
                }
              })}
            >
              <Stack>
                <TextInput
                  label="Name"
                  placeholder="Name"
                  {...form.getInputProps("name")}
                />
                <TextInput
                  label="Symbol"
                  placeholder="(e.g. VIC)"
                  {...form.getInputProps("symbol")}
                />

                <Textarea
                  placeholder="Description"
                  label="Description"
                  autosize
                  minRows={3}
                  {...form.getInputProps("description")}
                />
                <Group position="right">
                  {hydrated && !isConnected ? (
                    <ConnectKitButton />
                  ) : (
                    <Button
                      type="submit"
                      loading={isLoading || waitForTransaction.isLoading}
                    >
                      Mint NFT
                    </Button>
                  )}
                </Group>
              </Stack>
            </form>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
