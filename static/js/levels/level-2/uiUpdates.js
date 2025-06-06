export function updateMentorMessage(message) {
    const messageElement = document.getElementById('mentor-message');
    const toast = document.getElementById('mentor-toast');
    
    // Show toast if it's hidden
    if (toast.classList.contains('-translate-y-full') || toast.classList.contains('opacity-0')) {
        if (window.showMentorToast) {
            window.showMentorToast();
        }
    }
    
    // Update message with smooth transition
    messageElement.style.opacity = '0.6';
    setTimeout(() => {
        messageElement.textContent = message;
        messageElement.style.opacity = '1';
    }, 200);
    
    // Add subtle glow effect for new messages
    toast.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4), 0 0 20px rgba(59, 130, 246, 0.2)';
    setTimeout(() => {
        toast.style.boxShadow = '';
    }, 2000);
    
    // Reset auto-hide timer when new message comes in
    clearTimeout(window.toastAutoHideTimer);
    window.toastAutoHideTimer = setTimeout(() => {
        if (window.hideMentorToast) {
            window.hideMentorToast();
        }
    }, 8000);
}

export function updateSenderInfo(info) {
    document.getElementById('sender-info').textContent = info;
}

export function updateLinkInfo(info) {
    document.getElementById('link-info').textContent = info;
}

export function showResultModal(icon, title, message, feedback) {
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-feedback').innerHTML = feedback;
    document.getElementById('results-modal').classList.remove('hidden');
}
