import { getPayload } from "payload";
import config from "@payload-config";
import { headers as getHeader } from "next/headers";
import { redirect } from "next/navigation";
import { routerConfig } from "@/config/router.config";
import ProfilePage from "./client-page";

export default async function Page(){
  const payload = await getPayload({config});
  const headers = await getHeader();
  const user = await payload.auth({headers});
  console.log(user);
  if (!user.user){
    redirect(routerConfig.home);
  }
  return <ProfilePage />
}