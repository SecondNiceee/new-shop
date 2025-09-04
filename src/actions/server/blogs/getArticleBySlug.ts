"use server"
import { getPayload } from "payload"
import config from "@payload-config";
export const getArticleBySlug = async (slug : string) => {
    const payload = await getPayload({config});
    const blogs = await payload.find({
        collection : "blogs",
        where : {
            slug : {equals : slug}
        }
    });
    return blogs.docs[0];
}