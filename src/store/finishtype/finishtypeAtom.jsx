import axios from "axios";
import { atom, selector } from "recoil";


export const finishtypeDataState = atom({
    key : "finishtypeDataState",
    default : selector({
        key :  "finishtypeSelector",
        get : async () => {
            const res = await axios.get(`http://localhost:5000/api/finishtype/get-all-finishtype`);
            return res.data.finishtypes
        }
    })
})