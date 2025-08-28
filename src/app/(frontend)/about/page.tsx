"use client"

import { getAboutData } from "@/actions/server/about/getAboutData"
import ErrorAlert from "@/components/error-alert/ErrorAlert"
import BlockRenderer from "@/components/about/ui/block-renderer"
import type { About } from "@/payload-types"
import type { AboutBlock } from "@/components/about/types/about-types"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<About | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)

  // Функция получения данных с сервера
  const fetchAboutData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getAboutData()
      setAboutData(result)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      } else {
        setError({ message: "Internal Server Error", name: "Uncaught Error" })
      }
    }
    setLoading(false)
  }, [setLoading, setError, setAboutData])

  // Получение данных с сервера
  useEffect(() => {
    fetchAboutData()
  }, [fetchAboutData])

  // UI ошибки в случае ошибки загрузки с сервера
  if (error) {
    console.log(error)
    return (
      <ErrorAlert
        buttonAction={() => fetchAboutData()}
        errorMessage="Не удалось загрузить данные страницы, проверьте подключение к интернету."
      />
    )
  }

  // UI загрузки
  if (isLoading || !aboutData) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    )
  }

  // Если данных нет
  if (!aboutData) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <h1 className="mb-4 text-3xl font-bold">Страница не найдена</h1>
        <p className="text-gray-600">Содержимое страницы "О нас" не настроено в админ-панели.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <BlockRenderer blocks={(aboutData.content as AboutBlock[]) || []} />
    </div>
  )
}
