"use client"
import React, { useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { BASE_URL, PRODUCT_URL } from '../../constant';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Modal from './ReactModal';
import axios from 'axios';
import ModalDetailsTable from './ModalTableData';
import { ExportExcel } from '@/utils';

ModuleRegistry.registerModules([AllCommunityModule]);

const ReportInTable = () => {

    const dataIn = useSelector((state) => state?.products?.importDataIn);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [styleCode, setStyleCode] = useState('')

    const gridRef = useRef();

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);


    const [colDefs] = useState([
        { field: "sku", headerName: "Sku", flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },
        {
            field: "StyleCode", headerName: 'Stylecode', flex: 1, minWidth: 100, wrapText: true, autoHeight: true,
            cellRenderer: (params) => {
                return (
                    <p className='cursor-pointer' title='click to copy' onClick={() => navigator.clipboard.writeText(params?.value)}>{params?.value}</p>
                );
            },
        },
        {
            field: "ExportedUrlKey",
            headerName: 'Product Url',
            flex: 1,
            minWidth: 100,
            wrapText: true,
            autoHeight: true,
            cellRenderer: (params) => {
                const url = `${PRODUCT_URL}${params.value}`;
                return (
                    <Link href={url} target="_blank" rel="noopener noreferrer" className='text-blue-500 underline'>
                        {url}
                    </Link>
                );
            },
        },
        { field: "productpushed", headerName: 'Product Pushed', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, },

        {
            field: "action",
            headerName: 'Action',
            flex: 1,
            maxWidth: 100,
            headerClass: 'ag-left-aligned-header',
            cellRenderer: (params) => (
                <p onClick={() => {
                    checkStylecodeData(params?.data)
                    openModal()
                }} className="w-fit bg-gradient-to-r from-[#614119] via-[#d4af37] to-[#614119] cursor-pointer text-center text-white px-2 rounded-sm ">Check</p>
            ),

        }
    ]);


    const checkStylecodeData = async (data) => {
        try {
            setStyleCode(data?.StyleCode)

            const payload = {
                Stylecode: data?.StyleCode,
                sku: data?.sku,
            }
            const token = localStorage.getItem('mistoken');
            const response = await axios.post(`${BASE_URL}/api/checkstylecodeimport`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const result = await response?.data?.data;
            setModalData(result)
        } catch (err) {
            throw new Error(err)
        }
    }

   



    return (
        <div className="ag-theme-alpine w-full overflow-x-auto">
            <div className='w-full my-8 '>
                <div className='flex justify-between items-center mb-2'>
                    <p className='my-2 font-semibold text-[#614119]'>Stylecodes:{dataIn?.length}</p>
                    <button
                        className=" px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
                        onClick={()=>ExportExcel(dataIn)}
                    >
                        Export to Excel
                    </button>
                </div>

                <AgGridReact
                    ref={gridRef}
                    theme="legacy"
                    rowHeight={40}
                    rowData={dataIn}
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
                    paginationPageSize={50}
                    paginationPageSizeSelector={[20, 50, 100, 200]}
                />
            </div>
            <div>
                {showModal && (
                    <Modal onClose={closeModal}>
                        <p className='text-center font-bold border-b-1 pb-2 '>Summary</p>
                        <div className="overflow-x-auto mt-4 mb-2 text-black">
                            <ModalDetailsTable modalData={modalData} LocaleIN={1} LocaleSG={0} StyleCode={styleCode} />
                        </div>

                    </Modal>
                )}
            </div>
        </div>
    )
}

export default ReportInTable