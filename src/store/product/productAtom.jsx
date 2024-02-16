import axios from "axios";
import { atom, selector } from "recoil";

export const productsDataState = atom({
  key: "productsData",
  default: selector({
    key: "productAtomSelector",
    get: async () => {
      const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/products/get-all-products`);
      return res.data.products;
    }
  })
})
