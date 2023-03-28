import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemIcon, ListItemText, Menu, MenuItem, TextField } from '@mui/material'

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'

import { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoClose, IoSend } from 'react-icons/io5'
import { MdDelete, MdEdit } from 'react-icons/md'
import { db, storage } from '../services/firebaseService'


export default function MessagesMenu({docRef, filePath, editMessage, fileURL, type}) {

    const [open, setOpen] = useState(false);

    const handleClickOpenAlert = () => {
      setOpen(true);
    };
  
    const handleCloseAlert = () => {
      setOpen(false);
    };

    const [openEdit, setOpenEdit] = useState(false)
    const [toEditMessage, setToEditMessage] = useState(editMessage)

    const handleClickOpenEdit = () => {
      setOpenEdit(true);
    };

    const handleCloseEdit = () => {
      setOpenEdit(false);
    };

    const handleEditMessage = async () => {
      const messageRef = doc(db, docRef.path)

      await updateDoc(messageRef, {
      text: toEditMessage,
      editedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      handleCloseEdit()
      handleCloseMenu()
    })
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const deleteMessage = () => {
        if(filePath){
            const fileRef = ref(storage, filePath);
        deleteObject(fileRef).then(() => {
          }).catch((error) => {
            console.log('error:', error)
          });
        }
    
        deleteDoc(doc(db, docRef.path)).then(() => {
            handleCloseAlert()
            handleCloseMenu()
        })
    }

    return (
      <>
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={handleCloseEdit}
        >
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
            <span
              className="text-lg sm:text-xl md:text-2xl"
              onClick={handleEditMessage}
            >
              Editar mensagem
            </span>
            <button
              className="float-right rounded-full text-[3rem]"
              onClick={handleCloseEdit}
            >
              <IoClose />
            </button>
          </DialogTitle>
          {fileURL && (
            <DialogContent sx={{ justifyContent: "center", display: "flex", marginTop: 3 }}>
              {type === "image" && 
                (
                  <img
                    src={fileURL}
                    className="object-contain"
                    referrerPolicy="no-referrer"
                    alt="img"
                  ></img>
                )}
              {type === "video" &&
                (
                  <video
                    src={fileURL}
                    controls
                    className="object-contain"
                    referrerPolicy="no-referrer"
                  >
                    Seu navegador não suporta a reprodução de vídeo.
                  Faça o download do arquivo <a href={fileURL}>clicando aqui.</a>
                  </video>
                )}
            </DialogContent>
          )}
          <DialogContentText sx={{ padding: 3 }}>
            <label className="break-all">{editMessage}</label>
          </DialogContentText>
          <DialogActions
            sx={{ paddingBottom: 2, paddingRight: 2, paddingLeft: 3, gap: 4 }}
          >
            <TextField
              variant="outlined"
              className="h-full w-full"
              multiline
              maxRows={4}
              value={toEditMessage}
              onChange={(e) => setToEditMessage(e.target.value)}
            />
            <button
              className="color5 rounded-full p-3 text-[2rem]"
              onClick={handleEditMessage}
            >
              <IoSend />
            </button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={handleCloseAlert}>
          <DialogContent>
            <DialogContentText>
              Deseja realmente apagar a mensagem?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAlert}> Cancelar </Button>
            <Button onClick={deleteMessage} autoFocus>
              Apagar
            </Button>
          </DialogActions>
        </Dialog>

        <div className="m-2 flex items-center">
          <button
            aria-controls={openMenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            onClick={handleClick}
          >
            <GiHamburgerMenu />
          </button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClickOpenAlert}>
              <ListItemIcon>
                <MdDelete className="text-xl text-[#cc264acf]" />
              </ListItemIcon>
              <ListItemText className="text-[#cc264acf]">Deletar</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClickOpenEdit}>
              <ListItemIcon>
                <MdEdit className="text-xl text-white" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
          </Menu>
        </div>
      </>
    );
}