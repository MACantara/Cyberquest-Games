export function updateMentorMessage(message) {
    document.getElementById('mentor-message').textContent = message;
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
