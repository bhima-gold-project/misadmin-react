'use client'
import React, { useEffect, useState } from 'react'
import { startOfDay, endOfDay, format } from 'date-fns';
import apiservice from '@/app/apiservices/bmcServices/page';
import Card from '@/components/Card';
import { useRouter } from 'next/navigation';

const BmcSummary = () => {
  const today = new Date();
  const router = useRouter();

  const [fromDate, setFromDate] = useState(format(today, "yyyy-MM-dd"));
  const [toDate, setToDate] = useState(format(today, "yyyy-MM-dd"));
  const [bmcSummary, setBmcSummary] = useState([])
  const [duplicateRefno, setDuplicateRefno] = useState([])
  const [missingRefno, setMissingRefno] = useState([])
  const [typePayments, setTypePayments] = useState([])

  const handleStartChange = (e) => {
    const selected = startOfDay(new Date(e.target.value));
    setFromDate(format(selected, "yyyy-MM-dd"));
  };

  const handleEndChange = (e) => {
    const selected = endOfDay(new Date(e.target.value));
    setToDate(format(selected, "yyyy-MM-dd"));
  };

  const fetchBmcSummary = async () => {
    try {
      const data = await apiservice?.getBmcSummary(fromDate, toDate);
      setBmcSummary(data)
    } catch (err) {
      throw new Error(err)
    }
  }

  const fetchDuplicateRefNo = async () => {
    try {
      const data = await apiservice?.getDuplicateRefNo(fromDate, toDate);
      setDuplicateRefno(data)
    } catch (err) {
      throw new Error(err)
    }
  }

  const fetchMissingRefNo = async () => {
    try {
      const data = await apiservice?.getMissingRefNo(fromDate, toDate);
      setMissingRefno(data)
    } catch (err) {
      throw new Error(err)
    }
  }

  const fetchTypePayments = async () => {
    try {
      const data = await apiservice?.getTypePaymentDetails(fromDate, toDate);
      setTypePayments(data)
    } catch (err) {
      throw new Error(err)
    }
  }

  useEffect(() => {
    fetchBmcSummary()
    fetchDuplicateRefNo()
    fetchMissingRefNo()
    fetchTypePayments()
  }, [fromDate, toDate])

  return (
    <div className="min-h-screen">
      <h1 className='text-center text-2xl my-5 border-b border-amber-200'>BMC Summary</h1>
      <div className="flex gap-4 items-center ">
        <div className=" max-w-[200px] w-full">
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

        <div className=" max-w-[200px] w-full">
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
      <div className='my-5 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 pb-10 grid-cols-1 gap-5'>
       <div>
          <Card
            title="Overall Transaction"
            amount={bmcSummary?.overallTxn?.TxnAmt}
            onView={() => {
              router.push(
                `/bmc/${encodeURIComponent('Overall Transaction')}?filterType=overalltxn&fromDate=${fromDate}&toDate=${toDate}`
              );
            }}
          />
        </div>
        <div>
          <Card
            title="Payment Recieved"
            amount={bmcSummary?.summary?.TxnAmt}
            onView={() => {
              router.push(
                `/bmc/${encodeURIComponent('Payment Recieved')}?filterType=paymentRecieved&fromDate=${fromDate}&toDate=${toDate}`
              );
            }}
          />
        </div>

        <div>
          <Card
            title="Pushed To Vurdhi"
            amount={bmcSummary?.pushedtovurdhi?.TxnAmt}
            onView={() => {
              router.push(
                `/bmc/${encodeURIComponent('Pushed To Vurdhi')}?filterType=pushedToVurdhi&fromDate=${fromDate}&toDate=${toDate}`
              );
            }}
          />
        </div>

        <div>
          <Card
            title="Not Pushed To Vurdhi"
            amount={duplicateRefno?.notpushed?.TxnAmt}
            onView={() => {
              router.push(
                `/bmc/${encodeURIComponent('Not Pushed To Vurdhi')}?filterType=notPushedToVurdhi&fromDate=${fromDate}&toDate=${toDate}`
              );
            }}
          />
        </div>

        <div>
          <Card
            title="Refunded Amount"
            amount={duplicateRefno?.duplicateRefno?.TxnAmt}
            onView={() => {
              router.push(
                `/bmc/${encodeURIComponent('Refunded Amount')}?filterType=duplicatePayment&fromDate=${fromDate}&toDate=${toDate}`
              );
            }}
          />
        </div>

       <div>
          <Card
            title="EMI Transaction"
            amount={typePayments?.EmiAmount?.EAmount}
            onView={() => {
              router.push(
                `/bmc/${encodeURIComponent('EMI Transaction')}?filterType=emi&fromDate=${fromDate}&toDate=${toDate}`
              );
            }}
          />
        </div>

         <div>
            <Card
              title="New Member Transaction"
              amount={typePayments?.newMemberAmt?.NAmount}
              onView={() => {
                router.push(
                  `/bmc/${encodeURIComponent('New Member Transaction')}?filterType=newmember&fromDate=${fromDate}&toDate=${toDate}`
                );
              }}
            />
        </div>     
      </div>
    </div>
  )
}

export default BmcSummary