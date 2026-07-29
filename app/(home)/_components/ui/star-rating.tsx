import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "../../_lib/utils"

interface StarRatingProps extends React.ComponentProps<"div"> {
  rating: number
  maxStars?: number
  size?: number
  fillClassName?: string
  emptyClassName?: string
}

const StarRating = ({
  rating,
  maxStars = 5,
  size = 16,
  fillClassName = "fill-ecommerce-amber text-ecommerce-amber",
  emptyClassName = "text-ecommerce-border",
  className,
  ...props
}: StarRatingProps) => {
  return (
    <div
      data-slot="star-rating"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    >
      {Array.from({ length: maxStars }).map((_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= Math.floor(rating)
        const isHalf = !isFilled && starValue - 0.5 <= rating

        return (
          <Star
            key={i}
            size={size}
            className={cn(
              isFilled || isHalf ? fillClassName : emptyClassName,
              isHalf && "fill-ecommerce-amber/50 text-ecommerce-amber"
            )}
          />
        )
      })}
    </div>
  )
}

export { StarRating }
