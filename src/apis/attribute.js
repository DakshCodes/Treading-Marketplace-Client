import axios from "axios"

export const Createattribute = async (payload) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/attribute/create-attribute`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetattributeData = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/attribute/get-all-attribute`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deleteattribute = async (id) => {
    try {

        const response = await axios.delete(`http://localhost:5000/api/attribute/delete-attribute/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updateattribute = async (id, payload) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/attribute/update-attribute/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
