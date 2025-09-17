import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from "next/navigation"
import jsxConverters from '@/utils/jsx-converters';
import { RefreshRouteOnSave } from '@/utils/RefreshRouteOnSave';
import "@/styles/richText.scss";
import { getContacts } from '@/actions/server/pages/getContacts';

// Перевалидация каждые 60 секунд
export const revalidate = 31536000; // 1 год
export default async function AboutPage() {
  try {
    const contacts = await getContacts();
    // Если данных нет
    if (!contacts) {
      notFound()
    }
    return (
      <div className="rich-container">
        <RefreshRouteOnSave route='/contacts'   />
        <RichText converters={jsxConverters} data={contacts.content} />
      </div>
    )
  } catch (error) {
    console.error("Error loading about page:", error)
    notFound()
  }
}

// Метаданные для SEO
export async function generateMetadata() {
  try {
    const contactsData = await getContacts()
    return {
      title: contactsData.title || "Контакты",
      description: contactsData?.description || "Узнайте наши контакты -- ГрандБАЗА",
    }
  } catch (error) {
    return {
      title: "Контакты",
      description: "Узнайте наши контакты -- ГрандБАЗАР",
    }
  }
}
