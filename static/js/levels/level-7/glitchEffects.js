import { gameState } from './gameState.js';

export function startGlitchEffects() {
    setInterval(() => {
        if (gameState.aiConfidence > 50) {
            const glitchMonitor = document.getElementById('glitch-monitor');
            const glitchMessages = [
                '<span class="text-red-400">Memory corruption detected</span>',
                '<span class="text-purple-400">AI learning cycle active</span>',
                '<span class="text-yellow-400">Behavioral pattern analyzed</span>',
                '<span class="text-blue-400">Prediction algorithm updating</span>'
            ];
            
            const randomGlitch = glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
            glitchMonitor.innerHTML = `<div>${randomGlitch}</div>`;
            
            // Brief visual glitch effect
            document.body.style.filter = 'hue-rotate(90deg)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 200);
        }
    }, 8000);
}
