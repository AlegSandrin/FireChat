// import { useLoaderData } from "react-router-dom"
import Chat from "../components/Chat"

// export const homeLoader = () =>{
//     const one = "oi"
//     return {one}
// }

export default function Home() {
    // const {one}= useLoaderData();
    // console.log(one)

    return(
        <div className='flex w-[100wh] h-[100vh] place-content-center lg:p-8 overflow-hidden'>
                <Chat/>
        </div>
    )
}
