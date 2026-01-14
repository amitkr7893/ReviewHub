import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    quality: 5,
    service: 5,
    value: 5,
    comment: '',
    photos: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="rating-inputs">
        <div className="rating-group">
          <label>Quality</label>
          <select name="quality" value={formData.quality} onChange={handleChange}>
            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
            <option value="4">⭐⭐⭐⭐ Good</option>
            <option value="3">⭐⭐⭐ Average</option>
            <option value="2">⭐⭐ Poor</option>
            <option value="1">⭐ Terrible</option>
          </select>
        </div>

        <div className="rating-group">
          <label>Service</label>
          <select name="service" value={formData.service} onChange={handleChange}>
            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
            <option value="4">⭐⭐⭐⭐ Good</option>
            <option value="3">⭐⭐⭐ Average</option>
            <option value="2">⭐⭐ Poor</option>
            <option value="1">⭐ Terrible</option>
          </select>
        </div>

        <div className="rating-group">
          <label>Value</label>
          <select name="value" value={formData.value} onChange={handleChange}>
            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
            <option value="4">⭐⭐⭐⭐ Good</option>
            <option value="3">⭐⭐⭐ Average</option>
            <option value="2">⭐⭐ Poor</option>
            <option value="1">⭐ Terrible</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Your Review</label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          required
          rows="5"
          placeholder="Share your experience..."
        />
      </div>

      <div className="form-group">
        <label>Photos (Optional, max 5)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          max="5"
        />
        <small>You can upload up to 5 photos</small>
      </div>

      <button type="submit" className="btn-primary">Submit Review</button>
    </form>
  );
};

export default ReviewForm;