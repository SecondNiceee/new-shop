"use client"
import { CategoryWithSubs, getCategoriesWithSubs } from "@/actions/server/getCategorysWithSubs";
import { RequestError } from "@/utils/request";
import { create } from "zustand";

interface CategoriesStore{
    categories : CategoryWithSubs[],
    isLoading : boolean,
    getCategories : () => Promise<void>,
    error : RequestError | null
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
    categories : [],
    error : null,
    isLoading : false,
    getCategories : async () => {
        set({isLoading : true, error : null})
        const categories = await getCategoriesWithSubs();
        if (!categories){
            set({isLoading : false, error : {message : "Internal Error", status : 500}})
        }
        else{
            set({isLoading : false, categories})
        }
    }
}))