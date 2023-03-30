import { useEffect, useMemo, useState } from 'react'

import { FaBars, FaTimes } from 'react-icons/fa'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../services/firebaseService'

import Loading from './Loading'
import Sidebar from './Sidebar'
import ChatHeader from './ChatHeader'
import SignOut from './SignOut'
import { ChatRoom } from './ChatRoom'
import ShowAlert from './ShowAlert'
import useChat from '../chatState'

export default function Chat() {
    const userData = useChat((state) => state.userData)
    const userChat = useChat((state) => state.userChat);
    const [user] = useAuthState(auth)
    const [showAlert, setShowAlert] = useState()
    const [sidebar, setSidebar] = useState(false)
    const showSidebar = () => setSidebar(!sidebar)

    if (window.innerWidth < 640) {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
    
    return (
      <div className="container max-w-full">
        {showAlert?.setOpen === true && <ShowAlert showAlert={showAlert} />}
        <div className="grid h-full w-full grid-cols-12 grid-rows-6 overflow-hidden text-white opacity-[0.85] shadow-inner brightness-110 drop-shadow-2xl">
          <div
            className={`fixed z-20 md:block ${
              sidebar ? "sidebarOut left-[-100%]" : "sidebar left-[0]"
            } col-span-3 row-span-full h-full w-3/5 md:relative md:w-auto`}
          >
            <div className={`fixed left-[0] z-20 p-2 text-[2.5rem] md:hidden`}>
              {sidebar ? (
                <FaBars onClick={showSidebar} />
              ) : (
                <FaTimes onClick={showSidebar} />
              )}
            </div>
            <header className="color2 col-span-3 row-span-1 flex justify-end gap-8 overflow-hidden p-4 drop-shadow-xl md:justify-between">
              <img
                className="h-10 w-auto rounded-full md:h-12"
                src={userData.photoURL}
                alt="Imagem de perfil"
                referrerPolicy="no-referrer"
              />
              <SignOut />
            </header>
            <div className="color3 col-span-3 row-start-2 row-end-6 h-full overflow-y-auto drop-shadow-xl">
              {useMemo(() => {
                if (userData) {
                  return (
                    <Sidebar
                      setShowAlert={setShowAlert}
                    />
                  );
                } else {
                  return <Loading />;
                }
              }, [userChat])}
            </div>
          </div>
          <section
            onClick={() => !sidebar && setSidebar(true)}
            className="Chat col-span-full row-span-6 inline-flex flex-col overflow-hidden md:col-span-9"
          >
            <ChatHeader />
            {useMemo(() => {
              if (!user) {
                return <Loading />;
              } else {
                return (
                  <ChatRoom
                    setShowAlert={setShowAlert}
                  />
                );
              }
            }, [user, userChat])}
          </section>
        </div>
      </div>
    );
}
