import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import { MantineProvider } from "@mantine/core";

import type { AppProps } from "next/app";

const projectId = "e7af7967ca2d36a8010858f23fbb5031";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThirdwebProvider
        activeChain="ethereum"
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet(),
          walletConnect({
            projectId,
          }),
        ]}
      >
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
      </ThirdwebProvider>
    </>
  );
}
