import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageHelper';
import './UserDashboard.css';

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 6
      });
      
      if (filter) {
        params.append('status', filter);
      }
      
      const { data } = await api.get(`/applications?${params}`);
      setApplications(data.data);
      setTotalPages(data.pages);
      setTotal(data.total);
      setLoading(false);
    } catch (err) {
      setError('Failed to load applications');
      setLoading(false);
    }
  }, [filter, currentPage]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this application?')) {
      try {
        await api.delete(`/applications/${id}`);
        toast.success('Application cancelled successfully!');
        // If deleting last item on page and not on page 1, go to previous page
        if (applications.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchApplications();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to cancel application');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Adoption Applications</h1>
          <Link to="/pets">
            <button className="btn-primary">Browse More Pets</button>
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="filter-tabs">
          <button
            className={filter === '' ? 'active' : ''}
            onClick={() => {
              setFilter('');
              setCurrentPage(1);
            }}
          >
            All {filter === '' && total > 0 && `(${total})`}
          </button>
          <button
            className={filter === 'Pending' ? 'active' : ''}
            onClick={() => {
              setFilter('Pending');
              setCurrentPage(1);
            }}
          >
            Pending {filter === 'Pending' && total > 0 && `(${total})`}
          </button>
          <button
            className={filter === 'Approved' ? 'active' : ''}
            onClick={() => {
              setFilter('Approved');
              setCurrentPage(1);
            }}
          >
            Approved {filter === 'Approved' && total > 0 && `(${total})`}
          </button>
          <button
            className={filter === 'Rejected' ? 'active' : ''}
            onClick={() => {
              setFilter('Rejected');
              setCurrentPage(1);
            }}
          >
            Rejected {filter === 'Rejected' && total > 0 && `(${total})`}
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="no-applications">
            <p>You haven't submitted any applications yet.</p>
            <Link to="/pets">
              <button className="btn-primary">Browse Available Pets</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="applications-list">
              {applications.map((application) => (
                <div key={application._id} className="application-card">
                  <div className="application-pet-info">
                    {application.pet.photos && application.pet.photos.length > 0 ? (
                      <img 
                        src={getImageUrl(application.pet.photos[0])} 
                        alt={application.pet.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23667eea"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="40">🐾</text></svg>';
                        }}
                      />
                    ) : (
                      <div className="no-image">🐾</div>
                    )}
                    <div className="pet-details">
                      <h3>{application.pet.name}</h3>
                      <p>{application.pet.breed} • {application.pet.species}</p>
                      <p className="application-date">
                        Applied: {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="application-status-section">
                    <span className={`status-badge ${application.status.toLowerCase()}`}>
                      {application.status}
                    </span>
                    
                    {application.status === 'Approved' && (
                      <div className="status-message success">
                        🎉 Congratulations! Your application has been approved!
                      </div>
                    )}
                    
                    {application.status === 'Rejected' && application.notes && (
                      <div className="status-message rejected">
                        <strong>Reason:</strong> {application.notes}
                      </div>
                    )}
                    
                    {application.reviewedAt && (
                      <p className="review-date">
                        Reviewed: {new Date(application.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="application-actions">
                    <Link to={`/pets/${application.pet._id}`}>
                      <button className="btn-secondary">View Pet</button>
                    </Link>
                    {application.status === 'Pending' && (
                      <button
                        onClick={() => handleDelete(application._id)}
                        className="btn-danger"
                      >
                        Cancel Application
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary pagination-btn"
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages <= 1}
                className="btn-secondary pagination-btn"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

