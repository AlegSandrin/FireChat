// import { ThemeProvider } from "@emotion/react";
// import { createTheme, CssBaseline } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "./components/Loading";
import SignIn from "./pages/SignIn";
import SignInConfirm from "./pages/SignInConfirm";
import {auth, db} from "./services/firebaseService";

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });

function App() {

  const [user, loading] = useAuthState(auth)

  const navigate = useNavigate()
    
    useEffect(() => {
      async function verifUser(){
      if(user){
        const usersRef = doc(db, "usersDB", user.uid)
        const docs = await getDoc(usersRef)
        const data = docs?.data()
        if(data){
           navigate('/')
        }else{
            return <SignInConfirm SignInConfirm={true}/>
        }
        }
      }
    verifUser()
      
    },[])

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
