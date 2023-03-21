import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi'
import { MdDelete, MdEdit } from 'react-icons/md';
import { db, storage } from '../services/firebaseService';

export default function MessagesMenu({docRef, imagePath}) {

    const [open, setOpen] = useState(false);

    const handleClickOpenAlert = () => {
      setOpen(true);
    };
  
    const handleCloseAlert = () => {
      setOpen(false);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const deleteMessage = () => {
        if(imagePath){
            const imageRef = ref(storage, imagePath);
        deleteObject(imageRef).then(() => {
          }).catch((error) => {
            console.log('error:', error)
          });
        }
    
        deleteDoc(doc(db, docRef.path)).then(() => {
            handleCloseAlert()
            handleCloseMenu()
        })
    }

    return(
<>

<Dialog
    open={open}
    onClose={handleCloseAlert}
>
    <DialogContent>
        <DialogContentText>
        Deseja realmente apagar a mensagem?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseAlert}> Cancelar </Button>
        <Button onClick={deleteMessage} autoFocus> Apagar </Button>
    </DialogActions>
</Dialog>

    <div className='flex items-center m-2'>
        <button
        aria-controls={openMenu ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        onClick={handleClick}
      >
        <GiHamburgerMenu/>
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClickOpenAlert}>
            <ListItemIcon>
                <MdDelete className='text-[#cc264acf] text-xl'/>
            </ListItemIcon>
            <ListItemText className='text-[#cc264acf]'>Deletar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
                <MdEdit className='text-white text-xl'/>
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
        </MenuItem>

      </Menu>
    </div>
</>
    )
}