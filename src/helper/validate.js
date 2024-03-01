import { toast } from "react-hot-toast";
//verify username
export async function unitValidate(values){
       const errors = await unitVerify({},values)
       return errors;
}
 function unitVerify(error = {} , values){
           if (!values.name){
            error.name = toast.error('unit not be empty')
           }
           else if (values.name.includes(" ")){
            error.name = toast.error('unit invalid ....')  
           }
           return error;
}