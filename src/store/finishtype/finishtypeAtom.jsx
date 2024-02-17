import axios from "axios";
import { atom, selector } from "recoil";


export const finishtypeDataState = atom({
    key : "finishtypeDataState",
    default : selector({
        key :  "finishtypeSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/finishtype/get-all-finishtype`);
            return res.data.finishtypes
        }
    })
})