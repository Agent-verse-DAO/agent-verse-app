import { createStyles, Container, Group, Text, rem } from "@mantine/core";
import { ConnectKitButton } from "connectkit";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,
    marginBottom: rem(24),
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },
}));

export default function Header() {
  const { classes } = useStyles();

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

          <ConnectKitButton />
        </Group>
      </Container>
    </div>
  );
}
