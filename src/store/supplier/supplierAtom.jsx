import axios from "axios";
import { atom, selector } from "recoil";

export const suppliersDataState = atom({
  key: "suppliersData",
  default: selector({
    key: "supplierAtomSelector",
    get: async () => {
      const res = await axios.get(`http://localhost:5000/api/supplier/get-all-supplier`);
      return res.data.suppliers
    }
  })
})
