import loading from '../assets/img/loading.svg'

export default function Loading(){
    return (
      <div className="Loading flex h-full w-full items-center justify-center">
        <img
          src={loading}
          alt="Loading..."
          className="w-[60px] lg:w-[100px] xl:w-[130px]"
          referrerPolicy="no-referrer"
        />
      </div>
    );
}