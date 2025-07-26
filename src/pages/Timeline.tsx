import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTimelineStore, TimelineEvent } from '../store/timelineStore';
import { format } from 'date-fns';
// Test functions removed

const Timeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'performances' | 'homework' | 'charity'>('performances');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  
  const { isAuthenticated, user, hasPermission } = useAuthStore();
  const { addEvent, removeEvent, getEventsByCategory, events } = useTimelineStore();
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    category: 'performances' as TimelineEvent['category'],
    location: '',
    time: '',
    attendees: '',
    performers: '',
    duration: '',
    description: '',
    photos: [] as File[]
  });

  // Debug: Check localStorage and events on component mount
  useEffect(() => {
    console.log('Timeline component mounted');
    console.log('Current events from store:', events);
    console.log('Events in localStorage:', localStorage.getItem('onekey-timeline'));
    
    // Data loss check removed
    
    // Check if events are being loaded from localStorage
    const storedData = localStorage.getItem('onekey-timeline');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        console.log('Parsed localStorage data:', parsed);
        
        // If we have events in localStorage but not in store, there might be a hydration issue
        if (parsed.state?.events?.length > 0 && events.length === 0) {
          console.log('WARNING: Events found in localStorage but not in store!');
          console.log('localStorage events:', parsed.state.events.length);
          console.log('Store events:', events.length);
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
    
    // Force a store refresh to ensure hydration
    const checkStore = () => {
      const currentEvents = getEventsByCategory(activeTab);
      console.log('Current events after hydration check:', currentEvents.length);
    };
    
    // Check after a short delay to allow hydration
    setTimeout(checkStore, 500);
  }, [events, activeTab, getEventsByCategory]);

  // Smooth scrolling animations - Constance style
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          
          // Add staggered animations for child elements
          const children = entry.target.querySelectorAll('.timeline-item, .filter-btn, .timeline-event-card');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Add animation classes to sections
    const animateElements = document.querySelectorAll('.timeline-hero, .timeline-filters, .timeline-content-section');
    
    animateElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      el.classList.add(`animate-delay-${Math.min(index + 1, 5)}`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const categories = [
    { id: 'performances', label: 'Performances', icon: 'fas fa-music' },
    { id: 'homework', label: 'Homework Help', icon: 'fas fa-graduation-cap' },
    { id: 'charity', label: 'Charity Events', icon: 'fas fa-heart' }
  ];

  const currentEvents = getEventsByCategory(activeTab);

  // Debug: Log current events being displayed
  console.log('Current events for category', activeTab, ':', currentEvents);
  console.log('Total events in store:', events.length);

  const handleTabChange = (category: typeof activeTab) => {
    setActiveTab(category);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const createEvent = async () => {
      try {
        let photoUrls: string[] = [];
        
        // Convert photo files to base64 if present
        if (formData.photos.length > 0) {
          console.log('Converting photos to base64...', formData.photos.length, 'files');
          for (const photo of formData.photos) {
            const photoUrl = await convertFileToBase64(photo);
            photoUrls.push(photoUrl);
          }
          console.log('Photos converted successfully:', photoUrls.length, 'photos');
        }

        const newEvent = await addEvent({
          ...formData,
          photo: photoUrls[0] || null, // Keep first photo as main photo for now
          photos: photoUrls, // Store all photos
          createdBy: user.id
        });

        console.log('Event created with photos:', newEvent?.photo ? 'Yes' : 'No', 'Total photos:', photoUrls.length);

        // Backup removed

        setShowAddModal(false);
        setFormData({
          name: '',
          date: '',
          category: 'performances',
          location: '',
          time: '',
          attendees: '',
          performers: '',
          duration: '',
          description: '',
          photos: []
        });
      } catch (error) {
        console.error('Error creating event:', error);
        alert('Failed to create event');
      }
    };

    createEvent();
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        photos: fileArray
      }));
    }
  };

  const handleDelete = async (eventId: string) => {
    await removeEvent(eventId);
    setShowConfirmDelete(null);
  };

  const canManageEvents = isAuthenticated && user && hasPermission('manage_timeline');

  // Debug logging
  console.log('Timeline Debug:', {
    isAuthenticated,
    user: user?.username,
    userRole: user?.role,
    hasPermission: hasPermission('manage_timeline'),
    canManageEvents,
    showAddModal,
    formDataPhotos: formData.photos.length
  });

  return (
    <div className="timeline-page">
      {/* Hero Section - Constance Style */}
      <section className="timeline-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <h1>Our Timeline</h1>
              <p className="hero-subtitle">Explore our journey of community service, performances, and educational initiatives that bridge generations through music</p>
              <div className="hero-accent-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Filters Section */}
      <section className="timeline-filters">
        <div className="container">
          <div className="timeline-header">
            <h2>EXPLORE OUR INITIATIVES</h2>
            <p>Three pillars of community service</p>
          </div>

          {/* Admin Controls */}
          {canManageEvents && (
            <div className="admin-controls">
              <button 
                className="add-event-btn"
                onClick={() => setShowAddModal(true)}
              >
                <i className="fas fa-plus"></i>
                Add New Event
              </button>
              
              {/* Debug buttons removed */}
            </div>
          )}

          {/* Category Filters */}
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${activeTab === category.id ? 'active' : ''}`}
                onClick={() => handleTabChange(category.id as typeof activeTab)}
              >
                <i className={category.icon}></i>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Content Section */}
      <section className="timeline-content-section">
        <div className="container">
          {currentEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className={categories.find(c => c.id === activeTab)?.icon}></i>
              </div>
              <h3>Coming Soon</h3>
              <p>{categories.find(c => c.id === activeTab)?.label} events will be added here soon!</p>
            </div>
          ) : (
            <div className="timeline-list">
              {currentEvents.map(event => (
                <div key={event.id} className="timeline-item">
                  <div className="timeline-date">
                    <span className="month">{format(new Date(event.date), 'MMM')}</span>
                    <span className="day">{format(new Date(event.date), 'd')}</span>
                    <span className="year">{format(new Date(event.date), 'yyyy')}</span>
                  </div>
                  
                  <div className="timeline-connector">
                    <div className="timeline-icon">
                      <i className={categories.find(c => c.id === event.category)?.icon}></i>
                    </div>
                    <div className="timeline-line"></div>
                  </div>
                  
                  <div className="timeline-event-card">
                    <div className="event-header">
                      <h3>{event.name}</h3>
                      {canManageEvents && (
                        <button 
                          className="delete-event-btn"
                          onClick={() => setShowConfirmDelete(event.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                    
                    {event.photo && (
                      <div className="event-photo" style={{
                        marginBottom: '1.5rem',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        background: '#f8f9fa',
                        position: 'relative'
                      }}>
                        <img 
                          src={event.photo} 
                          alt={event.name}
                          style={{ 
                            width: '100%', 
                            height: 'auto',
                            maxHeight: '300px',
                            objectFit: 'contain',
                            display: 'block',
                            transition: 'transform 0.3s ease'
                          }}
                          onError={(e) => {
                            console.error('Failed to load image:', event.photo);
                            console.error('Event:', event);
                            // Hide the image container if image fails to load
                            const container = e.currentTarget.parentElement;
                            if (container) {
                              container.style.display = 'none';
                            }
                          }}
                          onLoad={(e) => {
                            console.log('Image loaded successfully:', event.photo);
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="event-meta">
                      {event.location && (
                        <span className="event-meta-item">
                          <i className="fas fa-map-marker-alt"></i> 
                          {event.location}
                        </span>
                      )}
                      
                      {event.time && (
                        <span className="event-meta-item">
                          <i className="fas fa-clock"></i> 
                          {event.time}
                        </span>
                      )}
                    </div>
                    
                    {event.description && (
                      <p className="event-description">{event.description}</p>
                    )}
                    
                    <div className="event-details">
                      {event.category !== 'homework' && event.attendees && (
                        <span className="detail-item">
                          <i className="fas fa-users"></i> 
                          {event.attendees} attendees
                        </span>
                      )}
                      {event.category !== 'homework' && event.performers && (
                        <span className="detail-item">
                          <i className="fas fa-user-friends"></i> 
                          {event.performers} performers
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-overlay active">
          <div className="modal-content timeline-modal">
            <div className="modal-header">
              <h2>Add New Event</h2>
              <button 
                className="close-modal"
                onClick={() => setShowAddModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="timeline-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Event Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="performances">Performances</option>
                    <option value="homework">Homework Help</option>
                    <option value="charity">Charity Events</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                />
              </div>
              
              {formData.category !== 'homework' && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="attendees">Expected Attendees</label>
                    <input
                      type="number"
                      id="attendees"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleFormChange}
                      min="0"
                      placeholder="Enter number of attendees"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="performers">Performers</label>
                    <input
                      type="number"
                      id="performers"
                      name="performers"
                      value={formData.performers}
                      onChange={handleFormChange}
                      min="0"
                      placeholder="Enter number of performers"
                    />
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={4}
                />
              </div>
              
              {/* Photo Upload Section */}
              <div className="form-group" style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '2px solid #c4ae7b' }}>
                <label htmlFor="photo" style={{ fontWeight: '600', color: '#333', fontSize: '1rem', marginBottom: '0.5rem', display: 'block' }}>
                  EVENT PHOTO(S)
                </label>
                <div style={{
                  border: '2px dashed #c4ae7b',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: '#ffffff',
                  marginTop: '0.5rem'
                }}>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    style={{ 
                      display: 'none'
                    }}
                  />
                  <label 
                    htmlFor="photo"
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 1.5rem',
                      background: '#c4ae7b',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      border: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#b39a6a';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#c4ae7b';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  >
                    Choose Files
                  </label>
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                    Select image files (JPG, PNG, GIF) - Multiple files allowed
                  </p>
                </div>
                {formData.photos.length > 0 && (
                  <div className="photo-preview" style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#ffffff',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666' }}>
                      Photo Preview ({formData.photos.length} file{formData.photos.length > 1 ? 's' : ''} selected):
                    </p>
                    <img 
                      src={URL.createObjectURL(formData.photos[0])} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '250px', 
                        maxHeight: '180px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}
                    />
                    {formData.photos.length > 1 && (
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#666' }}>
                        +{formData.photos.length - 1} more photo{formData.photos.length > 2 ? 's' : ''}
                      </p>
                    )}
                  </div>
                )}
                <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block', textAlign: 'center' }}>
                  Adding a photo helps make your event more engaging
                </small>
              </div>

              <button type="submit" className="timeline-submit-btn">
                <i className="fas fa-plus"></i>
                Add Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal-overlay active">
          <div className="modal-content timeline-modal">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button 
                className="close-modal"
                onClick={() => setShowConfirmDelete(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <p>Are you sure you want to delete this event? This action cannot be undone.</p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowConfirmDelete(null)}
              >
                Cancel
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDelete(showConfirmDelete)}
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline; 