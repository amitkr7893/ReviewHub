import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBusinesses } from '../services/api';
import './Home.css';

const Home = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, [category]);

  const fetchBusinesses = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      
      const response = await getBusinesses(params);
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBusinesses();
  };

  if (loading) {
    return <div className="loading">Loading businesses...</div>;
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>Find & Review Local Businesses</h1>
        <p>Discover the best places in your city</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Cafe">Cafe</option>
            <option value="Shop">Shop</option>
            <option value="Service">Service</option>
          </select>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      <div className="businesses-grid">
        {businesses.length === 0 ? (
          <div className="no-results">
            <h3>No businesses found</h3>
            <p>Be the first to add a business!</p>
          </div>
        ) : (
          businesses.map(business => (
            <Link to={`/business/${business._id}`} key={business._id} className="business-card">
              <h3>{business.name}</h3>
              <p className="category">{business.category}</p>
              <p className="location">{business.location?.city || 'Unknown'}</p>
              <div className="rating">
                ⭐ {business.averageRating.toFixed(1)} ({business.totalReviews} reviews)
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;