// Enhanced Persistence Test Utility with Server Shutdown and Debug Support
interface DebugLevel {
  ERROR: 0;
  WARN: 1;
  INFO: 2;
  DEBUG: 3;
  TRACE: 4;
}

interface PersistenceHealth {
  localStorage: boolean;
  sessionStorage: boolean;
  networkOnline: boolean;
  tabVisible: boolean;
  storageQuota: number;
  lastBackup: string | null;
}

interface EmergencyBackup {
  timestamp: string;
  data: any;
  reason: string;
  recovery: boolean;
}

class PersistenceDebugger {
  private debugLevel: number = 2; // INFO by default
  private isDebugMode: boolean = false;
  private emergencyBackups: EmergencyBackup[] = [];
  private healthStatus: PersistenceHealth;
  private shutdownListeners: (() => void)[] = [];

  constructor() {
    this.healthStatus = {
      localStorage: this.testStorageAvailability('localStorage'),
      sessionStorage: this.testStorageAvailability('sessionStorage'),
      networkOnline: navigator.onLine,
      tabVisible: !document.hidden,
      storageQuota: 0,
      lastBackup: null
    };
    this.initializeShutdownHandlers();
    this.initializeDebugConsole();
    this.checkStorageQuota();
  }

  // Debug logging with levels
  private log(level: number, message: string, ...args: any[]) {
    if (level <= this.debugLevel) {
      const timestamp = new Date().toISOString();
      const levelName = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'][level];
      const prefix = `[${timestamp}] [${levelName}] [PERSISTENCE]`;
      
      switch (level) {
        case 0: console.error(prefix, message, ...args); break;
        case 1: console.warn(prefix, message, ...args); break;
        case 2: console.info(prefix, message, ...args); break;
        case 3: console.debug(prefix, message, ...args); break;
        case 4: console.trace(prefix, message, ...args); break;
      }
    }
  }

  // Initialize debug console commands
  private initializeDebugConsole() {
    // Add global debug functions to window for console access
    (window as any).persistenceDebug = {
      setLevel: (level: number) => {
        this.debugLevel = level;
        this.log(2, `Debug level set to ${level}`);
      },
      toggleDebug: () => {
        this.isDebugMode = !this.isDebugMode;
        this.log(2, `Debug mode ${this.isDebugMode ? 'enabled' : 'disabled'}`);
        return this.isDebugMode;
      },
      getHealth: () => {
        this.updateHealthStatus();
        return this.healthStatus;
      },
      getEmergencyBackups: () => this.emergencyBackups,
      exportData: () => this.exportDebugData(),
      importData: (data: string) => this.importDebugData(data),
      testShutdown: () => this.simulateShutdown(),
      clearAllData: () => this.clearAllPersistenceData(),
      forceBackup: () => this.createEmergencyBackup('manual', false),
      
      // Backup management functions
      listBackups: () => this.listAllBackups(),
      viewBackup: (id: string) => this.viewBackupDetails(id),
      compareBackups: (id1: string, id2: string) => this.compareBackups(id1, id2),
      restoreFromBackup: (id: string) => this.restoreSpecificBackup(id),
      deleteBackup: (id: string) => this.deleteSpecificBackup(id),
      backupManager: () => this.showBackupManager()
    };

    this.log(2, 'Debug console initialized. Use persistenceDebug.* commands');
  }

  // Initialize shutdown and error handlers
  private initializeShutdownHandlers() {
    // Handle page unload (user closing tab/browser)
    window.addEventListener('beforeunload', (event) => {
      this.log(1, 'Page unload detected, creating emergency backup');
      this.createEmergencyBackup('beforeunload', false);
    });

    // Handle page visibility changes (tab switching, minimizing)
    document.addEventListener('visibilitychange', () => {
      this.healthStatus.tabVisible = !document.hidden;
      if (document.hidden) {
        this.log(3, 'Tab hidden, creating backup');
        this.createEmergencyBackup('visibility_hidden', false);
      } else {
        this.log(3, 'Tab visible, checking for recovery');
        this.checkForRecovery();
      }
    });

    // Handle network status changes
    window.addEventListener('online', () => {
      this.healthStatus.networkOnline = true;
      this.log(2, 'Network online, checking data integrity');
      this.checkForRecovery();
    });

    window.addEventListener('offline', () => {
      this.healthStatus.networkOnline = false;
      this.log(1, 'Network offline, creating backup');
      this.createEmergencyBackup('network_offline', false);
    });

    // Handle errors
    window.addEventListener('error', (event) => {
      this.log(0, 'JavaScript error detected', event.error);
      this.createEmergencyBackup('js_error', false);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.log(0, 'Unhandled promise rejection', event.reason);
      this.createEmergencyBackup('promise_rejection', false);
    });

    this.log(2, 'Shutdown handlers initialized');
  }

  private testStorageAvailability(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type];
      const testKey = '__test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      this.log(0, `${type} not available:`, error);
      return false;
    }
  }

  private async checkStorageQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        this.healthStatus.storageQuota = estimate.usage || 0;
        this.log(3, `Storage quota: ${estimate.usage}/${estimate.quota} bytes`);
      } catch (error) {
        this.log(1, 'Could not check storage quota:', error);
      }
    }
  }

  private updateHealthStatus() {
    this.healthStatus.localStorage = this.testStorageAvailability('localStorage');
    this.healthStatus.sessionStorage = this.testStorageAvailability('sessionStorage');
    this.healthStatus.networkOnline = navigator.onLine;
    this.healthStatus.tabVisible = !document.hidden;
    this.checkStorageQuota();
  }

  private createEmergencyBackup(reason: string, recovery: boolean = false) {
    try {
      const timelineData = localStorage.getItem('onekey-timeline');
      const authData = localStorage.getItem('onekey-auth');
      
      const backup: EmergencyBackup = {
        timestamp: new Date().toISOString(),
        data: {
          timeline: timelineData,
          auth: authData,
          health: { ...this.healthStatus }
        },
        reason,
        recovery
      };

      // Store in multiple locations
      sessionStorage.setItem(`emergency-backup-${Date.now()}`, JSON.stringify(backup));
      
      // Keep last 10 emergency backups
      this.emergencyBackups.push(backup);
      if (this.emergencyBackups.length > 10) {
        this.emergencyBackups.shift();
      }

      // Store emergency backups list
      localStorage.setItem('onekey-emergency-backups', JSON.stringify(this.emergencyBackups));
      this.healthStatus.lastBackup = backup.timestamp;

      this.log(recovery ? 2 : 1, `Emergency backup created: ${reason}`, backup);
      
      return backup;
    } catch (error) {
      this.log(0, 'Failed to create emergency backup:', error);
    }
  }

  private checkForRecovery() {
    try {
      // Load emergency backups
      const backupsData = localStorage.getItem('onekey-emergency-backups');
      if (backupsData) {
        this.emergencyBackups = JSON.parse(backupsData);
      }

      // Check if current data is missing but backups exist
      const currentTimeline = localStorage.getItem('onekey-timeline');
      if (!currentTimeline && this.emergencyBackups.length > 0) {
        this.log(1, 'Data loss detected, attempting recovery');
        this.recoverFromEmergencyBackup();
      }

      // Check for session storage backups from other sessions
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('emergency-backup-')) {
          const backupData = sessionStorage.getItem(key);
          if (backupData) {
            try {
              const backup = JSON.parse(backupData);
              this.log(2, 'Found session backup from previous session', backup);
              // Optionally auto-recover or prompt user
            } catch (error) {
              this.log(1, 'Invalid session backup found:', error);
            }
          }
        }
      }
    } catch (error) {
      this.log(0, 'Error during recovery check:', error);
    }
  }

  private recoverFromEmergencyBackup(): boolean {
    if (this.emergencyBackups.length === 0) {
      this.log(1, 'No emergency backups available for recovery');
      return false;
    }

    // Get the most recent backup
    const latestBackup = this.emergencyBackups[this.emergencyBackups.length - 1];
    
    try {
      if (latestBackup.data.timeline) {
        localStorage.setItem('onekey-timeline', latestBackup.data.timeline);
        this.log(2, 'Timeline data recovered from emergency backup');
      }
      
      if (latestBackup.data.auth) {
        localStorage.setItem('onekey-auth', latestBackup.data.auth);
        this.log(2, 'Auth data recovered from emergency backup');
      }

      // Mark this backup as used for recovery
      latestBackup.recovery = true;
      localStorage.setItem('onekey-emergency-backups', JSON.stringify(this.emergencyBackups));

      this.log(2, 'Emergency recovery completed successfully');
      return true;
    } catch (error) {
      this.log(0, 'Emergency recovery failed:', error);
      return false;
    }
  }

  private exportDebugData(): string {
    const debugData = {
      timestamp: new Date().toISOString(),
      health: this.healthStatus,
      emergencyBackups: this.emergencyBackups,
      localStorage: this.getAllLocalStorageData(),
      sessionStorage: this.getAllSessionStorageData(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    const exported = JSON.stringify(debugData, null, 2);
    this.log(2, 'Debug data exported', debugData);
    
    // Also create a downloadable file
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onekey-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    return exported;
  }

  private importDebugData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.log(2, 'Importing debug data', data);
      
      // Optionally restore localStorage data
      if (confirm('Restore localStorage data from import?')) {
        Object.entries(data.localStorage || {}).forEach(([key, value]) => {
          localStorage.setItem(key, value as string);
        });
        this.log(2, 'localStorage data restored from import');
      }
      
      return true;
    } catch (error) {
      this.log(0, 'Failed to import debug data:', error);
      return false;
    }
  }

  private getAllLocalStorageData(): Record<string, string> {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    return data;
  }

  private getAllSessionStorageData(): Record<string, string> {
    const data: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        data[key] = sessionStorage.getItem(key) || '';
      }
    }
    return data;
  }

  private simulateShutdown() {
    this.log(2, 'Simulating shutdown for testing');
    this.createEmergencyBackup('simulated_shutdown', false);
    
    // Simulate various shutdown scenarios
    setTimeout(() => {
      throw new Error('Simulated error for testing');
    }, 1000);
  }

  private clearAllPersistenceData() {
    if (confirm('This will clear ALL persistence data. Are you sure?')) {
      localStorage.clear();
      sessionStorage.clear();
      this.emergencyBackups = [];
      this.log(2, 'All persistence data cleared');
    }
  }

  // Backup management methods
  private listAllBackups() {
    console.info('[BACKUP MANAGER] === All Available Backups ===');
    
    const backups: any[] = [];
    
    // 1. Emergency backups
    this.emergencyBackups.forEach((backup, index) => {
      const eventCount = backup.data.timeline ? 
        (JSON.parse(backup.data.timeline).state?.events?.length || 0) : 0;
      
      backups.push({
        id: `emergency-${index}`,
        type: 'Emergency',
        reason: backup.reason,
        timestamp: backup.timestamp,
        eventCount,
        recovery: backup.recovery,
        size: new Blob([JSON.stringify(backup)]).size
      });
    });

    // 2. Session storage backups
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('backup') || key.includes('timeline'))) {
        try {
          const data = sessionStorage.getItem(key);
          if (data) {
            const parsed = key.includes('emergency-backup-') ? 
              JSON.parse(data) : { state: { events: JSON.parse(data).state?.events || [] } };
            
            const eventCount = parsed.data?.timeline ? 
              (JSON.parse(parsed.data.timeline).state?.events?.length || 0) :
              (parsed.state?.events?.length || 0);

            backups.push({
              id: `session-${key}`,
              type: 'Session',
              key,
              timestamp: key.includes('emergency-backup-') ? 
                parsed.timestamp : 'Unknown',
              eventCount,
              size: new Blob([data]).size
            });
          }
        } catch (error) {
          // Skip invalid backups
        }
      }
    }

    // 3. Local storage backups
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('backup') && key !== 'onekey-emergency-backups') {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            const eventCount = parsed.state?.events?.length || 0;
            
            backups.push({
              id: `local-${key}`,
              type: 'LocalStorage',
              key,
              timestamp: key.includes('backup-') ? 
                key.split('backup-')[1]?.replace(/-/g, ':') : 'Unknown',
              eventCount,
              size: new Blob([data]).size
            });
          }
        } catch (error) {
          // Skip invalid backups
        }
      }
    }

    // Sort by timestamp (newest first)
    backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Display in a nice table format
    console.table(backups.map(backup => ({
      ID: backup.id,
      Type: backup.type,
      Events: backup.eventCount,
      'Size (KB)': (backup.size / 1024).toFixed(2),
      Timestamp: backup.timestamp,
      Reason: backup.reason || 'N/A',
      Used: backup.recovery ? 'YES' : 'NO'
    })));

    console.info(`[BACKUP MANAGER] Found ${backups.length} total backups`);
    console.info('[BACKUP MANAGER] Usage:');
    console.info('• persistenceDebug.viewBackup("backup-id") - View backup details');
    console.info('• persistenceDebug.restoreFromBackup("backup-id") - Restore specific backup');
    console.info('• persistenceDebug.compareBackups("id1", "id2") - Compare two backups');
    console.info('• persistenceDebug.backupManager() - Interactive backup manager');

    return backups;
  }

  private viewBackupDetails(backupId: string) {
    console.info(`[BACKUP MANAGER] === Viewing Backup: ${backupId} ===`);
    
    let backupData = null;
    let metadata = {};

    // Find the backup
    if (backupId.startsWith('emergency-')) {
      const index = parseInt(backupId.split('-')[1]);
      const backup = this.emergencyBackups[index];
      if (backup) {
        backupData = backup.data.timeline;
        metadata = {
          type: 'Emergency',
          reason: backup.reason,
          timestamp: backup.timestamp,
          recovery: backup.recovery,
          health: backup.data.health
        };
      }
    } else if (backupId.startsWith('session-')) {
      const key = backupId.replace('session-', '');
      const data = sessionStorage.getItem(key);
      if (data) {
        if (key.includes('emergency-backup-')) {
          const parsed = JSON.parse(data);
          backupData = parsed.data.timeline;
          metadata = { type: 'Session Emergency', ...parsed };
        } else {
          backupData = data;
          metadata = { type: 'Session', key };
        }
      }
    } else if (backupId.startsWith('local-')) {
      const key = backupId.replace('local-', '');
      backupData = localStorage.getItem(key);
      metadata = { type: 'LocalStorage', key };
    }

    if (!backupData) {
      console.error(`[BACKUP MANAGER] ERROR: Backup not found: ${backupId}`);
      return null;
    }

    try {
      const parsed = JSON.parse(backupData);
      const events = parsed.state?.events || [];
      
      console.info(`[BACKUP MANAGER] Backup Metadata:`, metadata);
      console.info(`[BACKUP MANAGER] Event Count: ${events.length}`);
      console.info(`[BACKUP MANAGER] Data Size: ${(new Blob([backupData]).size / 1024).toFixed(2)} KB`);
      
      if (events.length > 0) {
        console.group('[BACKUP MANAGER] Events Preview');
        events.slice(0, 10).forEach((event: any, index: number) => {
          console.info(`${index + 1}. ${event.name} (${event.date}) - ${event.category}`);
        });
        if (events.length > 10) {
          console.info(`... and ${events.length - 10} more events`);
        }
        console.groupEnd();

        // Event statistics
        const categories = events.reduce((acc: any, event: any) => {
          acc[event.category] = (acc[event.category] || 0) + 1;
          return acc;
        }, {});
        
        console.info('[BACKUP MANAGER] Event Categories:', categories);
      }

      return {
        metadata,
        eventCount: events.length,
        events: events.slice(0, 5), // First 5 events for preview
        categories: events.reduce((acc: any, event: any) => {
          acc[event.category] = (acc[event.category] || 0) + 1;
          return acc;
        }, {}),
        fullData: parsed
      };
      
    } catch (error) {
      console.error('[BACKUP MANAGER] ERROR: Error parsing backup data:', error);
      return null;
    }
  }

  private compareBackups(id1: string, id2: string) {
    console.info(`[BACKUP MANAGER] === Comparing Backups ===`);
    console.info(`Backup 1: ${id1}`);
    console.info(`Backup 2: ${id2}`);
    
    const backup1 = this.viewBackupDetails(id1);
    const backup2 = this.viewBackupDetails(id2);
    
    if (!backup1 || !backup2) {
      console.error('[BACKUP MANAGER] ERROR: One or both backups not found');
      return null;
    }

    const categoriesDiff: Record<string, number> = {};
    
    // Compare categories
    const allCategories = new Set([
      ...Object.keys(backup1.categories),
      ...Object.keys(backup2.categories)
    ]);

    allCategories.forEach(category => {
      const count1 = backup1.categories[category] || 0;
      const count2 = backup2.categories[category] || 0;
      categoriesDiff[category] = count2 - count1;
    });

    const comparison = {
      eventCountDiff: backup2.eventCount - backup1.eventCount,
      timestamp1: (backup1.metadata as any).timestamp,
      timestamp2: (backup2.metadata as any).timestamp,
      sizeDiff: JSON.stringify(backup2.fullData).length - JSON.stringify(backup1.fullData).length,
      categoriesDiff
    };

    console.table({
      'Total Events': {
        [id1]: backup1.eventCount,
        [id2]: backup2.eventCount,
        Difference: comparison.eventCountDiff
      },
      'Data Size (chars)': {
        [id1]: JSON.stringify(backup1.fullData).length,
        [id2]: JSON.stringify(backup2.fullData).length,
        Difference: comparison.sizeDiff
      }
    });

    console.info('[BACKUP MANAGER] Category Differences:', comparison.categoriesDiff);
    console.info(`[BACKUP MANAGER] Recommendation: ${
      comparison.eventCountDiff > 0 ? `Use ${id2} (has more events)` :
      comparison.eventCountDiff < 0 ? `Use ${id1} (has more events)` :
      'Both backups have same event count'
    }`);

    return comparison;
  }

  private restoreSpecificBackup(backupId: string) {
    console.info(`[BACKUP MANAGER] === Restoring from Backup: ${backupId} ===`);
    
    const backupDetails = this.viewBackupDetails(backupId);
    if (!backupDetails) {
      console.error('[BACKUP MANAGER] ERROR: Cannot restore - backup not found');
      return false;
    }

    const currentData = localStorage.getItem('onekey-timeline');
    let currentEventCount = 0;
    if (currentData) {
      try {
        currentEventCount = JSON.parse(currentData).state?.events?.length || 0;
      } catch (error) {
        // Current data is corrupted
      }
    }

    const confirm = window.confirm(
      `WARNING: RESTORE CONFIRMATION\n\n` +
      `Current events: ${currentEventCount}\n` +
      `Backup events: ${backupDetails.eventCount}\n` +
      `Backup timestamp: ${(backupDetails.metadata as any).timestamp}\n\n` +
      `This will REPLACE your current timeline data!\n` +
      `Continue with restore?`
    );

    if (!confirm) {
      console.info('[BACKUP MANAGER] Restore cancelled by user');
      return false;
    }

    // Create backup of current data before restore
    if (currentData) {
      const timestamp = new Date().toISOString();
      sessionStorage.setItem(`pre-restore-backup-${Date.now()}`, currentData);
      console.info('[BACKUP MANAGER] Created backup of current data before restore');
    }

    // Perform the restore
    try {
      const timelineData = JSON.stringify(backupDetails.fullData);
      localStorage.setItem('onekey-timeline', timelineData);
      
      console.info(`[BACKUP MANAGER] Successfully restored ${backupDetails.eventCount} events from ${backupId}`);
      console.info('[BACKUP MANAGER] Refresh the page to see restored data in the UI');
      
      // Mark emergency backup as used if applicable
      if (backupId.startsWith('emergency-')) {
        const index = parseInt(backupId.split('-')[1]);
        if (this.emergencyBackups[index]) {
          this.emergencyBackups[index].recovery = true;
          localStorage.setItem('onekey-emergency-backups', JSON.stringify(this.emergencyBackups));
        }
      }

      return true;
    } catch (error) {
      console.error('[BACKUP MANAGER] ERROR: Restore failed:', error);
      return false;
    }
  }

  private deleteSpecificBackup(backupId: string) {
    console.warn(`[BACKUP MANAGER] === Deleting Backup: ${backupId} ===`);
    
    const confirm = window.confirm(
      `WARNING: DELETE BACKUP CONFIRMATION\n\n` +
      `This will permanently delete backup: ${backupId}\n` +
      `This action cannot be undone!\n\n` +
      `Continue with deletion?`
    );

    if (!confirm) {
      console.info('[BACKUP MANAGER] Deletion cancelled by user');
      return false;
    }

    try {
      if (backupId.startsWith('emergency-')) {
        const index = parseInt(backupId.split('-')[1]);
        if (this.emergencyBackups[index]) {
          this.emergencyBackups.splice(index, 1);
          localStorage.setItem('onekey-emergency-backups', JSON.stringify(this.emergencyBackups));
          console.info('[BACKUP MANAGER] Emergency backup deleted');
          return true;
        }
      } else if (backupId.startsWith('session-')) {
        const key = backupId.replace('session-', '');
        sessionStorage.removeItem(key);
        console.info('[BACKUP MANAGER] Session backup deleted');
        return true;
      } else if (backupId.startsWith('local-')) {
        const key = backupId.replace('local-', '');
        localStorage.removeItem(key);
        console.info('[BACKUP MANAGER] LocalStorage backup deleted');
        return true;
      }
      
      console.error('[BACKUP MANAGER] ERROR: Backup not found');
      return false;
    } catch (error) {
      console.error('[BACKUP MANAGER] ERROR: Error deleting backup:', error);
      return false;
    }
  }

  private showBackupManager() {
    console.info('[BACKUP MANAGER] === Interactive Backup Manager ===');
    console.info('');
    console.info('BACKUP COMMANDS:');
    console.info('   persistenceDebug.listBackups()              - Show all backups');
    console.info('   persistenceDebug.viewBackup("backup-id")    - View backup details');
    console.info('   persistenceDebug.restoreFromBackup("id")    - Restore specific backup');
    console.info('   persistenceDebug.compareBackups("id1","id2") - Compare two backups');
    console.info('   persistenceDebug.deleteBackup("backup-id")  - Delete backup');
    console.info('   persistenceDebug.forceBackup()              - Create new backup');
    console.info('');
    console.info('QUICK ACTIONS:');
    console.info('   1. List all backups → persistenceDebug.listBackups()');
    console.info('   2. View latest → persistenceDebug.viewBackup(persistenceDebug.listBackups()[0].id)');
    console.info('   3. Create backup → persistenceDebug.forceBackup()');
    console.info('');
    
    // Show current status
    const backups = this.listAllBackups();
    const currentData = localStorage.getItem('onekey-timeline');
    const currentEvents = currentData ? 
      (JSON.parse(currentData).state?.events?.length || 0) : 0;
    
    console.info(`CURRENT STATUS:`);
    console.info(`   Current events: ${currentEvents}`);
    console.info(`   Available backups: ${backups.length}`);
    console.info(`   System health: ${this.healthStatus.localStorage ? 'OK' : 'FAILED'} localStorage, ${this.healthStatus.networkOnline ? 'OK' : 'FAILED'} Network`);
    console.info('');
    
    if (backups.length > 0) {
      console.info('TIP: Use persistenceDebug.listBackups() to see all backup IDs');
    } else {
      console.warn('WARNING: No backups found! Consider creating one with persistenceDebug.forceBackup()');
    }
    
    return {
      backupCount: backups.length,
      currentEvents,
      health: this.healthStatus,
      commands: [
        'listBackups()',
        'viewBackup("backup-id")',
        'restoreFromBackup("backup-id")',
        'compareBackups("id1", "id2")',
        'deleteBackup("backup-id")',
        'forceBackup()'
      ]
    };
  }

  // Public API
  public getDebugger() {
    return (window as any).persistenceDebug;
  }

  public testBasicPersistence() {
    this.log(2, '=== Testing Enhanced localStorage Persistence ===');
    
    // Test basic localStorage functionality
    try {
      localStorage.setItem('test-key', 'test-value');
      const retrieved = localStorage.getItem('test-key');
      const testPassed = retrieved === 'test-value';
      this.log(testPassed ? 2 : 0, `Basic localStorage test: ${testPassed ? 'PASSED' : 'FAILED'}`);
      localStorage.removeItem('test-key');
    } catch (error) {
      this.log(0, 'localStorage not available:', error);
    }

    // Update and log health status
    this.updateHealthStatus();
    this.log(2, 'Health Status:', this.healthStatus);
    
    return this.healthStatus;
  }
}

// Create global instance
const persistenceDebugger = new PersistenceDebugger();

// Enhanced test function with detailed analysis
export const testLocalStorage = () => {
  const health = persistenceDebugger.testBasicPersistence();
  
  // Enhanced timeline data analysis
  const timelineData = localStorage.getItem('onekey-timeline');
  console.info('[PERSISTENCE] Timeline data analysis:', timelineData ? 'FOUND' : 'NOT FOUND');
  
  if (timelineData) {
    try {
      const parsed = JSON.parse(timelineData);
      const eventCount = parsed.state?.events?.length || 0;
      console.info('[PERSISTENCE] Timeline events:', eventCount);
      
      if (parsed.state && parsed.state.events) {
        parsed.state.events.forEach((event: any, index: number) => {
          console.debug(`[PERSISTENCE] Event ${index + 1}:`, {
            id: event.id,
            name: event.name,
            date: event.date,
            category: event.category,
            hasPhoto: !!event.photo
          });
        });
      }
    } catch (error) {
      console.error('[PERSISTENCE] Error parsing timeline data:', error);
      persistenceDebugger.getDebugger().forceBackup();
    }
  }
  
  // Enhanced auth data check
  const authData = localStorage.getItem('onekey-auth');
  console.info('[PERSISTENCE] Auth data:', authData ? 'EXISTS' : 'NOT FOUND');
  
  // Storage size analysis
  let totalSize = 0;
  console.group('[PERSISTENCE] Storage Analysis');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      const size = new Blob([value]).size;
      totalSize += size;
      console.info(`${key}: ${(size / 1024).toFixed(2)} KB`);
    }
  }
  console.info(`Total localStorage size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.groupEnd();
  
  return health;
};

// Enhanced function to add test event with backup protection
export const addTestEvent = async () => {
  console.info('[PERSISTENCE] Adding test event...');
  
  // Create backup before modification
  persistenceDebugger.getDebugger().forceBackup();
  
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
  
  try {
    const existingData = localStorage.getItem('onekey-timeline');
    let timelineState;
    
    if (existingData) {
      try {
        timelineState = JSON.parse(existingData);
        console.debug('[PERSISTENCE] Parsed existing timeline data');
      } catch (error) {
        console.error('[PERSISTENCE] Error parsing existing timeline data:', error);
        // Create emergency backup of corrupted data
        sessionStorage.setItem('corrupted-timeline-backup', existingData);
        timelineState = { state: { events: [] } };
      }
    } else {
      console.info('[PERSISTENCE] No existing timeline data, creating new structure');
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
    
    // Save with retry mechanism
    let saveAttempts = 0;
    const maxAttempts = 3;
    
    while (saveAttempts < maxAttempts) {
      try {
        localStorage.setItem('onekey-timeline', JSON.stringify(timelineState));
        console.info('[PERSISTENCE] Test event added successfully:', testEvent.id);
        break;
      } catch (error) {
        saveAttempts++;
        console.warn(`[PERSISTENCE] Save attempt ${saveAttempts} failed:`, error);
        
        if (saveAttempts >= maxAttempts) {
          // Final fallback - save to sessionStorage
          sessionStorage.setItem('onekey-timeline-fallback', JSON.stringify(timelineState));
          throw new Error('Failed to save to localStorage after multiple attempts');
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return testEvent;
  } catch (error) {
    console.error('[PERSISTENCE] Failed to add test event:', error);
    persistenceDebugger.getDebugger().forceBackup();
    throw error;
  }
};

// Enhanced function to clear timeline data with safety checks
export const clearTimelineData = () => {
  console.warn('[PERSISTENCE] Clearing timeline data...');
  
  // Create backup before clearing
  const currentData = localStorage.getItem('onekey-timeline');
  if (currentData) {
    persistenceDebugger.getDebugger().forceBackup();
    sessionStorage.setItem('last-cleared-timeline', currentData);
    console.info('[PERSISTENCE] Backup created before clearing');
  }
  
  localStorage.removeItem('onekey-timeline');
  console.warn('[PERSISTENCE] Timeline data cleared from localStorage');
  
  // Verify clearing was successful
  const verifyCleared = localStorage.getItem('onekey-timeline');
  if (verifyCleared) {
    console.error('[PERSISTENCE] WARNING: Timeline data still exists after clear attempt');
  }
};

// Enhanced refresh test with better monitoring
export const testPersistenceWithRefresh = async () => {
  console.info('[PERSISTENCE] Testing persistence with page refresh...');
  
  const beforeData = localStorage.getItem('onekey-timeline');
  console.info('[PERSISTENCE] Data before test:', beforeData ? 'EXISTS' : 'NONE');
  
  // Create emergency backup
  persistenceDebugger.getDebugger().forceBackup();
  
  try {
    // Add a test event
    const testEvent = await addTestEvent();
    console.info('[PERSISTENCE] Test event added:', testEvent.id);
    
    // Store test reference for verification after refresh
    sessionStorage.setItem('persistence-test-id', testEvent.id);
    sessionStorage.setItem('persistence-test-timestamp', Date.now().toString());
    
    // Enhanced alert with debugging instructions
    const message = `Test event added! 
    
Please refresh the page to test persistence.
After refresh, open console and run:
   • persistenceDebug.getHealth() - Check system health
   • testLocalStorage() - Verify data survived refresh
   
If data is lost, run:
   • persistenceDebug.getEmergencyBackups() - See available backups`;
   
    alert(message);
  } catch (error) {
    console.error('[PERSISTENCE] Failed to add test event:', error);
    alert('FAILED: Failed to add test event. Check console for details.');
  }
};

// Enhanced store sync with error recovery
export const syncStoreWithLocalStorage = () => {
  console.info('[PERSISTENCE] === Syncing Store with localStorage ===');
  
  // Check health first
  const health = persistenceDebugger.getDebugger().getHealth();
  console.info('[PERSISTENCE] System health before sync:', health);
  
  const storedData = localStorage.getItem('onekey-timeline');
  if (!storedData) {
    console.warn('[PERSISTENCE] No timeline data in localStorage to sync');
    
    // Check for emergency backups
    const backups = persistenceDebugger.getDebugger().getEmergencyBackups();
    if (backups.length > 0) {
      console.info('[PERSISTENCE] Found emergency backups, attempting recovery...');
      // Could trigger recovery here
    }
    return;
  }
  
  try {
    const parsed = JSON.parse(storedData);
    const eventCount = parsed.state?.events?.length || 0;
    console.info('[PERSISTENCE] Found events in localStorage:', eventCount);
    
    if (parsed.state?.events) {
      // Log event details for debugging
      console.group('[PERSISTENCE] Event Details');
      parsed.state.events.forEach((event: any, index: number) => {
        console.info(`${index + 1}. ${event.name} (${event.date})`);
      });
      console.groupEnd();
      
      // Create backup before reload
      persistenceDebugger.getDebugger().forceBackup();
      
      console.info('[PERSISTENCE] Forcing page reload to rehydrate store...');
      
      // Add reload reason to sessionStorage for post-reload debugging
      sessionStorage.setItem('reload-reason', 'store-sync');
      sessionStorage.setItem('pre-reload-event-count', eventCount.toString());
      
      window.location.reload();
    }
  } catch (error) {
    console.error('[PERSISTENCE] Error syncing store:', error);
    
    // Try to create backup of corrupted data
    sessionStorage.setItem('corrupted-sync-data', storedData);
    persistenceDebugger.getDebugger().forceBackup();
  }
};

// Enhanced backup function that integrates with debugging system
export const backupTimelineData = () => {
  console.info('[PERSISTENCE] === Creating Enhanced Timeline Data Backup ===');
  
  const timelineData = localStorage.getItem('onekey-timeline');
  if (timelineData) {
    try {
      // Use the enhanced backup system
      persistenceDebugger.getDebugger().forceBackup();
      
      // Additional manual backups for extra safety
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Multiple backup locations
      sessionStorage.setItem('onekey-timeline-backup', timelineData);
      localStorage.setItem('onekey-timeline-backup', timelineData);
      localStorage.setItem(`onekey-timeline-backup-${timestamp}`, timelineData);
      
      // Parse and backup individual components
      const parsed = JSON.parse(timelineData);
      if (parsed.state?.events) {
        localStorage.setItem('onekey-timeline-events', JSON.stringify(parsed.state.events));
        
        // Create metadata backup
        const metadata = {
          eventCount: parsed.state.events.length,
          backupTimestamp: new Date().toISOString(),
          systemHealth: persistenceDebugger.getDebugger().getHealth()
        };
        localStorage.setItem('onekey-backup-metadata', JSON.stringify(metadata));
        
        console.info(`[PERSISTENCE] Backed up ${parsed.state.events.length} events with metadata`);
      }
      
      console.info('[PERSISTENCE] Timeline data backed up successfully to multiple locations');
    } catch (error) {
      console.error('[PERSISTENCE] ERROR: Error backing up timeline data:', error);
      // Still try emergency backup even if manual backup fails
      try {
        sessionStorage.setItem('emergency-manual-backup', timelineData);
        console.warn('[PERSISTENCE] Created emergency fallback backup');
      } catch (fallbackError) {
        console.error('[PERSISTENCE] ERROR: Even emergency backup failed:', fallbackError);
      }
    }
  } else {
    console.warn('[PERSISTENCE] No timeline data to backup');
    
    // Check for emergency backups that could be promoted to main backup
    const emergencyBackups = persistenceDebugger.getDebugger().getEmergencyBackups();
    if (emergencyBackups.length > 0) {
      console.info('[PERSISTENCE] Found emergency backups that could be used');
    }
  }
};

// Enhanced restore function with multiple recovery options
export const restoreTimelineData = () => {
  console.info('[PERSISTENCE] === Restoring Timeline Data from Backup ===');
  
  // First, try the enhanced emergency backup system
  try {
    const emergencyBackups = persistenceDebugger.getDebugger().getEmergencyBackups();
    if (emergencyBackups.length > 0) {
      console.info('[PERSISTENCE] Found emergency backups, using latest');
      const latest = emergencyBackups[emergencyBackups.length - 1];
      if (latest.data.timeline) {
        localStorage.setItem('onekey-timeline', latest.data.timeline);
        console.info('[PERSISTENCE] Restored from emergency backup system');
        return true;
      }
    }
  } catch (error) {
    console.warn('[PERSISTENCE] Could not access emergency backup system:', error);
  }
  
  // Fallback to traditional backup sources
  const backupSources = [
    { key: 'onekey-timeline-backup', location: 'sessionStorage' },
    { key: 'onekey-timeline-backup', location: 'localStorage' },
    { key: 'last-cleared-timeline', location: 'sessionStorage' },
    { key: 'emergency-manual-backup', location: 'sessionStorage' }
  ];
  
  for (const source of backupSources) {
    try {
      const storage = source.location === 'sessionStorage' ? sessionStorage : localStorage;
      const backupData = storage.getItem(source.key);
      
      if (backupData) {
        // Validate backup before restoring
        const parsed = JSON.parse(backupData);
        if (parsed.state?.events || parsed.state) {
          localStorage.setItem('onekey-timeline', backupData);
          console.info(`[PERSISTENCE] Restored from ${source.location}:${source.key}`);
          return true;
        }
      }
    } catch (error) {
      console.warn(`[PERSISTENCE] Failed to restore from ${source.location}:${source.key}`, error);
    }
  }
  
  // Try individual events backup
  try {
    const eventsData = localStorage.getItem('onekey-timeline-events');
    if (eventsData) {
      const events = JSON.parse(eventsData);
      const timelineState = {
        state: { events }
      };
      localStorage.setItem('onekey-timeline', JSON.stringify(timelineState));
      console.info('[PERSISTENCE] Restored from individual events backup');
      return true;
    }
  } catch (error) {
    console.warn('[PERSISTENCE] Failed to restore from events backup:', error);
  }
  
  // Look for timestamped backups
  try {
    const timestampedBackups = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('onekey-timeline-backup-')) {
        timestampedBackups.push(key);
      }
    }
    
    if (timestampedBackups.length > 0) {
      // Sort by timestamp (newest first)
      timestampedBackups.sort().reverse();
      const latestBackup = localStorage.getItem(timestampedBackups[0]);
      
      if (latestBackup) {
        localStorage.setItem('onekey-timeline', latestBackup);
        console.info(`[PERSISTENCE] Restored from timestamped backup: ${timestampedBackups[0]}`);
        return true;
      }
    }
  } catch (error) {
    console.warn('[PERSISTENCE] Failed to check timestamped backups:', error);
  }
  
  console.warn('[PERSISTENCE] WARNING: No backup data found for restoration');
  return false;
};

// Enhanced data loss detection with comprehensive checking
export const checkForDataLoss = () => {
  console.info('[PERSISTENCE] === Enhanced Data Loss Detection ===');
  
  // Check system health first
  const health = persistenceDebugger.getDebugger().getHealth();
  console.info('[PERSISTENCE] System health:', health);
  
  const currentData = localStorage.getItem('onekey-timeline');
  const emergencyBackups = persistenceDebugger.getDebugger().getEmergencyBackups();
  
  // Check for complete data loss
  if (!currentData) {
    console.warn('[PERSISTENCE] WARNING: No current timeline data found!');
    
    if (emergencyBackups.length > 0) {
      console.warn('[PERSISTENCE] Found emergency backups, attempting automatic recovery...');
      return restoreTimelineData();
    }
    
    // Check session storage for recovery clues
    const reloadReason = sessionStorage.getItem('reload-reason');
    if (reloadReason) {
      console.warn(`[PERSISTENCE] Last reload reason: ${reloadReason}`);
      const preReloadCount = sessionStorage.getItem('pre-reload-event-count');
      if (preReloadCount) {
        console.warn(`[PERSISTENCE] Expected ${preReloadCount} events but found none - data loss confirmed`);
      }
    }
    
    return restoreTimelineData();
  }
  
  // Check for partial data loss
  try {
    const current = JSON.parse(currentData);
    const currentEvents = current.state?.events?.length || 0;
    
    // Compare with emergency backups
    if (emergencyBackups.length > 0) {
      const latestBackup = emergencyBackups[emergencyBackups.length - 1];
      if (latestBackup.data.timeline) {
        const backupData = JSON.parse(latestBackup.data.timeline);
        const backupEvents = backupData.state?.events?.length || 0;
        
        if (currentEvents < backupEvents) {
          console.warn(`[PERSISTENCE] WARNING: Partial data loss! Current: ${currentEvents}, Backup: ${backupEvents}`);
          console.info('[PERSISTENCE] Attempting restoration...');
          return restoreTimelineData();
        }
      }
    }
    
    // Compare with metadata backup
    const metadata = localStorage.getItem('onekey-backup-metadata');
    if (metadata) {
      try {
        const meta = JSON.parse(metadata);
        if (meta.eventCount > currentEvents) {
          console.warn(`[PERSISTENCE] WARNING: Data loss detected via metadata! Expected: ${meta.eventCount}, Current: ${currentEvents}`);
          return restoreTimelineData();
        }
      } catch (error) {
        console.warn('[PERSISTENCE] Could not parse backup metadata:', error);
      }
    }
    
    // Check session indicators
    const testId = sessionStorage.getItem('persistence-test-id');
    if (testId) {
      const hasTestEvent = current.state.events?.some((event: any) => event.id === testId);
      if (!hasTestEvent) {
        console.warn('[PERSISTENCE] WARNING: Test event missing - possible data loss');
        return restoreTimelineData();
      } else {
        console.info('[PERSISTENCE] Persistence test event found - data integrity confirmed');
      }
    }
    
    console.info('[PERSISTENCE] No data loss detected');
    console.info(`[PERSISTENCE] Current data: ${currentEvents} events`);
    
  } catch (error) {
    console.error('[PERSISTENCE] ERROR: Error analyzing current data:', error);
    // Data is corrupted, try to restore
    sessionStorage.setItem('corrupted-data-backup', currentData);
    return restoreTimelineData();
  }
  
  return false;
};

// Enhanced warning system with better user guidance
export const warnAboutHardBuild = () => {
  console.info('[PERSISTENCE] Checking for hard build risks...');
  
  const timelineData = localStorage.getItem('onekey-timeline');
  if (timelineData) {
    try {
      const parsed = JSON.parse(timelineData);
      const eventCount = parsed.state?.events?.length || 0;
      
      if (eventCount > 0) {
        // Create automatic backup before warning
        persistenceDebugger.getDebugger().forceBackup();
        
        const message = `WARNING: HARD BUILD DATA LOSS WARNING
        
You have ${eventCount} timeline events at risk!

BEFORE building, choose an option:
"Backup Data" - Create comprehensive backup
Run: persistenceDebug.exportData() - Export debug data

AFTER building:
"Restore Data" - Recover your events  
Run: persistenceDebug.getEmergencyBackups() - Check backups

Emergency commands (in console):
• persistenceDebug.getHealth() - Check system status
• restoreTimelineData() - Manual restore
• checkForDataLoss() - Auto-detect and fix

Pro tip: Enhanced persistence system now auto-creates emergency backups!`;
        
        console.warn('[PERSISTENCE] Hard build warning displayed to user');
        alert(message);
        return true;
      } else {
        console.info('[PERSISTENCE] No events to protect from hard build');
      }
    } catch (error) {
      console.error('[PERSISTENCE] Error checking timeline data:', error);
      persistenceDebugger.getDebugger().forceBackup();
    }
  } else {
    console.info('[PERSISTENCE] No timeline data found');
  }
  return false;
};

// Enhanced pre-build backup with multiple safety layers
export const createPreBuildBackup = () => {
  console.info('[PERSISTENCE] === Creating Comprehensive Pre-Build Backup ===');
  
  try {
    // Use enhanced backup system first
    persistenceDebugger.getDebugger().forceBackup();
    
    // Create traditional backups for compatibility
    backupTimelineData();
    
    const timelineData = localStorage.getItem('onekey-timeline');
    if (timelineData) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Multiple backup strategies
      localStorage.setItem(`onekey-timeline-backup-${timestamp}`, timelineData);
      sessionStorage.setItem(`onekey-pre-build-backup-${timestamp}`, timelineData);
      
      // Create recovery instructions
      const instructions = {
        backupTimestamp: timestamp,
        eventCount: JSON.parse(timelineData).state?.events?.length || 0,
        recoveryCommands: [
          'restoreTimelineData()',
          'persistenceDebug.getEmergencyBackups()',
          'checkForDataLoss()'
        ],
        systemHealth: persistenceDebugger.getDebugger().getHealth()
      };
      
      localStorage.setItem('onekey-recovery-instructions', JSON.stringify(instructions));
      
      console.info(`[PERSISTENCE] Created timestamped backup: onekey-timeline-backup-${timestamp}`);
      console.info('[PERSISTENCE] Recovery instructions saved');
      
      // Export debug data automatically
      const exportedData = persistenceDebugger.getDebugger().exportData();
      console.info('[PERSISTENCE] Debug data exported automatically');
    }
    
    const successMessage = `COMPREHENSIVE BACKUP COMPLETE!

Multiple backup layers created:
• Emergency backup system
• Traditional localStorage backup
• Timestamped backup
• Session backup
• Debug data export

Your timeline events are now FULLY PROTECTED from hard build data loss!

Recovery methods available:
• Automatic: checkForDataLoss()
• Manual: restoreTimelineData()  
• Debug: persistenceDebug.getEmergencyBackups()

Enhanced persistence system will auto-monitor and recover data!`;

    console.info('[PERSISTENCE] Pre-build backup completed successfully');
    alert(successMessage);
    
  } catch (error) {
    console.error('[PERSISTENCE] Error during pre-build backup:', error);
    alert('ERROR: Backup creation failed! Check console for details. Try manual backup commands.');
  }
};

// Convenient global backup functions for easy console access
export const listBackups = () => persistenceDebugger.getDebugger().listBackups();
export const viewBackup = (id: string) => persistenceDebugger.getDebugger().viewBackup(id);
export const restoreFromBackup = (id: string) => persistenceDebugger.getDebugger().restoreFromBackup(id);
export const compareBackups = (id1: string, id2: string) => persistenceDebugger.getDebugger().compareBackups(id1, id2);
export const deleteBackup = (id: string) => persistenceDebugger.getDebugger().deleteBackup(id);
export const backupManager = () => persistenceDebugger.getDebugger().backupManager();
export const forceBackup = () => persistenceDebugger.getDebugger().forceBackup();

// Add global shortcuts to window for ultimate convenience
if (typeof window !== 'undefined') {
  (window as any).listBackups = listBackups;
  (window as any).viewBackup = viewBackup;
  (window as any).restoreFromBackup = restoreFromBackup;
  (window as any).compareBackups = compareBackups;
  (window as any).deleteBackup = deleteBackup;
  (window as any).backupManager = backupManager;
  (window as any).forceBackup = forceBackup;
}

// Initialize the enhanced persistence system
console.info('[PERSISTENCE] Enhanced Persistence Test System Loaded');
console.info('[PERSISTENCE] Debug commands available at: persistenceDebug.*');
console.info('[PERSISTENCE] Auto-monitoring for shutdowns and data loss enabled');
console.info('');
console.info('QUICK START - Backup Management:');
console.info('   listBackups()           - Show all your backups');
console.info('   backupManager()         - Open interactive backup manager');
console.info('   forceBackup()          - Create backup right now');
console.info('   viewBackup("backup-id") - View specific backup details');
console.info('');

// Auto-check for data loss on module load
if (typeof window !== 'undefined') {
  // Run initial health check
  setTimeout(() => {
    checkForDataLoss();
    
    // Show backup status on startup
    console.info('[PERSISTENCE] Startup Backup Status:');
    const backups = listBackups();
    if (backups.length === 0) {
      console.warn('[PERSISTENCE] WARNING: No backups found! Creating initial backup...');
      forceBackup();
    }
  }, 1000);
} 