import axios from "axios"

export const CreateUnit = async (payload) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/unit/create-unit`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Getunitdata = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/unit/get-all-unit`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deleteunit = async (id) => {
    console.log("calling")

    try {
        const response = await axios.delete(`http://localhost:5000/api/unit/delete-unit/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updateunit = async (id, payload) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/unit/update-unit/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
