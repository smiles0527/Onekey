// Utility to test localStorage persistence
export const testLocalStorage = () => {
  console.log('=== Testing localStorage Persistence ===');
  
  // Test basic localStorage functionality
  try {
    localStorage.setItem('test-key', 'test-value');
    const retrieved = localStorage.getItem('test-key');
    console.log('Basic localStorage test:', retrieved === 'test-value' ? 'PASSED' : 'FAILED');
    localStorage.removeItem('test-key');
  } catch (error) {
    console.error('localStorage not available:', error);
  }
  
  // Check timeline data
  const timelineData = localStorage.getItem('onekey-timeline');
  console.log('Timeline data in localStorage:', timelineData);
  
  if (timelineData) {
    try {
      const parsed = JSON.parse(timelineData);
      console.log('Parsed timeline data:', parsed);
      console.log('Number of events:', parsed.state?.events?.length || 0);
      
      // Check Zustand persist structure
      if (parsed.state && parsed.state.events) {
        console.log('Events found:', parsed.state.events);
        parsed.state.events.forEach((event: any, index: number) => {
          console.log(`Event ${index + 1}:`, event.name, event.date, event.category);
        });
      } else {
        console.log('No events found in parsed data structure');
      }
    } catch (error) {
      console.error('Error parsing timeline data:', error);
    }
  } else {
    console.log('No timeline data found in localStorage');
  }
  
  // Check auth data
  const authData = localStorage.getItem('onekey-auth');
  console.log('Auth data in localStorage:', authData ? 'EXISTS' : 'NOT FOUND');
  
  // List all localStorage keys
  console.log('All localStorage keys:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      console.log(`- ${key}: ${localStorage.getItem(key)?.substring(0, 100)}...`);
    }
  }
  
  console.log('=== End localStorage Test ===');
};

// Function to manually add a test event to localStorage
export const addTestEvent = () => {
  const testEvent = {
    id: `test-event-${Date.now()}`,
    name: 'Test Event',
    date: new Date().toISOString().split('T')[0],
    category: 'performances' as const,
    location: 'Test Location',
    time: '12:00',
    attendees: '10',
    performers: '5',
    duration: '2 hours',
    description: 'This is a test event to verify persistence',
    photo: null,
    photos: [],
    createdAt: new Date().toISOString(),
    createdBy: 'test-user'
  };
  
  const existingData = localStorage.getItem('onekey-timeline');
  let timelineState;
  
  if (existingData) {
    try {
      timelineState = JSON.parse(existingData);
    } catch (error) {
      console.error('Error parsing existing timeline data:', error);
      timelineState = { state: { events: [] } };
    }
  } else {
    timelineState = { state: { events: [] } };
  }
  
  // Ensure proper structure
  if (!timelineState.state) {
    timelineState.state = {};
  }
  if (!timelineState.state.events) {
    timelineState.state.events = [];
  }
  
  // Add the test event
  timelineState.state.events.push(testEvent);
  
  // Save back to localStorage
  localStorage.setItem('onekey-timeline', JSON.stringify(timelineState));
  console.log('Test event added to localStorage:', testEvent);
  console.log('Updated localStorage data:', localStorage.getItem('onekey-timeline'));
  
  return testEvent;
};

// Function to clear all timeline data
export const clearTimelineData = () => {
  localStorage.removeItem('onekey-timeline');
  console.log('Timeline data cleared from localStorage');
};

// Function to force refresh the page to test persistence
export const testPersistenceWithRefresh = () => {
  console.log('Testing persistence with page refresh...');
  console.log('Current localStorage before refresh:', localStorage.getItem('onekey-timeline'));
  
  // Add a test event
  addTestEvent();
  
  console.log('Added test event, localStorage after add:', localStorage.getItem('onekey-timeline'));
  
  // Prompt user to refresh
  alert('Test event added! Please refresh the page to test persistence. Check the console for results.');
};

// Function to manually sync store with localStorage
export const syncStoreWithLocalStorage = () => {
  console.log('=== Syncing Store with localStorage ===');
  
  const storedData = localStorage.getItem('onekey-timeline');
  if (!storedData) {
    console.log('No timeline data in localStorage to sync');
    return;
  }
  
  try {
    const parsed = JSON.parse(storedData);
    console.log('Found data in localStorage:', parsed);
    
    if (parsed.state?.events) {
      console.log('Events in localStorage:', parsed.state.events.length);
      
      // Force a page reload to rehydrate the store
      console.log('Forcing page reload to rehydrate store...');
      window.location.reload();
    }
  } catch (error) {
    console.error('Error syncing store:', error);
  }
};

// Function to create backup of timeline data
export const backupTimelineData = () => {
  console.log('=== Creating Timeline Data Backup ===');
  
  const timelineData = localStorage.getItem('onekey-timeline');
  if (timelineData) {
    try {
      // Backup to sessionStorage
      sessionStorage.setItem('onekey-timeline-backup', timelineData);
      
      // Backup to additional localStorage key
      localStorage.setItem('onekey-timeline-backup', timelineData);
      
      // Backup individual events
      const parsed = JSON.parse(timelineData);
      if (parsed.state?.events) {
        localStorage.setItem('onekey-timeline-events', JSON.stringify(parsed.state.events));
        console.log(`Backed up ${parsed.state.events.length} events`);
      }
      
      console.log('Timeline data backed up successfully');
    } catch (error) {
      console.error('Error backing up timeline data:', error);
    }
  } else {
    console.log('No timeline data to backup');
  }
};

// Function to restore timeline data from backup
export const restoreTimelineData = () => {
  console.log('=== Restoring Timeline Data from Backup ===');
  
  // Try to restore from various backup sources
  let backupData = null;
  
  // Try sessionStorage first
  backupData = sessionStorage.getItem('onekey-timeline-backup');
  if (backupData) {
    console.log('Found backup in sessionStorage');
    localStorage.setItem('onekey-timeline', backupData);
    return true;
  }
  
  // Try localStorage backup
  backupData = localStorage.getItem('onekey-timeline-backup');
  if (backupData) {
    console.log('Found backup in localStorage');
    localStorage.setItem('onekey-timeline', backupData);
    return true;
  }
  
  // Try individual events backup
  const eventsData = localStorage.getItem('onekey-timeline-events');
  if (eventsData) {
    console.log('Found individual events backup');
    const events = JSON.parse(eventsData);
    const timelineState = {
      state: {
        events: events
      }
    };
    localStorage.setItem('onekey-timeline', JSON.stringify(timelineState));
    return true;
  }
  
  console.log('No backup data found');
  return false;
};

// Function to check for data loss after hard build
export const checkForDataLoss = () => {
  console.log('=== Checking for Data Loss ===');
  
  const currentData = localStorage.getItem('onekey-timeline');
  const backupData = sessionStorage.getItem('onekey-timeline-backup') || 
                    localStorage.getItem('onekey-timeline-backup');
  
  if (!currentData && backupData) {
    console.log('WARNING: Data loss detected! Current data missing but backup exists.');
    console.log('Attempting to restore from backup...');
    return restoreTimelineData();
  }
  
  if (currentData && backupData) {
    try {
      const current = JSON.parse(currentData);
      const backup = JSON.parse(backupData);
      
      const currentEvents = current.state?.events?.length || 0;
      const backupEvents = backup.state?.events?.length || 0;
      
      if (currentEvents < backupEvents) {
        console.log(`WARNING: Data loss detected! Current: ${currentEvents}, Backup: ${backupEvents}`);
        return restoreTimelineData();
      }
    } catch (error) {
      console.error('Error comparing current and backup data:', error);
    }
  }
  
  console.log('No data loss detected');
  return false;
};

// Function to warn about hard build data loss
export const warnAboutHardBuild = () => {
  const timelineData = localStorage.getItem('onekey-timeline');
  if (timelineData) {
    try {
      const parsed = JSON.parse(timelineData);
      const eventCount = parsed.state?.events?.length || 0;
      
      if (eventCount > 0) {
        const message = `⚠️ WARNING: You have ${eventCount} timeline events that will be lost during a hard build!\n\n` +
                       `Click "Backup Data" to create a backup before building.\n` +
                       `After the build, use "Restore Data" to recover your events.`;
        
        alert(message);
        return true;
      }
    } catch (error) {
      console.error('Error checking timeline data:', error);
    }
  }
  return false;
};

// Function to create comprehensive backup before hard build
export const createPreBuildBackup = () => {
  console.log('=== Creating Pre-Build Backup ===');
  
  // Create multiple backups
  backupTimelineData();
  
  // Also create a timestamped backup
  const timelineData = localStorage.getItem('onekey-timeline');
  if (timelineData) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    localStorage.setItem(`onekey-timeline-backup-${timestamp}`, timelineData);
    console.log(`Created timestamped backup: onekey-timeline-backup-${timestamp}`);
  }
  
  alert('✅ Backup created successfully! Your timeline events are now safe from hard build data loss.');
}; 