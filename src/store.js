import { useEffect } from "react";
import { create } from "zustand";

const useStore = create((set) => ({
    lastMessage: [],
    setLastMessage: (message) =>
        set((state) => ({ lastMessage: [message]})),
}))

export default useStore