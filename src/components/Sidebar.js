import { useCollection } from "react-firebase-hooks/firestore";
import { MdContactMail } from "react-icons/md";
import { IoMdAddCircle, IoIosPeople } from "react-icons/io";
import { db } from "../services/firebaseService";
import SidebarChatsItem from "./SidebarChatsItem";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useEffect } from "react";

import useChat from "../chatState";

const Sidebar = React.memo(({ setShowAlert }) => {
  const userData = useChat((state) => state.userData);
  const userChat = useChat((state) => state.userChat);
  const setUserChat = useChat((state) => state.setUserChat);

  const lastMessage = useChat((state) => state.privateChat);

  const [idInput, setIdInput] = useState("");
  const [refChat, setRefChat] = useState();

  useMemo(() => {
    const refChatData = db
      .collection("privateChat")
      .where("users", "array-contains", userData.userID);
    setRefChat(refChatData);
  }, [userData]);

  const [chatsSnapshot] = useCollection(refChat);

  const handleCreateChat = async () => {
    const refUsersDB = collection(db, "usersDB");

    if (idInput === userData.userID) {
      const alert = {
        severity: "warning",
        setOpen: true,
        title: "Aviso",
        message: "Insira um ID de usuário diferente do seu",
      };
      setShowAlert(alert);
    } else if (chatExists(idInput)) {
      const alert = {
        severity: "warning",
        setOpen: true,
        title: "Aviso",
        message: "Contato já adicionado",
      };
      setShowAlert(alert);
    } else {
      const q = query(refUsersDB, where("userID", "==", idInput));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const alert = {
          severity: "warning",
          setOpen: true,
          title: "Aviso",
          message: "ID de usuário não existente",
        };
        setShowAlert(alert);
      } else {
        db.collection("privateChat")
          .add({
            users: [userData.userID, idInput],
          })
          .then((promise) => {
            updateDoc(doc(db, promise.path), {
              docId: promise.id,
            });
          });
        const alert = {
          severity: "success",
          setOpen: true,
          title: "Sucesso",
          message: "Contato adicionado",
        };
        setShowAlert(alert);
        handleClose();
      }
    }
  };

  const chatExists = (chatID) => {
    return !!chatsSnapshot?.docs.find(
      (chat) => chat.data().users.find((user) => user === chatID)?.length > 0
    );
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex-col gap-1 text-xl">
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle
          color="secondary"
          borderBottom={3}
          sx={{ fontSize: 25, backgroundColor: "secundary" }}
        >
          <span className="text-lg sm:text-xl md:text-2xl">
            Adicionar Contato
          </span>
        </DialogTitle>
        <DialogContent sx={{ margin: 5 }}>
          <DialogContentText sx={{ fontSize: 18 }}>
            Digite o <strong>ID do úsuario</strong>:
          </DialogContentText>
          <TextField
            variant="outlined"
            autoFocus
            fullWidth
            margin="dense"
            id="userID"
            label="UserID"
            value={idInput}
            onChange={(e) => {
              setIdInput(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateChat}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <div
        className={`${
          Object.keys(userChat).length == 0 && "active"
        } color3 flex cursor-pointer items-center justify-center gap-1 border-b border-gray-100 border-opacity-30 p-3 transition hover:bg-[#a34373] md:gap-2`}
        onClick={() => {
          setUserChat({});
        }}
      >
        <IoIosPeople className="text-[2.5rem]" />
        <span className="overflow-hidden text-ellipsis text-sm lg:text-base xl:text-lg">
          Chat Geral
        </span>
      </div>
      <div className="my-5 flex h-full w-full justify-between px-2">
        <div className="flex items-center gap-1">
          <MdContactMail className="text-2xl" />
          <h1>Contatos</h1>
        </div>
        <div className="flex items-center text-3xl">
          <IoMdAddCircle className="cursor-pointer" onClick={handleClickOpen} />
        </div>
      </div>
      <div className="overflow-y-auto">
        {chatsSnapshot?.docs.map((item, index) => (
          <div className="h-full w-full" key={index}>
            <SidebarChatsItem
              active={userChat?.chatId === item?.id ? "active" : ""}
              id={item.id}
              users={item.data().users}
              user={userData.userID}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default Sidebar;
