// import { useLoaderData } from "react-router-dom"
import Chat from "../components/Chat"

// export const homeLoader = () =>{
//     const one = "oi"
//     return {one}
// }

export default function Home() {
    // const {one}= useLoaderData();

    return(
        <div className='flex max-h-[100vh] h-[100vh] md:justify-center md:items-center lg:p-8 overflow-hidden'>
                <Chat/>
        </div>
    )
}
