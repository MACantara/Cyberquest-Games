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

export function updateAILearningFeed(message) {
    const feedElement = document.getElementById('ai-learning-feed');
    if (feedElement) {
        const newMessage = document.createElement('div');
        newMessage.className = 'text-xs text-red-200 animate-fade-in';
        newMessage.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        
        feedElement.insertBefore(newMessage, feedElement.firstChild);
        
        // Remove old messages to prevent overflow
        while (feedElement.children.length > 6) {
            feedElement.removeChild(feedElement.lastChild);
        }
        
        // Scroll to top to show newest message
        feedElement.scrollTop = 0;
    }
}

function createMentorNotification(message) {
    // Remove existing mentor notifications
    document.querySelectorAll('.mentor-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'mentor-notification fixed bottom-20 left-4 max-w-md bg-blue-900 border-2 border-cyan-500 text-cyan-100 p-4 rounded-lg shadow-2xl z-50 animate-slide-up';
    notification.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="bi bi-robot text-blue-900 text-sm"></i>
            </div>
            <div class="flex-1">
                <div class="text-cyan-300 font-semibold text-sm mb-1">Battle AI - Argus</div>
                <div class="text-cyan-100 text-sm leading-relaxed">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-cyan-400 hover:text-cyan-200 ml-2">
                <i class="bi bi-x-lg text-sm"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('animate-fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 10000);
}

export function createBattleAlert(message, type = 'info', duration = 5000) {
    const alert = document.createElement('div');
    
    const alertStyles = {
        info: {
            bg: 'bg-blue-900',
            border: 'border-blue-500',
            text: 'text-blue-300',
            icon: 'bi-info-circle text-blue-400'
        },
        success: {
            bg: 'bg-green-900',
            border: 'border-green-500',
            text: 'text-green-300',
            icon: 'bi-check-circle text-green-400'
        },
        warning: {
            bg: 'bg-yellow-900',
            border: 'border-yellow-500',
            text: 'text-yellow-300',
            icon: 'bi-exclamation-triangle text-yellow-400'
        },
        error: {
            bg: 'bg-red-900',
            border: 'border-red-500',
            text: 'text-red-300',
            icon: 'bi-exclamation-octagon text-red-400'
        },
        ai_victory: {
            bg: 'bg-red-950',
            border: 'border-red-400',
            text: 'text-red-200',
            icon: 'bi-robot text-red-500'
        },
        pattern_break: {
            bg: 'bg-purple-900',
            border: 'border-purple-500',
            text: 'text-purple-300',
            icon: 'bi-lightning text-purple-400'
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
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-200 ml-2">
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

export function updateBattleMetrics(metrics) {
    // Update battle statistics with smooth animations
    const elements = {
        'ai-confidence': `${metrics.aiConfidence}%`,
        'predictability-score': `${metrics.predictabilityScore}%`,
        'patterns-broken': metrics.patternsBroken,
        'system-integrity': `${metrics.systemIntegrity}%`,
        'adaptation-cycles': metrics.adaptationCycles
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
                }, 800);
            }
        }
    });
    
    // Update visual indicators based on battle state
    updateBattleVisualIndicators(metrics);
}

function updateBattleVisualIndicators(metrics) {
    // Update AI confidence color and effects
    const confidenceElement = document.getElementById('ai-confidence');
    if (confidenceElement) {
        if (metrics.aiConfidence >= 80) {
            confidenceElement.className = 'text-lg font-bold text-red-400 animate-pulse';
        } else if (metrics.aiConfidence >= 50) {
            confidenceElement.className = 'text-lg font-bold text-yellow-400';
        } else {
            confidenceElement.className = 'text-lg font-bold text-green-400';
        }
    }
    
    // Update predictability score styling
    const predictabilityElement = document.getElementById('predictability-score');
    if (predictabilityElement) {
        if (metrics.predictabilityScore >= 70) {
            predictabilityElement.className = 'text-lg font-bold text-red-400 animate-pulse';
            createBattleAlert('⚠️ HIGH PREDICTABILITY DETECTED: Your patterns are too consistent!', 'warning', 3000);
        } else if (metrics.predictabilityScore >= 40) {
            predictabilityElement.className = 'text-lg font-bold text-yellow-400';
        } else {
            predictabilityElement.className = 'text-lg font-bold text-green-400';
        }
    }
    
    // Update patterns broken celebration
    if (metrics.patternsBroken > 0) {
        const patternsElement = document.getElementById('patterns-broken');
        if (patternsElement) {
            patternsElement.className = 'text-lg font-bold text-green-400';
        }
    }
}

export function showAIAdaptationWarning(adaptationLevel) {
    const warnings = {
        low: {
            message: 'AI learning rate: 15% - Basic pattern recognition active',
            type: 'info'
        },
        medium: {
            message: 'AI learning rate: 45% - Advanced behavioral modeling engaged',
            type: 'warning'
        },
        high: {
            message: 'AI learning rate: 75% - Predictive algorithms at maximum efficiency!',
            type: 'error'
        },
        critical: {
            message: 'AI learning rate: 95% - Complete behavioral prediction achieved!',
            type: 'ai_victory'
        }
    };
    
    const warning = warnings[adaptationLevel] || warnings.medium;
    createBattleAlert(`🤖 ${warning.message}`, warning.type, 6000);
}

export function triggerPatternBreakCelebration() {
    // Special effect when player successfully breaks a pattern
    const celebration = document.createElement('div');
    celebration.className = 'fixed inset-0 pointer-events-none z-60';
    celebration.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 opacity-20 animate-pulse"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div class="text-6xl mb-4 animate-bounce">🎯</div>
            <div class="text-green-400 font-bold text-2xl animate-pulse">PATTERN DISRUPTED!</div>
            <div class="text-green-300 text-lg mt-2">AI prediction models scrambled</div>
        </div>
    `;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 3000);
    
    createBattleAlert('🎯 Pattern successfully disrupted! AI confidence reduced.', 'pattern_break', 4000);
}

export function showGhostTimelineEffect(timeline) {
    // Show "ghost" predictions of what would happen in alternate timelines
    const ghost = document.createElement('div');
    ghost.className = 'fixed top-1/4 right-4 w-80 bg-purple-950 border-2 border-purple-600 text-purple-200 p-4 rounded-lg shadow-2xl z-50 animate-ghost-fade';
    ghost.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="text-2xl">👻</div>
            <div class="flex-1">
                <div class="text-purple-300 font-semibold text-sm mb-2">GHOST TIMELINE DETECTED</div>
                <div class="text-purple-200 text-xs leading-relaxed">${timeline}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(ghost);
    
    setTimeout(() => {
        ghost.remove();
    }, 5000);
}

export function updateSystemIntegrityVisual(integrity) {
    // Update system integrity with visual corruption effects
    const integrityBar = document.getElementById('system-integrity');
    if (integrityBar) {
        integrityBar.style.width = integrity + '%';
        
        if (integrity <= 30) {
            integrityBar.className = 'bg-red-400 h-2 rounded transition-all duration-1000 animate-pulse';
            // Add corruption effects to the interface
            document.body.style.filter = `hue-rotate(${(100-integrity) * 3}deg) contrast(${1 + (100-integrity) * 0.01})`;
        } else if (integrity <= 60) {
            integrityBar.className = 'bg-yellow-400 h-2 rounded transition-all duration-1000';
            document.body.style.filter = 'none';
        } else {
            integrityBar.className = 'bg-blue-400 h-2 rounded transition-all duration-1000';
            document.body.style.filter = 'none';
        }
    }
}

// CSS animations for battle interface
if (!document.querySelector('#battle-ui-animations')) {
    const style = document.createElement('style');
    style.id = 'battle-ui-animations';
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
        
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes ghost-fade {
            0% { opacity: 0; transform: translateX(50px) scale(0.9); }
            20% { opacity: 0.8; transform: translateX(0) scale(1.05); }
            80% { opacity: 0.8; transform: translateX(0) scale(1); }
            100% { opacity: 0; transform: translateX(-50px) scale(0.9); }
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
        
        .animate-fade-in {
            animation: fade-in 0.5s ease-in;
        }
        
        .animate-ghost-fade {
            animation: ghost-fade 5s ease-in-out;
        }
        
        .response-option:hover {
            transform: scale(1.02);
            transition: transform 0.2s ease;
        }
        
        .scenario-btn:hover {
            transform: translateY(-2px) scale(1.05);
            transition: all 0.2s ease;
        }
        
        /* Battle line animation */
        .battle-line::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(0deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: battle-pulse 3s infinite;
        }
        
        @keyframes battle-pulse {
            0%, 100% { transform: translateY(-100%); }
            50% { transform: translateY(100%); }
        }
    `;
    document.head.appendChild(style);
}
