"use client";
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import React, { useState } from 'react'
import { BLUEDART_TRACK, CMS_TRACK, SEQUEL_TRACK } from '../../constant';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Modal from './ReactModal';
import { MdContentCopy } from "react-icons/md";
import { toast } from 'react-toastify';
import { ExportExcel } from '@/utils';
import CustomTooltip from './CustomTooltip';


ModuleRegistry.registerModules([AllCommunityModule]);

const ShipmentStatusReport = () => {

    const shipmentStatusData = useSelector((state) => state?.products?.deliveryStatusData);

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const [colDefs] = useState([
        {
            field: "ecomorderid", headerName: "Order No", flex: 1, minWidth: 100, wrapText: true, autoHeight: true, headerClass: 'ag-left-aligned-header',
            tooltipComponent: "customTooltip",
            tooltipValueGetter: () => "Click to copy",
            cellRenderer: (params) => {
                return (
                    <p className='cursor-pointer' onClick={() => navigator.clipboard.writeText(params?.value)}>{params?.value}</p>
                );
            },
        },
        { field: "Orderrefno", headerName: 'OrderRef No.', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, headerClass: 'ag-left-aligned-header', },

        {
            field: "AwNo",
            headerName: 'Aw Billno',
            flex: 1,
            minWidth: 100,
            wrapText: true,
            autoHeight: true,
            headerClass: 'ag-left-aligned-header',
            tooltipComponent: "customTooltip",
            tooltipValueGetter: () => "Click to copy",
            cellRenderer: (params) => {
                return (
                    <>
                        {
                            params.value && params.value != 'null' &&
                            <p className='cursor-pointer' onClick={() => navigator.clipboard.writeText(params?.value)}>{params?.value}</p>
                        }
                    </>
                );
            },
        },

        {
            field: "logisticPartner", headerName: 'Logistics', flex: 1, minWidth: 100, wrapText: true,
            autoHeight: true, headerClass: 'ag-left-aligned-header',
            cellRenderer: (params) => {
                return (
                    <>
                        {
                            params.value && params.value != 'null' ?
                                <p>{params.value}</p> : <p>Not Assigned</p>
                        }
                    </>
                );
            },
        },
        {
            field: "ShippedOn", headerName: 'Shipped On', flex: 1, minWidth: 100, wrapText: true, autoHeight: true, headerClass: 'ag-left-aligned-header',
            cellRenderer: (params) => {
                return (
                    <>
                        {
                            params.value && params.value != 'null' ?
                                <p>{new Date(params.value).toLocaleDateString("en-IN")}</p> : <p>Not Assigned</p>
                        }
                    </>

                );
            },
        },

        {
            field: "Delivered_Message", headerName: 'Message  ', flex: 1, minWidth: 100, wrapText: true,
            autoHeight: true, headerClass: 'ag-left-aligned-header',
            cellRenderer: (params) => {
                return (
                    <>
                        {
                            params.value && params.value != 'null' ?
                                <p className={`${params?.value == 'DELIVERED' ? 'text-green-500' : params?.value == 'CANCELLED' ? 'text-red-500' : 'text-yellow-700'}`}>{params.value}</p> : <p>IN TRANSIT</p>
                        }
                    </>
                );
            },
        },
        {
            field: "estiimated_delivery", headerName: 'Estimated Delivery', flex: 1, minWidth: 100, wrapText: true,
            autoHeight: true, headerClass: 'ag-left-aligned-header',
            cellRenderer: (params) => {
                return (
                    <>
                        {
                            params.value && params.value != 'null' ?
                                <p>{new Date(params.value).toLocaleDateString("en-IN")}</p> : <p>---.---.--</p>
                        }
                    </>

                );
            },
        },
        {
            field: "DeliveredOn", headerName: 'Delivered On', flex: 1, minWidth: 100, wrapText: true,
            autoHeight: true, headerClass: 'ag-left-aligned-header',
            cellRenderer: (params) => {
                return (
                    <>
                        {
                            params.value && params.value != 'null' ?
                            
                                <p>{new Date(params.value).toLocaleDateString("en-IN")}</p> : <p>---.---.--</p>
                        }
                    </>

                );
            },
        },
        {
            field: "action",
            headerName: 'Action',
            flex: 1,
            maxWidth: 100,
            headerClass: 'ag-left-aligned-header',
            cellRenderer: (params) => (
                <p onClick={() => {
                    setModalData(params?.data)
                    openModal()
                }} className="w-fit bg-gradient-to-r from-[#614119] via-[#d4af37] to-[#614119] cursor-pointer text-center text-white px-2 rounded-sm ">Track</p>
            )
        }

    ]);


    const track_url = modalData?.logisticPartner?.toLowerCase() == 'sequel' || modalData?.logisticPartner?.toLowerCase() == 'sequel247' ? `${SEQUEL_TRACK}${modalData?.AwNo}` :
        modalData?.logisticPartner?.toLowerCase() == 'bluedart' ? `${BLUEDART_TRACK}${modalData?.AwNo}` :
            modalData?.logisticPartner?.toLowerCase() == 'cms' ? `${CMS_TRACK}${modalData?.AwNo}` : '#';

    return (
        <div className="ag-theme-alpine w-full overflow-x-auto">
            <div className='w-full my-8 '>
                <div className='flex justify-between items-center mb-2'>
                    <p className='my-2 font-semibold text-[#614119]'>Total:{shipmentStatusData?.length}</p>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
                        onClick={() => ExportExcel(shipmentStatusData)}
                    >
                        Export to Excel
                    </button>
                </div>
                <AgGridReact
                    //ref={gridRef}
                    theme="legacy"
                    rowHeight={40}
                    rowData={shipmentStatusData}
                    columnDefs={colDefs}
                    defaultColDef={{
                        resizable: false,
                        sortable: false,
                        filter: false,
                        suppressMovable: true,
                        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'start', fontSize: '12px', borderRight: '1px solid #d3d3d3', }
                    }}
                    getRowClass={(params) => {
                        const estimated = params.data?.estiimated_delivery;
                        const deliveredOn = params.data?.DeliveredOn;
                        if (estimated) {
                            const deliveredDate = new Date(deliveredOn);
                            const estimatedDate = new Date(estimated);
                            if (deliveredDate > estimatedDate) {
                                return "late-delivery-row";
                            }
                        }
                        return "";
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
            <div>
                {showModal && (
                    <Modal onClose={closeModal}>
                        <p className='text-center font-bold border-b-1 pb-2 '>Order Track</p>
                        <div className='flex flex-col gap-y-5 text-black mb-2 mt-4'>
                            <div>
                                <p className='font-semibold flex items-center gap-x-2'>Order No : <span className='font-medium'>{modalData?.ecomorderid}</span> <span className='cursor-pointer' onClick={() => {
                                    navigator.clipboard.writeText(modalData?.ecomorderid);
                                    toast.success('Order No copied to clipboard!');

                                }}><MdContentCopy /></span></p>
                            </div>

                            <div>
                                <p className='font-semibold flex items-center gap-x-2'>Order RefNo:
                                    <span>{modalData?.Orderrefno}</span> <span className='cursor-pointer' onClick={() => {
                                        navigator.clipboard.writeText(modalData?.Orderrefno);
                                        toast.success('Order RefNo. copied to clipboard!');

                                    }}><MdContentCopy /></span></p>
                            </div>
                            <div>
                                <p className='font-semibold flex items-center gap-x-2'>Aw Billno: <Link href={track_url}
                                    target="_blank" rel="noopener noreferrer" className='text-blue-500 underline'>{modalData?.AwNo}</Link> <span className='cursor-pointer' onClick={() => {
                                        navigator.clipboard.writeText(modalData?.AwNo);
                                        toast.success('AW No. copied to clipboard!');

                                    }}><MdContentCopy /></span></p>
                            </div>
                            <div>
                                <p className='font-semibold'>Order Date :&nbsp;<span className='font-medium capitalize'>{modalData?.order_date ? new Date(modalData.order_date).toLocaleDateString("en-IN") : "N/A"}</span></p>
                            </div>
                            <div>
                                <p className='font-semibold'>Logistic Partner : <span className='font-medium'> {modalData?.logisticPartner && modalData?.logisticPartner != 'null' ? modalData?.logisticPartner : 'Not Assigned'}</span></p>
                            </div>

                            <div>
                                <p className='font-semibold'>Mobile No :&nbsp;<span className='font-medium'>{modalData?.mobile_no}</span></p>
                            </div>

                            <div>
                                <p className='font-semibold'>Customer Name :&nbsp;<span className='font-medium capitalize'>{modalData?.cust_name}</span></p>
                            </div>

                            <div>
                                <p className='font-semibold'>Shipping City :&nbsp;<span className='font-medium capitalize'>{modalData?.ShippingCity}</span></p>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>


        </div>
    )
}

export default ShipmentStatusReport