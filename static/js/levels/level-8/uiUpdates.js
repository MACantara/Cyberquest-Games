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
    
    // Auto-remove after 10 seconds for longer messages
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('animate-fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 10000);
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

export function showProgressUpdate(phase, description) {
    // Show progress update with phase information
    const progressAlert = document.createElement('div');
    progressAlert.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 border-2 border-cyan-500 text-cyan-100 p-6 rounded-xl shadow-2xl z-60 animate-scale-in';
    progressAlert.innerHTML = `
        <div class="text-center">
            <div class="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="bi bi-check-circle text-slate-900 text-2xl"></i>
            </div>
            <h3 class="text-cyan-300 font-bold text-lg mb-2">${phase} Complete</h3>
            <p class="text-cyan-200 text-sm">${description}</p>
        </div>
    `;
    
    document.body.appendChild(progressAlert);
    
    setTimeout(() => {
        progressAlert.classList.add('animate-fade-out');
        setTimeout(() => progressAlert.remove(), 300);
    }, 3000);
}

export function highlightCodeVulnerability(lineNumber, vulnerabilityType) {
    // Highlight specific lines in code viewer
    const codeLines = document.querySelectorAll('#code-content .flex');
    if (codeLines[lineNumber - 1]) {
        const line = codeLines[lineNumber - 1];
        line.classList.add('bg-red-900/40', 'border-l-4', 'border-red-500', 'animate-pulse');
        
        // Add vulnerability indicator
        const indicator = document.createElement('span');
        indicator.className = 'ml-2 text-red-400 text-xs font-bold';
        indicator.textContent = `← ${vulnerabilityType}`;
        line.appendChild(indicator);
        
        // Remove animation after 3 seconds
        setTimeout(() => {
            line.classList.remove('animate-pulse');
        }, 3000);
    }
}

export function revealVulnerabilitiesInCode(vulnerabilities) {
    // Gradually reveal vulnerabilities with visual effects
    vulnerabilities.forEach((vuln, index) => {
        setTimeout(() => {
            highlightCodeVulnerability(vuln.line, vuln.type);
            
            // Show discovery notification
            createEthicalAlert(`${vuln.type} discovered on line ${vuln.line}`, 'warning', 3000);
        }, index * 1000);
    });
}

export function showExploitWarning(severity = 'high') {
    const warning = document.createElement('div');
    warning.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-60';
    warning.innerHTML = `
        <div class="bg-red-900 border-2 border-red-500 rounded-xl p-8 max-w-md mx-4">
            <div class="text-center">
                <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <i class="bi bi-exclamation-triangle text-white text-2xl"></i>
                </div>
                <h3 class="text-red-300 font-bold text-xl mb-3">⚠️ EXPLOIT WARNING</h3>
                <p class="text-red-200 text-sm mb-6">
                    You are about to test exploits on live election infrastructure. This action carries significant ethical and legal implications.
                </p>
                <div class="space-y-3">
                    <button id="proceed-exploit" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold">
                        Proceed with Testing
                    </button>
                    <button id="cancel-exploit" class="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg">
                        Cancel - Too Risky
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(warning);
    
    return new Promise((resolve) => {
        document.getElementById('proceed-exploit').onclick = () => {
            warning.remove();
            resolve(true);
        };
        
        document.getElementById('cancel-exploit').onclick = () => {
            warning.remove();
            resolve(false);
        };
    });
}

export function animateFileAnalysis(fileName, duration = 3000) {
    // Show file analysis animation
    const fileElement = document.querySelector(`[data-file="${fileName.replace('.', '-').replace('/', '-')}"]`);
    if (fileElement) {
        fileElement.classList.add('animate-pulse', 'bg-blue-900/30');
        
        setTimeout(() => {
            fileElement.classList.remove('animate-pulse');
            fileElement.classList.add('bg-green-900/30');
            
            // Add completion checkmark
            const checkmark = document.createElement('i');
            checkmark.className = 'bi bi-check-circle text-green-400 ml-2';
            fileElement.appendChild(checkmark);
        }, duration);
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
        
        @keyframes slide-down {
            from { transform: translateY(-100%); opacity: 0; }
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
        
        .animate-slide-down {
            animation: slide-down 0.4s ease-out;
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
