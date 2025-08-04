"use client"

import { useCategoriesStore } from "@/entities/categories/categoriesStore"
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import ErrorAlert from "../error-alert/ErrorAlert";
import { Media } from "@/payload-types";


export function Categories() {
  const {categories, getCategories, error, isLoading} = useCategoriesStore();
  const isCategoriesFetched = useRef<boolean>(false);
  useEffect( () => {
    if (!categories.length && !isCategoriesFetched.current){
      getCategories();
      isCategoriesFetched.current = true
    }
  }, [categories] )
  console.log(categories);


  if (isLoading && !categories.length) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      );
    }

  // 🔽 Показываем ошибку, если есть
  if (error) {
    console.log(error);
    return (
      <ErrorAlert buttonAction={ () => {
        getCategories();
      }}  errorMessage="Не удалось загрузить категории. Проверьте подключение к интернету." />
    );
  }
  return (
    <div className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-start gap-3 md:gap-5 overflow-x-scroll pb-2">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 max-w-[90px] cursor-pointer hover:text-green-600 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-green-50">
                <Image width={30} height={30} alt={"shop"} src={(category.icon as Media).url ?? ""} className="h-6 w-6 text-black" />
              </div>
              <span className="text-xs text-center leading-tight">{category.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
