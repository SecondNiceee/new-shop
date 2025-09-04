"use server"
import { getPayload } from "payload"
import config from "@payload-config";
export const getArticles = async () => {
    const payload = await getPayload({config});
    const blogs = await payload.find({
        collection : "blogs",
        select : {
            slug : true,
            title : true,
            background : true
        }
    });
    return blogs.docs;
}