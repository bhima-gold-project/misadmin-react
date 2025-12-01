"use client";
import axios from "axios";
import { BASE_URL } from "../../../../constant";


const getBmcSummary = async (fromDate, toDate) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${BASE_URL}/api/bmcReport?fromDate=${fromDate}&toDate=${toDate}`, {},
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

const getDuplicateRefNo = async (fromDate, toDate) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${BASE_URL}/api/duplicateRefNo?fromDate=${fromDate}&toDate=${toDate}`, {},
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

const getBmcReportDetails = async (filterType, fromDate, toDate) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${BASE_URL}/api/bmcReportdetails?fromDate=${fromDate}&toDate=${toDate}&filterType=${filterType}`, {},
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

const getPortalTxnByFilter = async (filterType,fromDate, toDate) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${BASE_URL}/api/portalTxnByFilter?fromDate=${fromDate}&toDate=${toDate}&filterType=${filterType}`, {},
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

const getMissingRefNo = async (fromDate, toDate) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${BASE_URL}/api/missingRefNo?fromDate=${fromDate}&toDate=${toDate}`, {},
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

const getTypePaymentDetails = async (fromDate, toDate) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${BASE_URL}/api/typeENsplitPayment?fromDate=${fromDate}&toDate=${toDate}`, {},
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

export default { getBmcSummary, getDuplicateRefNo, getBmcReportDetails, getMissingRefNo, getTypePaymentDetails, getPortalTxnByFilter }