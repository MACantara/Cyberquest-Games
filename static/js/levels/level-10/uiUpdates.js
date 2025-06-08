export function updateArgusMessage(message) {
    const messageElement = document.getElementById('argus-message');
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
    console.log('ARGUS AI:', message);
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

export function updateInvestigationProgress(progress) {
    // Update investigation progress indicators
    const progressElements = {
        'evidence-count': `${progress.evidenceCollected}/15`,
        'logs-analyzed': `${progress.logsAnalyzed}/5`,
        'hashes-verified': `${progress.hashesVerified}/3`,
        'metadata-extracted': `${progress.metadataExtracted}/4`,
        'timeline-events': progress.timelineAnalyzed ? '2/2' : '0/2',
        'traffic-analyzed': progress.trafficAnalyzed ? '1/1' : '0/1'
    };
    
    Object.entries(progressElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

export function animateConfidenceUpdate(suspectId, newConfidence, oldConfidence) {
    const confidenceElement = document.getElementById(`${suspectId}-confidence`);
    const confidenceBar = document.getElementById(`${suspectId}-confidence-bar`);
    
    if (confidenceElement && confidenceBar) {
        // Animate confidence number
        confidenceElement.style.transform = 'scale(1.2)';
        confidenceElement.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            confidenceElement.textContent = `${newConfidence}%`;
            confidenceElement.style.transform = 'scale(1)';
            
            // Animate confidence bar
            confidenceBar.style.width = `${newConfidence}%`;
            confidenceBar.style.transition = 'width 0.5s ease';
            
            // Update bar color based on confidence level
            if (newConfidence >= 70) {
                confidenceBar.className = 'bg-red-400 h-1 rounded-full transition-all duration-500';
            } else if (newConfidence >= 50) {
                confidenceBar.className = 'bg-yellow-400 h-1 rounded-full transition-all duration-500';
            } else {
                confidenceBar.className = 'bg-blue-400 h-1 rounded-full transition-all duration-500';
            }
        }, 150);
    }
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

// Add CSS animations if not already present
if (!document.querySelector('#level10-animations')) {
    const style = document.createElement('style');
    style.id = 'level10-animations';
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
        
        /* Evidence collection animations */
        .evidence-item {
            transition: all 0.2s ease;
        }
        
        .evidence-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        /* Suspect card hover effects */
        .suspect-card {
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .suspect-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        
        /* Forensics tool button effects */
        .forensic-tool {
            transition: all 0.2s ease;
        }
        
        .forensic-tool:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .forensic-tool:active {
            transform: translateY(0);
        }
        
        /* Evidence entry animations */
        .log-entry, .hash-entry, .metadata-entry {
            transition: all 0.2s ease;
        }
        
        .log-entry:hover, .hash-entry:hover, .metadata-entry:hover {
            transform: translateX(4px);
            box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
        }
        
        /* Confidence meter animations */
        .suspect-card .bg-red-400, .suspect-card .bg-yellow-400, .suspect-card .bg-blue-400 {
            transition: width 0.5s ease, background-color 0.3s ease;
        }
        
        /* ARGUS message panel effects */
        .commander-panel {
            transition: transform 0.2s ease;
        }
        
        /* Investigation note animations */
        .investigation-note {
            transition: all 0.3s ease;
        }
        
        .investigation-note:hover {
            transform: translateX(-2px);
            box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
        }
        
        /* Timeline visualization effects */
        .timeline-event {
            transition: all 0.2s ease;
        }
        
        .timeline-event:hover {
            transform: translateX(4px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        /* Traffic analysis hover effects */
        .traffic-analysis {
            transition: all 0.2s ease;
        }
        
        .traffic-analysis:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
    `;
    document.head.appendChild(style);
}
