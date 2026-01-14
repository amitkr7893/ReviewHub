import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getBusiness, getReviews, submitReview } from '../services/api';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import './BusinessDetail.css';

const BusinessDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchBusinessData();
  }, [id]);

  const fetchBusinessData = async () => {
    try {
      const [businessRes, reviewsRes] = await Promise.all([
        getBusiness(id),
        getReviews(id)
      ]);
      setBusiness(businessRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const formData = new FormData();
      formData.append('businessId', id);
      formData.append('quality', reviewData.quality);
      formData.append('service', reviewData.service);
      formData.append('value', reviewData.value);
      formData.append('comment', reviewData.comment);
      
      if (reviewData.photos) {
        for (let photo of reviewData.photos) {
          formData.append('photos', photo);
        }
      }

      await submitReview(formData);
      alert('Review submitted! It will appear after admin approval.');
      setShowReviewForm(false);
      fetchBusinessData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!business) {
    return <div className="error-message">Business not found</div>;
  }

  return (
    <div className="business-detail">
      <div className="business-header">
        <div className="business-info">
          <h1>{business.name}</h1>
          <p className="category">{business.category}</p>
          <p className="location">
            {business.location?.address}, {business.location?.city}, {business.location?.state}
          </p>
          <div className="rating-summary">
            <span className="rating-value">⭐ {business.averageRating.toFixed(1)}</span>
            <span className="review-count">({business.totalReviews} reviews)</span>
          </div>
        </div>
        
        {user && (
          <button 
            className="btn-primary"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {business.description && (
        <div className="card business-description">
          <h3>About</h3>
          <p>{business.description}</p>
        </div>
      )}

      {showReviewForm && (
        <div className="card">
          <h3>Write Your Review</h3>
          <ReviewForm onSubmit={handleReviewSubmit} />
        </div>
      )}

      <div className="reviews-section">
        <h2>Reviews ({reviews.length})</h2>
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default BusinessDetail;