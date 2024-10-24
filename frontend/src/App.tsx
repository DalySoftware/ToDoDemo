import {ThemeProvider} from "@mui/material";
import AppBar from "@mui/material/AppBar/AppBar";
import CssBaseline from "@mui/material/CssBaseline/CssBaseline";
import createTheme from "@mui/material/styles/createTheme";
import {useColorScheme} from "@mui/material/styles/ThemeProviderWithVars";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import Typography from "@mui/material/Typography/Typography";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import IconButton from "@mui/material/IconButton/IconButton";

const UnthemedApp = () => {
  const {mode, setMode, systemMode} = useColorScheme();
  if (!mode) setMode(systemMode ?? "dark");

  const toggleMode = () => setMode(mode == "light" ? "dark" : "light");

  return (
    <>
      <CssBaseline/>
      <AppBar position="static">
        <Toolbar>

          <Typography variant="h4" component="h1" sx={{flexGrow: 1}}>Demo ToDo App</Typography>
          <IconButton onClick={toggleMode}>
            <DarkModeIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
    </>

  )
}

const theme = createTheme({
  colorSchemes: {
    dark: true,
    light: true,
  },
})

const App = () => (
  <ThemeProvider theme={theme}>
    <UnthemedApp/>
  </ThemeProvider>
)

export default App
