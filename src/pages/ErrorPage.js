import error from "../assets/img/error.png"

export default function ErrorPage() {
    return(
    <div className="ErrorPage grid h-screen place-items-center">
        <div className='text-white rounded-3xl overflow-hidden drop-shadow-2xl shadow-inner md:h-auto md:w-[600px] h-auto w-[95%]'>
            <div className='flex flex-col items-center bg-[#33384e] bg-opacity-75 md:px-5 px-5 pb-14 rounded-b-3xl'>
                <img src={error} className='h-[300px] w-[300px] brightness-110 translate-y-5 saturate-150'></img> 
                <label className="md:text-7xl text-3xl mb-2 tracking-widest">404</label>
                <label className="md:text-3xl sm:text-xl text-base">Página não encontrada</label>
            </div>
        </div>
    </div>
    )
}