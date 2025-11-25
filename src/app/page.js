"use client";
import axios from "axios";
import Image from "next/image";
import bhima_boy from '../../../public/bhima_boy.png';

axios.defaults.withCredentials = true

export default function Home() {
  return (
    <div className="font-sans grid  items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className='col-span-2 '>
          <div className="w-full flex justify-center items-center mb-4">
            <Image
              src={bhima_boy}
              alt="Bhima Logo"
              width={150}
              height={150}
            />
          </div>
          <h1 className="lg:text-4xl text-2xl font-bold text-center " style={{ color: "#614119" }}>
            Magna MIS Insight
          </h1>
          <p className='text-center text-base lg:text-xl '>The clear insights your business needs to achieve true brilliance.</p>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className='text-xs text-center'>@2025 Designed & developed by Sharaan Infosystems (R)</p>
      </footer>
    </div>
  );
}
