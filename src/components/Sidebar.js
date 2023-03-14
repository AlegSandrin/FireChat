import { useCollection } from "react-firebase-hooks/firestore";
import { MdContactMail } from "react-icons/md";
import { IoMdAddCircle, IoIosPeople } from "react-icons/io";
import { db} from '../services/firebaseService'
import SidebarChatsItem from "./SidebarChatsItem";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useColorScheme } from "@mui/material";
import { useState } from "react";
import { alignProperty } from "@mui/material/styles/cssUtils";
import { Box, color } from "@mui/system";


const Sidebar = ({setUserChat, userChat, UserData, setShowAlert}) => {

    const [idInput, setIdInput] = useState('')
    const refChat = db
    .collection('privateChat')
    .where('users', 'array-contains', UserData.userID)
    const [chatsSnapshot] = useCollection(refChat)
    
    const refUsersDB = collection(db, 'usersDB')

    const handleCreateChat = async () => {

        if(idInput === UserData.userID){
            const alert = {
                severity:"warning",
                setOpen:true, 
                title: 'Aviso',
                message:'Insira um ID de usuário diferente do seu'
            }
            setShowAlert(alert)
        } else if(chatExists(idInput)){
            const alert = {
                severity:"warning",
                setOpen:true, 
                title: 'Aviso',
                message:'Contato já adicionado'
            }
            setShowAlert(alert)
        } else {

        const q = query(refUsersDB, where('userID', '==', idInput))
        const querySnapshot = await getDocs(q);
        
        if(querySnapshot.empty){
            const alert = {
                severity:"warning",
                setOpen:true, 
                title: 'Aviso',
                message:'ID de usuário não existente'
            }
            setShowAlert(alert)
        }
        else{
            db.collection('privateChat').add({
            users: [UserData.userID, idInput] })
            const alert = {
                severity:"success",
                setOpen:true, 
                title: 'Sucesso',
                message:'Contato adicionado'
            }
            setShowAlert(alert)
            handleClose()
        }
    }
}

    const chatExists = (chatID) => {
        return !!chatsSnapshot?.docs.find(
            (chat) => chat.data().users.find((user) => user === chatID)?.length > 0
        )
    }

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
    setOpen(true);
    };

    const handleClose = () => {
    setOpen(false);
    };

    return (
        <div className='flex-col gap-1 text-xl'>
            
            <Dialog fullWidth open={open} onClose={handleClose} >
                <DialogTitle sx={{fontSize:30}}>Adicionar Contato</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{fontSize:23}}>
                        Digite o <strong>ID do úsuario</strong>:
                    </DialogContentText>
                    <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    id="userID"
                    label='UserID'
                    variant='standard'
                    value={idInput}
                    onChange={(e) => {setIdInput(e.target.value)}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleCreateChat}>Adicionar</Button>
                </DialogActions>
            </Dialog>

            <div className={`${userChat ? '' : 'active'} color3 flex justify-center border-opacity-30 border-gray-100 border-b items-center md:gap-2 hover:bg-[#a34373] transition cursor-pointer gap-1 p-3`} onClick={() => {setUserChat(null)}}>
                <IoIosPeople className="text-[2.5rem]"/>
                <span className="text-sm lg:text-base xl:text-lg text-ellipsis overflow-hidden">Chat Geral</span>
            </div>
            <div className="flex justify-between my-5 h-full w-full px-2">
                
            <div className="flex items-center gap-1">
            <MdContactMail className="text-2xl"/>
            <h1>Contatos</h1>
            </div>
                <div className="flex items-center text-3xl">
                <IoMdAddCircle className="cursor-pointer" onClick={handleClickOpen}/>
                </div>
            </div>
                {chatsSnapshot?.docs.map((item, index) => (
                <div className="h-full w-full" key={index}>
                <SidebarChatsItem
                setUserChat={setUserChat} 
                active={userChat?.chatId === item.id ? 'active' : ''}
                id={item.id}
                users={item.data().users}
                user={UserData.userID}
                UserData={UserData}
                />
                </div>
                ))
                    
                }
                
        </div>
    )
}

export default Sidebar