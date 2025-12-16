
"use client";
import React, { useEffect, useState } from 'react'
import productAtrsService from '../apiservices/productAttrsUpdtServices/page'
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { setProductAttrs } from '../../redux/slice';
import ProductAttrsGrid from '@/components/ProductAttrsGrid';
import { toast } from 'react-toastify';

const ProductAttrsUpdate = () => {
    const dispatch = useDispatch()
    const [prodAttrs, setProdAttrs] = useState([])


    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const handleCancel = () => {
        reset();
        setProdAttrs([])
    };

    const onSubmit = async (data) => {
        try {
            const result = await productAtrsService.getProductAttrsUpdate(data)
            const grouped = {};

            result.forEach(item => {
                const barcode = item.barcode_no;

                if (!grouped[barcode]) {
                    grouped[barcode] = {
                        barcode: item.barcode_no,
                        itemName: item.design_name,
                        itemType: item.item_name,
                        itemSize: item.item_size,
                        image: item.ImageURL,
                    };
                }

                const key = item.product_attributes_description
                    .toLowerCase()
                    .replace(/\s+/g, "_");

                grouped[barcode][key] = item.product_attributes_value;
            });

            
            const finalArray = Object.values(grouped);

            if(finalArray?.length > 0){
            dispatch(setProductAttrs(finalArray))
            setProdAttrs(finalArray)
            }else{
                toast.warn('Data Not Found !')
            }
        } catch (err) {
            throw new Error(err)
        }
    }


    return (
        <div className="min-h-screen">
            <h1 className='text-center text-2xl mb-3 border-b border-amber-200'>Product Attrs Update</h1>

            <div className="w-full grid max-w-sm mx-auto mt-10">
                <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Enter Stylecode
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-6">
                        {/* Input Field */}
                        <div>
                            <input
                                type="text"
                                placeholder="Stylecode..."
                                {...register("stylecode", { required: "Stylecode is required" })}
                                className={`w-full px-4 py-2 border rounded-lg  border-amber-300 outline-amber-200 
                               ${errors.stylecode ? "border-red-500 ring-red-200" : "border-gray-300 ring-blue-200"}`}
                            />

                            {errors.stylecode && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.stylecode.message}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex w-full items-center gap-4 ">
                            <button
                                type="submit"
                                className="cursor-pointer bg-gradient-to-r from-[#614119] via-[#d4af37] to-[#614119] w-full text-white px-5 py-2 rounded-lg shadow  transition-all"
                            >
                                View
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cursor-pointer bg-gradient-to-r from-[#614119] via-[#d4af37] to-[#614119] w-full text-white px-5 py-2 rounded-lg shadow  transition-all"
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {prodAttrs?.length > 0 &&
                <div>
                    <ProductAttrsGrid />
                </div>
            }
        </div>
    )
}

export default ProductAttrsUpdate