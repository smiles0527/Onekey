const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Onekey Development Environment...\n');

// Check if backend exists
const backendPath = path.join(__dirname, 'backend');
if (!fs.existsSync(backendPath)) {
  console.error('❌ Backend directory not found!');
  process.exit(1);
}

// Function to start a process
function startProcess(name, command, args, cwd = __dirname) {
  console.log(`📦 Starting ${name}...`);
  
  const process = spawn(command, args, {
    cwd,
    stdio: 'pipe',
    shell: true
  });

  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  process.stderr.on('data', (data) => {
    console.log(`[${name}] ERROR: ${data.toString().trim()}`);
  });

  process.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });

  process.on('error', (error) => {
    console.error(`[${name}] Failed to start:`, error.message);
  });

  return process;
}

// Start backend first
console.log('🔧 Starting Backend Server...');
const backendProcess = startProcess('Backend', 'npm', ['run', 'dev'], backendPath);

// Wait a bit for backend to start, then start frontend
setTimeout(() => {
  console.log('🎨 Starting Frontend Server...');
  const frontendProcess = startProcess('Frontend', 'npm', ['start']);
}, 3000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  backendProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development servers...');
  backendProcess.kill('SIGTERM');
  process.exit(0);
});

console.log('\n✅ Development environment starting...');
console.log('📱 Frontend will be available at: http://localhost:3000');
console.log('🔌 Backend API will be available at: http://localhost:3001');
console.log('⏹️  Press Ctrl+C to stop all servers\n'); 