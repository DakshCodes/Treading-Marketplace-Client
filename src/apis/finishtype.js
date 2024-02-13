import axios from "axios"

export const Createfinishtype = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/finishtype/create-finishtype`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetfinishtypeData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/finishtype/get-all-finishtype`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletefinishtype = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/finishtype/delete-finishtype/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatefinishtype = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/finishtype/update-finishtype/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
