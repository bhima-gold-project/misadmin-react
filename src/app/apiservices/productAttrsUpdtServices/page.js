"use client";
import axios from "axios"
import { BASE_URL } from "../../../../constant"

const getProductAttrsUpdate = async (data) => {
    const {stylecode} = data
    try {
        const token = localStorage.getItem('mistoken')
        const response = await axios.get(`${BASE_URL}/api/fetchProductAttrs?stylecode=${stylecode}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        return response?.data?.data
    } catch (err) {
        throw new Error(err)
    }
}


export default { getProductAttrsUpdate }