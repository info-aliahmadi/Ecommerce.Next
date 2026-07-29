'use client';

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Check, Loader2, Star } from 'lucide-react';
import { Button } from '../../../_components/ui/button';
import { Input } from '../../../_components/ui/input';
import { Textarea } from '../../../_components/ui/textarea';

function StarRatingInput({
  value,
  onChange,
  size = 24,
}: Readonly<{
  value: number;
  onChange: (v: number) => void;
  size?: number;
}>) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starVal = i + 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starVal)}
            onMouseEnter={() => setHover(starVal)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              size={size}
              className={`transition-colors ${starVal <= (hover || value)
                ? 'fill-ecommerce-amber text-ecommerce-amber'
                : 'text-ecommerce-border'
                }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewForm({ productId }: { productId: number }) {
  const t = useTranslations('');
  const queryClient = useQueryClient();
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 0, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleSubmitReview = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (reviewForm.rating === 0 || !reviewForm.comment.trim()) return;
      setSubmittingReview(true);
      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            author: reviewForm.author.trim() || 'Anonymous',
            rating: reviewForm.rating,
            title: reviewForm.title.trim(),
            comment: reviewForm.comment.trim(),
          }),
        });
        if (!res.ok) throw new Error('Failed');
        toast.success(t('homepage.productDetail.reviewSubmitted'));
        setReviewForm({ author: '', rating: 0, title: '', comment: '' });
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
      } catch {
        toast.error('Failed to submit review');
      } finally {
        setSubmittingReview(false);
      }
    },
    [reviewForm, productId, queryClient, t],
  );

  return (
    <form onSubmit={handleSubmitReview} className="space-y-3">
      <Input
        placeholder="Your name"
        value={reviewForm.author}
        onChange={(e) => setReviewForm((prev) => ({ ...prev, author: e.target.value }))}
        className="h-9 text-sm border-ecommerce-border"
      />
      <div>
        <label className="text-xs text-ecommerce-text-muted mb-1.5 block">
          {t('homepage.productDetail.rating')}
        </label>
        <StarRatingInput
          value={reviewForm.rating}
          onChange={(v) => setReviewForm((prev) => ({ ...prev, rating: v }))}
          size={22}
        />
      </div>
      <Input
        placeholder="Review title"
        value={reviewForm.title}
        onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
        className="h-9 text-sm border-ecommerce-border"
      />
      <Textarea
        placeholder="Your review..."
        value={reviewForm.comment}
        onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
        rows={3}
        className="text-sm border-ecommerce-border resize-none"
        required
      />
      <Button
        type="submit"
        disabled={submittingReview || reviewForm.rating === 0 || !reviewForm.comment.trim()}
        className="w-full h-9 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white text-sm font-medium rounded-lg gap-2 disabled:opacity-50"
      >
        {submittingReview ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Check size={14} />
        )}
        {t('homepage.productDetail.submitReview')}
      </Button>
    </form>
  );
}
