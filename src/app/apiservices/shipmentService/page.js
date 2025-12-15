"use client";
import axios from "axios";
import { BASE_URL } from "../../../../constant";


const getShipmentSummary = async (fromDate, toDate) => {
  try {
    const token = localStorage.getItem('mistoken')
    const response = await axios.post(`${BASE_URL}/api/shipmentSummary?fromDate=${fromDate}&toDate=${toDate}`, {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    )
    return response?.data?.data
  } catch (err) {
    throw new Error(err)
  }
}

export default {getShipmentSummary}