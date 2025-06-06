export function updateMentorMessage(message) {
    // Create emergency notification instead of static message
    createEmergencyAlert(message, 'info');
}

export function showResultModal(icon, title, message, feedback) {
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-feedback').innerHTML = feedback;
    document.getElementById('results-modal').classList.remove('hidden');
}

export function updateAccountVisual(accountId, secured) {
    const accountItem = document.querySelector(`[data-account="${accountId}"]`);
    if (accountItem) {
        if (secured) {
            // Success styling with immediate visual feedback
            accountItem.className = 'account-item bg-green-900 border-2 border-green-500 rounded-lg p-4 opacity-75 cursor-not-allowed';
            
            // Update icon to secured state
            const icon = accountItem.querySelector('i');
            if (icon) {
                icon.className = 'bi bi-shield-check text-green-400 text-2xl';
            }
            
            // Update status text
            const statusSpan = accountItem.querySelector('.bg-red-600, .bg-yellow-600');
            if (statusSpan) {
                statusSpan.textContent = 'SECURED';
                statusSpan.className = 'bg-green-600 text-white text-xs px-2 py-1 rounded';
            }
            
            // Remove animation classes
            accountItem.classList.remove('animate-pulse', 'hover:bg-red-800', 'hover:bg-yellow-800');
            
            // Add secured indicator
            const securedIndicator = accountItem.querySelector('.animate-spin, .animate-ping');
            if (securedIndicator) {
                securedIndicator.className = 'text-green-400';
                securedIndicator.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
            }
            
        } else {
            // Failure styling - compromised account
            accountItem.className = 'account-item bg-red-950 border-2 border-red-400 rounded-lg p-4 animate-pulse cursor-not-allowed';
            
            // Update icon to compromised state
            const icon = accountItem.querySelector('i');
            if (icon) {
                icon.className = 'bi bi-exclamation-triangle-fill text-red-500 text-2xl animate-bounce';
            }
            
            // Update status text
            const statusSpan = accountItem.querySelector('.bg-red-600, .bg-yellow-600');
            if (statusSpan) {
                statusSpan.textContent = 'BREACHED';
                statusSpan.className = 'bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse';
            }
            
            // Add breached indicator
            const indicator = accountItem.querySelector('.animate-spin, .animate-ping');
            if (indicator) {
                indicator.className = 'text-red-500 animate-bounce';
                indicator.innerHTML = '<i class="bi bi-x-circle-fill"></i>';
            }
        }
    }
}

export function createEmergencyAlert(message, type = 'info') {
    const alert = document.createElement('div');
    
    const alertStyles = {
        info: {
            bg: 'bg-blue-900',
            border: 'border-blue-500',
            text: 'text-blue-300',
            icon: 'bi-info-circle'
        },
        success: {
            bg: 'bg-green-900',
            border: 'border-green-500',
            text: 'text-green-300',
            icon: 'bi-check-circle'
        },
        warning: {
            bg: 'bg-yellow-900',
            border: 'border-yellow-500',
            text: 'text-yellow-300',
            icon: 'bi-exclamation-triangle'
        },
        error: {
            bg: 'bg-red-900',
            border: 'border-red-500',
            text: 'text-red-300',
            icon: 'bi-exclamation-octagon'
        }
    };
    
    const style = alertStyles[type] || alertStyles.info;
    
    alert.className = `fixed top-20 right-4 w-80 ${style.bg} border-2 ${style.border} ${style.text} p-4 rounded-lg shadow-2xl z-50 animate-slide-in`;
    alert.innerHTML = `
        <div class="flex items-start gap-3">
            <i class="bi ${style.icon} text-lg mt-0.5 ${type === 'error' ? 'animate-pulse' : ''}"></i>
            <div class="flex-1">
                <div class="text-sm font-semibold mb-1">Emergency Response AI</div>
                <div class="text-xs leading-relaxed">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white ml-2">
                <i class="bi bi-x-lg text-sm"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.classList.add('animate-slide-out');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

export function updateEmergencyStats(stats) {
    // Update real-time dashboard statistics with animations
    if (stats.vaultSecurity !== undefined) {
        const vaultElement = document.getElementById('vault-security');
        if (vaultElement) {
            const currentValue = parseInt(vaultElement.textContent);
            const newValue = Math.max(0, Math.min(100, stats.vaultSecurity));
            
            // Animate the number change
            animateNumberChange(vaultElement, currentValue, newValue, '%');
            
            // Update color based on security level
            if (newValue >= 80) {
                vaultElement.className = 'text-3xl font-bold text-green-400';
            } else if (newValue >= 50) {
                vaultElement.className = 'text-3xl font-bold text-yellow-400';
            } else {
                vaultElement.className = 'text-3xl font-bold text-red-400 animate-pulse';
            }
        }
    }
    
    if (stats.securedAccounts !== undefined) {
        const securedElement = document.getElementById('secured-accounts');
        if (securedElement) {
            animateNumberChange(securedElement, parseInt(securedElement.textContent), stats.securedAccounts);
        }
    }
    
    if (stats.compromisedAccounts !== undefined) {
        const compromisedElement = document.getElementById('compromised-accounts');
        if (compromisedElement) {
            const newValue = stats.compromisedAccounts;
            animateNumberChange(compromisedElement, parseInt(compromisedElement.textContent), newValue);
            
            // Flash red if compromised accounts increase
            if (newValue > 0) {
                compromisedElement.parentElement.classList.add('animate-pulse');
            }
        }
    }
    
    if (stats.attackIntensity !== undefined) {
        const intensityElement = document.getElementById('attack-intensity');
        const intensityBar = document.getElementById('intensity-bar');
        
        if (intensityElement && intensityBar) {
            const newIntensity = Math.max(0, Math.min(100, stats.attackIntensity));
            intensityElement.textContent = Math.floor(newIntensity) + '%';
            intensityBar.style.width = newIntensity + '%';
            
            // Update color based on intensity
            if (newIntensity >= 80) {
                intensityBar.className = 'bg-red-500 h-1 rounded transition-all duration-1000 animate-pulse';
            } else if (newIntensity >= 50) {
                intensityBar.className = 'bg-yellow-500 h-1 rounded transition-all duration-1000';
            } else {
                intensityBar.className = 'bg-green-500 h-1 rounded transition-all duration-1000';
            }
        }
    }
}

function animateNumberChange(element, startValue, endValue, suffix = '') {
    const duration = 800;
    const frameDuration = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = t => t * (2 - t);
    
    let frame = 0;
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentValue = Math.round(startValue + (endValue - startValue) * progress);
        
        element.textContent = currentValue + suffix;
        element.classList.add('animate-count');
        
        setTimeout(() => {
            element.classList.remove('animate-count');
        }, 100);
        
        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = endValue + suffix;
        }
    }, frameDuration);
}

export function showCriticalSystemAlert(accountEmail, timeRemaining) {
    // Create a large critical alert overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-60 animate-fade-in';
    overlay.innerHTML = `
        <div class="bg-red-900 border-4 border-red-500 rounded-lg p-8 max-w-2xl mx-4 text-center animate-bounce">
            <div class="text-6xl mb-4 animate-pulse">⚠️</div>
            <h2 class="text-3xl font-bold text-red-300 mb-4">CRITICAL BREACH IMMINENT</h2>
            <p class="text-red-200 text-lg mb-4">
                <strong>${accountEmail}</strong> will be compromised in <span class="text-yellow-300 font-mono text-xl">${timeRemaining}</span> seconds!
            </p>
            <p class="text-red-300 mb-6">Deploy emergency countermeasures immediately!</p>
            <button onclick="this.parentElement.parentElement.remove()" class="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold">
                UNDERSTOOD - DEPLOY COUNTERMEASURES
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (overlay.parentElement) {
            overlay.remove();
        }
    }, 8000);
}

export function triggerVaultSecuredEffects() {
    // Create celebration effects when vault is secured
    createEmergencyAlert('🛡️ VAULT SECURED! All systems protected and The Null repelled!', 'success');
    
    // Update all visual indicators to secured state
    document.getElementById('critical-banner').style.background = 'linear-gradient(90deg, #059669, #10b981)';
    document.getElementById('critical-banner').innerHTML = `
        <div class="flex items-center justify-center gap-3">
            <i class="bi bi-shield-check-fill text-green-300"></i>
            <span class="font-bold">🛡️ VAULT SECURED - THREAT NEUTRALIZED 🛡️</span>
            <span class="bg-green-800 px-3 py-1 rounded font-mono">SECURE</span>
        </div>
    `;
    
    // Stop attack intensity visualization
    const intensityBar = document.getElementById('intensity-bar');
    if (intensityBar) {
        intensityBar.style.width = '0%';
        intensityBar.className = 'bg-green-500 h-1 rounded transition-all duration-2000';
    }
    
    // Update attempts per second to show attack stopped
    const attemptsElement = document.getElementById('attempts-per-sec');
    if (attemptsElement) {
        attemptsElement.textContent = '0';
    }
}

// CSS for custom animations (add to stylesheet or inject)
if (!document.querySelector('#emergency-animations')) {
    const style = document.createElement('style');
    style.id = 'emergency-animations';
    style.textContent = `
        @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .animate-slide-in {
            animation: slide-in 0.3s ease-out;
        }
        
        .animate-slide-out {
            animation: slide-out 0.3s ease-in;
        }
        
        .animate-fade-in {
            animation: fade-in 0.5s ease-out;
        }
    `;
    document.head.appendChild(style);
}
