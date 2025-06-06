export function updateMentorMessage(message) {
    // Create floating AI mentor message
    createMentorNotification(message);
}

export function showResultModal(icon, title, message, feedback) {
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-feedback').innerHTML = feedback;
    document.getElementById('results-modal').classList.remove('hidden');
}

export function updatePostVisual(postId, resolved) {
    const postItem = document.querySelector(`[data-post="${postId}"]`);
    if (postItem) {
        if (resolved) {
            // Success styling - resolved post
            postItem.classList.remove('animate-pulse', 'border-red-400', 'border-orange-400', 'border-purple-400');
            postItem.classList.add('opacity-75', 'border-green-400');
            
            // Add resolution indicator
            let successIcon = postItem.querySelector('.resolution-indicator');
            if (!successIcon) {
                successIcon = document.createElement('div');
                successIcon.className = 'resolution-indicator absolute top-2 right-2 bg-green-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg';
                successIcon.innerHTML = '<i class="bi bi-check text-white text-sm font-bold"></i>';
                postItem.style.position = 'relative';
                postItem.appendChild(successIcon);
            }
            
            // Update engagement metrics to show resolution impact
            updateEngagementAfterResolution(postItem, postId);
            
        } else {
            // Failure styling - crisis continues
            postItem.classList.add('border-red-500', 'animate-pulse');
            
            // Add warning indicator
            let warningIcon = postItem.querySelector('.resolution-indicator');
            if (!warningIcon) {
                warningIcon = document.createElement('div');
                warningIcon.className = 'resolution-indicator absolute top-2 right-2 bg-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse';
                warningIcon.innerHTML = '<i class="bi bi-exclamation-triangle text-white text-sm"></i>';
                postItem.style.position = 'relative';
                postItem.appendChild(warningIcon);
            }
        }
    }
}

function updateEngagementAfterResolution(postElement, postId) {
    // Simulate positive change in engagement after good moderation
    const likesElement = postElement.querySelector('.bi-heart-fill + span, .bi-heart + span');
    const commentsElement = postElement.querySelector('.bi-chat-fill + span, .bi-chat + span');
    const sharesElement = postElement.querySelector('.bi-arrow-repeat + span');
    
    if (postId === 1) { // Echo's post - engagement drops as people unshare
        if (sharesElement) {
            const currentShares = parseInt(sharesElement.textContent.replace(/\D/g, ''));
            const newShares = Math.max(currentShares - 30, 0);
            sharesElement.textContent = `${newShares} shares`;
        }
    } else if (postId === 2) { // Alex's response - gets more support
        if (likesElement) {
            const currentLikes = parseInt(likesElement.textContent.replace(/\D/g, ''));
            const newLikes = currentLikes + 50;
            likesElement.textContent = formatEngagementNumber(newLikes);
        }
    }
}

function formatEngagementNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function createMentorNotification(message) {
    // Remove existing mentor notifications
    document.querySelectorAll('.mentor-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'mentor-notification fixed bottom-20 left-4 max-w-md bg-cyan-900 border-2 border-cyan-500 text-cyan-100 p-4 rounded-lg shadow-2xl z-50 animate-slide-up';
    notification.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="bi bi-robot text-cyan-900 text-sm"></i>
            </div>
            <div class="flex-1">
                <div class="text-cyan-300 font-semibold text-sm mb-1">Emergency AI - AEGIS</div>
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

export function createSocialAlert(message, type = 'info', duration = 5000) {
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
        crisis: {
            bg: 'bg-red-100',
            border: 'border-red-400',
            text: 'text-red-900',
            icon: 'bi-exclamation-triangle text-red-700'
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

export function updateCommunityMood(mood) {
    // Update the social media interface to reflect community mood
    const header = document.querySelector('header');
    const crisisIndicator = header?.querySelector('.bg-red-100');
    
    if (mood === 'healing' && crisisIndicator) {
        crisisIndicator.className = 'bg-green-100 border border-green-300 rounded-lg px-3 py-1 flex items-center gap-2';
        crisisIndicator.innerHTML = `
            <i class="bi bi-heart text-green-600"></i>
            <span class="text-green-700 text-sm font-medium">Community Healing</span>
        `;
    } else if (mood === 'crisis' && crisisIndicator) {
        crisisIndicator.className = 'bg-red-100 border border-red-300 rounded-lg px-3 py-1 flex items-center gap-2';
        crisisIndicator.innerHTML = `
            <i class="bi bi-exclamation-triangle text-red-600 animate-pulse"></i>
            <span class="text-red-700 text-sm font-medium">Crisis Mode Active</span>
        `;
    }
}

export function showCommunityImpactFeedback(impact) {
    // Show the real-world impact of moderation decisions
    const feedbackTypes = {
        positive: {
            icon: '💙',
            title: 'Positive Community Impact',
            message: 'Your ethical moderation is helping heal relationships and restore trust.',
            class: 'border-green-400 bg-green-50 text-green-800'
        },
        negative: {
            icon: '💔',
            title: 'Community Damage',
            message: 'Poor moderation decisions are causing lasting harm to relationships.',
            class: 'border-red-400 bg-red-50 text-red-800'
        },
        neutral: {
            icon: '⚖️',
            title: 'Mixed Results',
            message: 'Some progress made, but more thoughtful action needed.',
            class: 'border-yellow-400 bg-yellow-50 text-yellow-800'
        }
    };
    
    const feedback = feedbackTypes[impact] || feedbackTypes.neutral;
    
    createSocialAlert(`${feedback.icon} ${feedback.title}: ${feedback.message}`, impact, 6000);
}

// CSS animations for smooth social media interactions
if (!document.querySelector('#social-ui-animations')) {
    const style = document.createElement('style');
    style.id = 'social-ui-animations';
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
        
        .post-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
        }
        
        .resolution-indicator {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
}
