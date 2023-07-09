import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { env } from "~/env.mjs";
import { MantineProvider } from "@mantine/core";

import type { AppProps } from "next/app";
import { goerli } from "wagmi/chains";

const projectId = "e7af7967ca2d36a8010858f23fbb5031";

const config = createConfig(
  getDefaultConfig({
    infuraId: env.NEXT_PUBLIC_INFURA_API_KEY,
    walletConnectProjectId: projectId,
    appName: "Agent verse",
    chains: [goerli],
  })
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme: "light",
              primaryColor: "cyan",
            }}
          >
            <Component {...pageProps} />
          </MantineProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  );
}
