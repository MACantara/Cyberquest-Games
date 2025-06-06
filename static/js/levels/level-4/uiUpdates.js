export function updateMentorMessage(message) {
    document.getElementById('mentor-message').textContent = message;
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
    if (secured) {
        accountItem.className = 'account-item bg-green-900 border border-green-600 rounded p-3 opacity-75';
        accountItem.querySelector('.text-red-400, .text-yellow-400').className = 'bi bi-shield-check text-green-400 text-lg flex-shrink-0 mt-1';
    } else {
        accountItem.classList.add('animate-pulse');
    }
}
