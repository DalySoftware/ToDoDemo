import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";

export const StatusColumn = ({ status }: { status: string }) => (
  <Card
    sx={{
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    }}
  >
    <Typography component="h2" variant="h4">
      {status}
    </Typography>
  </Card>
);
