import axios from "axios";
import { atom, selector } from "recoil";


export const invoiceDataState = atom({
    key : "invoiceData",
    default : selector({
        key :  "invoiceSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/invoice/get-all-invoice`);
            return res.data.invoices
        }
    })
})