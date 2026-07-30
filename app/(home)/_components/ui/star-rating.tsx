"use client"
import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "../../_lib/utils"

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: number
  fillClassName?: string
  emptyClassName?: string
  className?: string
  onChange?: (rating: number) => void
}

const StarRating = ({
  rating,
  maxStars = 5,
  size = 16,
  fillClassName = "fill-ecommerce-amber text-ecommerce-amber",
  emptyClassName = "text-ecommerce-border",
  onChange,
  className,
  ...props
}: StarRatingProps) => {
  const [hover, setHover] = React.useState(0)

  const displayRating = onChange ? (hover || rating) : rating

  return (
    <div
      data-slot="star-rating"
      className={cn("flex items-center gap-0.5", className)}
      onMouseLeave={onChange ? () => setHover(0) : undefined}
      {...props}
    >
      {Array.from({ length: maxStars }).map((_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= Math.floor(displayRating)
        const isHalf = !isFilled && starValue - 0.5 <= displayRating

        return (
          <button
            key={i}
            type={onChange ? "button" : undefined}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={onChange ? () => setHover(starValue) : undefined}
            className={cn(
              "transition-transform hover:scale-110 focus:outline-none",
              !onChange && "pointer-events-none"
            )}
          >
            <Star
              size={size}
              className={cn(
                isFilled || isHalf ? fillClassName : emptyClassName,
                isHalf && "fill-ecommerce-amber/50 text-ecommerce-amber"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export { StarRating }
