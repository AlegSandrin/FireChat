import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import useChat from "./chatState";
import Chat from "./components/Chat";
import Loading from "./components/Loading";
import SignIn from "./pages/SignIn";
import SignInConfirm from "./pages/SignInConfirm";
import {auth, db} from "./services/firebaseService";
import firebase from "firebase/compat/app";

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
  const [confirmUser, setConfirmUser] = useState('')
  const [docId, setDocId] = useState()

  const setUserData = useChat((state) => state.setUserData)
  const {userID} = useChat((state) => state.userData)
  const setPrivateChat = useChat((state) => state.setPrivateChat)
  
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

useEffect(async () => {
  let ids = []
  if(userID){
  const ref = query(collection(db,'privateChat'), where('users', 'array-contains', userID), orderBy("lastMessage", "desc"))
  const querySnapshot = await getDocs(ref)
  querySnapshot.forEach((doc) => {
    ids.push(doc.data().docId)
  })
  }
  setDocId(ids)
},[userID])

const [messages, setMessages] = useState()

useEffect(() => {
  setPrivateChat(messages)
},[messages]) 

useEffect(() => {
  if(docId){
    let chats = []
    docId.forEach(async (id) => {
      let docs = []
        const snap = await getDocs(db.collection('privateChat').doc(id).collection('messages').orderBy('createdAt'))
        snap.forEach((doc) => {
        const data = doc.data()
        docs.push(data)
        });
      chats.push(docs)
    })
    setMessages(chats)
  }
},[docId])

  if (loading) return <div className="h-full w-full justify-center absolute"><Loading/></div>

  if (!user) return <SignIn/>

  function components(){
    if(confirmUser === ''){
      return <div className="h-full w-full justify-center absolute"><Loading/></div>
    }
    else{
      if(confirmUser === 'chat'){
        return <Chat/>
      }
      if(confirmUser === 'confirm'){
        return <SignInConfirm SignInConfirm={true}/>
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {components()}
    </ThemeProvider>
  );
}

export default App;
