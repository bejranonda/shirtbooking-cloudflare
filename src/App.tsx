import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shirt, Phone, User, MapPin, CheckCircle, Globe, Youtube, Facebook, Download, Lock, RefreshCw, CreditCard, Mail, Search, Package, CircleDot, ArrowLeft } from 'lucide-react';
import './App.css';

// Order status types
const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered'] as const;
type OrderStatus = typeof ORDER_STATUSES[number];

// ============================================================
// Order Tracker Component (User-facing)
// ============================================================
function OrderTracker() {
  const { t, i18n } = useTranslation();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/track?phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(name)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    }
    setSearched(true);
    setLoading(false);
  };

  const getStatusIndex = (status: string) => ORDER_STATUSES.indexOf(status as OrderStatus);

  const getStatusIcon = (step: string, currentStatus: string) => {
    const stepIndex = ORDER_STATUSES.indexOf(step as OrderStatus);
    const currentIndex = getStatusIndex(currentStatus);
    if (stepIndex <= currentIndex) {
      return <CheckCircle size={20} className="status-icon done" />;
    }
    return <CircleDot size={20} className="status-icon pending" />;
  };

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
          <Package size={48} strokeWidth={1} />
          <h1>{t('track_title')}</h1>
          <p className="subtitle">{t('track_subtitle')}</p>
        </div>

        <form onSubmit={handleSearch} className="booking-form track-form">
          <div className="form-group">
            <label><User size={16} strokeWidth={2.5} /> {t('track_name')}</label>
            <input
              type="text"
              value={name}
              required
              placeholder={t('track_name')}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label><Phone size={16} strokeWidth={2.5} /> {t('track_phone')}</label>
            <input
              type="tel"
              value={phone}
              required
              placeholder={t('track_phone')}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            <Search size={18} /> {loading ? '...' : t('track_search')}
          </button>
        </form>

        {searched && results !== null && (
          <div className="track-results">
            {results.length === 0 ? (
              <div className="no-results">
                <p>{t('track_no_results')}</p>
              </div>
            ) : (
              <>
                <h2 className="results-title">{t('track_results')}</h2>
                {results.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <span className="order-id">{t('order_id')}{order.id}</span>
                      <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="order-card-body">
                      <p><strong>{order.size}</strong> x {order.quantity}</p>
                    </div>

                    {/* Status Timeline */}
                    <div className="status-timeline">
                      {ORDER_STATUSES.map((step, index) => {
                        const stepIndex = index;
                        const currentIndex = getStatusIndex(order.status || 'pending');
                        const isActive = stepIndex <= currentIndex;
                        const isLast = index === ORDER_STATUSES.length - 1;
                        return (
                          <div key={step} className={`timeline-step ${isActive ? 'active' : ''}`}>
                            <div className="timeline-icon">
                              {getStatusIcon(step, order.status || 'pending')}
                            </div>
                            {!isLast && <div className={`timeline-line ${stepIndex < currentIndex ? 'active' : ''}`} />}
                            <span className="timeline-label">{t(`status_${step}`)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" className="back-link">
            <ArrowLeft size={16} /> {t('back_to_home')}
          </a>
        </div>
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

// ============================================================
// Admin Panel Component
// ============================================================
function AdminPanel() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState<Record<number, string>>({});

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

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, pw: password })
      });
      if (response.ok) {
        // Update local state
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        setStatusUpdates(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      } else {
        alert('Failed to update status');
      }
    } catch {
      alert('Error updating status');
    }
  };

  const exportToCSV = () => {
    if (bookings.length === 0) return;

    const headers = ['ID', 'Name', 'Phone', 'Email', 'Size', 'Quantity', 'Address', 'Transfer Ref', 'Status', 'Date'];
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
        b.status || 'pending',
        b.created_at
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'badge-confirmed';
      case 'shipped': return 'badge-shipped';
      case 'delivered': return 'badge-delivered';
      default: return 'badge-pending';
    }
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
              <th>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{new Date(b.created_at).toLocaleDateString()}</td>
                <td>
                  <strong>{b.name}</strong><br />
                  <small>{b.phone}</small><br />
                  <small style={{ color: 'var(--secondary)' }}>{b.email}</small>
                </td>
                <td>{b.size} x {b.quantity}</td>
                <td><small>{b.transfer_ref}</small></td>
                <td className="status-cell">
                  <span className={`status-badge ${getStatusBadgeClass(b.status || 'pending')}`}>
                    {t(`status_${b.status || 'pending'}`)}
                  </span>
                  <div className="status-update-row">
                    <select
                      value={statusUpdates[b.id] ?? b.status ?? 'pending'}
                      onChange={(e) => setStatusUpdates(prev => ({ ...prev, [b.id]: e.target.value }))}
                      className="status-select"
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s} value={s}>{t(`status_${s}`)}</option>
                      ))}
                    </select>
                    <button
                      className="status-update-btn"
                      onClick={() => updateStatus(b.id, statusUpdates[b.id] ?? b.status ?? 'pending')}
                      disabled={!statusUpdates[b.id] || statusUpdates[b.id] === (b.status || 'pending')}
                    >
                      {t('update_status')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// Main Application Component
// ============================================================
function App() {
  const { t, i18n } = useTranslation();
  const pathname = window.location.pathname;
  const isAdmin = pathname === '/admin';
  const isTrack = pathname === '/track';
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

  if (isTrack) {
    return <OrderTracker />;
  }

  if (submitted) {
    return (
      <div className="success-container">
        <CheckCircle size={80} color="#111" strokeWidth={1} />
        <h1>{t('success')}</h1>
        <div className="success-actions">
          <a href="/track" className="track-link-btn">
            <Package size={18} /> {t('track_your_order')}
          </a>
          <button onClick={() => setSubmitted(false)} className="submit-btn" style={{ width: 'auto', padding: '16px 40px' }}>Back</button>
        </div>
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
