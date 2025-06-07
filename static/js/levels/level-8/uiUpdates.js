export function updateMentorMessage(message) {
    // Create floating mentor notification
    createMentorNotification(message);
}

export function showResultModal(icon, title, message, feedback) {
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-feedback').innerHTML = feedback;
    document.getElementById('results-modal').classList.remove('hidden');
}

function createMentorNotification(message) {
    // Remove existing mentor notifications
    document.querySelectorAll('.mentor-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'mentor-notification fixed bottom-20 left-4 max-w-md bg-slate-800 border-2 border-cyan-500 text-cyan-100 p-4 rounded-lg shadow-2xl z-50 animate-slide-up';
    notification.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="bi bi-robot text-slate-900 text-sm"></i>
            </div>
            <div class="flex-1">
                <div class="text-cyan-300 font-semibold text-sm mb-1">Security Mentor - Argus</div>
                <div class="text-cyan-100 text-sm leading-relaxed">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-cyan-400 hover:text-cyan-200 ml-2">
                <i class="bi bi-x-lg text-sm"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('animate-fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 8000);
}

export function createEthicalAlert(message, type = 'info', duration = 5000) {
    const alert = document.createElement('div');
    
    const alertStyles = {
        info: { bg: 'bg-blue-900', border: 'border-blue-500', text: 'text-blue-300', icon: 'bi-info-circle' },
        success: { bg: 'bg-green-900', border: 'border-green-500', text: 'text-green-300', icon: 'bi-check-circle' },
        warning: { bg: 'bg-yellow-900', border: 'border-yellow-500', text: 'text-yellow-300', icon: 'bi-exclamation-triangle' },
        error: { bg: 'bg-red-900', border: 'border-red-500', text: 'text-red-300', icon: 'bi-exclamation-octagon' },
        ethical: { bg: 'bg-green-950', border: 'border-green-400', text: 'text-green-200', icon: 'bi-heart' }
    };
    
    const style = alertStyles[type] || alertStyles.info;
    
    alert.className = `fixed top-20 right-4 w-80 ${style.bg} border-2 ${style.border} ${style.text} p-3 rounded-lg shadow-xl z-50 animate-slide-in`;
    alert.innerHTML = `
        <div class="flex items-start gap-3">
            <i class="bi ${style.icon} text-lg mt-0.5"></i>
            <div class="flex-1">
                <div class="text-sm leading-relaxed">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white ml-2">
                <i class="bi bi-x text-sm"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentElement) {
            alert.classList.add('animate-slide-out');
            setTimeout(() => alert.remove(), 300);
        }
    }, duration);
}

export function showAuditProgress(completed, total) {
    // Update audit progress with integrated messaging
    const progressBar = document.getElementById('audit-progress');
    const progressText = document.getElementById('audit-progress-text');
    
    if (progressBar && progressText) {
        const percentage = (completed / total) * 100;
        progressBar.style.width = percentage + '%';
        progressText.textContent = `${completed}/${total} components analyzed`;
        
        if (percentage >= 100) {
            progressBar.className = 'bg-green-500 h-2 rounded transition-all duration-1000';
            createEthicalAlert('🎯 Security audit complete! All critical components analyzed.', 'success');
            
            // Add completion message to audit log
            const messagesContainer = document.getElementById('audit-messages');
            if (messagesContainer) {
                const completionMessage = document.createElement('div');
                completionMessage.className = 'bg-green-900 border-l-4 border-green-400 rounded p-2 mb-2';
                completionMessage.innerHTML = `
                    <div class="text-green-300 font-medium">Audit Complete</div>
                    <div class="text-green-200 text-xs">Comprehensive security analysis of CivitasVote election system completed. Critical vulnerabilities identified.</div>
                    <div class="text-green-400 text-xs mt-1">${new Date().toLocaleTimeString()} • Milestone Achieved</div>
                `;
                messagesContainer.appendChild(completionMessage);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        } else if (percentage >= 50) {
            progressBar.className = 'bg-blue-500 h-2 rounded transition-all duration-1000';
        }
    }
}

export function triggerEthicalCelebration(decisionType) {
    // Special effects for major ethical decisions
    const celebration = document.createElement('div');
    celebration.className = 'fixed inset-0 pointer-events-none z-60';
    
    if (decisionType === 'responsible') {
        celebration.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 opacity-20 animate-pulse"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div class="text-6xl mb-4 animate-bounce">🛡️</div>
                <div class="text-green-400 font-bold text-2xl animate-pulse">ETHICAL CHOICE MADE</div>
                <div class="text-green-300 text-lg mt-2">Democracy protected through responsible disclosure</div>
            </div>
        `;
    } else if (decisionType === 'corrupt') {
        celebration.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 opacity-30 animate-pulse"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div class="text-6xl mb-4 animate-bounce">💰</div>
                <div class="text-red-400 font-bold text-2xl animate-pulse">INTEGRITY COMPROMISED</div>
                <div class="text-red-300 text-lg mt-2">Personal gain over public safety</div>
            </div>
        `;
    }
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 4000);
}

// CSS animations for security audit interface
if (!document.querySelector('#security-audit-animations')) {
    const style = document.createElement('style');
    style.id = 'security-audit-animations';
    style.textContent = `
        @keyframes slide-up {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fade-out {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .animate-slide-up {
            animation: slide-up 0.4s ease-out;
        }
        
        .animate-slide-in {
            animation: slide-in 0.3s ease-out;
        }
        
        .animate-slide-out {
            animation: slide-out 0.3s ease-in;
        }
        
        .animate-fade-out {
            animation: fade-out 0.3s ease-in;
        }
        
        .scan-component:hover {
            transform: scale(1.02);
            transition: all 0.2s ease;
        }
        
        .analysis-tool:hover {
            transform: translateY(-1px);
            transition: all 0.2s ease;
        }
        
        .decision-option:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
        }
        
        @keyframes ethical-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .ethical-indicator {
            animation: ethical-pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);
}
