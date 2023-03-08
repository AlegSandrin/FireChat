import loading from '../assets/img/loading.svg'

export default function Loading(){
    return(
        <div className='flex w-full h-full justify-center items-center'>
            <img src={loading} alt='Loading...' className='w-[60px] lg:w-[100px] xl:w-[130px]'/>
        </div>
    )
}