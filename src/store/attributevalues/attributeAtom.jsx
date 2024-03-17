import axios from "axios";
import { atom, selector } from "recoil";


export const attributeDataState = atom({
    key : "attributeData",
    default : selector({
        key :  "attributeSelector",
        get : async () => {
            const res = await axios.get(`http://localhost:5000/api/attribute/get-all-attribute`);
            return res.data.attributes
        }
    })
})