import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageHelper';
import './PetDetails.css';

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
    housingType: '',
    hasYard: false,
    hasPets: false,
    petsDescription: '',
    experience: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/pets/${id}`
      );
      setPet(data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load pet details');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setApplicationData({
      ...applicationData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/applications', {
        pet: id,
        applicantInfo: applicationData
      });
      setApplicationSuccess(true);
      setShowApplicationForm(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error && !pet) {
    return <div className="error-message text-center mt-3">{error}</div>;
  }

  return (
    <div className="pet-details-container">
      <div className="container">
        {applicationSuccess && (
          <div className="success-banner">
            Application submitted successfully! Redirecting to dashboard...
          </div>
        )}

        <div className="pet-details-card">
          <div className="pet-details-images">
            {pet.photos && pet.photos.length > 0 ? (
              <>
                <div className="main-image">
                  <img 
                    src={getImageUrl(pet.photos[selectedImageIndex])} 
                    alt={pet.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="no-image"><span>🐾</span></div>';
                    }}
                  />
                </div>
                
                {/* Thumbnail Slider */}
                {pet.photos.length > 1 && (
                  <div className="thumbnail-slider">
                    <div className="thumbnail-container">
                      {pet.photos.map((photo, index) => (
                        <div 
                          key={index} 
                          className={`thumbnail-item ${selectedImageIndex === index ? 'active' : ''}`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img 
                            src={getImageUrl(photo)} 
                            alt={`${pet.name} ${index + 1}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<span style="font-size: 20px;">🐾</span>';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="main-image no-image">
                <span>🐾</span>
              </div>
            )}
          </div>

          <div className="pet-details-info">
            <div className="pet-header">
              <h1>{pet.name}</h1>
              <span className={`status-badge ${pet.status.toLowerCase()}`}>
                {pet.status}
              </span>
            </div>

            <div className="pet-specs">
              <div className="spec">
                <strong>Species:</strong> {pet.species}
              </div>
              <div className="spec">
                <strong>Breed:</strong> {pet.breed}
              </div>
              <div className="spec">
                <strong>Age:</strong> {pet.age} years
              </div>
              <div className="spec">
                <strong>Gender:</strong> {pet.gender}
              </div>
              <div className="spec">
                <strong>Size:</strong> {pet.size}
              </div>
              <div className="spec">
                <strong>Color:</strong> {pet.color || 'N/A'}
              </div>
            </div>

            <div className="pet-description">
              <h3>About {pet.name}</h3>
              <p>{pet.description}</p>
            </div>

            {pet.medicalHistory && (
              <div className="medical-info">
                <h3>Medical History</h3>
                <p>{pet.medicalHistory}</p>
              </div>
            )}

            <div className="pet-health">
              <div className="health-item">
                <span className={pet.vaccinated ? 'yes' : 'no'}>
                  {pet.vaccinated ? '✓' : '✗'}
                </span>
                Vaccinated
              </div>
              <div className="health-item">
                <span className={pet.neutered ? 'yes' : 'no'}>
                  {pet.neutered ? '✓' : '✗'}
                </span>
                Neutered/Spayed
              </div>
            </div>

            {pet.adoptionFee > 0 && (
              <div className="adoption-fee">
                <strong>Adoption Fee:</strong> ${pet.adoptionFee}
              </div>
            )}

            {pet.location && (
              <div className="location">
                <strong>📍 Location:</strong> {pet.location}
              </div>
            )}

            {pet.status === 'Available' && (
              <div className="action-buttons">
                {!showApplicationForm ? (
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                      } else {
                        setShowApplicationForm(true);
                        // Scroll to application form
                        setTimeout(() => {
                          const formSection = document.querySelector('.application-form-container');
                          if (formSection) {
                            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100);
                      }
                    }}
                    className="btn-primary btn-large"
                  >
                    Apply to Adopt
                  </button>
                ) : (
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="btn-secondary"
                  >
                    Cancel Application
                  </button>
                )}
              </div>
            )}

            {pet.status === 'Pending' && (
              <div className="status-message">
                This pet has pending adoption applications
              </div>
            )}

            {pet.status === 'Adopted' && (
              <div className="status-message">
                This pet has been adopted
              </div>
            )}
          </div>
        </div>

        {/* Application Form */}
        {showApplicationForm && (
          <div className="application-form-container">
            <h2>Adoption Application for {pet.name}</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleApplicationSubmit} className="application-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={applicationData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Housing Type *</label>
                  <select
                    name="housingType"
                    value={applicationData.housingType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select...</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Condo">Condo</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={applicationData.address}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="hasYard"
                      checked={applicationData.hasYard}
                      onChange={handleInputChange}
                    />
                    I have a yard
                  </label>
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="hasPets"
                      checked={applicationData.hasPets}
                      onChange={handleInputChange}
                    />
                    I have other pets
                  </label>
                </div>
              </div>

              {applicationData.hasPets && (
                <div className="form-group">
                  <label>Please describe your other pets</label>
                  <textarea
                    name="petsDescription"
                    value={applicationData.petsDescription}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Your Experience with Pets *</label>
                <textarea
                  name="experience"
                  value={applicationData.experience}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us about your experience with pets..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Why do you want to adopt {pet.name}? *</label>
                <textarea
                  name="reason"
                  value={applicationData.reason}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us why you want to adopt this pet..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary btn-large"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetDetails;

