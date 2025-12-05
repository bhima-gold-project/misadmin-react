"use client"
import React, { useEffect, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import CustomTooltip from './CustomTooltip';
import { useSelector } from 'react-redux';
import { PRODUCT_IMAGE_URL } from '../../constant';

ModuleRegistry.registerModules([AllCommunityModule]);

const ProductAttrsGrid = () => {
    const gridRef = useRef();
    const productAttrsData = useSelector((state) => state?.products?.productAttrs)
    const [colDefs, setColDefs] = useState([]);

  const defaultCols  = [
        {
            field: "image", headerName: "Image", flex: 1, minWidth: 100, wrapText: true, autoHeight: true,
            cellRenderer: (params) => {
                const cleanUrl = params.value?.replace(/\\/g, "/");
                if (!cleanUrl) {
                    return <span>No Image</span>;
                }
                return (
                    <img
                        src={`${PRODUCT_IMAGE_URL}/${cleanUrl}`}
                        alt="Product"
                        style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />
                );
            },
        },
        { field: "barcode", headerName: "Sku", flex: 1, minWidth: 100, wrapText: true, autoHeight: true },
        { field: "itemName", headerName: "Item Name", flex: 1, minWidth: 100, wrapText: true, autoHeight: true },
        { field: "itemType", headerName: "Item Type", flex: 1, minWidth: 100, wrapText: true, autoHeight: true },
        { field: "itemSize", headerName: "Size", flex: 1, minWidth: 100, wrapText: true, autoHeight: true },
        { field: "thickness", headerName: "Thickness", flex: 1, minWidth: 100, wrapText: true, autoHeight: true },
        { field: "height", headerName: "Height", flex: 1, minWidth: 100, wrapText: true, autoHeight: true },
        { field: "width", headerName: "Width", flex: 1, minWidth: 100, wrapText: true, autoHeight: true },
        { field: "length", headerName: "length", flex: 1, minWidth: 100, wrapText: true, autoHeight: true },
         { field: "polish", headerName: "Polish", flex: 1, minWidth: 100, wrapText: true, autoHeight: true },

    ]

    useEffect(() => {
    const keys = Object.keys(productAttrsData[0] || {});
    // Filter only columns that exist in the response
    const filtered = defaultCols.filter(col => keys.includes(col.field));
    setColDefs(filtered);
}, []);

    return (
        <div className={`ag-theme-alpine w-full h-fit overflow-x-auto`}>
            <div className='w-full my-8'>
                <AgGridReact
                    ref={gridRef}
                    theme="legacy"
                    rowHeight={40}
                    rowData={productAttrsData}
                    columnDefs={colDefs}
                    defaultColDef={{
                        resizable: false,
                        sortable: false,
                        filter: false,
                        suppressMovable: true,
                        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', borderRight: '1px solid #d3d3d3' }
                    }}
                    tooltipShowDelay={0}
                    tooltipHideDelay={2000}
                    components={{
                        customTooltip: CustomTooltip,
                    }}
                    domLayout="autoHeight"
                    copyHeadersToClipboard={true}
                />
            </div>
        </div>
    )
}

export default ProductAttrsGrid