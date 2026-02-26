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
    address: '',
    transferRef: ''
  });
  const [items, setItems] = useState<{ size: string; quantity: number }[]>([]);
  const [currentItem, setCurrentItem] = useState({ size: '', quantity: 1 });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const addItem = () => {
    if (currentItem.size && currentItem.quantity > 0) {
      setItems([...items, { ...currentItem }]);
      setCurrentItem({ size: '', quantity: 1 });
    } else {
      alert('Please select size and quantity');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, items })
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

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) || 0 : value }));
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
          <img src="https://thalay.eu/wp-content/uploads/2021/07/theForwardRectan2.png" alt="The Forward Logo" className="logo" />
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
              value={formData.name}
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
              value={formData.phone}
              required 
              placeholder={t('phone')} 
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row items-input-row">
            <div className="form-group">
              <label><Shirt size={18} /> {t('size')}</label>
              <select 
                name="size" 
                value={currentItem.size} 
                onChange={handleItemChange}
              >
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
                value={currentItem.quantity}
                onChange={handleItemChange}
              />
            </div>
            
            <button type="button" onClick={addItem} className="add-item-btn">
              {t('add_item')}
            </button>
          </div>

          <div className="items-list-container">
            <h3>{t('items_list')}</h3>
            {items.length === 0 ? (
              <p className="no-items">{t('no_items')}</p>
            ) : (
              <ul className="items-list">
                {items.map((item, index) => (
                  <li key={index} className="item-entry">
                    <span>{t(`size_${item.size.toLowerCase()}`)} x {item.quantity}</span>
                    <button type="button" onClick={() => removeItem(index)} className="remove-btn">
                      {t('remove')}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label><MapPin size={18} /> {t('address')}</label>
            <textarea 
              name="address" 
              value={formData.address}
              rows={3} 
              required 
              placeholder={t('address')} 
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>{t('transfer_ref')}</label>
            <input 
              type="text" 
              name="transferRef" 
              value={formData.transferRef}
              placeholder={t('transfer_ref')} 
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={items.length === 0}>
            {t('submit')}
          </button>
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
