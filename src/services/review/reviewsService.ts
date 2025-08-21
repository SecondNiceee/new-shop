import { Review } from '@/payload-types'
import { request } from '@/utils/request'
import { CreateReviewDto } from './dto/CreateReviewDto'
import { ChangeReviewDto } from './dto/ChangeReviewDto'


class ReviewsService {
  async loadReviews(productId: number) {
    const response = await request<{ docs: Review[] }>({
      url: `/api/reviews`,
      method: 'GET',
      query: {
        'where[product][equals]': String(productId),
        sort: '-createdAt',
        depth: '1',
      },
    })
    return response.docs
  }
  async createReview(dto: CreateReviewDto) {
    const response = await request<{ doc: Review }>({
      url: '/api/reviews',
      method: 'POST',
      body: {
        product: dto.productId,
        rating: dto.rating,
        comment: dto.comment
      },
      credentials: true,
    })
    console.log(response.doc);
    return response.doc
  }
  async changeReview(dto:ChangeReviewDto){
    const response = await request<{ doc: Review }>({
      url: `/api/reviews/${dto.reviewId}`,
      method: 'PATCH',
      body: {
        rating: dto.rating,
        comment: dto.comment
      },
      credentials: true,
    })
    return response.doc
  }
}
export const reviewService = new ReviewsService()
