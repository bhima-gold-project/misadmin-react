import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../../../../constant";


const getBmcSummary = async (fromDate,toDate) => {
    try {
         const token = Cookies.get("token");
        const response = await axios.post(`${BASE_URL}/api/bmcReport?fromDate=${fromDate}&toDate=${toDate}`,{},
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

const getDuplicateRefNo = async (fromDate,toDate) => {
    try {
         const token = Cookies.get("token");
        const response = await axios.post(`${BASE_URL}/api/duplicateRefNo?fromDate=${fromDate}&toDate=${toDate}`,{},
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

const getBmcReportDetails = async (filterType,fromDate,toDate) => {
    try {
         const token = Cookies.get("token");
        const response = await axios.post(`${BASE_URL}/api/bmcReportdetails?fromDate=${fromDate}&toDate=${toDate}&filterType=${filterType}`,{},
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

export default { getBmcSummary,getDuplicateRefNo ,getBmcReportDetails}