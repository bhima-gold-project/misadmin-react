"use client";
import Image from 'next/image';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import bhima_logo from '../../../public/bhima_logo.webp';
import bhima_boy from '../../../public/bhima_boy.png';
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { RiLoginCircleLine } from "react-icons/ri";
import axios from 'axios';
import { BASE_URL } from '../../../constant';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Login = () => {

  const router = useRouter();
  const [togglePassword, setTogglePassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const loginPayload = {
        UserName: data?.username,
        Password: data?.password
      }

      const response = await axios.post(`${BASE_URL}/api/users/mis-login`, loginPayload, { withCredentials: true });
      const result = await response?.data;
      if (result?.success === true) {
        localStorage.setItem('mistoken', result?.data?.token)
        toast.success(result?.message);
        router.push('/');
      } else {
        toast.error(result?.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  }

  return (
    <div className="font-sans grid lg:grid-cols-4 h-screen justify-center items-center " >
      <div className='col-span-2 '>
        <div className="w-full flex justify-center items-center mb-4">
          <Image
            src={bhima_boy}
            alt="Bhima Logo"
            width={150}
            height={150}
          />
        </div>
        <h1 className="lg:text-4xl text-3xl font-bold text-center " style={{ color: "#614119" }}>
          Bhima Gold Admin Pannel
        </h1>
        <p className='text-center text-base lg:text-xl '>The clear insights your business needs to achieve true brilliance.</p>
      </div>
      <div className='flex justify-center col-span-2 gap-y-6' >
        <form onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();            
              handleSubmit(onSubmit)();     
            }
          }}
          className="bg-white/90 grid gap-y-6 p-4 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] border border-[#d4af37] m-4 w-full max-w-md" >
          <div className="w-full flex justify-center items-center mb-4">
            <Image
              src={bhima_logo}
              alt="Bhima Logo"
              width={150}
              height={150}
            />
          </div>

          <div>
            <div className="text-[#614119] w-full px-4 py-2 rounded-[0.7rem] border border-[#d4af37] outline-none bg-transparent transition-all duration-200 box-border flex items-center gap-2">
              <FaRegUser />
              <div className='w-full'>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className='w-full border-none outline-none bg-transparent'

                  {...register('username', {
                    required: 'Username is required',
                  })}
                />
              </div>
            </div>
            {errors.username && (
              <small className="text-red-500">{errors.username.message}</small>
            )}
          </div>

          <div>
            <div className="text-[#614119] w-full px-4 py-2 rounded-[0.7rem] border border-[#d4af37] outline-none bg-transparent transition-all duration-200 box-border flex items-center gap-2">
              <RiLockPasswordLine size={20} />
              <div className='w-full'>
                <input
                  id="password"
                  type={togglePassword ? "text" : "password"}
                  placeholder="Password"
                  className='w-full border-none outline-none bg-transparent'
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
              </div>
              {togglePassword ? <FaRegEye size={20} className='cursor-pointer' onClick={() => setTogglePassword(!togglePassword)} /> : <FaRegEyeSlash size={20} className='cursor-pointer' onClick={() => setTogglePassword(!togglePassword)} />}
            </div>
            {errors.password && (
              <small className="text-red-500">{errors.password.message}</small>
            )}
          </div>


          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#614119] via-[#d4af37] to-[#614119] cursor-pointer
               text-white py-2 rounded-[0.5rem] mt-4 hover:opacity-90 transition-opacity duration-200 flex justify-center items-center gap-2"
            >
              <RiLoginCircleLine />  Login
            </button>
          </div>
          <p className='text-xs text-center'>@2025 Designed & developed by Sharaan Infosystems (R)</p>
        </form>
      </div>
    </div>
  )
}

export default Login;