import React, { useEffect, useRef, useState } from 'react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch } from 'react-redux';
import { setSelectedStylecodes } from '@/redux/slice';
import CustomTooltip from './CustomTooltip';

ModuleRegistry.registerModules([AllCommunityModule]);

const AgGridTable = ({ rowData, searchResult, searchTerm }) => {
    const dispatch = useDispatch()
    const gridRef = useRef();

    const [colDefs] = useState([
        {
            headerName: '',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 60,
            suppressSizeToFit: true,
        },
        {
            field: "ImagePath",
            headerName: "Image",
            flex: 1,
            minWidth: 100,
            cellRenderer: (params) => {
                // Replace backslashes in URLs
                const cleanUrl = params.value?.replace(/\\/g, "/");
                if (!cleanUrl) {
                    return <span>No Image</span>;
                }
                return (
                    <img
                        src={cleanUrl}
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
        {
            field: "Stylecode", headerName: 'Stylecode', flex: 1, minWidth: 200, wrapText: true,
            autoHeight: true,
            tooltipComponent: "customTooltip",
            tooltipValueGetter: () => "Click to copy",
            cellRenderer: (params) => {
                return (
                    <p className='cursor-pointer' onClick={() => navigator.clipboard.writeText(params?.value)}>{params?.value}</p>
                );
            },
        },
        {
            field: "Sku", headerName: 'Sku', flex: 1, minWidth: 100, wrapText: true,
            autoHeight: true,
              tooltipComponent: "customTooltip",
            tooltipValueGetter: () => "Click to copy",
            cellRenderer: (params) => {
                return (
                    <p className='cursor-pointer' onClick={() => navigator.clipboard.writeText(params?.value)}>{params?.value}</p>
                );
            },
        },
        {
            field: "Name", headerName: 'Title', flex: 1, minWidth: 300, wrapText: true,
            autoHeight: true,
        },
        {
            field: "CategoryName", headerName: 'Category', flex: 1, minWidth: 100, wrapText: true,
            autoHeight: true,
        },
        { field: "LocaleIN", headerName: 'LocaleIN', flex: 1, minWidth: 100 },
        { field: "LocaleSG", headerName: 'LocaleSG', flex: 1, minWidth: 100 },
        { field: "LocaleAE", headerName: 'LocaleAE', flex: 1, minWidth: 100 },
        { field: "LocaleUS", headerName: 'LocaleUS', flex: 1, minWidth: 100 },
    ]);

    const onSelectionChanged = () => {
        const selectedData = gridRef.current.api.getSelectedRows();
        dispatch(setSelectedStylecodes(selectedData))
    };

    const moveRowToTop = (term) => {
        const api = gridRef.current?.api;
        if (!api || !term) return;

        const matchedRows = [];

        api.forEachNode((node) => {
            if (node.data?.Stylecode?.toLowerCase() === term.toLowerCase()) {
                matchedRows.push(node.data);
            }
            if (node.data?.Sku?.toLowerCase() === term.toLowerCase()) {
                matchedRows.push(node.data);
            }
        });

        if (matchedRows?.length > 0) {
            api.applyTransaction({ remove: matchedRows });
            api.applyTransaction({ add: matchedRows, addIndex: 0 });
        }
    };

    const hasEmptyField = (data) => {
        if (!data) return false;
        return Object.values(data).some(value => value === "" || value === null || value === undefined);
    };

    useEffect(() => {
        if (searchTerm) {
            moveRowToTop(searchTerm);
        }
    }, [searchTerm]);

    return (
        <div className="ag-theme-alpine w-full overflow-x-auto">
            <div className='w-full  h-fit max-h-[700px]'>
                <AgGridReact
                    ref={gridRef}
                    theme="legacy"
                    rowHeight={100}
                    rowData={rowData}
                    columnDefs={colDefs}
                    rowSelection="multiple"
                    onSelectionChanged={onSelectionChanged}
                    suppressRowClickSelection={true}
                    getRowClass={(params) => {
                        const isSearched = searchResult?.some(p => p?.Sku === params?.data?.Sku);
                        const isEmpty = hasEmptyField(params.data);

                        return (isSearched || isEmpty) ? isSearched ? "highlight-row" : isEmpty ? "highlight-red" : '' : '';
                    }}
                    isRowSelectable={(node) => !hasEmptyField(node.data)}

                    tooltipShowDelay={0}     // show instantly
                    tooltipHideDelay={1000}  // auto hide in 2s
                    components={{
                        customTooltip: CustomTooltip,
                    }}
                    defaultColDef={{
                        resizable: false,
                        sortable: false,
                        filter: false,
                        suppressMovable: true,
                        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', borderRight: '1px solid #d3d3d3' }
                    }}
                    domLayout="autoHeight"
                />
            </div>
        </div>
    )
}

export default AgGridTable