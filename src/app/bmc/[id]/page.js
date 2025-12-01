"use client"
import React, { useEffect, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import axios from 'axios';
import Modal from '@/components/ReactModal';
import ModalDetailsTable from '@/components/ModalTableData';
import { useParams, useSearchParams } from 'next/navigation';
import apiservice from '../../apiservices/bmcServices/page';
import { BASE_URL } from '../../../../constant';
import { format } from 'date-fns';
import { CiSearch } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { RingLoader } from 'react-spinners';


ModuleRegistry.registerModules([AllCommunityModule]);

const BmcAgGridTable = () => {
  const search = useSearchParams()
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
  const gridRef = useRef();

  const colDefs = [
    {
      field: "ReferenceNumber", headerName: 'ReferenceNumber', flex: 1, minWidth: 100, wrapText: true, autoHeight: true,
      cellRenderer: (params) => {
        return (
          <p className='cursor-pointer' title='click to copy' onClick={() => navigator.clipboard.writeText(params?.value)}>{params?.value}</p>
        );
      },
    },
    { field: "MobileNo", headerName: 'MobileNo', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
    { field: "TxnAmt", headerName: 'TxnAmt', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
    {
      field: "ProviderDate", headerName: 'ProviderDate', flex: 1, minWidth: 100, wrapText: true, autoHeight: true,
      cellRenderer: (params) => {
        return (<>
          {
            params.value && params.value != 'null' ? <p>{format(params?.value, "yyyy-MM-dd HH:mm")}</p> : <p>---.---.--</p>
          }
        </>)
      },
    },
    { field: "ProviderTxnID", headerName: 'ProviderTxnID', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
    { field: "PushToVrudhi", headerName: 'PushToVrudhi', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
    paramsValue?.filterType === "duplicatePayment"
      ? { field: "isordercreated", headerName: 'Isordercreated', flex: 1, minWidth: 100 }
      : null,
    { field: "PaymentReceivedFrom", headerName: 'PaymentReceivedFrom', flex: 1, minWidth: 100, wrapText: true, autoHeight: true },
    { field: "Type", headerName: 'Type', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
  ].filter(Boolean);

  
  const ExportExcel = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/exportToExcel`,
        bmcReports,
        {
          responseType: "blob"
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllBmcData = async () => {
     setIsLoading(true)
    try {
      if (paramsValue?.filterType == 'paymentRecieved' || paramsValue?.filterType == 'pushedToVurdhi' || paramsValue?.filterType == 'notPushedToVurdhi') {
        const data = await apiservice?.getBmcReportDetails(paramsValue?.filterType, paramsValue?.fromDate, paramsValue?.toDate);
        return setBmcReports(data?.result)
      }
      if (paramsValue?.filterType == 'overalltxn' || paramsValue?.filterType == 'emi' || paramsValue?.filterType == 'newmember' || paramsValue?.filterType == 'duplicatePayment') {
        const data = await apiservice?.getPortalTxnByFilter(paramsValue?.filterType, paramsValue?.fromDate, paramsValue?.toDate);
        return setBmcReports(data)
      }
    } catch (err) {
      throw new Error(err)
    }finally{
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

  useEffect(() => {
    fetchAllBmcData()
  }, [search])

   if(isLoading){
    return <div className='h-screen flex flex-col justify-center items-center'>
      <RingLoader color="#c7a44d"/>
      <span>Loading.....</span>
      </div>
  }

  return (
    <div className="ag-theme-alpine w-full overflow-x-auto" >
      <h1 className='text-center text-2xl my-5 border-b border-amber-200 text-[#c7a44d]'>{title}</h1>
      <div className='w-full my-8'>
        <div className='flex justify-between items-center'>
          <p className='my-2 font-semibold text-[#614119]'>Records:{bmcReports?.length}</p>
          <div className='flex gap-x-4 w-full justify-end items-end pb-3'>
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
                onClick={ExportExcel}>
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
