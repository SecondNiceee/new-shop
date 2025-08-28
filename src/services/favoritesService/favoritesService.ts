import { Favorite } from "@/payload-types"
import { request } from "@/utils/request"
import { PaginatedDocs } from "payload";


class FavoritesService {
  private baseUrl = "/api/favorites"
  // Создать избранное 
  // Параметр id продукта
  async addToFavorites(productId: number): Promise<Favorite> {
    const rezult = await request<{doc:Favorite}>({
        method : "POST",
        url : `${this.baseUrl}/add`,
        body : {
            productId
        },
        credentials : true
    })
  return rezult.doc;
  }

  // Удаление из избранного
  // Параметр id продукта
  async removeFromFavorites(productId: number): Promise<any> {
    const rezult = await request({
        method : "DELETE",
        url : `${this.baseUrl}/remove`,
        credentials : true,
        body : {
          productId
        }
    })
    return rezult;
  }

 // Получить все избранные 
 // Параметров нет, потому что по пользователю все делаем
  async getFavorites(page : number, limit : number): Promise<PaginatedDocs<Favorite>> {
    const rezult = await request<PaginatedDocs<Favorite>>({
        method : "GET",
        url : `${this.baseUrl}`,
        credentials : true,
        query : {
          page : String(page), limit : String(limit),
        }
    })
    return rezult;
  }

  async getFavoritiesIds():Promise<number[]>{
    const rezult = await request<{docs:Favorite[]}>({
        method : "GET",
        url : this.baseUrl + '/findIds',
        credentials : true
    })

    return rezult.docs.map( (product) => (product.product as number) );
  }
 
}

export const favoritesService = new FavoritesService()
