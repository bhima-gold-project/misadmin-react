import { MdContentCopy } from "react-icons/md";
import { toast } from 'react-toastify';
import { BASE_URL, PRODUCT_IMAGE_URL } from "../../constant";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";

export default function ModalDetailsTable({ modalData = [], LocaleIN, LocaleSG, StyleCode }) {

    const [images, setImages] = useState([])

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    const reImportStylecode = async () => {
         const token = Cookies.get("token");
        try {
            const response = await axios.post(`${BASE_URL}/api/re_importStylecode`, {
                Stylecode: StyleCode,
                LocaleIN: LocaleIN,
                LocaleSG: LocaleSG,
                LocaleAE: 0,
                LocaleUS: 0
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            const result = await response.data
            if (result?.success == true) {
                toast.success(result?.message);
            }

        } catch (err) {
            toast.success('Import failed unexpectedly');
            throw new Error(err)
        }
    }

    const ViewImages = async () => {
        const token = Cookies.get("token");
        try {
            const response = await axios.post(`${BASE_URL}/api/getProductImages`, {
                Stylecode: StyleCode
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            const result = await response.data
            if (result?.success == true && result?.data?.length > 0) {
                setImages(result?.data)
            } else {
                toast.warn('No Images to display!');
            }

        } catch (err) {
            throw new Error(err)
        }
    }

    const firstSKU = modalData?.[0]?.SKU || "";
    const isNotNumber = /[^0-9]/.test(firstSKU);

    return (
        <div className="overflow-x-auto mt-4 mb-2">
            <table className="min-w-full border border-gray-300 text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-900">
                    <tr>
                        <th className="px-4 py-2 border">Sku</th>
                        <th className="px-4 py-2 border">Stylecode</th>
                        <th className="px-4 py-2 border">Product Pushed</th>
                        {isNotNumber ? '' : <th className="px-4 py-2 border">Order No</th>}
                        {isNotNumber ? '' : <th className="px-4 py-2 border">Sold Flag</th>}
                        <th className="px-4 py-2 border">Is Stock</th>
                        <th className="px-4 py-2 border">Branch Code</th>
                    </tr>
                </thead>

                <tbody>
                    {modalData?.map((item, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2 border  gap-x-2">
                                <p className="flex items-center  gap-x-2 ">{item?.SKU} <MdContentCopy
                                    className="cursor-pointer text-gray-600 hover:text-gray-900"
                                    onClick={() => handleCopy(item?.SKU, "barcode_no")}
                                /></p>

                            </td>

                            <td className="px-4 py-2 border ">
                                <p className="flex items-center  gap-x-2 ">{item?.StyleCode} <MdContentCopy
                                    className="cursor-pointer text-gray-600 hover:text-gray-900"
                                    onClick={() => handleCopy(item?.StyleCode, "Stylecode")}
                                /></p>

                            </td>

                            <td className="px-4 py-2 border capitalize">{item?.productpushed}</td>
                            {isNotNumber ? '' : <td className="px-4 py-2 border capitalize">{item?.order_no}</td>}
                            {isNotNumber ? '' : <td className="px-4 py-2 border capitalize">{item?.sold_flag}</td>}
                            <td className="px-4 py-2 border">{item?.isstock}</td>
                            <td className="px-4 py-2 border">{item?.branch_code}</td>

                        </tr>
                    ))}

                    {modalData?.length === 0 && (
                        <tr>
                            <td colSpan="10" className="text-center py-4 text-gray-500">
                                No records found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="w-full flex justify-center gap-x-5">
                <div>
                    <button onClick={() => reImportStylecode()}
                        className={`w-fit px-2 bg-gradient-to-r from-[#b48244] via-[#d4af37] to-[#b48244] 
               text-white py-1 rounded-md mt-4  transition-opacity duration-200 flex justify-center items-center gap-2
               ${modalData?.length <= 0 ? 'opacity-25 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}
               `}
                        disabled={modalData?.length <= 0 ? true : false}
                    >
                        Re-Import Stylecode
                    </button>
                </div>

                <div>
                    <button onClick={() => ViewImages()}
                        className={`w-fit px-2 bg-gradient-to-r from-[#b48244] via-[#d4af37] to-[#b48244] 
               text-white py-1 rounded-md mt-4  transition-opacity duration-200 flex justify-center items-center gap-2
               ${modalData?.length <= 0 ? 'opacity-25 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}
               `}
                        disabled={modalData?.length <= 0 ? true : false}
                    >
                        View Images
                    </button>
                </div>
            </div>

            {
                images?.length > 0 && <div>
                    <div className="flex justify-center items-center gap-x-3 overflow-x-scroll ">
                        {
                            images?.map((item, i) => {
                                return (
                                    <div key={item?.ID} className="my-8">
                                        <div className="w-36 h-36 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
                                            <img
                                                src={`${PRODUCT_IMAGE_URL}${item.ImageURL}`}
                                                alt="Product Image"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <p className="text-center mt-2">SlNo: {item?.SlNo}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
        </div>
    );
}
