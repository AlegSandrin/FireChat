import { create } from "zustand";

const useChat = create((set) => ({
  userData: {},
  setUserData: (userData) =>
    set(() => ( { userData: userData} ) ),

  userChat: {},
  setUserChat: (userChat) =>
    set(() => ( { userChat: userChat } ) ),

  privateChat: [],
  setPrivateChat: (privateChat) =>
    set((state) => ( { privateChat: [privateChat]} ) ),

  lastMessage: [],
  setChatId: (chatid) =>
    set((state) => ({ lastMessage: [...state.lastMessage, [chatid]] })),
  setLastMessage: (chatid, message) =>
    set((state) => (lastMessage[chatid] = message)),
}));

export default useChat