'use client';

import { useState } from 'react';
import { Review } from '@/lib/mockData';
import { Star, ThumbsUp } from 'lucide-react';

export default function ProviderReviews({
    reviews,
    rating
}: {
    reviews: Review[];
    rating: number;
}) {
    const [showAll, setShowAll] = useState(false);
    const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

    // Calculate rating distribution
    const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length
    }));

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Patient Reviews</h2>

            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b">
                {/* Overall Rating */}
                <div className="text-center md:text-left">
                    <div className="text-5xl font-bold text-gray-900 mb-2">{rating}</div>
                    <div className="flex items-center gap-1 justify-center md:justify-start mb-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < Math.floor(rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="text-sm text-gray-600">
                        Based on {reviews.length} reviews
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 space-y-2">
                    {ratingCounts.map(({ star, count }) => {
                        const percentage = reviews.length > 0
                            ? (count / reviews.length) * 100
                            : 0;

                        return (
                            <div key={star} className="flex items-center gap-3">
                                <span className="text-sm font-medium w-12">
                                    {star} star
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-12 text-right">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
                {displayedReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>

            {/* Show More Button */}
            {reviews.length > 3 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-6 w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                </button>
            )}
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const reviewDate = new Date(review.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="border-b last:border-b-0 pb-6 last:pb-0">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="font-semibold text-gray-900">{review.patientName}</div>
                    <div className="text-sm text-gray-500">{reviewDate}</div>
                </div>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {review.procedure && (
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full mb-3">
                    {review.procedure}
                </div>
            )}

            <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>

            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00BFA6] transition-colors">
                <ThumbsUp className="w-4 h-4" />
                Helpful
            </button>
        </div>
    );
}