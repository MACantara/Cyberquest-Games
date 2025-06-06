export const gameState = {
    trustLevel: 50,
    postsSecured: 0,
    viralSpread: 47,
    trollAccounts: 12,
    privacyScore: 25,
    currentPost: null,
    analysisSteps: {},
    completedPosts: [],
    // Social media specific metrics
    communityHealth: 40,
    misinformationCounter: 0,
    supportiveInteractions: 0,
    ethicalActionsCount: 0
};

export function updateMetrics() {
    // Ensure values stay within bounds
    gameState.trustLevel = Math.max(0, Math.min(100, gameState.trustLevel));
    gameState.viralSpread = Math.max(0, Math.min(100, gameState.viralSpread));
    gameState.privacyScore = Math.max(0, Math.min(100, gameState.privacyScore));
    gameState.trollAccounts = Math.max(0, gameState.trollAccounts);
    gameState.communityHealth = Math.max(0, Math.min(100, gameState.communityHealth));
    
    // Update UI elements
    updateMetricDisplay('trust-level', gameState.trustLevel);
    updateMetricDisplay('posts-secured', gameState.postsSecured);
    updateMetricDisplay('viral-spread', Math.round(gameState.viralSpread));
    updateMetricDisplay('troll-accounts', gameState.trollAccounts);
    updateMetricDisplay('privacy-score', Math.round(gameState.privacyScore));
    
    // Update progress bars with smooth animations
    updateProgressBar('trust-bar', gameState.trustLevel);
    updateProgressBar('privacy-bar', 100 - gameState.privacyScore); // Inverted for risk
    updateProgressBar('viral-bar', gameState.viralSpread);
    
    // Update status texts with contextual information
    updateStatusText('trust-status', getTrustStatus(gameState.trustLevel));
    updateStatusText('privacy-status', getPrivacyStatus(gameState.privacyScore));
    updateStatusText('viral-status', getViralStatus(gameState.viralSpread));
    
    // Update bar colors based on values
    updateBarColor('trust-bar', gameState.trustLevel, 'trust');
    updateBarColor('privacy-bar', 100 - gameState.privacyScore, 'privacy');
    updateBarColor('viral-bar', gameState.viralSpread, 'viral');
}

function updateMetricDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        const currentValue = parseInt(element.textContent) || 0;
        animateNumberChange(element, currentValue, value);
    }
}

function updateProgressBar(elementId, percentage) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.width = percentage + '%';
        element.style.transition = 'width 0.5s ease-in-out';
    }
}

function updateStatusText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

function updateBarColor(elementId, value, type) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let colorClass = '';
    
    switch(type) {
        case 'trust':
            if (value >= 75) colorClass = 'bg-green-500';
            else if (value >= 50) colorClass = 'bg-blue-500';
            else if (value >= 25) colorClass = 'bg-yellow-500';
            else colorClass = 'bg-red-500';
            break;
        case 'privacy':
            if (value <= 25) colorClass = 'bg-green-500';
            else if (value <= 50) colorClass = 'bg-yellow-500';
            else if (value <= 75) colorClass = 'bg-orange-500';
            else colorClass = 'bg-red-500';
            break;
        case 'viral':
            if (value <= 25) colorClass = 'bg-green-500';
            else if (value <= 50) colorClass = 'bg-yellow-500';
            else if (value <= 75) colorClass = 'bg-orange-500';
            else colorClass = 'bg-red-500';
            break;
    }
    
    // Remove existing color classes and add new one
    element.className = element.className.replace(/bg-\w+-500/g, '') + ' ' + colorClass;
}

function getTrustStatus(level) {
    if (level >= 80) return 'Highly trusted community';
    if (level >= 60) return 'Generally trusted';
    if (level >= 40) return 'Moderately trusted';
    if (level >= 20) return 'Low community trust';
    return 'Trust crisis';
}

function getPrivacyStatus(score) {
    if (score >= 80) return 'Well protected';
    if (score >= 60) return 'Moderate protection';
    if (score >= 40) return 'Some exposure';
    if (score >= 20) return 'High risk exposure';
    return 'Critical privacy violations';
}

function getViralStatus(spread) {
    if (spread >= 80) return 'Crisis spreading rapidly';
    if (spread >= 60) return 'Viral content active';
    if (spread >= 40) return 'Moderate spread';
    if (spread >= 20) return 'Spreading slowly';
    return 'Contained';
}

function animateNumberChange(element, start, end) {
    const duration = 500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.round(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

export function startSocialMetrics() {
    // Simulate dynamic social media metrics
    setInterval(() => {
        // Only update if crisis hasn't been resolved
        if (gameState.completedPosts.length < 3) {
            // Viral spread continues if not addressed
            if (!gameState.completedPosts.includes(1)) {
                gameState.viralSpread = Math.min(gameState.viralSpread + 0.5, 100);
                gameState.trustLevel = Math.max(gameState.trustLevel - 0.3, 0);
            }
            
            // Privacy risk increases with unaddressed violations
            if (gameState.privacyScore < 50) {
                gameState.privacyScore = Math.max(gameState.privacyScore - 0.2, 0);
            }
            
            // Troll accounts become more active during crisis
            if (Math.random() < 0.1 && gameState.trollAccounts < 20) {
                gameState.trollAccounts++;
            }
        } else {
            // Crisis resolution phase - metrics improve
            gameState.viralSpread = Math.max(gameState.viralSpread - 1, 0);
            gameState.trustLevel = Math.min(gameState.trustLevel + 0.5, 100);
            gameState.privacyScore = Math.min(gameState.privacyScore + 0.8, 100);
        }
        
        updateMetrics();
    }, 3000);
    
    // Real-time social media activity simulation
    startActivitySimulation();
}

function startActivitySimulation() {
    // Simulate real-time social media notifications and activity
    setInterval(() => {
        if (gameState.completedPosts.length < 3) {
            simulateNotification();
        }
    }, 8000);
}

function simulateNotification() {
    const notifications = [
        { type: 'comment', text: 'New comment on viral post', icon: 'bi-chat' },
        { type: 'share', text: 'Private DMs shared 15 more times', icon: 'bi-arrow-repeat' },
        { type: 'report', text: '3 users reported blackmail content', icon: 'bi-flag' },
        { type: 'support', text: 'Support group formed for Alex', icon: 'bi-heart' }
    ];
    
    const notification = notifications[Math.floor(Math.random() * notifications.length)];
    
    // Create floating notification
    const notifElement = document.createElement('div');
    notifElement.className = 'fixed top-20 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-40 animate-slide-in';
    notifElement.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="${notification.icon} text-blue-500"></i>
            <span class="text-sm text-gray-800">${notification.text}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600 ml-2">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notifElement);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notifElement.parentElement) {
            notifElement.remove();
        }
    }, 4000);
}

// CSS for animations
if (!document.querySelector('#social-animations')) {
    const style = document.createElement('style');
    style.id = 'social-animations';
    style.textContent = `
        @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-slide-in {
            animation: slide-in 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
}
