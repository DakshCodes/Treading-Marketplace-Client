import axios from "axios";
import { atom, selector } from "recoil";


export const categoryDataState = atom({
    key : "categoryData",
    default : selector({
        key :  "categorySelector",
        get : async () => {
            const res = await axios.get(`http://localhost:5000/api/category/get-all-category`);
            return res.data.categories
        }
    })
})