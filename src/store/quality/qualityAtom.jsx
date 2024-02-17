import axios from "axios";
import { atom, selector } from "recoil";


export const qualityDataState = atom({
    key : "qualityData",
    default : selector({
        key :  "qualitySelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/quality/get-all-quality`);
            return res.data.qualities
        }
    })
})