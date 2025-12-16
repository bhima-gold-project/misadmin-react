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
  const [notPushedToVurdhi, setNotPushedToVurdhi] = useState([])
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

  const fetchNotPushedToVurdhi = async () => {
    try {
      const data = await apiservice?.getNotPushedToVurdhi(fromDate, toDate);
       setNotPushedToVurdhi(data)
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
    fetchNotPushedToVurdhi()
    fetchMissingRefNo()
    fetchTypePayments()
  }, [fromDate, toDate])

  return (
    <div className="min-h-screen">
      <h1 className='text-center text-2xl mb-3 border-b border-amber-200'>BMC Payment Summary</h1>
      <div className="flex gap-4 items-center mb-5">
        <div className=" max-w-[200px] w-full">
          <label className="block text-sm font-semibold text-[#8a5a20]  ">
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
          <label className="block text-sm font-semibold  text-[#8a5a20] ">
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

      <p className='text-lg text-[#8a5a20] font-semibold mb-2'>Latest Tranzactions</p>
      <div className=' grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3  grid-cols-1 gap-5'>
        <div>
          <Card
            title="Overall Tranzaction"
            count={bmcSummary?.overallTxn?.TotalCount}
            amount={bmcSummary?.overallTxn?.TxnAmt}
            onView={() => {
              router.push(
                `/bmc/${encodeURIComponent('Overall Tranzaction')}?filterType=overalltxn&fromDate=${fromDate}&toDate=${toDate}`
              );
            }}
          />
        </div>
        <div>
          <Card
            title="Payment Recieved"
             count={bmcSummary?.summary?.TotalCount}
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
            count={bmcSummary?.pushedtovurdhi?.TotalCount}
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
            count={notPushedToVurdhi?.notpushed?.TotalCount}
            amount={notPushedToVurdhi?.notpushed?.TxnAmt}
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
            count={notPushedToVurdhi?.duplicateRefno?.TotalCount}
            amount={notPushedToVurdhi?.duplicateRefno?.TxnAmt}
            onView={() => {
              router.push(
                `/bmc/${encodeURIComponent('Refunded Amount')}?filterType=duplicatePayment&fromDate=${fromDate}&toDate=${toDate}`
              );
            }}
          />
        </div>

        <div>
          <Card
            title="EMI Amount"
              count={typePayments?.EmiAmount?.TotalCount}
            amount={typePayments?.EmiAmount?.EAmount}
            onView={() => {
              router.push(
                `/bmc/${encodeURIComponent('EMI Amount')}?filterType=emi&fromDate=${fromDate}&toDate=${toDate}`
              );
            }}
          />
        </div>

        <div>
          <Card
            title="New Enrollment Amount"
            count={typePayments?.newMemberAmt?.TotalCount}
            amount={typePayments?.newMemberAmt?.NAmount}
            onView={() => {
              router.push(
                `/bmc/${encodeURIComponent('New Enrollment Amount')}?filterType=newmember&fromDate=${fromDate}&toDate=${toDate}`
              );
            }}
          />
        </div>
      </div>

      <div className='my-5'>
        <p className='text-lg font-semibold mb-2 text-[#8a5a20] '>Previous Tranzactions</p>
        <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3  grid-cols-1 gap-5'>
          <Card
            title="Not Pushed To Vurdhi"
            count={notPushedToVurdhi?.previousNotPushed?.TotalCount}
            amount={notPushedToVurdhi?.previousNotPushed?.TxnAmt}
            onView={() => {
              router.push(
                `/bmc/${encodeURIComponent('Not Pushed To Vurdhi')}?filterType=previousNotPushed&fromDate=${fromDate}&toDate=${toDate}`
              );
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default BmcSummary