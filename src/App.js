import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Chat from "./components/Chat";
import Loading from "./components/Loading";
import SignIn from "./pages/SignIn";
import SignInConfirm from "./pages/SignInConfirm";
import {auth, db} from "./services/firebaseService";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#005d77',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#000000',
      paper: 'rgba(51,56,78,0.85)',
    },
    text: {
      primary: 'rgba(255,246,246,0.87)',
      secondary: 'rgba(255,255,255,0.8)',
      disabled: 'rgba(175,175,175,0.38)',
      hint: '#d2d2d2',
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: [
      'Martian Mono', 
      'monospace',
    ].join(','),
  },
});

function App() {

  const [user, loading] = useAuthState(auth)
  const [userData, setUserData] = useState()
  const [confirmUser, setConfirmUser] = useState('')
    
    useEffect(() => {
      async function verifUser(){
      if(user){
        const usersRef = doc(db, "usersDB", user.uid)
        const docs = await getDoc(usersRef)
        const data = docs.data()
        if(data){
          setUserData(data)
          setConfirmUser('chat')
        }
        else{
          setConfirmUser('confirm')
        }
        }
      }
    verifUser()
    },[user])

  if (loading) return <div className="h-full w-full justify-center absolute"><Loading/></div>

  if (!user) return <SignIn/>

  function components(){
    if(confirmUser === ''){
      return <div className="h-full w-full justify-center absolute"><Loading/></div>
    }
    else{
      if(confirmUser === 'chat'){
        return <Chat userData={userData}/>
      }
      if(confirmUser === 'confirm'){
        return <SignInConfirm SignInConfirm={true}/>
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
      {components()}
    </ThemeProvider>
  );
}

export default App;
