import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils/imageHelper';
import './PetList.css';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    species: '',
    gender: '',
    size: '',
    minAge: '',
    maxAge: ''
  });

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/pets?${params}`
      );

      setPets(data.data);
      setTotalPages(data.pages);
      setLoading(false);
    } catch (err) {
      setError('Failed to load pets');
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPets();
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      species: '',
      gender: '',
      size: '',
      minAge: '',
      maxAge: ''
    });
    setCurrentPage(1);
  };

  const handleImageError = (petId) => {
    setImageLoadErrors(prev => ({ ...prev, [petId]: true }));
  };

  const getSpeciesEmoji = (species) => {
    const emojis = {
      'Dog': '🐕',
      'Cat': '🐈',
      'Bird': '🦜',
      'Rabbit': '🐰',
      'Other': '🐾'
    };
    return emojis[species] || '🐾';
  };

  if (loading && pets.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading adorable pets...</p>
      </div>
    );
  }

  return (
    <div className="pet-list-container">
      <div className="container">
        <h1 className="page-title">Available Pets for Adoption</h1>

        {/* Filters Section */}
        <div className="filters-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              name="search"
              placeholder="Search by name or breed..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>

          <div className="filters-grid">
            <select name="species" value={filters.species} onChange={handleFilterChange}>
              <option value="">All Species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Other">Other</option>
            </select>

            <select name="gender" value={filters.gender} onChange={handleFilterChange}>
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select name="size" value={filters.size} onChange={handleFilterChange}>
              <option value="">All Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>

            <input
              type="number"
              name="minAge"
              placeholder="Min Age"
              value={filters.minAge}
              onChange={handleFilterChange}
              min="0"
            />

            <input
              type="number"
              name="maxAge"
              placeholder="Max Age"
              value={filters.maxAge}
              onChange={handleFilterChange}
              min="0"
            />

            <button type="button" onClick={resetFilters} className="btn-secondary">
              Reset Filters
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <div className="no-results">
            <p>No pets found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="pets-grid">
              {pets.map((pet) => (
                <Link to={`/pets/${pet._id}`} key={pet._id} className="pet-card-link">
                  <div className="pet-card">
                    <div className="pet-image-container">
                      {pet.photos && pet.photos.length > 0 && !imageLoadErrors[pet._id] ? (
                        <img 
                          src={getImageUrl(pet.photos[0])} 
                          alt={pet.name}
                          className="pet-image"
                          onError={() => handleImageError(pet._id)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="no-image">
                          <span className="no-image-icon">{getSpeciesEmoji(pet.species)}</span>
                          <span className="no-image-text">No Photo</span>
                        </div>
                      )}
                      <span className={`pet-status ${pet.status.toLowerCase()}`}>
                        {pet.status}
                      </span>
                      {pet.photos && pet.photos.length > 1 && (
                        <span className="photo-count">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                          </svg>
                          {pet.photos.length}
                        </span>
                      )}
                    </div>
                    <div className="pet-info">
                      <h3 className="pet-name">{pet.name}</h3>
                      <p className="pet-breed">{pet.breed}</p>
                      <div className="pet-details">
                        <span className="detail-item">
                          <span className="detail-icon">{getSpeciesEmoji(pet.species)}</span>
                          {pet.species}
                        </span>
                        <span className="detail-item">
                          <span className="detail-icon">{pet.gender === 'Male' ? '♂' : '♀'}</span>
                          {pet.gender}
                        </span>
                        <span className="detail-item">
                          <span className="detail-icon">🎂</span>
                          {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
                        </span>
                      </div>
                      {pet.size && (
                        <div className="pet-size">
                          <span className={`size-badge ${pet.size.toLowerCase()}`}>
                            {pet.size}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary"
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages <= 1}
                className="btn-secondary"
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

export default PetList;

