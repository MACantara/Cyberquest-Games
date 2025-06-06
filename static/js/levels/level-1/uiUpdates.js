export function updateMentorMessage(message) {
    document.getElementById('mentor-message').textContent = message;
}

export function updateCredibilityMeter(score) {
    const meter = document.getElementById('credibility-meter');
    const text = document.getElementById('credibility-text');
    
    meter.style.width = score + '%';
    
    if (score >= 80) {
        meter.className = 'bg-green-400 h-3 rounded transition-all duration-500';
        text.textContent = 'Highly credible source';
    } else if (score >= 50) {
        meter.className = 'bg-yellow-400 h-3 rounded transition-all duration-500';
        text.textContent = 'Moderately credible';
    } else {
        meter.className = 'bg-red-400 h-3 rounded transition-all duration-500';
        text.textContent = 'Low credibility - suspicious';
    }
}

export function showResultModal(icon, title, message, feedback) {
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-feedback').innerHTML = feedback;
    document.getElementById('results-modal').classList.remove('hidden');
}

export function updateTimerDisplay(timeRemaining) {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
