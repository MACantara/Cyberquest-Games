import { gameState } from './gameState.js';
import { showResultModal } from './uiUpdates.js';

export function endGame() {
    // Determine the most likely suspect based on evidence
    const maxConfidence = Math.max(...Object.values(gameState.suspectConfidence));
    const likelySuspect = Object.keys(gameState.suspectConfidence).find(key => gameState.suspectConfidence[key] === maxConfidence);
    
    const correctSuspect = 'dr'; // Dr. Reeves is the actual mastermind
    
    if (likelySuspect === correctSuspect && maxConfidence >= 60) {
        showVictoryEnding();
    } else {
        showPartialSuccess();
    }
}

export function showVictoryEnding() {
    showResultModal(
        '🏆',
        'The Null Unmasked!',
        'You\'ve successfully identified Dr. Alexis Reeves as The Null mastermind.',
        `
            <div class="text-left space-y-3">
                <div class="bg-purple-900 border border-purple-600 rounded p-3">
                    <p class="text-purple-300 font-semibold">🏆 Final Achievement Unlocked</p>
                    <p class="text-purple-200 text-sm">Cyber Sentinel - Master Analyst</p>
                </div>
                <div class="bg-green-900 border border-green-600 rounded p-3">
                    <p class="text-green-300 font-semibold">💡 THE TRUTH REVEALED</p>
                    <p class="text-green-200 text-sm">Dr. Reeves, motivated by revenge and ideological opposition to Academy practices, orchestrated The Null operation to expose what she viewed as unethical digital surveillance.</p>
                </div>
                <div class="text-sm space-y-1">
                    <p><strong>Evidence Collected:</strong> ${gameState.evidenceCollected}</p>
                    <p><strong>Truth Score:</strong> ${gameState.truthScore}</p>
                    <p><strong>Analysis Accuracy:</strong> ${Math.round((gameState.truthIndicators / 8) * 100)}%</p>
                </div>
            </div>
        `
    );
    
    // Show final cinematic after modal closes
    document.getElementById('continue-btn').onclick = function() {
        document.getElementById('results-modal').classList.add('hidden');
        showFinalCinematic();
    };
}

export function showPartialSuccess() {
    showResultModal(
        '⚠️',
        'Investigation Incomplete',
        'Your analysis shows promise but lacks sufficient evidence for a definitive conclusion.',
        `
            <div class="text-left space-y-3">
                <div class="bg-yellow-900 border border-yellow-600 rounded p-3">
                    <p class="text-yellow-300 font-semibold">📊 Partial Success</p>
                    <p class="text-yellow-200 text-sm">More evidence gathering needed for a conclusive case.</p>
                </div>
                <div class="text-sm space-y-1">
                    <p><strong>Evidence Collected:</strong> ${gameState.evidenceCollected}</p>
                    <p><strong>Truth Score:</strong> ${gameState.truthScore}</p>
                    <p><strong>Confidence Level:</strong> ${Math.round((gameState.truthIndicators / 8) * 100)}%</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Continue gathering evidence to improve your case.</p>
            </div>
        `
    );
}

export function showFinalCinematic() {
    showResultModal(
        '🎯',
        'Mission Complete: The Sentinel Protocol',
        'Your investigation has concluded. The digital frontier is secure.',
        `
            <div class="text-left bg-gradient-to-r from-purple-900 to-indigo-900 rounded p-4">
                <div class="text-center mb-4">
                    <div class="text-6xl mb-2">🛡️</div>
                    <h3 class="text-xl font-bold text-cyan-300">Cyber Sentinel Certified</h3>
                </div>
                
                <div class="space-y-3 text-sm">
                    <div class="bg-black bg-opacity-30 rounded p-3">
                        <p class="text-purple-300 font-semibold">Commander Vega's Final Assessment:</p>
                        <p class="text-gray-200 italic">"Nova, you didn't just stop a breach. You changed the system. Your leadership and reasoning have shaped the future of the Academy."</p>
                    </div>
                    
                    <div class="bg-black bg-opacity-30 rounded p-3">
                        <p class="text-indigo-300 font-semibold">Legacy Impact:</p>
                        <p class="text-gray-200">A new generation of cadets will learn from holographic recordings of your ethical decisions and analytical methods.</p>
                    </div>
                    
                    <div class="text-center bg-black bg-opacity-50 rounded p-3">
                        <p class="text-cyan-400 font-semibold">"In the shadows of the net, only those with clarity, courage, and conscience prevail."</p>
                        <p class="text-cyan-300 text-xs mt-2">You are that sentinel.</p>
                    </div>
                </div>
            </div>
        `
    );
    
    document.getElementById('continue-btn').onclick = function() {
        window.location.href = '/campaign';
    };
}
