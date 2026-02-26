import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shirt, Phone, User, MapPin, CheckCircle, Globe, Youtube, Facebook } from 'lucide-react';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    size: '',
    quantity: 1,
    address: ''
  });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="success-container">
        <CheckCircle size={64} color="#1877F2" />
        <h1>{t('success')}</h1>
        <button onClick={() => setSubmitted(false)} className="btn-primary">Back</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <img src="https://thalay.eu/wp-content/uploads/2021/07/The-Forward-Logo.png" alt="The Forward Logo" className="logo" />
        </div>
        <div className="lang-switcher">
          <button onClick={() => changeLanguage('th')} title="Thai">🇹🇭</button>
          <button onClick={() => changeLanguage('en')} title="English">🇺🇸</button>
          <button onClick={() => changeLanguage('de')} title="German">🇩🇪</button>
          <button onClick={() => changeLanguage('dk')} title="Danish">🇩🇰</button>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <h1>{t('title')}</h1>
          <p className="subtitle">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label><User size={18} /> {t('name')}</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder={t('name')} 
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label><Phone size={18} /> {t('phone')}</label>
            <input 
              type="tel" 
              name="phone" 
              required 
              placeholder={t('phone')} 
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><Shirt size={18} /> {t('size')}</label>
              <select name="size" required onChange={handleInputChange}>
                <option value="">{t('select_size')}</option>
                <option value="S">{t('size_s')}</option>
                <option value="M">{t('size_m')}</option>
                <option value="L">{t('size_l')}</option>
                <option value="XL">{t('size_xl')}</option>
                <option value="XXL">{t('size_xxl')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('quantity')}</label>
              <input 
                type="number" 
                name="quantity" 
                min="1" 
                defaultValue="1" 
                required 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label><MapPin size={18} /> {t('address')}</label>
            <textarea 
              name="address" 
              rows={3} 
              required 
              placeholder={t('address')} 
              onChange={handleInputChange}
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">{t('submit')}</button>
        </form>
      </main>

      <footer className="footer">
        <div className="social-links">
          <a href="https://www.youtube.com/@TheFORWARDTH" target="_blank" rel="noopener noreferrer">
            <Youtube />
          </a>
          <a href="https://www.facebook.com/TheForwardTH" target="_blank" rel="noopener noreferrer">
            <Facebook />
          </a>
          <a href="https://thalay.eu/host/theforward" target="_blank" rel="noopener noreferrer">
            <Globe />
          </a>
        </div>
        <p>© 2026 The Forward. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
