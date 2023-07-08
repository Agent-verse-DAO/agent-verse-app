import {
  createStyles,
  Container,
  Group,
  Text,
  rem,
  Button,
  Box,
} from "@mantine/core";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,
    marginBottom: rem(120),
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },
}));

export default function Home() {
  const { classes, theme } = useStyles();
  const address = useAddress();

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Text
            sx={{
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Agent verse
          </Text>

          <Box
            sx={{
              button: {
                backgroundColor: "transparent !important",
                transition: "background-color 100ms ease",
                padding: "0.5rem 1.125rem !important",
                height: "auto !important",
                fontSize: ".875rem !important",
              },
              "button:hover": {
                backgroundColor: `${theme.colors.cyan[7]} !important`,
              },
            }}
          >
            <ConnectWallet
              theme="light"
              detailsBtn={() => (
                <Button
                  weight={500}
                  size="sm"
                  sx={{ lineHeight: 1, color: theme.white }}
                  mr={3}
                >
                  {address && `${address?.slice(0, 6)}...${address?.slice(-5)}`}
                </Button>
              )}
            />
          </Box>
        </Group>
      </Container>
    </div>
  );
}
