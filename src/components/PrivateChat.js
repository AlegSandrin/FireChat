import { ChatMessage } from './ChatMessage'

import { useState, useRef, useEffect, useMemo } from 'react'

import { db, storage } from '../services/firebaseService'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { query } from "firebase/firestore";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { IoClose, IoSend } from "react-icons/io5";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaCamera } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uuidv4 } from "@firebase/util";

const firestore = firebase.firestore();

export default function PrivateChat({userChat, setShowAlert}){
    
    const docId = userChat.chatId
    const photoURL = userChat.UserData.photoURL
    const userID = userChat.UserData.userID
    const username = userChat.UserData.username
    const [msgQuery, setMsgQuery] = useState()

    useMemo(() => {
        const q = query(db.collection('privateChat').doc(docId).collection('messages').orderBy('createdAt'))
        setMsgQuery(q)
    },[docId])

    const [messages,loading,error,querySnapshot] = useCollectionData(msgQuery)

    const docRef = []
        querySnapshot?.forEach(function(doc){
        docRef.push(doc.ref)
        })   

    const refBody = useRef('')
    useEffect(() => {
        if (refBody.current.scrollHeight > refBody.current.offsetHeight){
            refBody.current.scrollTop =
            refBody.current.scrollHeight - refBody.current.offsetHeight
        }
    },[messages])

    const [formValue, setFormValue] = useState('')

    const sendMessage = async (e) => {
    const messagesRef = firestore.collection('privateChat').doc(docId).collection('messages')

       e.preventDefault(); 

        if(formValue.length > 0){
        
        await messagesRef.add
        ({
            text: formValue, 
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userID: userID,
            photoURL: photoURL,
            username: username
        })
        setFormValue('') 
    }
    }

    const [isDisabled, setIsDisabled] = useState(true)

    useEffect(() => {
        if(formValue.length === 0){
            setIsDisabled(true)
        }
        else{
            setIsDisabled(false)
            if(formValue.length > 1000){
                const alert = {
                    severity:"warning",
                    setOpen:true, 
                    title: 'Mensagem muito longa',
                    message:'Número máximo de 1000 caracteres excedido'
                }
                setShowAlert(alert)
                setIsDisabled(true)
            }
            else{
                setIsDisabled(false)
            }
        }   
    },[formValue])

    const [fileUpload, setFileUpload] = useState(null)
    const [fileText, setFileText] = useState(formValue)

    const uploadFile = () => {
        if (fileUpload === null || fileUpload === undefined) return;

        const file = fileUpload[0]
        const type = fileUpload[1]

        handleClose()
        const fileRef = ref(storage, `privateChat/${docId}/${file.name + uuidv4()}` )
        uploadBytes(fileRef, file).then((promise) => {
            getDownloadURL(promise.ref).then((url) => {
              const addFile = {
                text: fileText,
                 createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                 userID: userID,
                 photoURL: photoURL,
                 username: username,
              }
              if(type === "image") {
                addFile.imageURL = url;
                addFile.imagePath = promise.ref.fullPath;
              }
              if(type === "video"){
                addFile.videoURL = url;
                addFile.videoPath = promise.ref.fullPath;
              }
                firestore.collection('privateChat').doc(docId).collection('messages').add(addFile) 
            })
        })
    }  

    const [open, setOpen] = useState(false)
    const [imgPreview, setImgPreview] = useState()
    const [videoPreview, setVideoPreview] = useState()

    const previewFile = (input, type) => {
        setOpen(true);
            var reader = new FileReader()
            reader.onload = function(e){
              if(type === "image"){
                setImgPreview(e.target.result);
                }
              if(type === "video"){
                setVideoPreview(e.target.result);
              }
            }
            reader.readAsDataURL(input);
    }

    const handleClose = () => {
    setOpen(false);
    setFileText('')
    setImgPreview(null)
    setVideoPreview(null)
    };

    const fileValidation = (file) => {
      // 1MB = 1,048,576 bytes - sizelimit = 200mb
      const sizelimit = 204857600
      if (file.target.files[0]?.size > sizelimit){
        const alert = {
          severity: "warning",
          setOpen: true,
          title: "Erro no envio",
          message: "Arquivo muito grande. Limite: 200MB",
        };
        setShowAlert(alert);
      }
      else if (file.target.files[0]?.type.includes("image")
      || file.target.files[0]?.type.includes("video"))
      {

      if (file.target.files[0]?.type.includes("image")) {
        setFileUpload([file.target.files[0], "image"]);
        previewFile(file.target.files[0], "image")
      }

      if (file.target.files[0]?.type.includes("video")) {
        setFileUpload([file.target.files[0], "video"]);
        previewFile(file.target.files[0], "video")

      } 
      }
      else {
        const alert = {
          severity: "warning",
          setOpen: true,
          title: "Erro no envio",
          message: "Só é permitido o envio de arquivos de imagem/gif ou video",
        };
        setShowAlert(alert);
      }
  
  }

    return (
      <>
        <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
          <DialogTitle
            color="secondary"
            borderBottom={3}
            sx={{
              backgroundColor: "secundary",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span className="text-lg sm:text-xl md:text-2xl">
              Enviar Imagem
            </span>
            <button
              className="float-right rounded-full text-[3rem]"
              onClick={handleClose}
            >
              <IoClose />
            </button>
          </DialogTitle>
          <DialogContent
            sx={{ marginTop: 2, justifyContent: "center", display: "flex" }}
          >
            {imgPreview && (
              <img
                src={imgPreview}
                className="object-contain"
                referrerPolicy="no-referrer"
                alt="imgpreview"
              />
            )}
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="object-contain"
                referrerPolicy="no-referrer"
                alt="videopreview"
              />
            )}
          </DialogContent>
          <DialogActions
            sx={{ paddingBottom: 2, paddingRight: 2, paddingLeft: 3, gap: 4 }}
          >
            <TextField
              variant="outlined"
              className="h-full w-full"
              value={fileText}
              onChange={(e) => setFileText(e.target.value)}
            />
            <button
              className="color5 rounded-full p-3 text-[2rem]"
              onClick={uploadFile}
            >
              <IoSend />
            </button>
          </DialogActions>
        </Dialog>

        <div className="flex h-full w-full flex-col place-content-end overflow-hidden">
          <main
            className="h-full overflow-y-auto scroll-smooth pt-3"
            ref={refBody}
          >
            {messages &&
              messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  docRef={docRef[index]}
                  CurrentUserID={userChat.UserData.userID}
                />
              ))}
          </main>

          <div className="flex items-center">
            <label className="block cursor-pointer">
              <FaCamera className="ml-4 mr-2 text-4xl" />
              <input
                id="sendImage"
                className="hidden"
                type="file"
                accept="image/* , video/*"
                onChange={(e) => fileValidation(e)}
              />
            </label>

            <form
              className="m-2 flex w-full overflow-hidden rounded-[2rem] bg-[rgba(32,36,53,0.85)] p-2 px-4 pb-0 pt-0 shadow-inner drop-shadow-xl"
              onSubmit={sendMessage}
            >
              <TextField
                variant="standard"
                className="h-full w-full"
                value={formValue}
                onChange={(e) => {
                  setFormValue(e.target.value);
                  setFileText(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <button
                      disabled={isDisabled}
                      className={`${
                        isDisabled && "saturate-0"
                      } color5 float-right m-1 rounded-full p-3 text-[2rem] transition`}
                      type="submit"
                    >
                      <IoSend />
                    </button>
                  ),
                }}
              />
            </form>
          </div>
        </div>
      </>
    );
}