"use server"

import { getPayload } from "payload";
import config from "@payload-config";

export const getDelivery = async () => {
    const payload = await getPayload({config});
    const about = await payload.find({
      collection : "pages",
      where : {
        slug : {equals : "delivery"}
      }
    })
    return about.docs[0]
}