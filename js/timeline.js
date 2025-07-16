// Timeline Page JavaScript - Event Management System

document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in and show controls
    checkAdminStatus();
    
    // Initialize modal functionality
    initializeModal();
    
    // Initialize tab switching
    initializeTabSwitching();
    
    // Initialize animations
    initializeAnimations();
    
    // Load existing events
    loadEvents();
});

// Check admin login status
function checkAdminStatus() {
    const isLoggedIn = localStorage.getItem('onekey_admin_logged_in');
    const adminControls = document.getElementById('adminControls');
    
    console.log('Admin login status:', isLoggedIn);
    console.log('Admin controls element:', adminControls);
    
    if (isLoggedIn === 'true') {
        console.log('Showing admin controls');
        adminControls.style.display = 'flex';
    } else {
        console.log('Hiding admin controls');
        adminControls.style.display = 'none';
    }
}

// Initialize modal functionality
function initializeModal() {
    const addEventBtn = document.getElementById('addEventBtn');
    const addEventModal = document.getElementById('addEventModal');
    const closeAddEvent = document.getElementById('closeAddEvent');
    const cancelEvent = document.getElementById('cancelEvent');
    const eventForm = document.getElementById('eventForm');
    const eventCategory = document.getElementById('eventCategory');
    const conditionalFields = document.getElementById('conditionalFields');
    
    // Open modal
    addEventBtn.addEventListener('click', function() {
        openModal(addEventModal);
    });
    
    // Close modal
    closeAddEvent.addEventListener('click', function() {
        closeModal(addEventModal);
    });
    
    cancelEvent.addEventListener('click', function() {
        closeModal(addEventModal);
    });
    
    // Close modal when clicking outside
    addEventModal.addEventListener('click', function(e) {
        if (e.target === addEventModal) {
            closeModal(addEventModal);
        }
    });
    
    // Show/hide conditional fields based on category
    eventCategory.addEventListener('change', function() {
        const category = this.value;
        if (category === 'performances' || category === 'charity') {
            conditionalFields.style.display = 'block';
        } else {
            conditionalFields.style.display = 'none';
        }
    });
    
    // Handle form submission
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewEvent();
    });
    
    // Handle ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && addEventModal.classList.contains('active')) {
            closeModal(addEventModal);
        }
    });
}

// Modal utility functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 300);
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    const form = modal.querySelector('form');
    if (form) form.reset();
    
    // Hide conditional fields
    const conditionalFields = document.getElementById('conditionalFields');
    if (conditionalFields) conditionalFields.style.display = 'none';
}

// Add new event function
function addNewEvent() {
    const form = document.getElementById('eventForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Add loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Adding Event...';
    
    // Collect form data
    const eventData = {
        id: Date.now().toString(),
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        category: document.getElementById('eventCategory').value,
        location: document.getElementById('eventLocation').value || '',
        time: document.getElementById('eventTime').value || '',
        attendees: document.getElementById('eventAttendees').value || '',
        performers: document.getElementById('eventPerformers').value || '',
        duration: document.getElementById('eventDuration').value || '',
        description: document.getElementById('eventDescription').value || '',
        photo: null // For now, we'll handle photos later
    };
    
    // Simulate processing time
    setTimeout(() => {
        // Save to localStorage
        saveEvent(eventData);
        
        // Add to timeline
        addEventToTimeline(eventData);
        
        // Close modal
        closeModal(document.getElementById('addEventModal'));
        
        // Show success message
        showSuccessMessage('Event added successfully!');
        
        // Reset submit button
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Add Event';
        
        // Switch to the appropriate tab to show the new event
        switchToTab(eventData.category);
        
    }, 1000);
}

// Save event to localStorage
function saveEvent(eventData) {
    let events = JSON.parse(localStorage.getItem('onekey_events') || '[]');
    events.push(eventData);
    localStorage.setItem('onekey_events', JSON.stringify(events));
}

// Load events from localStorage
function loadEvents() {
    const events = JSON.parse(localStorage.getItem('onekey_events') || '[]');
    events.forEach(event => {
        addEventToTimeline(event, false); // false = don't animate on load
    });
}

// Add event to timeline
function addEventToTimeline(eventData, animate = true) {
    const category = eventData.category;
    const sectionId = category === 'performances' ? 'performances-section' : 
                     category === 'homework' ? 'homework-section' : 'charity-section';
    
    const section = document.getElementById(sectionId);
    
    // Remove empty state if it exists
    const emptyState = section.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    // Create or get timeline list
    let timelineList = section.querySelector('.timeline-list');
    if (!timelineList) {
        timelineList = document.createElement('div');
        timelineList.className = 'timeline-list';
        section.appendChild(timelineList);
    }
    
    // Create event element
    const eventElement = createEventElement(eventData);
    
    if (animate) {
        eventElement.style.opacity = '0';
        eventElement.style.transform = 'translateY(30px)';
    }
    
    // Insert event in chronological order
    insertEventInOrder(timelineList, eventElement, eventData.date);
    
    if (animate) {
        // Animate in
        setTimeout(() => {
            eventElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            eventElement.style.opacity = '1';
            eventElement.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Create event element
function createEventElement(eventData) {
    const eventDate = new Date(eventData.date);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const eventElement = document.createElement('div');
    eventElement.className = 'timeline-item';
    eventElement.setAttribute('data-event-id', eventData.id);
    
    // Determine icon based on category
    const icons = {
        'performances': 'fas fa-music',
        'homework': 'fas fa-graduation-cap',
        'charity': 'fas fa-heart'
    };
    
    const icon = icons[eventData.category] || 'fas fa-calendar';
    
    eventElement.innerHTML = `
        <div class="timeline-date">
            <span class="month">${monthNames[eventDate.getMonth()]}</span>
            <span class="day">${eventDate.getDate()}</span>
            <span class="year">${eventDate.getFullYear()}</span>
        </div>
        <div class="timeline-icon">
            <i class="${icon}"></i>
        </div>
        <div class="timeline-content">
            <h3>${eventData.name}</h3>
            ${eventData.location ? `<p class="event-location"><i class="fas fa-map-marker-alt"></i> ${eventData.location}</p>` : ''}
            ${eventData.time ? `<p class="event-time"><i class="fas fa-clock"></i> ${eventData.time}</p>` : ''}
            ${eventData.description ? `<p class="event-description">${eventData.description}</p>` : ''}
            
            <div class="event-details">
                ${eventData.attendees ? `<span class="detail-item"><i class="fas fa-users"></i> ${eventData.attendees} attendees</span>` : ''}
                ${eventData.performers ? `<span class="detail-item"><i class="fas fa-user-friends"></i> ${eventData.performers} ${eventData.category === 'homework' ? 'volunteers' : 'performers'}</span>` : ''}
                ${eventData.duration ? `<span class="detail-item"><i class="fas fa-hourglass-half"></i> ${eventData.duration}</span>` : ''}
            </div>
            
            <div class="event-actions">
                <button class="edit-event-btn" onclick="editEvent('${eventData.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-event-btn" onclick="deleteEvent('${eventData.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    return eventElement;
}

// Insert event in chronological order (newest first)
function insertEventInOrder(timelineList, eventElement, eventDate) {
    const existingEvents = timelineList.querySelectorAll('.timeline-item');
    let inserted = false;
    
    for (let i = 0; i < existingEvents.length; i++) {
        const existingEvent = existingEvents[i];
        const existingDate = getEventDate(existingEvent);
        
        if (new Date(eventDate) > new Date(existingDate)) {
            timelineList.insertBefore(eventElement, existingEvent);
            inserted = true;
            break;
        }
    }
    
    if (!inserted) {
        timelineList.appendChild(eventElement);
    }
}

// Get event date from timeline item
function getEventDate(eventElement) {
    const eventId = eventElement.getAttribute('data-event-id');
    const events = JSON.parse(localStorage.getItem('onekey_events') || '[]');
    const event = events.find(e => e.id === eventId);
    return event ? event.date : '';
}

// Delete event function
function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        // Remove from localStorage
        let events = JSON.parse(localStorage.getItem('onekey_events') || '[]');
        events = events.filter(event => event.id !== eventId);
        localStorage.setItem('onekey_events', JSON.stringify(events));
        
        // Remove from DOM
        const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
        if (eventElement) {
            eventElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            eventElement.style.opacity = '0';
            eventElement.style.transform = 'translateX(-100px)';
            
            setTimeout(() => {
                eventElement.remove();
                checkForEmptyState();
            }, 300);
        }
        
        showSuccessMessage('Event deleted successfully!');
    }
}

// Edit event function (for future implementation)
function editEvent(eventId) {
    // For now, just show a message
    alert('Edit functionality coming soon!');
}

// Check if sections need empty state
function checkForEmptyState() {
    const sections = ['performances-section', 'homework-section', 'charity-section'];
    const emptyMessages = {
        'performances-section': { icon: 'fas fa-music', text: 'Performance events will be added here soon!' },
        'homework-section': { icon: 'fas fa-graduation-cap', text: 'Homework help events will be added here soon!' },
        'charity-section': { icon: 'fas fa-heart', text: 'Charity events will be added here soon!' }
    };
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const timelineList = section.querySelector('.timeline-list');
        
        if (!timelineList || timelineList.children.length === 0) {
            if (timelineList) timelineList.remove();
            
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="${emptyMessages[sectionId].icon}"></i>
                <p>${emptyMessages[sectionId].text}</p>
            `;
            section.appendChild(emptyState);
        }
    });
}

// Switch to specific tab
function switchToTab(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sections = {
        'performances': document.getElementById('performances-section'),
        'homework': document.getElementById('homework-section'),
        'charity': document.getElementById('charity-section')
    };
    
    // Update buttons
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        }
    });
    
    // Show appropriate section
    Object.values(sections).forEach(section => {
        section.style.display = 'none';
    });
    
    if (sections[category]) {
        sections[category].style.display = 'block';
        sections[category].style.animation = 'fadeInUp 0.5s ease forwards';
    }
}

// Show success message
function showSuccessMessage(message) {
    // Remove existing messages
    document.querySelectorAll('.success-message').forEach(msg => msg.remove());
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = 'success-message';
    messageElement.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Style the message
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease forwards;
    `;
    
    document.body.appendChild(messageElement);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        messageElement.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => messageElement.remove(), 300);
    }, 3000);
}

// Initialize tab switching functionality
function initializeTabSwitching() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sections = {
        'performances': document.getElementById('performances-section'),
        'homework': document.getElementById('homework-section'),
        'charity': document.getElementById('charity-section')
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            switchToTab(filter);
        });
    });
}

// Initialize animations
function initializeAnimations() {
    const sections = document.querySelectorAll('.timeline-container');
    
    // Scroll animation observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Interactive hover effects for empty states
    document.querySelectorAll('.empty-state').forEach(state => {
        state.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.15)';
        });
        
        state.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
        });
    });
}

// Add CSS for animations
const timelineAnimationsCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .modal-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-content {
        background: white;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: scale(0.9) translateY(30px);
        transition: all 0.3s ease;
    }
    
    .modal-overlay.active .modal-content {
        transform: scale(1) translateY(0);
    }
    
    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e0e6ed;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h2 {
        margin: 0;
        color: #2c3e50;
        font-family: 'Spectral', serif;
        font-size: 1.5rem;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #5a6c7d;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .close-modal:hover {
        background: rgba(0, 0, 0, 0.1);
        color: #2c3e50;
    }
`;

// Inject animations CSS
const style = document.createElement('style');
style.textContent = timelineAnimationsCSS;
document.head.appendChild(style); 