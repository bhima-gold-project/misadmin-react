"use client"

import React, { useEffect, useState } from 'react'
import { startOfDay, endOfDay, format } from 'date-fns';
import { CiSearch } from "react-icons/ci";
import axios from 'axios';
import { BASE_URL } from '../../../../constant';
import { setDeliveryStatusData } from '../../../redux/slice';
import { useDispatch } from 'react-redux';
import ShipmentStatusReport from '@/components/ShipmentStatusReport';
import Loader from '@/components/Loader';

const ShipmentStatus = () => {
    const today = new Date();
    const dispatch = useDispatch();

    const [fromDate, setFromDate] = useState(format(today, "yyyy-MM-dd"));
    const [toDate, setToDate] = useState(format(today, "yyyy-MM-dd"));
    const [searchTerm, setSearchTerm] = useState('')
    const [searchOder, setSearchOder] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const handleStartChange = (e) => {
        const selected = startOfDay(new Date(e.target.value));
        setFromDate(format(selected, "yyyy-MM-dd"));
    };

    const handleEndChange = (e) => {
        const selected = endOfDay(new Date(e.target.value));
        setToDate(format(selected, "yyyy-MM-dd"));
    };

    const getShipmentStatus = async () => {
        setIsLoading(true)
        try {
            const token = localStorage.getItem('mistoken')
            const response = await axios.get(`${BASE_URL}/api/shipmentStatus?fromDate=${fromDate}&toDate=${toDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            const result = await response?.data?.data
            dispatch(setDeliveryStatusData(result))
        } catch (err) {
            throw new Error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const search = async () => {
        if (searchTerm === '') return;
        const token = localStorage.getItem('mistoken')
        try {
            setIsLoading(true)
            const response = await axios.get(`${BASE_URL}/api/searchStatus?search=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            const result = await response?.data?.data
            dispatch(setDeliveryStatusData(result))
        } catch (err) {
            throw new Error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const searchOders = async () => {
        if (searchOder === '') return;
        const token = localStorage.getItem('mistoken')
        try {
            const response = await axios.get(`${BASE_URL}/api/search?search=${searchOder}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            const result = await response?.data?.data
            dispatch(setDeliveryStatusData(result))
        } catch (err) {
            throw new Error(err)
        }
    }

    useEffect(() => {
        getShipmentStatus()
        setSearchTerm('');
    }, [fromDate, toDate])

    useEffect(() => {
        search()
    }, [searchTerm])


    return (
        <div className="min-h-screen">
            <h1 className='text-center text-2xl my-5 border-b border-amber-200'>Shipment Status Report</h1>

            <div className='flex lg:flex-row flex-col  lg:items-center justify-between gap-x-4'>

                <div className="flex gap-4 items-center ">
                    <div className=" max-w-[300px] w-full">
                        <label className="block text-sm font-semibold text-[#c7a44d] ">
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
                        <label className="block text-sm font-semibold  text-[#c7a44d]">
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

                <div className='flex flex-row items-center gap-x-5 mt-2 lg:mt-0 '>
                    <div className='w-full max-w-[300px] lg:min-w-[200px]'>
                        <label className="block text-sm font-semibold text-[#c7a44d]">Select</label>
                        <select
                          value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (e.target.value === '') {
                                    getShipmentStatus()
                                }
                            }}
                            className='border-2 border-amber-300 p-1 text-gray-500 text-sm  outline-amber-200 rounded w-full'
                        >
                            <option value=''>Select All</option>
                            <option value='DELIVERED'>DELIVERED</option>
                            <option value='IN TRANSIT'>IN TRANSIT</option>
                        </select>
                    </div>

                    <div className='w-full max-w-[300px] lg:min-w-[200px]'>
                        <label className="block text-sm font-semibold text-[#c7a44d]">Search </label>
                        <div className='flex flex-row justify-end items-center gap-2 w-full '>
                            <div className='w-full'>
                                <input type="search" placeholder='Aw no | Order no...' onChange={(e) => {
                                    setSearchOder(e.target.value)
                                    if (e.target.value === '') {
                                        getShipmentStatus()
                                    }
                                }} className='border-2 border-amber-300 p-1 text-sm text-black outline-amber-200 rounded w-full' />
                            </div>
                            <div className='bg-[#b8860b] hidden lg:block p-1 rounded-bl-md rounded-tr-md cursor-pointer' onClick={() => searchOders()}> <CiSearch color='white' size={24} /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {isLoading ? <Loader /> : <ShipmentStatusReport />}
            </div>
        </div>
    )
}

export default ShipmentStatus