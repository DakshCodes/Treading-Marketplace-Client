import axios from "axios";
import { atom, selector } from "recoil";


export const customerDataState = atom({
    key : "customerDataState",
    default : selector({
        key :  "customerSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/customer/get-all-customers`);
            return res.data.customers
        }
    })
})
