// src/pages/AdminDashboard.jsx

import { useState, useEffect } from "react";
import {
  getPendingReviews,
  updateReviewStatus,
  getBusinesses,
  createBusiness,
  deleteBusiness,
} from "../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [newBusiness, setNewBusiness] = useState({
    name: "",
    category: "",
    description: "",
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [reviewsRes, businessRes] = await Promise.all([
      getPendingReviews(),
      getBusinesses(),
    ]);
    setPendingReviews(reviewsRes.data);
    setBusinesses(businessRes.data);
  };

  const handleReviewAction = async (reviewId, status) => {
    await updateReviewStatus(reviewId, status);
    fetchData();
  };

  const handleAddBusiness = async (e) => {
    e.preventDefault();
    await createBusiness(newBusiness);
    setShowAddBusiness(false);
    setNewBusiness({
      name: "",
      category: "",
      description: "",
      location: { address: "", city: "", state: "", zipCode: "" },
    });
    fetchData();
  };

  const handleDeleteBusiness = async (id) => {
    await deleteBusiness(id);
    fetchData();
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="tabs">
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Pending Reviews ({pendingReviews.length})
        </button>
        <button
          className={activeTab === "businesses" ? "active" : ""}
          onClick={() => setActiveTab("businesses")}
        >
          Manage Businesses ({businesses.length})
        </button>
      </div>

      {activeTab === "reviews" && (
        <div className="reviews-section">
          {pendingReviews.map((review) => (
            <div key={review._id} className="admin-review-card">
              <h3>{review.business?.name}</h3>
              <p>{review.comment}</p>
              <button
                onClick={() => handleReviewAction(review._id, "approved")}
              >
                Approve
              </button>
              <button
                onClick={() => handleReviewAction(review._id, "rejected")}
              >
                Reject
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "businesses" && (
        <div className="businesses-section">
          <button onClick={() => setShowAddBusiness(!showAddBusiness)}>
            {showAddBusiness ? "Cancel" : "+ Add Business"}
          </button>

          {showAddBusiness && (
            <form onSubmit={handleAddBusiness}>
              <input
                value={newBusiness.name}
                onChange={(e) =>
                  setNewBusiness({ ...newBusiness, name: e.target.value })
                }
              />
              <button type="submit">Add</button>
            </form>
          )}

          {businesses.map((business) => (
            <div key={business._id}>
              <h3>{business.name}</h3>
              <button onClick={() => handleDeleteBusiness(business._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
