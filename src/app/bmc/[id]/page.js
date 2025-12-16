"use client"
import React, { useEffect, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import apiservice from '../../apiservices/bmcServices/page';
import { CiSearch } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { RingLoader } from 'react-spinners';
import { ExportExcel } from '@/utils';
import CustomTooltip from '@/components/CustomTooltip';
import { IoIosArrowBack } from "react-icons/io";


ModuleRegistry.registerModules([AllCommunityModule]);

const BmcAgGridTable = () => {
  const search = useSearchParams()
  const router = useRouter()
  const { id } = useParams();
  const title = decodeURIComponent(id);
  const paramsValue = {
    filterType: search.get("filterType"),
    fromDate: search.get("fromDate"),
    toDate: search.get("toDate"),
  }
  const [bmcReports, setBmcReports] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toggle, setToggle] = useState('All_Records')
  const gridRef = useRef();

  const colDefs = [
    {
      field: "ReferenceNumber", headerName: 'ReferenceNumber', flex: 1, minWidth: 100, wrapText: true, autoHeight: true,
      tooltipComponent: "customTooltip",
      tooltipValueGetter: () => "Click to copy",
      cellRenderer: (params) => {
        return (
          <p className='cursor-pointer' onClick={() => navigator.clipboard.writeText(params?.value)}>{params?.value}</p>
        );
      },
    },
    {
      field: "MobileNo", headerName: 'MobileNo', flex: 1, minWidth: 100, wrapText: true, autoHeight: true,
      tooltipComponent: "customTooltip",
      tooltipValueGetter: () => "Click to copy",
      cellRenderer: (params) => {
        return (
          <p className='cursor-pointer' onClick={() => navigator.clipboard.writeText(params?.value)}>{params?.value}</p>
        );
      },

    },
    { field: "TxnAmt", headerName: 'TxnAmt', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
    {
      field: "ProviderDate", headerName: 'ProviderDate', flex: 1, minWidth: 100, wrapText: true, autoHeight: true,
      cellRenderer: (params) => {
        return (<>
          {
            params.value && params.value != 'null' ? <p>{new Date(params.value).toLocaleDateString("en-IN")}</p> : <p>---.---.--</p>
          }
        </>)
      },
    },
    {
      field: "ProviderTxnID", headerName: 'ProviderTxnID', flex: 1, minWidth: 100, wrapText: true, autoHeight: true,
      tooltipComponent: "customTooltip",
      tooltipValueGetter: () => "Click to copy",
      cellRenderer: (params) => {
        return (
          <p className='cursor-pointer' onClick={() => navigator.clipboard.writeText(params?.value)}>{params?.value}</p>
        );
      },
    },
    { field: "PaymentReceivedFrom", headerName: 'PaymentReceivedFrom', flex: 1, minWidth: 100, wrapText: true, autoHeight: true },
    // { field: "Type", headerName: 'Type', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
  ].filter(Boolean);


  const fetchAllBmcData = async () => {
    setIsLoading(true)
    try {
      if (paramsValue?.filterType == 'paymentRecieved' || paramsValue?.filterType == 'pushedToVurdhi' || paramsValue?.filterType == 'notPushedToVurdhi') {
        const data = await apiservice?.getBmcReportDetails(paramsValue?.filterType, paramsValue?.fromDate, paramsValue?.toDate);
        return setBmcReports(data?.result)
      }
      if (paramsValue?.filterType == 'overalltxn' || paramsValue?.filterType == 'emi' || paramsValue?.filterType == 'previousNotPushed'
        || paramsValue?.filterType == 'newmember' || paramsValue?.filterType == 'duplicatePayment') {
        const data = await apiservice?.getPortalTxnByFilter(paramsValue?.filterType, paramsValue?.fromDate, paramsValue?.toDate);
        return setBmcReports(data)
      }
    } catch (err) {
      throw new Error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const searchRefNo = async () => {
    if (!searchTerm) {
      return toast.warn('Search term required !')
    }
    const data = bmcReports?.filter((item, i) => item?.ReferenceNumber == searchTerm)
    return setBmcReports(data)
  }

  const handleChange = async (value) => {
    setToggle(value)
    if (value == 'All_Records') {
      return fetchAllBmcData()
    }
    if (value == 'New_Enrollment') {
      const data = await apiservice?.getTypeFilters(paramsValue?.fromDate, paramsValue?.toDate, 'N');
      return setBmcReports(data?.result)
    }
    if (value == 'EMI_Amount') {
      const data = await apiservice?.getTypeFilters(paramsValue?.fromDate, paramsValue?.toDate, 'E');
      return setBmcReports(data?.result)
    }
  }

  useEffect(() => {
    fetchAllBmcData()
  }, [search])

  if (isLoading) {
    return <div className='h-screen flex flex-col justify-center items-center'>
      <RingLoader color="#c7a44d" />
      <span>Loading.....</span>
    </div>
  }

  return (
    <div className="ag-theme-alpine w-full overflow-x-auto" >
      <div className='relative'>
        <p onClick={()=>router.back()} className='my-2 font-semibold text-[#c7a44d] absolute left-0 cursor-pointer flex items-center'><IoIosArrowBack /> Go Back</p>
        <h1 className='text-center text-2xl mb-3 border-b border-amber-200 text-[#c7a44d]'>{title}</h1>
      </div>

      <div className='w-full my-8'>
        <div className='flex justify-between items-center'>
          <p className='my-2 font-semibold text-[#614119]'>Records:{bmcReports?.length}</p>
          <div className='flex gap-x-4 w-full justify-end  pb-3'>
            {paramsValue?.filterType == 'notPushedToVurdhi' && <div className="flex gap-6 items-center">
              {/* All records */}
              <label
                className="flex items-center gap-2 cursor-pointer text-gray-700"
              >
                <input
                  type="radio"
                  name="report"
                  value="All_Records"
                  checked={toggle === "All_Records"}
                  onChange={() => handleChange("All_Records")}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className='text-[#8a5a20] font-semibold'>All Records</span>
              </label>

              {/* New Enrollment */}
              <label
                className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input
                  type="radio"
                  name="report"
                  value="New_Enrollment"
                  checked={toggle === "New_Enrollment"}
                  onChange={() => handleChange("New_Enrollment")}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className='text-[#8a5a20] font-semibold'>New Enrollment</span>
              </label>
              {/* EMI Amount */}
              <label
                className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input
                  type="radio"
                  name="report"
                  value="EMI_Amount"
                  checked={toggle === "EMI_Amount"}
                  onChange={() => handleChange("EMI_Amount")}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className='text-[#8a5a20] font-semibold'>EMI Amount</span>
              </label>
            </div>}
            <div className='w-full max-w-[250px]'>
              <div className='flex flex-row justify-end items-center gap-2'>
                <div className='w-full'>
                  <input type="search" placeholder='Refrence No.'
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      if (e.target.value === '') {
                        fetchAllBmcData()
                      }
                    }} className='border-2 border-amber-300 p-1 text-sm text-black outline-amber-200 rounded w-full' />
                </div>
                <div className='bg-[#b8860b] p-1 rounded-bl-md rounded-tr-md cursor-pointer' onClick={() => searchRefNo()}> <CiSearch color='white' size={24} /></div>
              </div>
            </div>
            <div>
              <button
                className=" px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
                onClick={() => ExportExcel(bmcReports)}
              >
                Export to Excel
              </button>
            </div>
          </div>
        </div>

        <AgGridReact
          ref={gridRef}
          theme="legacy"
          rowHeight={40}
          rowData={bmcReports}
          columnDefs={colDefs}
          defaultColDef={{
            resizable: false,
            sortable: false,
            filter: false,
            suppressMovable: true,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', borderRight: '1px solid #d3d3d3' }
          }}
          tooltipShowDelay={0}     // show instantly
          tooltipHideDelay={1000}  // auto hide in 2s
          components={{
            customTooltip: CustomTooltip,
          }}
          domLayout="autoHeight"
          copyHeadersToClipboard={true}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[20, 50, 100, 200]}
        />
      </div>
    </div>
  )
}

export default BmcAgGridTable
