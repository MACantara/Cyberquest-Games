import { systems } from './systemHandler.js';

export function updateMentorMessage(message) {
    // Create a notification popup instead of updating a fixed element
    createNotification('Emergency Response AI', message, 'info');
}

export function showResultModal(icon, title, message, feedback) {
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-feedback').innerHTML = feedback;
    document.getElementById('results-modal').classList.remove('hidden');
}

export function updateSystemVisuals() {
    // Update system items in file explorer
    Object.keys(systems).forEach(id => {
        const systemItem = document.querySelector(`[data-system="${id}"]`);
        const system = systems[id];
        
        if (systemItem) {
            const statusElement = systemItem.querySelector('.text-xs');
            const indicator = systemItem.querySelector('.w-2');
            
            switch(system.status) {
                case 'clean':
                    statusElement.textContent = `${system.player} • Status: CLEAN`;
                    statusElement.className = 'text-xs text-gray-500';
                    indicator.className = 'w-2 h-2 bg-green-500 rounded-full';
                    systemItem.classList.remove('bg-red-50', 'bg-yellow-50', 'animate-pulse');
                    break;
                case 'infected':
                    statusElement.textContent = `${system.player} • Status: INFECTED 🦠`;
                    statusElement.className = 'text-xs text-red-500';
                    indicator.className = 'w-2 h-2 bg-red-500 rounded-full animate-ping';
                    systemItem.classList.add('bg-red-50', 'animate-pulse');
                    break;
                case 'suspicious':
                    statusElement.textContent = `${system.player} • Status: SUSPICIOUS ⚠️`;
                    statusElement.className = 'text-xs text-yellow-600';
                    indicator.className = 'w-2 h-2 bg-yellow-500 rounded-full';
                    systemItem.classList.add('bg-yellow-50');
                    break;
            }
        }
    });
}

export function createNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        info: 'border-blue-500 bg-blue-100 text-blue-800',
        warning: 'border-yellow-500 bg-yellow-100 text-yellow-800',
        error: 'border-red-500 bg-red-100 text-red-800',
        success: 'border-green-500 bg-green-100 text-green-800'
    };
    
    notification.className = `fixed top-16 right-4 w-80 p-4 border-2 ${colors[type]} rounded-lg shadow-xl z-50 animate-bounce`;
    notification.innerHTML = `
        <div class="flex items-start justify-between mb-2">
            <div class="font-bold text-sm">${title}</div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-600 hover:text-gray-800">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>
        <div class="text-xs">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 6000);
}

export function simulateSystemSlowdown(systemId) {
    // Simulate visual lag and corruption
    const system = systems[systemId];
    if (!system) return;
    
    // Increase CPU usage display
    const cpuBar = document.getElementById('cpu-bar');
    const currentWidth = parseInt(cpuBar.style.width);
    const newWidth = Math.min(currentWidth + 20, 99);
    cpuBar.style.width = newWidth + '%';
    cpuBar.textContent = newWidth + '%';
    
    // Add visual glitches
    const desktop = document.getElementById('desktop-wallpaper');
    desktop.style.filter = 'hue-rotate(180deg) contrast(150%)';
    
    setTimeout(() => {
        desktop.style.filter = 'none';
    }, 2000);
    
    // Create emergency system notification
    createNotification(
        'System Performance Warning',
        `Terminal-${systemId.toString().padStart(2, '0')} is experiencing severe performance degradation. Immediate action required!`,
        'warning'
    );
}

export function simulateDataExfiltration(systemId) {
    // Show data being stolen in real-time
    createNotification(
        'Data Breach Detected',
        'Unauthorized data transmission in progress. Player credentials and game data being exfiltrated!',
        'error'
    );
    
    // Update network status in taskbar
    const networkStatus = document.getElementById('network-status');
    networkStatus.innerHTML = '📡 DATA LEAK';
    networkStatus.className = 'text-red-400 animate-pulse';
}

export function showFileEncryption(files) {
    // Gradually encrypt file names with visual effect
    files.forEach((filename, index) => {
        setTimeout(() => {
            createNotification(
                'File Encrypted',
                `${filename} has been encrypted by ransomware. Recovery key required.`,
                'error'
            );
        }, index * 1000);
    });
}

export function updateContainmentStatus(contained, total) {
    // Update the HUD with containment progress
    const progress = (contained / total) * 100;
    
    if (progress >= 100) {
        createNotification(
            'Containment Successful',
            'All threats have been neutralized. VR Arena is secure.',
            'success'
        );
        
        // Stop all corruption effects
        if (window.stopCorruptionEffects) {
            window.stopCorruptionEffects();
        }
        
        // Reset desktop appearance
        const desktop = document.getElementById('desktop-wallpaper');
        desktop.style.filter = 'none';
        
        // Update system tray
        document.getElementById('network-status').innerHTML = '🛡️ SECURE';
        document.getElementById('network-status').className = 'text-green-400';
    }
}
