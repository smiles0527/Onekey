PERSISTENCE TEST SYSTEM DOCUMENTATION

The enhanced persistence test system provides comprehensive data protection, backup management, and debugging capabilities for localStorage data persistence. The system automatically monitors for shutdowns, errors, and data loss while providing manual controls for backup operations.

CONSOLE COMMANDS

Basic Operations:
listBackups() - Display all available backups in table format
backupManager() - Show interactive backup manager with full command reference
forceBackup() - Create immediate backup of current timeline data
testLocalStorage() - Run comprehensive persistence tests and health checks

Backup Management:
viewBackup("backup-id") - Display detailed information about specific backup
restoreFromBackup("backup-id") - Restore timeline data from specific backup with confirmation
compareBackups("id1", "id2") - Compare two backups side-by-side with recommendations
deleteBackup("backup-id") - Permanently delete specific backup with confirmation

Advanced Operations:
persistenceDebug.getHealth() - Check system health and storage availability
persistenceDebug.exportData() - Export complete debug data and download as JSON file
persistenceDebug.importData(jsonString) - Import previously exported debug data
persistenceDebug.getEmergencyBackups() - View emergency backup system entries
persistenceDebug.setLevel(0-4) - Set logging level (0=ERROR, 1=WARN, 2=INFO, 3=DEBUG, 4=TRACE)
persistenceDebug.toggleDebug() - Enable/disable enhanced debug mode
persistenceDebug.testShutdown() - Simulate shutdown for testing emergency backup system
persistenceDebug.clearAllData() - Clear all persistence data with confirmation

Legacy Functions:
addTestEvent() - Add test timeline event for persistence verification
clearTimelineData() - Clear timeline data with automatic backup creation
testPersistenceWithRefresh() - Add test event and prompt for page refresh
syncStoreWithLocalStorage() - Force reload to rehydrate store from localStorage
backupTimelineData() - Create manual backup using traditional method
restoreTimelineData() - Restore using traditional backup priority system
checkForDataLoss() - Comprehensive data loss detection and automatic recovery
warnAboutHardBuild() - Display hard build warning with backup recommendations
createPreBuildBackup() - Create comprehensive backup before hard build

BACKUP TYPES

Emergency Backups:
Automatically created during shutdowns, errors, network issues, and page visibility changes. Stored in both localStorage and sessionStorage. Limited to 10 most recent backups with automatic rotation. Include system health data and creation reason.

Session Backups:
Temporary backups stored in sessionStorage. Survive page refreshes but not browser restarts. Used for short-term protection during development and testing.

LocalStorage Backups:
Persistent backups with timestamps stored in localStorage. Survive browser restarts. Created manually or during pre-build operations. Include metadata for recovery verification.

AUTOMATIC MONITORING

The system automatically monitors and responds to:
- Page unload and beforeunload events (browser/tab closing)
- Network connectivity changes (online/offline status)
- Page visibility changes (tab switching, minimizing)
- JavaScript errors and unhandled promise rejections
- Browser crashes and unexpected shutdowns

DATA RECOVERY

Automatic recovery triggers when:
- Current timeline data is missing but backups exist
- Current data has fewer events than most recent backup
- Persistence test event is missing after page refresh
- Current data fails JSON parsing but backups are available

Manual recovery options:
- restoreFromBackup("backup-id") for specific backup restoration
- restoreTimelineData() for automatic backup priority restoration
- checkForDataLoss() for comprehensive recovery attempt

HEALTH MONITORING

System health includes:
- localStorage availability and quota usage
- sessionStorage availability
- Network connectivity status
- Tab visibility state
- Last backup timestamp
- Storage size analysis

DEBUGGING

Debug levels:
0 - ERROR: Critical errors only
1 - WARN: Warnings and errors
2 - INFO: General information, warnings, and errors (default)
3 - DEBUG: Detailed debugging information
4 - TRACE: Complete execution tracing

All logging includes timestamps and structured prefixes for easy filtering and analysis.

INTEGRATION

Import the persistence test system:
import { testLocalStorage, listBackups, backupManager } from './utils/persistenceTest'

The system initializes automatically when imported and begins monitoring immediately. Console commands become available globally for easy access during development and debugging.

PROFESSIONAL USAGE

For production environments:
- Use persistenceDebug.exportData() for comprehensive data collection
- Monitor health with persistenceDebug.getHealth() for system status
- Create regular backups with forceBackup() before risky operations
- Use listBackups() to audit available recovery options
- Set appropriate debug level with persistenceDebug.setLevel() for log management

For development environments:
- Use backupManager() for interactive backup management
- Monitor console for automatic backup creation notifications
- Test recovery scenarios with persistenceDebug.testShutdown()
- Verify persistence across refreshes with testPersistenceWithRefresh()

The system provides multiple layers of data protection with automatic monitoring, manual controls, and comprehensive debugging capabilities for robust timeline data persistence.