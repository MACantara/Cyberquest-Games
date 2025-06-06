import { gameState } from './gameState.js';
import { spreadInfection } from './responseHandler.js';

export function startSpreadTimer() {
    const timer = setInterval(() => {
        if (gameState.spreadTimer > 0) {
            gameState.spreadTimer--;
            document.getElementById('spread-timer').textContent = gameState.spreadTimer;
            
            if (gameState.spreadTimer <= 0) {
                spreadInfection();
                gameState.spreadTimer = 60; // Reset timer
            }
        }
    }, 1000);
    
    // Store timer reference for cleanup
    gameState.spreadTimerRef = timer;
}
