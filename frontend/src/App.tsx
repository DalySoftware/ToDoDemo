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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  googleLogout,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import Button from "@mui/material/Button/Button";

type User = { accessToken: string };

const LoginLogoutButton = ({
  user,
  setUser,
}: {
  user?: User;
  setUser: (user: User | undefined) => void;
}) => {
  const login = useGoogleLogin({
    onSuccess: (response) => {
      setUser({ accessToken: response.access_token });
    },
  });
  const logout = () => {
    googleLogout;
    setUser(undefined);
  };
  return !!user ? (
    <IconButton>
      <LogoutIcon onClick={logout} />
    </IconButton>
  ) : (
    <Button onClick={() => login()} endIcon={<LoginIcon color="primary" />}>
      Login to start
    </Button>
  );
};

const UnthemedApp = () => {
  const { mode, setMode } = useColorScheme();
  const [user, setUser] = useState<User | undefined>(undefined);

  if (!mode) return null;

  const toggleMode = () => setMode(mode == "light" ? "dark" : "light");

  return (
    <>
      <Stack direction="column" spacing={5} alignItems="center">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              Demo ToDo App
            </Typography>
            <LoginLogoutButton user={user} setUser={setUser} />
            <IconButton onClick={toggleMode}>
              <DarkModeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <ToDoDisplay user={user} />
      </Stack>
    </>
  );
};

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 3,
      },
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "20px",
        },
      },
    },
  },
});

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId="762528976735-ru900278kll5b7vcdjm7slebki3geq4j.apps.googleusercontent.com">
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <UnthemedApp />
      </QueryClientProvider>
    </ThemeProvider>
  </GoogleOAuthProvider>
);

export default App;
export type { User };
