import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export let scenarios = {};

export async function loadScenarios() {
    try {
        const response = await fetch('/static/js/levels/level-7/data/scenarios.json');
        scenarios = await response.json();
    } catch (error) {
        console.error('Failed to load scenarios:', error);
    }
}

export function startScenario(scenarioId) {
    gameState.currentScenario = scenarios[scenarioId];
    displayScenario(gameState.currentScenario);
    document.getElementById('tutorial-behavior').classList.add('hidden');
    
    updateMentorMessage(`Scenario ${scenarioId} active. The AI expects you to ${gameState.currentScenario.predictedResponse.replace('_', ' ')}. Surprise it!`);
}

export function displayScenario(scenario) {
    document.getElementById('mirror-placeholder').classList.add('hidden');
    document.getElementById('scenario-panel').classList.remove('hidden');
    
    document.getElementById('scenario-content').textContent = scenario.description;
    document.getElementById('ai-prediction').textContent = `Expects: ${scenario.predictedResponse.replace('_', ' ')}`;
    
    // Populate options
    const optionsContainer = document.getElementById('challenge-options');
    optionsContainer.innerHTML = scenario.options.map(option => `
        <button class="option-btn bg-gray-600 hover:bg-gray-500 text-white p-3 rounded text-sm font-medium ${option.breakPattern ? 'border-2 border-orange-400' : ''}" 
                data-option="${option.id}" data-breaks-pattern="${option.breakPattern}">
            ${option.breakPattern ? '🔀 ' : ''}${option.text}
        </button>
    `).join('');
    
    // Add event listeners to options
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const optionId = this.dataset.option;
            const breaksPattern = this.dataset.breaksPattern === 'true';
            handleChoice(optionId, breaksPattern);
        });
    });
    
    // Update AI confidence based on scenario
    gameState.aiConfidence = Math.min(95, gameState.aiConfidence + 5);
    updateGameMetrics();
}

export function handleChoice(optionId, breaksPattern) {
    const scenario = gameState.currentScenario;
    gameState.aiPredictions++;
    
    if (breaksPattern) {
        handlePatternBreak(scenario, optionId);
    } else {
        handlePredictableChoice(scenario, optionId);
    }
    
    gameState.completedScenarios.push(scenario.id);
    gameState.adaptationCycles++;
    updateGameMetrics();
    
    // Check if level complete
    if (gameState.patternsBroken >= 2 && gameState.predictabilityScore <= 30) {
        setTimeout(() => endGame(true), 2000);
    } else {
        setTimeout(() => {
            document.getElementById('scenario-panel').classList.add('hidden');
            document.getElementById('mirror-placeholder').classList.remove('hidden');
            updateMentorMessage("Good! Continue breaking patterns. The AI is adapting, but you're staying ahead.");
        }, 3000);
    }
}

export function handlePatternBreak(scenario, optionId) {
    gameState.patternsBroken++;
    gameState.predictabilityScore = Math.max(0, gameState.predictabilityScore - 20);
    gameState.aiConfidence = Math.max(20, gameState.aiConfidence - 15);
    
    // Positive visual feedback
    document.getElementById('player-action').innerHTML = `
        <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <i class="bi bi-check-circle text-white text-xl"></i>
        </div>
        <p class="text-green-300 text-sm">Pattern broken!</p>
    `;
    
    document.getElementById('ai-action').innerHTML = `
        <div class="w-16 h-16 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <i class="bi bi-x-circle text-white text-xl"></i>
        </div>
        <p class="text-red-300 text-sm">Prediction failed!</p>
    `;
    
    showResultModal('🔀', 'Pattern Disrupted!', 
        'You successfully broke your behavioral pattern!',
        '<div class="text-green-400">The AI failed to predict your response. System integrity improved.</div>'
    );
    
    updateMentorMessage("Excellent! You did the unexpected. The AI's confidence is dropping - it can't predict your next move.");
}

export function handlePredictableChoice(scenario, optionId) {
    gameState.predictabilityScore = Math.min(100, gameState.predictabilityScore + 10);
    gameState.aiConfidence = Math.min(95, gameState.aiConfidence + 10);
    gameState.systemIntegrity = Math.max(0, gameState.systemIntegrity - 15);
    
    // Negative visual feedback
    document.getElementById('player-action').innerHTML = `
        <div class="w-16 h-16 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <i class="bi bi-exclamation-triangle text-white text-xl"></i>
        </div>
        <p class="text-red-300 text-sm">Predicted move</p>
    `;
    
    document.getElementById('ai-action').innerHTML = `
        <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <i class="bi bi-check-circle text-white text-xl"></i>
        </div>
        <p class="text-green-300 text-sm">Perfect prediction!</p>
    `;
    
    showResultModal('🎯', 'AI Predicted Correctly', 
        'The AI successfully anticipated your response.',
        '<div class="text-red-400">Your predictable behavior allowed the AI to execute a perfect counter-attack.</div>'
    );
    
    updateMentorMessage("The AI saw that coming. You fell into your old patterns. Try to think outside your usual approach.");
}

export function endGame(success) {
    if (success) {
        updateMentorMessage("Outstanding! You've successfully defeated the adaptive AI by breaking your own patterns. The system is secure again.");
        document.getElementById('complete-level').disabled = false;
        
        showResultModal(
            '🏆',
            'AI Defeated!',
            'You\'ve successfully completed The Adaptive Adversary and earned the Unscripted badge.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-pink-900 border border-pink-600 rounded p-3">
                        <p class="text-pink-300 font-semibold">🏆 Digital Badge Earned</p>
                        <p class="text-pink-200 text-sm">Unscripted - Broke the Pattern</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Final Predictability:</strong> ${gameState.predictabilityScore}%</p>
                        <p><strong>Patterns Broken:</strong> ${gameState.patternsBroken}</p>
                        <p><strong>System Integrity:</strong> ${gameState.systemIntegrity}%</p>
                        <p><strong>AI Confidence:</strong> ${gameState.aiConfidence}%</p>
                    </div>
                </div>
            `
        );
    }
}
