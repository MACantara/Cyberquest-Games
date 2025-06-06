import { gameState, updateGameMetrics } from './gameState.js';
import { showResultModal } from './uiUpdates.js';

export function handleRandomizeApproach() {
    gameState.predictabilityScore = Math.max(0, gameState.predictabilityScore - 10);
    showResultModal('🎲', 'Approach Randomized', 
        'You activated random behavior mode.',
        '<div class="text-blue-400">Temporary unpredictability boost applied.</div>'
    );
    updateGameMetrics();
}

export function handleDelayResponse() {
    gameState.predictabilityScore = Math.max(0, gameState.predictabilityScore - 15);
    showResultModal('⏱️', 'Response Delayed', 
        'You introduced deliberate delays to break timing patterns.',
        '<div class="text-orange-400">AI timing analysis disrupted.</div>'
    );
    updateGameMetrics();
}

export function handleReverseLogic() {
    gameState.predictabilityScore = Math.max(0, gameState.predictabilityScore - 25);
    showResultModal('🔄', 'Logic Reversed', 
        'You chose the opposite of your usual logical approach.',
        '<div class="text-purple-400">AI logic prediction algorithm confused.</div>'
    );
    updateGameMetrics();
}
