import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showNumber?: boolean
  reviewsCount?: number
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showNumber = true,
  reviewsCount,
  className = "",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[...Array(maxRating)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < Math.floor(rating)
                ? "text-orange-400 fill-current"
                : i < rating
                  ? "text-orange-400 fill-current opacity-50"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <div className={`${textSizeClasses[size]} text-gray-600 flex items-center gap-1`}>
          <span className="font-medium">{rating.toFixed(1)}</span>
          {reviewsCount !== undefined && <span className="text-gray-400">({reviewsCount})</span>}
        </div>
      )}
    </div>
  )
}
