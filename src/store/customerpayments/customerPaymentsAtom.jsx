import axios from "axios";
import { atom, selector } from "recoil";


export const customerpaymentDataState = atom({
    key : "customerpaymentDataState",
    default : selector({
        key :  "customerpaymentSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/customerpayment/get-all-customerpayments`);
            return res.data.customerpayments
        }
    })
})
