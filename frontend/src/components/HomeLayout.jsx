import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* --- TOP BAR (Toujours utile pour les infos) --- */
export const TopBar = () => (
  <div className="top-bar">
    <span>LIVRAISON OFFERTE DÈS 100€ • ÉLÉGANCE CONNECTÉE</span>
  </div>
);

/* --- NAVBAR UNIFIÉE ET PROFESSIONNELLE --- */
export const Navbar = ({ userName, onLogout, onContact, onCartToggle, onLoginClick, onSignupClick }) => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCount(cart.length);
    };

    updateCount();
    window.addEventListener('cartUpdated', updateCount);
    // Support for multiple tabs
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return (
    <div className="nav-wrapper-fixed">
      <nav className="main-navbar-new">
        {/* Logo */}
        <div className="nav-logo-new" onClick={() => navigate('/')}>
          SMART<span>SHOP</span>
        </div>

        {/* Liens principaux */}
        <div className="nav-links-group">
          <button className="nav-btn-pro" onClick={() => navigate('/')}>Home</button>
          <button className="nav-btn-pro" onClick={() => navigate('/shop')}>Shop IA</button>
          <button className="nav-btn-pro" onClick={onContact}>Contact</button>
        </div>

        {/* Espace Utilisateur & Panier */}
        <div className="nav-actions-right">
          {userName ? (
            <div className="nav-user-wrapper" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div className="nav-user-pill" onClick={() => navigate('/profile')} style={{ cursor: 'pointer', position: 'relative' }}>
                <span className="gold-accent-text" style={{ fontSize: '0.6rem', position: 'absolute', top: '-15px', left: '15px', letterSpacing: '2px' }}>STUDIO MEMBER</span>
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                <span><strong>{userName}</strong></span>
              </div>
              <button className="nav-btn-pro" onClick={onLogout} style={{ opacity: 0.4, padding: '5px 10px' }}>Quitter</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="nav-btn-pro" onClick={onLoginClick}>Login</button>
              <button className="nav-btn-pro active" onClick={onSignupClick}>S'inscrire</button>
            </div>
          )}

          {/* Panier (Drawer Trigger) - Only visible if logged in */}
          {userName && (
            <div className="cart-icon-pro" onClick={onCartToggle} title="Accéder au Panier (Tiroir)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {count > 0 && <span className="cart-badge-new">{count}</span>}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

/* --- FOOTER --- */
export const Footer = ({ onContact }) => (
  <footer className="main-footer">
    <div className="footer-links">
      <span onClick={onContact}>Nous Contacter</span>
      <span>Mentions Légales</span>
    </div>
    <div className="footer-copy">
      © 2026 SmartShop Studio.
    </div>
  </footer>
);