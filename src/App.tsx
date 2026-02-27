import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shirt, Phone, User, MapPin, CheckCircle, Globe, Youtube, Facebook, Download, Lock, RefreshCw, CreditCard, Mail } from 'lucide-react';
import './App.css';

function AdminPanel() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/bookings?pw=${encodeURIComponent(password)}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
        setIsLoggedIn(true);
      } else {
        alert('Invalid Password');
      }
    } catch (error) {
      alert('Error fetching data');
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    if (bookings.length === 0) return;
    
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Size', 'Quantity', 'Address', 'Transfer Ref', 'Date'];
    const csvRows = [
      headers.join(','),
      ...bookings.map(b => [
        b.id,
        `"${b.name}"`,
        `"${b.phone}"`,
        `"${b.email || ''}"`,
        b.size,
        b.quantity,
        `"${b.address.replace(/\n/g, ' ')}"`,
        `"${b.transfer_ref || ''}"`,
        b.created_at
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <Lock size={48} />
        <h2>{t('admin_title')}</h2>
        <input 
          type="password" 
          placeholder={t('password')} 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
        />
        <button onClick={fetchBookings} className="submit-btn">{t('login')}</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>{t('admin_title')} ({bookings.length})</h2>
        <div className="admin-actions">
          <button onClick={fetchBookings} className="refresh-btn" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
          </button>
          <button onClick={exportToCSV} className="export-btn">
            <Download size={18} /> {t('export_csv')}
          </button>
        </div>
      </div>

      <div className="bookings-table-wrapper">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('name')}</th>
              <th>{t('order_details')}</th>
              <th>{t('transfer_ref')}</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{new Date(b.created_at).toLocaleDateString()}</td>
                <td>
                  <strong>{b.name}</strong><br/>
                  <small>{b.phone}</small><br/>
                  <small style={{color: 'var(--secondary)'}}>{b.email}</small>
                </td>
                <td>{b.size} x {b.quantity}</td>
                <td><small>{b.transfer_ref}</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main Application Component
function App() {
  const { t, i18n } = useTranslation();
  const isAdmin = window.location.pathname === '/admin';
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
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

  if (isAdmin) {
    return <AdminPanel />;
  }

  if (submitted) {
    return (
      <div className="success-container">
        <CheckCircle size={80} color="#111" strokeWidth={1} />
        <h1>{t('success')}</h1>
        <button onClick={() => setSubmitted(false)} className="submit-btn" style={{ width: 'auto', padding: '16px 40px' }}>Back</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <img src="/logo.png" alt="The Forward Logo" className="logo" />
        </div>
        <div className="lang-switcher">
          <button onClick={() => changeLanguage('th')} title="Thai">
            <img src="https://flagcdn.com/w40/th.png" alt="Thai" width="20" className="flag-icon" />
          </button>
          <button onClick={() => changeLanguage('en')} title="English">
            <img src="https://flagcdn.com/w40/us.png" alt="English" width="20" className="flag-icon" />
          </button>
          <button onClick={() => changeLanguage('de')} title="German">
            <img src="https://flagcdn.com/w40/de.png" alt="German" width="20" className="flag-icon" />
          </button>
          <button onClick={() => changeLanguage('dk')} title="Danish">
            <img src="https://flagcdn.com/w40/dk.png" alt="Danish" width="20" className="flag-icon" />
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <h1>{t('title')}</h1>
          <p className="subtitle">{t('subtitle')}</p>
          <div className="product-info">
            <p className="product-desc">{t('product_desc')}</p>
            <p className="price-tag">
              <CreditCard size={22} strokeWidth={1.5} />
              <strong>{t('price_tag')}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label><User size={16} strokeWidth={2.5} /> {t('name')}</label>
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
            <label><Phone size={16} strokeWidth={2.5} /> {t('phone')}</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone}
              required 
              placeholder={t('phone')} 
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label><Mail size={16} strokeWidth={2.5} /> {t('email')}</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              required 
              placeholder={t('email')} 
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row items-input-row">
            <div className="form-group">
              <label><Shirt size={16} strokeWidth={2.5} /> {t('size')}</label>
              <select 
                name="size" 
                value={currentItem.size} 
                onChange={handleItemChange}
              >
                <option value="">{t('select_size')}</option>
                <option value="M">{t('size_m_desc')}</option>
                <option value="XL">{t('size_xl_desc')}</option>
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
              <p className="no-items" style={{ fontSize: '0.9rem', color: '#999', textAlign: 'center', margin: '10px 0' }}>{t('no_items')}</p>
            ) : (
              <ul className="items-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map((item, index) => (
                  <li key={index} className="item-entry">
                    <span style={{ fontWeight: 500 }}>{t(`size_${item.size.toLowerCase()}_desc`)} x {item.quantity}</span>
                    <button type="button" onClick={() => removeItem(index)} className="remove-btn">
                      {t('remove')}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label><MapPin size={16} strokeWidth={2.5} /> {t('address')}</label>
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
            <Youtube size={20} />
          </a>
          <a href="https://www.facebook.com/TheForwardTH" target="_blank" rel="noopener noreferrer">
            <Facebook size={20} />
          </a>
          <a href="https://thalay.eu/host/theforward" target="_blank" rel="noopener noreferrer">
            <Globe size={20} />
          </a>
        </div>
        <p>© 2026 The Forward. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
