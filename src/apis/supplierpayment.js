import axios from "axios"

export const Createsupplierpayment = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/supplierpayment/create-supplierpayment`, payload);
        return response.data;

    } catch (error) {
        return error
    }
}

export const GetsupplierpaymentData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/supplierpayment/get-all-supplierpayments`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

// export const GetsupplierpaymentDataByID = async () => {
//     try {
//         const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/supplierpayment/get-all-supplierpayment`);
//         return response.data;

//     } catch (error) {
//         return error.message
//     }
// }
export const Deletesupplierpayment = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/supplierpayment/delete-supplierpayment/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatesupplierpayment = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/supplierpayment/update-supplierpayment/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
