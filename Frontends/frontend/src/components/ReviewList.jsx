import React from 'react';
import './ReviewList.css';

const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  const calculateAverage = (review) => {
    return ((review.rating.quality + review.rating.service + review.rating.value) / 3).toFixed(1);
  };

  return (
    <div className="review-list">
      {reviews.map(review => (
        <div key={review._id} className="review-item">
          <div className="review-header">
            <div className="reviewer-info">
              <span className="reviewer-name">👤 {review.user?.name || 'Anonymous'}</span>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="review-rating">
              ⭐ {calculateAverage(review)}
            </div>
          </div>

          <div className="rating-breakdown">
            <span>Quality: {'⭐'.repeat(review.rating.quality)}</span>
            <span>Service: {'⭐'.repeat(review.rating.service)}</span>
            <span>Value: {'⭐'.repeat(review.rating.value)}</span>
          </div>

          <p className="review-comment">{review.comment}</p>

          {review.photos && review.photos.length > 0 && (
            <div className="review-photos">
              {review.photos.map((photo, index) => (
                <img 
                  key={index} 
                  src={`http://localhost:5000/${photo}`} 
                  alt={`Review photo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;