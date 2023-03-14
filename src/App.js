// import { ThemeProvider } from "@emotion/react";
// import { createTheme, CssBaseline } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet } from "react-router-dom";
import Loading from "./components/Loading";
import SignIn from "./pages/SignIn";
import {auth} from "./services/firebaseService";

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });

function App() {

  const [user, loading] = useAuthState(auth)

  if (loading) return( <div className="h-full w-full justify-center absolute"><Loading/></div> )

  if (!user) return <SignIn/>

  return (
    // <ThemeProvider theme={darkTheme}>
    //   <CssBaseline />
      <Outlet/>
    // {/* </ThemeProvider> */}
  );
}

export default App;
