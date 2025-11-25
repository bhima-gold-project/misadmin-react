"use client"
import React, { useEffect, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import axios from 'axios';
import Modal from '@/components/ReactModal';
import ModalDetailsTable from '@/components/ModalTableData';
import { BASE_URL } from '../../../../../constant';
import { useParams, useSearchParams } from 'next/navigation';
import apiservice from '../../../apiservices/bmcServices/page';


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
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [styleCode, setStyleCode] = useState('')
  const gridRef = useRef();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);


  const [colDefs] = useState([
    // { field: "PortalTxnID", headerName: "PortalTxnID", flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
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
    { field: "ProviderDate", headerName: 'ProviderDate', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
    { field: "ProviderTxnID", headerName: 'ProviderTxnID', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
    { field: "PushToVrudhi", headerName: 'PushToVrudhi', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
    { field: "isordercreated", headerName: 'isordercreated', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
    { field: "PaymentReceivedFrom", headerName: 'PaymentReceivedFrom', flex: 1, minWidth: 100, wrapText: true, autoHeight: true },
    { field: "Type", headerName: 'Type', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
    // {
    //   field: "action",
    //   headerName: 'Action',
    //   flex: 1,
    //   maxWidth: 100,
    //   headerClass: 'ag-left-aligned-header',
    //   cellRenderer: (params) => (
    //     <p onClick={() => {
    //       openModal()
    //     }} className="w-fit bg-gradient-to-r from-[#614119] via-[#d4af37] to-[#614119] cursor-pointer text-center text-white px-2 rounded-sm ">View</p>
    //   ),
    // }
  ]);


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
    try {
      const data = await apiservice?.getBmcReportDetails(paramsValue?.filterType, paramsValue?.fromDate, paramsValue?.toDate);
      setBmcReports(data?.result)
    } catch (err) {
      throw new Error(err)
    }
  }

  useEffect(() => {
    fetchAllBmcData()
  }, [search])

  return (
    <div className="ag-theme-alpine w-full overflow-x-auto" >
      <h1 className='text-center text-2xl my-5 border-b border-amber-200 text-[#c7a44d]'>{title}</h1>
      <div className='w-full my-8 '>
        <div className='flex justify-between items-center'>
          <p className='my-2 font-semibold text-[#614119]'>Records:{bmcReports?.length}</p>
          <button
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
            onClick={ExportExcel}
          >
            Export to Excel
          </button>
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
      <div>
        {showModal && (
          <Modal onClose={closeModal}>
            <p className='text-center font-bold border-b-1 pb-2 '>Summary</p>
            <div className="overflow-x-auto mt-4 mb-2 text-black">

            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default BmcAgGridTable
