import { gameState } from './gameState.js';
import { suspects } from './dataLoader.js';
import { showResultModal } from './uiUpdates.js';

export function showSuspectDetails(suspectId) {
    const suspect = suspects[suspectId];
    const confidence = gameState.suspectConfidence[Object.keys(gameState.suspectConfidence)[suspectId - 1]];
    
    showResultModal('👤', suspect.name, 
        `Analysis of ${suspect.name}'s involvement in The Null operation.`,
        `
            <div class="text-left space-y-3">
                <div class="bg-gray-800 rounded p-3">
                    <p class="text-gray-300 text-sm"><strong>Background:</strong> ${suspect.background}</p>
                </div>
                <div class="bg-gray-800 rounded p-3">
                    <p class="text-gray-300 text-sm"><strong>Motive:</strong> ${suspect.motive}</p>
                </div>
                <div class="bg-gray-800 rounded p-3">
                    <p class="text-gray-300 text-sm"><strong>Alibi:</strong> ${suspect.alibi}</p>
                </div>
                <div class="text-center">
                    <p class="text-cyan-400 text-sm">Current Confidence: ${confidence}%</p>
                </div>
            </div>
        `
    );
}
