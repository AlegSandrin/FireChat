import { Link } from "react-router-dom"
import error from "../assets/img/error.png"

export default function ErrorPage() {
    return (
      <div className="ErrorPage grid h-screen place-items-center">
        <div className="h-auto w-[95%] overflow-hidden rounded-3xl text-white shadow-inner drop-shadow-2xl md:h-auto md:w-[600px]">
          <div className="flex flex-col items-center rounded-b-3xl bg-[#33384e] bg-opacity-50 px-5 pb-14 md:px-5">
            <img
              src={error}
              alt="error"
              className="h-[300px] w-[300px] translate-y-5 opacity-70 brightness-110 saturate-150"
              referrerPolicy="no-referrer"
            ></img>
            <div className="flex -translate-y-7 flex-col place-items-center justify-center">
              <label className="mb-2 text-3xl tracking-widest md:text-7xl">
                404
              </label>
              <label className="text-base sm:text-xl md:text-3xl">
                Página não encontrada
              </label>
              <div className="md:text-1xl mt-4 flex items-center gap-3 text-base sm:text-xl">
                <label className="">Volte para página de </label>{" "}
                <Link
                  to="/"
                  className="font-extrabold text-[#cc264acf] transition hover:brightness-150"
                >
                  {" "}
                  login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}