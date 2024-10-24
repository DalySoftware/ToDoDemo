import { ThemeProvider } from "@mui/material";
import AppBar from "@mui/material/AppBar/AppBar";
import CssBaseline from "@mui/material/CssBaseline/CssBaseline";
import createTheme from "@mui/material/styles/createTheme";
import { useColorScheme } from "@mui/material/styles/ThemeProviderWithVars";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import Typography from "@mui/material/Typography/Typography";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import IconButton from "@mui/material/IconButton/IconButton";
import { ToDoDisplay } from "./components/ToDoDisplay";
import Stack from "@mui/material/Stack/Stack";

const UnthemedApp = () => {
  const { mode, setMode } = useColorScheme();
  if (!mode) return null;

  const toggleMode = () => setMode(mode == "light" ? "dark" : "light");

  return (
    <>
      <Stack direction="column" spacing={5}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              Demo ToDo App
            </Typography>
            <IconButton onClick={toggleMode}>
              <DarkModeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <ToDoDisplay />
      </Stack>
    </>
  );
};

const theme = createTheme({
  colorSchemes: {
    dark: true,
    light: true,
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <UnthemedApp />
  </ThemeProvider>
);

export default App;
