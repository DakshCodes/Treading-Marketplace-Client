import axios from "axios"

export const Createcut = async (payload) => {
    try {
        console.log(payload,'pppppppppppppppppppppp')
        const response = await axios.post(`http://localhost:5000/api/cut/create-cut`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Getcutdata = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/cut/get-all-cuts`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletecut = async (id) => {
   

    try {
        const response = await axios.delete(`http://localhost:5000/api/cut/delete-cut/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatecut = async (id, payload) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/cut/update-cut/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
