import axios from "axios"

export const CreateattributeValue = async (payload) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/attributeValue/create-attributeValue`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetattributeValueData = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/attributeValue/get-all-attributeValue`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const DeleteattributeValue = async (id) => {
    try {

        const response = await axios.delete(`http://localhost:5000/api/attributeValue/delete-attributeValue/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const UpdateattributeValue = async (id, payload) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/attributeValue/update-attributeValue/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
