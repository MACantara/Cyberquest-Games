export function updateMentorMessage(message) {
    const messageElement = document.getElementById('mentor-message');
    
    // Smooth message transition
    messageElement.style.opacity = '0.6';
    setTimeout(() => {
        messageElement.textContent = message;
        messageElement.style.opacity = '1';
    }, 200);
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
