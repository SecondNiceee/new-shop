"use server"

import { getPayload } from "payload";
import config from "@payload-config";

export const getPayment = async () => {
    const payload = await getPayload({config});
    const about = await payload.find({
      collection : "pages",
      where : {
        slug : {equals : "payment"}
      }
    })
    return about.docs[0]
}