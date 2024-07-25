import axios from "axios"

export const Createpayment = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/payment/create-payment`, payload);
        return response.data;

    } catch (error) {
        return error
    }
}

export const GetpaymentData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/payment/get-all-payment`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

// export const GetpaymentDataByID = async () => {
//     try {
//         const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/payment/get-all-payment`);
//         return response.data;

//     } catch (error) {
//         return error.message
//     }
// }
export const Deletepayment = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/payment/delete-payment/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatepayment = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/payment/update-payment/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
