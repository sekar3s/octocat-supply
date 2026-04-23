import { useState } from 'react';

interface StarRatingProps {
  productId: number;
  productName: string;
  rating: number;
  onRate: (productId: number, rating: number) => void;
}

export default function StarRating({ productId, productName, rating, onRate }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const [justRated, setJustRated] = useState(false);

  const handleClick = (star: number) => {
    onRate(productId, star);
    setJustRated(true);
    setTimeout(() => setJustRated(false), 600);
  };

  const activeRating = hover || rating;

  return (
    <div
      className="flex items-center gap-0.5"
      role="group"
      aria-label={`Star rating for ${productName}`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= activeRating;
        const isAnimated = justRated && star <= rating;
        return (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${productName} ${star} out of 5 stars`}
            aria-pressed={star === rating}
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            id={`star-${star}-product-${productId}`}
            className={[
              'w-9 h-9 flex items-center justify-center rounded-full',
              'transition-all duration-150 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1',
              'hover:scale-125 active:scale-95',
              isFilled
                ? 'text-red-500 star-glow'
                : 'text-gray-300 hover:text-red-300',
              isAnimated ? 'star-pop' : '',
            ].join(' ')}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-7 h-7"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.601a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
      <span
        className="text-sm text-red-500 font-semibold ml-1 min-w-[2rem]"
        aria-live="polite"
        aria-atomic="true"
        aria-label={rating > 0 ? `${rating} out of 5 stars` : 'Not yet rated'}
      >
        {rating > 0 ? `${rating}/5` : ''}
      </span>
    </div>
  );
}
