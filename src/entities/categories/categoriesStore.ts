import { Category } from "@/payload-types";
import { request, RequestError } from "@/utils/request";
import { create } from "zustand";

interface CategoriesStore{
    categories : Category[],
    isLoading : boolean,
    getCategories : () => Promise<void>,
    error : RequestError | null
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
    categories : [],
    error : null,
    isLoading : false,
    getCategories : async () => {
        try{
            set({isLoading : true, error : null})
            const categories = await request({
                method : "GET",
                url : "/api/categories",
                credentials : true
            })
            set({categories : categories.docs, isLoading : false})
        }
        catch(e){
            const error = e as RequestError;
            console.log(error.status);
            console.log(error.message);
            set({isLoading : false, error : {message : error.message, status : error.status}})
        }
    }
}))