'use client'
import { startOfDay, endOfDay, format } from 'date-fns';
import ShipmentCard from '@/components/ShipmentCard'
import React, { useEffect, useState } from 'react'
import shipmentService from '@/app/apiservices/shipmentService/page';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const today = format(new Date(), 'yyyy-MM-dd')

const ShipmentSummary = () => {
   const router = useRouter();
   const searchParams = useSearchParams()
   const pathname = usePathname()
 
   const [fromDate, setFromDate] = useState(today)
   const [toDate, setToDate] = useState(today)
   const [summary, setSummary] = useState([])

  /* 1. Restore state FROM URL when page loads / comes back */
    useEffect(() => {
      const urlFrom = searchParams.get('fromDate')
      const urlTo = searchParams.get('toDate')
      if (urlFrom && urlTo) {
        setFromDate(urlFrom)
        setToDate(urlTo)
      }
    }, [])
  
    /*  2. Sync state TO URL + fetch data */
    useEffect(() => {
      router.replace(`${pathname}?fromDate=${fromDate}&toDate=${toDate}`,{ scroll: false })
        shipmentSummary()
    }, [fromDate, toDate])

  const handleStartChange = (e) => {
    const selected = startOfDay(new Date(e.target.value));
    setFromDate(format(selected, "yyyy-MM-dd"));
  };

  const handleEndChange = (e) => {
    const selected = endOfDay(new Date(e.target.value));
    setToDate(format(selected, "yyyy-MM-dd"));
  };

  const shipmentSummary = async () => {
    try {
      const result = await shipmentService.getShipmentSummary(fromDate, toDate)
      setSummary(result)
    } catch (err) {
      throw new Error(err)
    }
  }

  return (
    <div className="min-h-screen">
      <h1 className='text-center text-2xl mb-3  border-b border-amber-200'>Shippment Summary</h1>
      <div className="flex gap-4 items-center ">
        <div className=" max-w-[200px] w-full">
          <label className="block text-sm font-semibold text-[#8a5a20]">
            From Date
          </label>
          <input
            type="date"
            value={format(fromDate, "yyyy-MM-dd")}
            onChange={handleStartChange}
            className="border-2 border-amber-300 text-black text-sm outline-amber-200 p-1 rounded w-full"
          />
        </div>

        <div className=" max-w-[200px] w-full">
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
      <div className='my-10 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 pb-10 grid-cols-1 gap-5'>
        <div className="flex justify-center items-center">
          <div className="bg-white border border-gray-200 rounded-full p-5 shadow-sm w-36 h-36 flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Shipments
            </h3>
            <p className="text-base text-gray-500 mb-4">
              Total:&nbsp;<span className="text-gray-700 font-bold">
                 {summary?.reduce((acc, curr) => {
                return acc + (Number(curr?.TotalCount) || 0)
              }, 0)}
              </span>
            </p>
          </div>
        </div>

        {
          summary?.map((item, i) => {
            return (
              <div key={item?.Label}>
                <ShipmentCard
                  title={item?.Label}
                  count={item?.TotalCount}
                  onView={() =>
                    router.push(
                      `/shipments/${encodeURIComponent(item?.Label)}?fromDate=${fromDate}&toDate=${toDate}`
                    )}
                />
              </div>
            )
          })
        }


      </div>
    </div>
  )
}

export default ShipmentSummary