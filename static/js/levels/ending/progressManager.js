import { generateSampleProgress } from './gameData.js';

export function loadPlayerProgress() {
    // Load progress from localStorage or generate sample data
    const savedProgress = localStorage.getItem('cyberquest_progress');
    
    if (savedProgress) {
        window.playerProgress = JSON.parse(savedProgress);
    } else {
        // Generate sample completion data
        window.playerProgress = generateSampleProgress();
    }
}

export function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

export function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const duration = 2000;
    const start = Date.now();
    
    function update() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(targetValue * progress);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

export function animateCounters() {
    // Animate total score
    animateCounter('total-score', window.playerProgress.totalScore);
    
    // Animate completion time
    document.getElementById('completion-time').textContent = formatTime(window.playerProgress.totalTime);
    
    // Animate skill points
    animateCounter('skill-points', window.playerProgress.skillPoints);
}
