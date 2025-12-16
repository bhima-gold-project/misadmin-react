"use client";
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { startOfDay, endOfDay, format } from 'date-fns';
import { CiSearch } from "react-icons/ci";
import { BASE_URL } from '../../../../constant';
import { setImportedDataIn } from '../../../redux/slice';
import axios from 'axios';
import dynamic from "next/dynamic";
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';

const ReportInTable = dynamic(() => import("@/components/ReportIn"), {
  ssr: false,
});

const ReportIn = () => {
  const today = new Date();
  const dispatch = useDispatch();

  const [fromDate, setFromDate] = useState(format(today, "yyyy-MM-dd"));
  const [toDate, setToDate] = useState(format(today, "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState('')
  const [toggle, setToggle] = useState("imported");
  const [isLoading, setIsLoading] = useState(false);


  const handleStartChange = (e) => {
    const selected = startOfDay(new Date(e.target.value));
    setFromDate(format(selected, "yyyy-MM-dd"));
  };

  const handleEndChange = (e) => {
    const selected = endOfDay(new Date(e.target.value));
    setToDate(format(selected, "yyyy-MM-dd"));
  };

  const getReportsIn = async () => {
    setIsLoading(true)
    try {
      const apiUrl = toggle == 'imported' ? `${BASE_URL}/api/importedProducts?Locale=en-IN&fromDate=${fromDate}&toDate=${toDate}&ProdPushed=2` : `${BASE_URL}/api/importedProducts?Locale=en-IN&fromDate=${fromDate}&toDate=${toDate}&ProdPushed=0`
      const token = localStorage.getItem('mistoken')
      const response = await axios.get(apiUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      const result = await response?.data?.data
      dispatch(setImportedDataIn(result))
    } catch (err) {
      throw new Error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const searchStylecodesIn = async () => {
    try {
      if (!searchTerm) {
        getReportsIn()
        return
      }
      const token = localStorage.getItem('mistoken')
      const response = await axios.get(`${BASE_URL}/api/searchstylecodeSku?searchTerm=${searchTerm}&locale=en-IN`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      const result = await response?.data?.data

      if (result?.length > 0) {
        dispatch(setImportedDataIn(result))
      } else {
        toast.warn('Data Not Found !')
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  useEffect(() => {
    getReportsIn()
  }, [fromDate, toDate,toggle]);


  return (
    <div className="min-h-screen">
      <h1 className='text-center text-2xl mb-3 border-b border-amber-200'>Report-IN</h1>

      <div className='flex flex-col xl:flex-row xl:justify-between xl:items-center lg:flex-row lg:items-center lg:justify-between 
      md:flex-row md:items-center md:justify-between gap-x-4'>
        <div className="flex gap-4 items-center ">
          <div className=" max-w-[300px] w-full">
            <label className="block text-sm font-semibold text-[#8a5a20] ">
              From Date
            </label>
            <input
              type="date"
              value={format(fromDate, "yyyy-MM-dd")}
              onChange={handleStartChange}
              className="border-2 border-amber-300 text-black text-sm outline-amber-200 p-1 rounded w-full"
            />
          </div>

          <div className=" max-w-[300px] w-full">
            <label className="block text-sm font-semibold  text-[#8a5a20]">
              To Date
            </label>
            <input
              type="date"
              value={format(toDate, "yyyy-MM-dd")}
              onChange={handleEndChange}
              className="border-2 border-amber-300 p-1 text-black text-sm outline-amber-200 rounded w-full"
            />
          </div>
        </div>

        <div className="flex gap-6 items-center">
          {/* Imported Stylecode */}
          <label
            className="flex items-center gap-2 cursor-pointer text-gray-700"
          >
            <input
              type="radio"
              name="stylecode"
              value="imported"
              checked={toggle === "imported"}
              onChange={() => setToggle("imported")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span>Imported Stylecode</span>
          </label>

          {/* Not Imported Stylecode */}
          <label
            className="flex items-center gap-2 cursor-pointer text-gray-700"
          >
            <input
              type="radio"
              name="stylecode"
              value="not_imported"
              checked={toggle === "not_imported"}
              onChange={() => setToggle("not_imported")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span>Not Imported Stylecode</span>
          </label>
        </div>


        <div className='w-full max-w-[250px]'>
          <label className="block text-sm font-semibold text-[#c7a44d]">Search </label>
          <div className='flex flex-row justify-end items-center gap-2 '>
            <div className='w-full'>
              <input type="search" placeholder='Sku | Stylecode...'
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  if (e.target.value === '') {
                    getReportsIn()
                  }
                }} className='border-2 border-amber-300 p-1 text-sm text-black outline-amber-200 rounded w-full' />
            </div>
            <div className='bg-[#b8860b] p-1 rounded-bl-md rounded-tr-md cursor-pointer' onClick={() => searchStylecodesIn()}> <CiSearch color='white' size={24} /></div>
          </div>
        </div>
      </div>
      <div>
        {isLoading ? <Loader/>:<ReportInTable title={'products'}/>}
      </div>
    </div>

  )
}

export default ReportIn