export function updateCommanderMessage(message) {
    const messageElement = document.getElementById('commander-message');
    if (messageElement) {
        // Add typing effect
        messageElement.style.opacity = '0.7';
        
        setTimeout(() => {
            messageElement.textContent = message;
            messageElement.style.opacity = '1';
            
            // Add subtle animation to draw attention
            messageElement.parentElement.style.transform = 'scale(1.02)';
            messageElement.parentElement.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                messageElement.parentElement.style.transform = 'scale(1)';
            }, 200);
        }, 150);
    }
    
    // Also log to console for debugging
    console.log('Commander Vega:', message);
}

export function showResultModal(icon, title, message, feedback) {
    const modal = document.getElementById('results-modal');
    if (!modal) return;
    
    // Update modal content
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-feedback').innerHTML = feedback;
    
    // Show modal with animation
    modal.classList.remove('hidden');
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        modal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
}

export function hideResultModal() {
    const modal = document.getElementById('results-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

export function createNotification(message, type = 'info', duration = 4000) {
    // Create floating notification
    const notification = document.createElement('div');
    
    const typeStyles = {
        success: { 
            bg: 'bg-green-900/90', 
            border: 'border-green-500', 
            text: 'text-green-300', 
            icon: 'bi-check-circle' 
        },
        warning: { 
            bg: 'bg-yellow-900/90', 
            border: 'border-yellow-500', 
            text: 'text-yellow-300', 
            icon: 'bi-exclamation-triangle' 
        },
        error: { 
            bg: 'bg-red-900/90', 
            border: 'border-red-500', 
            text: 'text-red-300', 
            icon: 'bi-exclamation-octagon' 
        },
        info: { 
            bg: 'bg-blue-900/90', 
            border: 'border-blue-500', 
            text: 'text-blue-300', 
            icon: 'bi-info-circle' 
        }
    };
    
    const style = typeStyles[type] || typeStyles.info;
    
    notification.className = `fixed top-4 right-4 ${style.bg} border ${style.border} ${style.text} px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm animate-slide-in`;
    notification.innerHTML = `
        <div class="flex items-start gap-3">
            <i class="bi ${style.icon} text-lg mt-0.5 flex-shrink-0"></i>
            <div class="flex-1">
                <div class="text-sm">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white ml-2 flex-shrink-0">
                <i class="bi bi-x text-sm"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
    
    return notification;
}

export function updateMissionProgress(progress) {
    // Update mission progress indicators
    const progressElements = {
        'mission-timer': formatTime(progress.elapsed),
        'nodes-defended': `${progress.nodesDefended}/${progress.totalNodes}`,
        'time-survived': formatTime(progress.elapsed)
    };
    
    Object.entries(progressElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function showCriticalAlert(title, message, actions = []) {
    // Show urgent alert requiring immediate attention
    const alert = document.createElement('div');
    alert.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-60';
    alert.innerHTML = `
        <div class="bg-red-900 border-2 border-red-500 rounded-xl p-6 max-w-md mx-4 animate-pulse">
            <div class="text-center">
                <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="bi bi-exclamation-triangle text-white text-2xl"></i>
                </div>
                <h3 class="text-red-300 font-bold text-xl mb-3">${title}</h3>
                <p class="text-red-200 text-sm mb-6">${message}</p>
                <div class="space-y-2">
                    ${actions.map(action => `
                        <button class="critical-action w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold" 
                                data-action="${action.id}">
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Handle action clicks
    alert.querySelectorAll('.critical-action').forEach(button => {
        button.addEventListener('click', function() {
            const actionId = this.dataset.action;
            const action = actions.find(a => a.id === actionId);
            if (action && action.callback) {
                action.callback();
            }
            alert.remove();
        });
    });
    
    return alert;
}

export function updateNetworkStatus(stats) {
    // Update network status indicators
    const statusElements = {
        'bandwidth-usage': `${stats.bandwidthUsage}% utilized`,
        'network-latency': `${stats.latency}ms avg`,
        'packet-loss': `${stats.packetLoss}%`
    };
    
    Object.entries(statusElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            
            // Color coding based on values
            if (id === 'bandwidth-usage') {
                const usage = parseInt(stats.bandwidthUsage);
                element.className = usage > 90 ? 'text-red-400' : 
                                 usage > 70 ? 'text-yellow-400' : 'text-green-400';
            } else if (id === 'network-latency') {
                const latency = parseInt(stats.latency);
                element.className = latency > 500 ? 'text-red-400' : 
                                  latency > 200 ? 'text-yellow-400' : 'text-green-400';
            } else if (id === 'packet-loss') {
                const loss = parseInt(stats.packetLoss);
                element.className = loss > 10 ? 'text-red-400' : 
                                  loss > 5 ? 'text-yellow-400' : 'text-green-400';
            }
        }
    });
}

export function animateMetricUpdate(elementId, newValue, color = 'text-cyan-400') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Animate value change
    element.style.transform = 'scale(1.1)';
    element.style.transition = 'transform 0.2s ease';
    element.className = `text-3xl font-bold ${color} animate-pulse`;
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
        
        setTimeout(() => {
            element.classList.remove('animate-pulse');
        }, 1000);
    }, 100);
}

// Add CSS animations if not already present
if (!document.querySelector('#level9-animations')) {
    const style = document.createElement('style');
    style.id = 'level9-animations';
    style.textContent = `
        @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes scale-in {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        .animate-slide-in {
            animation: slide-in 0.3s ease-out;
        }
        
        .animate-scale-in {
            animation: scale-in 0.4s ease-out;
        }
        
        /* Infrastructure node hover effects */
        .infrastructure-node {
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .infrastructure-node:hover {
            filter: brightness(1.2);
        }
        
        /* Mitigation button effects */
        .mitigation-action {
            transition: all 0.2s ease;
        }
        
        .mitigation-action:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .mitigation-action:active {
            transform: translateY(0);
        }
        
        /* Alert queue animations */
        .alert-item {
            transition: all 0.3s ease;
        }
        
        .alert-item:hover {
            transform: translateX(-2px);
            box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
        }
        
        /* Commander message panel effects */
        .commander-panel {
            transition: transform 0.2s ease;
        }
        
        /* Attack indicators pulse effect */
        @keyframes attack-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .attack-indicator {
            animation: attack-pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);
}
