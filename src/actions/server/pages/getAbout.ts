"use server"

import { getPayload } from "payload";
import config from "@payload-config";

export const getAbout = async () => {
    const payload = await getPayload({config});
    const about = await payload.find({
      collection : "pages",
      where : {
        title : {equals : "About"}
      }
    })
    return about.docs[0]
}