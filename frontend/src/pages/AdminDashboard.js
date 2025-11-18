import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import ImageUpload from '../components/ImageUpload';
import { getImageUrl } from '../utils/imageHelper';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pets');
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPetForm, setShowPetForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [petFormData, setPetFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    size: 'Medium',
    color: '',
    description: '',
    medicalHistory: '',
    vaccinated: false,
    neutered: false,
    status: 'Available',
    photos: [],
    adoptionFee: 0,
    location: ''
  });
  const [photoUrls, setPhotoUrls] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  
  // Pagination states
  const [petCurrentPage, setPetCurrentPage] = useState(1);
  const [petTotalPages, setPetTotalPages] = useState(1);
  
  // Slider state for applications
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all pets including non-available ones for admin with pagination
      // Note: We need to pass 'all' as a special value to get all statuses
      const params = new URLSearchParams({
        page: petCurrentPage,
        limit: 10,
        adminView: 'true' // Special flag for admin to see all statuses
      });
      const { data } = await api.get(`/pets?${params}`);
      setPets(data.data);
      setPetTotalPages(data.pages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [petCurrentPage]);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all applications without pagination
      const { data } = await api.get('/applications');
      setApplications(data.data || data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'pets') {
      fetchPets();
    }
  }, [activeTab, fetchPets]);

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab, fetchApplications]);

  const handlePetFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPetFormData({
      ...petFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePetSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Selected files count:', selectedFiles.length);
      
      // Parse photo URLs
      const photosArray = photoUrls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url !== '');

      const dataToSubmit = {
        ...petFormData,
        photos: photosArray,
        age: parseInt(petFormData.age),
        adoptionFee: parseFloat(petFormData.adoptionFee)
      };

      let petId;
      if (editingPet) {
        await api.put(`/pets/${editingPet._id}`, dataToSubmit);
        petId = editingPet._id;
        
        // If files were selected in edit mode, upload them
        if (selectedFiles.length > 0) {
          console.log('Uploading files in edit mode...');
          await uploadSelectedFiles(petId);
          toast.success(`Pet updated successfully! ${selectedFiles.length} image(s) uploaded.`);
        } else {
          toast.success('Pet updated successfully!');
        }
      } else {
        const response = await api.post('/pets', dataToSubmit);
        petId = response.data.data._id;
        console.log('Pet created with ID:', petId);
        
        // If files were selected, upload them
        if (selectedFiles.length > 0) {
          console.log('Uploading files in create mode...');
          await uploadSelectedFiles(petId);
          toast.success(`Pet added successfully! ${selectedFiles.length} image(s) uploaded.`);
        } else {
          toast.success('Pet added successfully!');
        }
      }

      resetPetForm();
      setPetCurrentPage(1); // Reset to first page after adding/editing
      fetchPets();
    } catch (err) {
      console.error('Error in handlePetSubmit:', err);
      toast.error(err.response?.data?.message || 'Failed to save pet');
    }
  };

  const uploadSelectedFiles = async (petId) => {
    try {
      console.log('Uploading files:', selectedFiles.length);
      
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        console.log(`Adding file ${index + 1}:`, file.name);
        formData.append('photos', file);
      });

      console.log('Sending upload request to:', `/pets/${petId}/photos`);
      const response = await api.post(`/pets/${petId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Upload response:', response.data);
      return response;
    } catch (err) {
      console.error('Error uploading files:', err);
      console.error('Error response:', err.response?.data);
      toast.error(`Failed to upload images: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setPetFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      size: pet.size,
      color: pet.color || '',
      description: pet.description,
      medicalHistory: pet.medicalHistory || '',
      vaccinated: pet.vaccinated,
      neutered: pet.neutered,
      status: pet.status || 'Available',
      photos: pet.photos || [],
      adoptionFee: pet.adoptionFee,
      location: pet.location || ''
    });
    setPhotoUrls(pet.photos ? pet.photos.join('\n') : '');
    
    // Show existing images as previews
    if (pet.photos && pet.photos.length > 0) {
      // Convert photo URLs to full URLs for preview
      const existingPreviews = pet.photos.map(photo => {
        // If photo is already a full URL, use it; otherwise prepend backend URL
        if (photo.startsWith('http')) {
          return photo;
        }
        return `${process.env.REACT_APP_API_URL.replace('/api', '')}${photo}`;
      });
      setFilePreviews(existingPreviews);
      setSelectedFiles([]); // Clear selected files for edit mode
    } else {
      setFilePreviews([]);
      setSelectedFiles([]);
    }
    
    setShowPetForm(true);
    
    // Scroll to the form section at the top
    setTimeout(() => {
      const formSection = document.querySelector('.pet-form-container');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDeletePet = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await api.delete(`/pets/${id}`);
        toast.success('Pet deleted successfully!');
        // If deleting last item on page and not on page 1, go to previous page
        if (pets.length === 1 && petCurrentPage > 1) {
          setPetCurrentPage(petCurrentPage - 1);
        } else {
          fetchPets();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete pet');
      }
    }
  };

  const resetPetForm = () => {
    setPetFormData({
      name: '',
      species: 'Dog',
      breed: '',
      age: '',
      gender: 'Male',
      size: 'Medium',
      color: '',
      description: '',
      medicalHistory: '',
      vaccinated: false,
      neutered: false,
      status: 'Available',
      photos: [],
      adoptionFee: 0,
      location: ''
    });
    setPhotoUrls('');
    setEditingPet(null);
    setShowPetForm(false);
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Max 5MB per image.`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not an image.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Set selected files
    setSelectedFiles(validFiles);

    // Create previews for new files
    const newPreviews = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          // All files read, now update previews
          if (editingPet && petFormData.photos && petFormData.photos.length > 0) {
            // In edit mode: Keep existing + add new
            const existingPreviews = petFormData.photos.map(photo => {
              if (photo.startsWith('http')) return photo;
              return `${process.env.REACT_APP_API_URL.replace('/api', '')}${photo}`;
            });
            setFilePreviews([...existingPreviews, ...newPreviews]);
          } else {
            // In create mode: Just new files
            setFilePreviews(newPreviews);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFilePreview = (indexToRemove) => {
    // If in edit mode with existing images
    if (editingPet && petFormData.photos && indexToRemove < petFormData.photos.length) {
      // Remove from existing photos
      const updatedPhotos = petFormData.photos.filter((_, index) => index !== indexToRemove);
      setPetFormData({ ...petFormData, photos: updatedPhotos });
      setPhotoUrls(updatedPhotos.join('\n'));
    } else {
      // Remove from newly selected files
      const adjustedIndex = editingPet ? indexToRemove - petFormData.photos.length : indexToRemove;
      setSelectedFiles(prev => prev.filter((_, index) => index !== adjustedIndex));
    }
    
    // Remove from previews
    setFilePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleApplicationAction = async (applicationId, status, notes = '') => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status, notes });
      toast.success(`Application ${status.toLowerCase()} successfully!`);
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update application');
    }
  };

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % applications.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + applications.length) % applications.length);
  };

  // Reset slide when applications change
  useEffect(() => {
    setCurrentSlide(0);
  }, [applications]);

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="admin-tabs">
          <button
            className={activeTab === 'pets' ? 'active' : ''}
            onClick={() => {
              setActiveTab('pets');
              setPetCurrentPage(1);
            }}
          >
            Manage Pets
          </button>
          <button
            className={activeTab === 'applications' ? 'active' : ''}
            onClick={() => setActiveTab('applications')}
          >
            Review Applications
          </button>
        </div>

        {/* Pets Management */}
        {activeTab === 'pets' && (
          <div className="pets-management">
            <div className="section-header">
              <h2>Pets Management</h2>
              <button
                className="btn-primary"
                onClick={() => setShowPetForm(!showPetForm)}
              >
                {showPetForm ? 'Cancel' : '+ Add New Pet'}
              </button>
            </div>

            {showPetForm && (
              <div className="pet-form-container">
                <h3>{editingPet ? 'Edit Pet' : 'Add New Pet'}</h3>
                <form onSubmit={handlePetSubmit} className="pet-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Pet Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={petFormData.name}
                        onChange={handlePetFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Species *</label>
                      <select
                        name="species"
                        value={petFormData.species}
                        onChange={handlePetFormChange}
                        required
                      >
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Breed *</label>
                      <input
                        type="text"
                        name="breed"
                        value={petFormData.breed}
                        onChange={handlePetFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Age (years) *</label>
                      <input
                        type="number"
                        name="age"
                        value={petFormData.age}
                        onChange={handlePetFormChange}
                        min="0"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Gender *</label>
                      <select
                        name="gender"
                        value={petFormData.gender}
                        onChange={handlePetFormChange}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Size *</label>
                      <select
                        name="size"
                        value={petFormData.size}
                        onChange={handlePetFormChange}
                        required
                      >
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Color</label>
                      <input
                        type="text"
                        name="color"
                        value={petFormData.color}
                        onChange={handlePetFormChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={petFormData.description}
                      onChange={handlePetFormChange}
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Medical History</label>
                    <textarea
                      name="medicalHistory"
                      value={petFormData.medicalHistory}
                      onChange={handlePetFormChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Adoption Fee ($)</label>
                      <input
                        type="number"
                        name="adoptionFee"
                        value={petFormData.adoptionFee}
                        onChange={handlePetFormChange}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={petFormData.location}
                        onChange={handlePetFormChange}
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="form-group">
                    <label>Pet Photos</label>
                    
                    <div className="photo-upload-container">
                      <div className="photo-upload-center">
                        <label htmlFor={editingPet ? "pet-images-edit" : "pet-images"} className="choose-images-btn">
                          📷 Choose Images
                          <input
                            id={editingPet ? "pet-images-edit" : "pet-images"}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                          />
                        </label>
                        <p className="upload-hint">Max 5MB per image. Up to 10 images at once.</p>
                      </div>
                      
                      {filePreviews.length > 0 && (
                        <div className="preview-grid">
                          {filePreviews.map((preview, index) => {
                            const isExisting = editingPet && petFormData.photos && index < petFormData.photos.length;
                            return (
                              <div key={index} className={`preview-item ${isExisting ? 'existing-image' : ''}`}>
                                <img src={preview} alt={`Preview ${index + 1}`} />
                                {isExisting && (
                                  <div className="existing-badge">Existing</div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeFilePreview(index)}
                                  className="remove-preview-btn"
                                  title={isExisting ? "Remove existing image" : "Remove image"}
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {editingPet && petFormData.photos && petFormData.photos.length > 0 && (
                        <p className="upload-info" style={{ color: '#667eea', fontWeight: '500' }}>
                          📂 {petFormData.photos.length} existing image(s)
                        </p>
                      )}
                      
                      {selectedFiles.length > 0 && (
                        <p className="upload-success">
                          ✓ {selectedFiles.length} new image(s) selected
                        </p>
                      )}
                      
                      <p className="upload-info">
                        <span className="info-icon">💡</span> {editingPet ? 'Existing images shown above. Select new images to add more.' : 'Select images to upload with this pet.'}
                      </p>
                    </div>
                  </div>

                  <div className="checkbox-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="vaccinated"
                        checked={petFormData.vaccinated}
                        onChange={handlePetFormChange}
                      />
                      Vaccinated
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="neutered"
                        checked={petFormData.neutered}
                        onChange={handlePetFormChange}
                      />
                      Neutered/Spayed
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Pet Status *</label>
                    <select
                      name="status"
                      value={petFormData.status}
                      onChange={handlePetFormChange}
                      required
                      className="status-select"
                    >
                      <option value="Available">Available</option>
                      <option value="Pending">Pending</option>
                      <option value="Adopted">Adopted</option>
                    </select>
                    <small className="form-hint">
                      💡 Note: Status is automatically managed by applications. Change manually if needed.
                    </small>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      {editingPet ? 'Update Pet' : 'Add Pet'}
                    </button>
                    <button type="button" onClick={resetPetForm} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="loading">Loading pets...</div>
            ) : (
              <div className="pets-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Species</th>
                      <th>Breed</th>
                      <th>Age</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pets.map((pet) => (
                      <tr key={pet._id}>
                        <td>
                          {pet.photos && pet.photos.length > 0 ? (
                            <img src={getImageUrl(pet.photos[0])} alt={pet.name} className="table-image" />
                          ) : (
                            <div className="table-no-image">🐾</div>
                          )}
                        </td>
                        <td>{pet.name}</td>
                        <td>{pet.species}</td>
                        <td>{pet.breed}</td>
                        <td>{pet.age} yrs</td>
                        <td>
                          <span className={`status-badge ${pet.status.toLowerCase()}`}>
                            {pet.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() => handleEditPet(pet)}
                              className="btn-edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePet(pet._id)}
                              className="btn-delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination for Pets */}
                <div className="pagination">
                  <button
                    onClick={() => setPetCurrentPage(petCurrentPage - 1)}
                    disabled={petCurrentPage === 1}
                    className="btn-secondary pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="page-info">
                    Page {petCurrentPage} of {petTotalPages || 1}
                  </span>
                  <button
                    onClick={() => setPetCurrentPage(petCurrentPage + 1)}
                    disabled={petCurrentPage === petTotalPages || petTotalPages <= 1}
                    className="btn-secondary pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Applications Management */}
        {activeTab === 'applications' && (
          <div className="applications-management">
            <h2>Adoption Applications</h2>

            {loading ? (
              <div className="loading">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="no-data">No applications found.</div>
            ) : (
              <>
                <div className="applications-slider-container">
                  {/* Left Arrow */}
                  {applications.length > 1 && (
                    <button 
                      className="slider-arrow slider-arrow-left" 
                      onClick={prevSlide}
                      aria-label="Previous application"
                    >
                      ❮
                    </button>
                  )}

                  {/* Application Card */}
                  <div className="application-slider-wrapper">
                    <div 
                      className="application-slider-track"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {applications.map((application) => (
                        <div key={application._id} className="application-slide">
                          <div className="application-admin-card">
                            <div className="application-header">
                              <div className="applicant-info">
                                <h3>{application.applicant.name}</h3>
                                <p>{application.applicant.email}</p>
                                <p>{application.applicantInfo.phone}</p>
                              </div>
                              <span className={`status-badge ${application.status.toLowerCase()}`}>
                                {application.status}
                              </span>
                            </div>

                            <div className="pet-summary">
                              <strong>Pet:</strong> {application.pet.name} ({application.pet.species})
                            </div>

                            <div className="application-details">
                              <div className="detail-item">
                                <strong>Address:</strong> {application.applicantInfo.address}
                              </div>
                              <div className="detail-item">
                                <strong>Housing:</strong> {application.applicantInfo.housingType}
                              </div>
                              <div className="detail-item">
                                <strong>Has Yard:</strong> {application.applicantInfo.hasYard ? 'Yes' : 'No'}
                              </div>
                              <div className="detail-item">
                                <strong>Has Pets:</strong> {application.applicantInfo.hasPets ? 'Yes' : 'No'}
                              </div>
                              {application.applicantInfo.hasPets && application.applicantInfo.petsDescription && (
                                <div className="detail-item">
                                  <strong>Pets:</strong> {application.applicantInfo.petsDescription}
                                </div>
                              )}
                              <div className="detail-item">
                                <strong>Experience:</strong> {application.applicantInfo.experience}
                              </div>
                              <div className="detail-item">
                                <strong>Reason:</strong> {application.applicantInfo.reason}
                              </div>
                            </div>

                            <div className="application-meta">
                              <p>Applied: {new Date(application.createdAt).toLocaleString()}</p>
                              {application.reviewedAt && (
                                <p>Reviewed: {new Date(application.reviewedAt).toLocaleString()}</p>
                              )}
                            </div>

                            {application.status === 'Pending' && (
                              <div className="application-admin-actions">
                                <button
                                  onClick={() => handleApplicationAction(application._id, 'Approved')}
                                  className="btn-approve"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    const notes = prompt('Enter rejection reason (optional):');
                                    handleApplicationAction(application._id, 'Rejected', notes || '');
                                  }}
                                  className="btn-reject"
                                >
                                  Reject
                                </button>
                              </div>
                            )}

                            {application.notes && (
                              <div className="admin-notes">
                                <strong>Notes:</strong> {application.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Arrow */}
                  {applications.length > 1 && (
                    <button 
                      className="slider-arrow slider-arrow-right" 
                      onClick={nextSlide}
                      aria-label="Next application"
                    >
                      ❯
                    </button>
                  )}
                </div>

                {/* Slider Indicator */}
                {applications.length > 1 && (
                  <div className="slider-indicator">
                    <span className="slide-counter">
                      {currentSlide + 1} / {applications.length}
                    </span>
                    <div className="slider-dots">
                      {applications.map((_, index) => (
                        <button
                          key={index}
                          className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                          onClick={() => setCurrentSlide(index)}
                          aria-label={`Go to application ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

