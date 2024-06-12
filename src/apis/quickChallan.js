import axios from "axios"

export const Createquickchallan = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/quickchallan/create-quickchallan`, payload);
        return response.data;

    } catch (error) {
        return error
    }
}

export const GetquickchallanData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/quickchallan/get-all-quickchallan`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletequickchallan = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/quickchallan/delete-quickchallan/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatequickchallan = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/quickchallan/update-quickchallan/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const UpdateQuickChallanProducts = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/quickchallan/update-quick-challan-products/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const UpdateQuickProductsDue = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/quickchallan/update-quick-due-products/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

