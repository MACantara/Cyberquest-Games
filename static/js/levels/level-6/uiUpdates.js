export function updateMentorMessage(message) {
    // Create floating mentor notification instead of relying on fixed element
    createMentorNotification(message);
}

export function showResultModal(icon, title, message, feedback) {
    const resultModal = document.getElementById('results-modal');
    if (resultModal) {
        document.getElementById('result-icon').textContent = icon;
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-message').textContent = message;
        document.getElementById('result-feedback').innerHTML = feedback;
        resultModal.classList.remove('hidden');
    }
}

export function updateInvestorVisual(investorId, success) {
    const investorItem = document.querySelector(`[data-investor="${investorId}"]`);
    if (investorItem) {
        if (success) {
            // Success styling - decision made correctly
            investorItem.classList.remove('animate-pulse', 'border-red-500', 'border-yellow-600');
            investorItem.classList.add('opacity-75', 'border-green-500');
            
            // Add success indicator
            let successIcon = investorItem.querySelector('.decision-indicator');
            if (!successIcon) {
                successIcon = document.createElement('div');
                successIcon.className = 'decision-indicator absolute top-2 right-2 bg-green-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg';
                successIcon.innerHTML = '<i class="bi bi-check text-white text-sm font-bold"></i>';
                investorItem.style.position = 'relative';
                investorItem.appendChild(successIcon);
            }
            
            // Update status text
            const statusElement = investorItem.querySelector('.bg-red-600, .bg-green-600, .bg-yellow-600');
            if (statusElement) {
                statusElement.textContent = 'RESOLVED';
                statusElement.className = 'bg-green-600 text-white text-xs px-2 py-1 rounded';
            }
            
        } else {
            // Failure styling - wrong decision made
            investorItem.classList.add('border-red-500', 'animate-pulse');
            
            // Add warning indicator
            let warningIcon = investorItem.querySelector('.decision-indicator');
            if (!warningIcon) {
                warningIcon = document.createElement('div');
                warningIcon.className = 'decision-indicator absolute top-2 right-2 bg-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse';
                warningIcon.innerHTML = '<i class="bi bi-x text-white text-sm font-bold"></i>';
                investorItem.style.position = 'relative';
                investorItem.appendChild(warningIcon);
            }
            
            // Update status text
            const statusElement = investorItem.querySelector('.bg-red-600, .bg-green-600, .bg-yellow-600');
            if (statusElement) {
                statusElement.textContent = 'POOR CHOICE';
                statusElement.className = 'bg-red-600 text-white text-xs px-2 py-1 rounded animate-pulse';
            }
        }
    }
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
                <div class="text-cyan-300 font-semibold text-sm mb-1">Mentor AI - Argus</div>
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

export function createInvestmentAlert(message, type = 'info', duration = 5000) {
    const alert = document.createElement('div');
    
    const alertStyles = {
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: 'bi-info-circle text-blue-600'
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: 'bi-check-circle text-green-600'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: 'bi-exclamation-triangle text-yellow-600'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: 'bi-exclamation-octagon text-red-600'
        },
        scam: {
            bg: 'bg-red-100',
            border: 'border-red-400',
            text: 'text-red-900',
            icon: 'bi-shield-exclamation text-red-700'
        }
    };
    
    const style = alertStyles[type] || alertStyles.info;
    
    alert.className = `fixed top-20 right-4 w-80 ${style.bg} border-2 ${style.border} ${style.text} p-3 rounded-lg shadow-xl z-50 animate-slide-in`;
    alert.innerHTML = `
        <div class="flex items-start gap-3">
            <i class="bi ${style.icon} text-lg mt-0.5"></i>
            <div class="flex-1">
                <div class="text-sm leading-relaxed">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700 ml-2">
                <i class="bi bi-x text-sm"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove
    setTimeout(() => {
        if (alert.parentElement) {
            alert.classList.add('animate-slide-out');
            setTimeout(() => alert.remove(), 300);
        }
    }, duration);
}

export function updateStartupMetrics(metrics) {
    // Update startup dashboard with real-time metrics
    const elements = {
        'startup-funds': `$${Math.floor(metrics.startupFunds / 1000)}K`,
        'verified-investors': metrics.verifiedInvestors,
        'scams-detected': metrics.scamsDetected,
        'trust-rating': `${metrics.trustRating}%`
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            // Animate value changes
            const currentValue = element.textContent;
            if (currentValue !== value.toString()) {
                element.classList.add('animate-pulse');
                element.textContent = value;
                setTimeout(() => {
                    element.classList.remove('animate-pulse');
                }, 500);
            }
        }
    });
    
    // Update trust rating color
    const trustElement = document.getElementById('trust-rating');
    if (trustElement) {
        if (metrics.trustRating >= 80) {
            trustElement.className = 'text-xl font-bold text-green-400';
        } else if (metrics.trustRating >= 60) {
            trustElement.className = 'text-xl font-bold text-yellow-400';
        } else {
            trustElement.className = 'text-xl font-bold text-red-400';
        }
    }
}

export function showFundingProgress(current, target) {
    // Visual funding progress for startup
    const progressBar = document.getElementById('funding-progress');
    if (progressBar) {
        const percentage = Math.min((current / target) * 100, 100);
        progressBar.style.width = `${percentage}%`;
        
        if (percentage >= 100) {
            progressBar.className = 'bg-green-500 h-2 rounded transition-all duration-1000';
            createInvestmentAlert('🎉 Funding goal achieved! Your startup is fully funded.', 'success');
        } else if (percentage >= 75) {
            progressBar.className = 'bg-blue-500 h-2 rounded transition-all duration-1000';
        } else {
            progressBar.className = 'bg-yellow-500 h-2 rounded transition-all duration-1000';
        }
    }
}

export function triggerScamAlert(investorName) {
    // Dramatic scam detection alert
    createInvestmentAlert(
        `🚨 SCAM DETECTED: ${investorName} flagged as fraudulent! Domain analysis reveals typosquatting and pressure tactics.`,
        'scam',
        8000
    );
    
    // Add red overlay effect briefly
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-red-500 opacity-20 pointer-events-none z-40';
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.remove();
    }, 500);
}

export function triggerLegitimateAlert(investorName) {
    // Positive verification alert
    createInvestmentAlert(
        `✅ VERIFIED: ${investorName} is a legitimate investor with proper credentials and realistic terms.`,
        'success',
        6000
    );
    
    // Add green glow effect briefly
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-green-500 opacity-10 pointer-events-none z-40';
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.remove();
    }, 500);
}

// CSS animations for investment interface
if (!document.querySelector('#investment-ui-animations')) {
    const style = document.createElement('style');
    style.id = 'investment-ui-animations';
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
        
        .contract-section:hover {
            background-color: rgba(251, 191, 36, 0.1);
            transition: background-color 0.2s ease;
        }
        
        .decision-action:hover {
            transform: scale(1.05);
            transition: transform 0.2s ease;
        }
        
        .investor-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease;
        }
        
        .decision-indicator {
            animation: pulse-success 2s infinite;
        }
        
        @keyframes pulse-success {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
}
