import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { IoClose } from 'react-icons/io5'
import MessagesMenu from './MessagesMenu'
import { auth } from '../services/firebaseService'
import { useState, useEffect } from 'react'
import { FaPlay } from 'react-icons/fa'

export function ChatMessage(props) {
    const docRef = props.docRef
    const CurrentUserID = props.CurrentUserID
    const { text, uid, photoURL, createdAt, username, userID, imageURL, imagePath, videoURL, videoPath, editedAt } = props.message;
    let type = ''
    if(imageURL) type = 'image'
    if(videoURL) type = 'video'

        const ts_ms = new Date(createdAt * 1000); // timestamp para milisegundos
        var date = new Date(ts_ms); // inicia um novo objeto Date
        var month = ("0" + (date.getMonth() + 1)).slice(-2); // mes
        var day = ("0" + (date.getDate() + 1)).slice(-2); // dia
        var hours = ("0" + date.getHours()).slice(-2); // horas
        var minutes = ("0" + date.getMinutes()).slice(-2); // minutos

        const ts_msEdit = new Date(editedAt * 1000); // timestamp para milisegundos
        var dateEdit = new Date(ts_msEdit); // inicia um novo objeto Date
        var monthEdit = ("0" + (dateEdit.getMonth() + 1)).slice(-2); // mes
        var dayEdit = ("0" + (dateEdit.getDate() + 1)).slice(-2); // dia
        var hoursEdit = ("0" + dateEdit.getHours()).slice(-2); // horas
        var minutesEdit = ("0" + dateEdit.getMinutes()).slice(-2); // minutos

    const photo = photoURL;

    const [messageClass,setMessageClass] = useState()
    useEffect(() => {
    if(uid){
        uid === auth.currentUser.uid ? setMessageClass('sent') : setMessageClass('received')
    }else{
        userID === CurrentUserID ? setMessageClass('sent') : setMessageClass('received')
    } 
    })
    
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        };

    const showFile = (file, text, type, username, createdAt) => {
        return (
          <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
            <DialogTitle
              sx={{
                backgroundColor: "secundary",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span className="text-sm sm:text-lg md:text-xl">
                {username} - {createdAt}
              </span>
              <button
                className="rounded-full p-3 text-[2rem]"
                onClick={handleClose}
              >
                <IoClose />
              </button>
            </DialogTitle>
            <DialogContent sx={{ justifyContent: "center", display: "flex" }}>
              {type === "image" && (
                <img
                  src={file}
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
              {type === "video" && (
                <video
                  src={file}
                  controls
                  className="object-contain"
                  referrerPolicy="no-referrer"
                >
                  Seu navegador não suporta a reprodução de vídeo. Faça o
                  download do arquivo <a href={file}>clicando aqui.</a>
                </video>
              )}
            </DialogContent>
            {text && (
              <DialogContentText sx={{ paddingLeft: 3, paddingRight: 3 }}>
                {text}
              </DialogContentText>
            )}
            <DialogActions
              sx={{ paddingBottom: 2, paddingRight: 2, paddingLeft: 3, gap: 4 }}
            ></DialogActions>
          </Dialog>
        );
    }

    return (
      <>
        {open &&
          showFile(
            imageURL || videoURL,
            text,
            type,
            username,
            `${day}/${month} ${hours}:${minutes}`
          )}

        <div className={`div${messageClass} ml-2 opacity-90`}>
          <div
            className={`${messageClass} m-5 inline-flex rounded-xl py-1 px-2 brightness-125`}
          >
            <img
              className="mr-2 h-[35px] w-auto -translate-y-6 -translate-x-6 rounded-full"
              src={photo}
              referrerPolicy="no-referrer"
              alt={`Foto de ${username}`}
            />
            <div>
              <div className="flex h-auto w-auto justify-between font-thin">
                <span className="m-1 -translate-x-8 text-base font-normal">
                  {username}
                  <span className="ml-1 text-[0.5rem] font-thin">{userID}</span>
                </span>
                <span className="my-auto ml-auto flex flex-col justify-end text-[0.5rem] ">
                  <span className="self-end text-right">
                    {day}/{month} {hours}:{minutes}
                  </span>
                  <span className="self-end text-right">
                    {editedAt &&
                      `(editado às ${dayEdit}/${monthEdit} ${hoursEdit}:${minutesEdit})`}
                  </span>
                </span>
                {userID === CurrentUserID && (
                  <MessagesMenu
                    docRef={docRef}
                    filePath={imagePath || videoPath}
                    editMessage={text}
                    fileURL={imageURL || videoURL}
                    type={type}
                  />
                )}
                {uid === auth.currentUser.uid && (
                  <MessagesMenu
                    docRef={docRef}
                    filePath={imagePath || videoPath}
                    editMessage={text}
                    fileURL={imageURL || videoURL}
                    type={type}
                  />
                )}
              </div>
              {imageURL && (
                <img
                  className="mx-auto max-h-[250px] max-w-full cursor-pointer p-2"
                  src={imageURL}
                  onClick={() => {
                    setOpen(true);
                  }}
                ></img>
              )}
              {videoURL && (
                <div className="transition flex justify-center items-center hover:text-[#cc264af6] w-auto h-auto">
                  <FaPlay className="absolute text-4xl opacity-60" />
                  <video
                    className=" mx-auto max-h-[250px] max-w-full cursor-pointer p-2"
                    src={videoURL}
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Seu navegador não suporta a reprodução de vídeo. Faça o
                    download do arquivo <a href={videoURL}>clicando aqui.</a>
                  </video>
                </div>
              )}
              {text && (
                <p className="m-2 mt-0 -translate-x-9 break-all font-extralight">
                  {text}
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
    
}