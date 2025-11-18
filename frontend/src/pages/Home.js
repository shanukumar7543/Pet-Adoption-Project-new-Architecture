import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Find Your Perfect Companion</h1>
            <p>Give a loving home to pets in need. Browse our available pets and start your adoption journey today!</p>
            <div className="hero-buttons">
              <Link to="/pets">
                <button className="btn-primary btn-large">Browse Pets</button>
              </Link>
              <Link to="/register">
                <button className="btn-outline btn-large">Get Started</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Adopt With Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🐕</div>
              <h3>Wide Selection</h3>
              <p>Choose from a variety of dogs, cats, birds, and other pets looking for homes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h3>Vetted & Healthy</h3>
              <p>All our pets are vaccinated, neutered, and have complete medical records</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Easy Process</h3>
              <p>Simple application process with quick responses from our team</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Post-Adoption Support</h3>
              <p>We provide ongoing support and guidance after adoption</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Browse Pets</h3>
              <p>Search and filter through our available pets to find your match</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Submit Application</h3>
              <p>Fill out a simple adoption application form</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Review Process</h3>
              <p>Our team reviews your application and gets back to you</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Welcome Home</h3>
              <p>Once approved, welcome your new family member home!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Make a Difference?</h2>
          <p>Start your adoption journey today and give a pet a second chance at happiness</p>
          <Link to="/pets">
            <button className="btn-primary btn-large">View Available Pets</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

