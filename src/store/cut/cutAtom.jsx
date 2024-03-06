import axios from "axios";
import { atom, selector } from "recoil";


export const cutDataState = atom({
    key : "cutsDataState",
    default : selector({
        key :  "cutSelector",
        get : async () => {
            const res = await axios.get(`http://localhost:5000/api/cut/get-all-cuts`);
            return res.data.cuts
        }
    })
})