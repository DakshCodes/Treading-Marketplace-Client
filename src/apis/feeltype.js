import axios from "axios"

export const Createfeeltype = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/feeltype/create-feeltype`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetfeeltypeData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/feeltype/get-all-feeltype`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletefeeltype = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/feeltype/delete-feeltype/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatefeeltype = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/feeltype/update-feeltype/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
