import axios from "axios";
import { atom, selector } from "recoil";


export const weaveDataState = atom({
    key : "weaveDataState",
    default : selector({
        key :  "weaveSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/weave/get-all-weave`);
            return res.data.weaves
        }
    })
})