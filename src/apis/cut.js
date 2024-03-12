import axios from "axios"

export const Createcut = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/cut/create-cut`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Getcutdata = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/cut/get-all-cuts`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletecut = async (id) => {
   

    try {
        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/cut/delete-cut/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatecut = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/cut/update-cut/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
