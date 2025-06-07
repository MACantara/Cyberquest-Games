import { gameState, updateGameMetrics, trackPlayerPattern } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';
import { triggerPatternBreakEffect } from './glitchEffects.js';

let activePatternBreakers = {
    randomization: false,
    delayTactic: false,
    reverseLogic: false
};

export function activateRandomization() {
    activePatternBreakers.randomization = true;
    gameState.patternsBroken++;
    gameState.unpredictableActions++;
    
    // Dramatically reduce AI confidence
    gameState.aiConfidence = Math.max(20, gameState.aiConfidence - 25);
    gameState.predictabilityScore = Math.max(10, gameState.predictabilityScore - 30);
    
    triggerPatternBreakEffect();
    
    // Show randomization effect
    createRandomizationOverlay();
    
    updateMentorMessage("🎲 RANDOMIZATION ACTIVATED! The AI's behavioral models are scrambled. Your next choice will be completely unpredictable!");
    
    // Auto-deactivate after next response
    setTimeout(() => {
        activePatternBreakers.randomization = false;
    }, 30000); // 30 seconds or until next response
}

export function activateDelayTactic() {
    activePatternBreakers.delayTactic = true;
    gameState.patternsBroken++;
    gameState.unpredictableActions++;
    
    // Disrupt AI's time-based predictions
    gameState.aiConfidence = Math.max(15, gameState.aiConfidence - 20);
    
    triggerPatternBreakEffect();
    
    // Show delay countdown effect
    createDelayCountdown();
    
    updateMentorMessage("⏱️ DELAY TACTIC ENGAGED! You're disrupting the AI's time-based behavioral models. Take your time with the next decision.");
    
    // Force a minimum response delay
    const originalResponseOptions = document.querySelectorAll('.response-option');
    originalResponseOptions.forEach(option => {
        option.style.pointerEvents = 'none';
        option.style.opacity = '0.5';
    });
    
    // Re-enable after delay
    setTimeout(() => {
        originalResponseOptions.forEach(option => {
            option.style.pointerEvents = 'auto';
            option.style.opacity = '1';
        });
        activePatternBreakers.delayTactic = false;
    }, 8000); // 8 second forced delay
}

export function activateReverseLogic() {
    activePatternBreakers.reverseLogic = true;
    gameState.patternsBroken++;
    gameState.unpredictableActions++;
    
    // Heavily disrupt AI confidence in logical predictions
    gameState.aiConfidence = Math.max(10, gameState.aiConfidence - 30);
    gameState.predictabilityScore = Math.max(5, gameState.predictabilityScore - 35);
    
    triggerPatternBreakEffect();
    
    // Show reverse logic effect
    createReverseLogicOverlay();
    
    updateMentorMessage("🔄 REVERSE LOGIC ACTIVATED! Do the OPPOSITE of what seems logical. The AI expects rational choices - confound it with chaos!");
    
    // Visually indicate reverse logic mode
    document.querySelectorAll('.response-option').forEach(option => {
        option.style.border = '2px solid #8b5cf6';
        option.style.background = 'linear-gradient(45deg, #581c87, #7c3aed)';
    });
    
    // Auto-deactivate after next response
    setTimeout(() => {
        activePatternBreakers.reverseLogic = false;
        document.querySelectorAll('.response-option').forEach(option => {
            option.style.border = '';
            option.style.background = '';
        });
    }, 30000);
}

function createRandomizationOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 pointer-events-none z-50';
    overlay.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-20 animate-pulse"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-spin">
            🎲
        </div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8 text-purple-300 font-bold text-xl text-center animate-bounce">
            CHAOS MODE ACTIVATED
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.remove();
    }, 3000);
}

function createDelayCountdown() {
    const countdown = document.createElement('div');
    countdown.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-900 border-4 border-orange-500 rounded-lg p-8 z-50 text-center';
    countdown.innerHTML = `
        <div class="text-4xl mb-4">⏱️</div>
        <div class="text-orange-300 font-bold text-xl mb-4">TEMPORAL DISRUPTION</div>
        <div class="text-orange-200 text-lg">AI time predictions scrambled</div>
        <div id="delay-timer" class="text-orange-400 font-mono text-3xl mt-4">8</div>
    `;
    
    document.body.appendChild(countdown);
    
    let timeLeft = 8;
    const timer = setInterval(() => {
        timeLeft--;
        const timerElement = countdown.querySelector('#delay-timer');
        if (timerElement) {
            timerElement.textContent = timeLeft;
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            countdown.remove();
        }
    }, 1000);
}

function createReverseLogicOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 pointer-events-none z-50';
    overlay.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-25 animate-pulse"></div>
        <div class="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center">
            <div class="text-6xl mb-4 animate-spin" style="animation-direction: reverse;">🔄</div>
            <div class="text-purple-300 font-bold text-2xl animate-bounce">LOGIC REVERSED</div>
            <div class="text-purple-200 text-lg mt-2">Think backwards. Act irrationally.</div>
        </div>
        <div class="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-purple-400 text-lg font-mono animate-pulse">
            if (logical) { don't(); } else { do(); }
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.remove();
    }, 4000);
}

export function checkPatternBreakerEffects(optionId, scenario) {
    let modifiedChoice = optionId;
    let effectDescription = '';
    
    // Apply randomization effect
    if (activePatternBreakers.randomization) {
        const availableOptions = scenario.options.map(opt => opt.id);
        modifiedChoice = availableOptions[Math.floor(Math.random() * availableOptions.length)];
        effectDescription += '🎲 Random choice selected. ';
        activePatternBreakers.randomization = false;
        
        // Track as extremely unpredictable
        trackPlayerPattern(modifiedChoice, Math.random() * 10 + 5, Math.random()); // Random time and risk
    }
    
    // Apply reverse logic effect
    if (activePatternBreakers.reverseLogic) {
        // Find the option that breaks patterns or is most unexpected
        const patternBreakers = scenario.options.filter(opt => opt.breakPattern);
        if (patternBreakers.length > 0) {
            modifiedChoice = patternBreakers[Math.floor(Math.random() * patternBreakers.length)].id;
        } else {
            // If no pattern breakers, choose opposite of predicted
            const nonPredicted = scenario.options.filter(opt => opt.id !== scenario.predictedResponse);
            if (nonPredicted.length > 0) {
                modifiedChoice = nonPredicted[Math.floor(Math.random() * nonPredicted.length)].id;
            }
        }
        effectDescription += '🔄 Logic reversed - opposite choice made. ';
        activePatternBreakers.reverseLogic = false;
        
        // Track as maximum unpredictability
        trackPlayerPattern(modifiedChoice, Math.random() * 5 + 10, 0.9 + Math.random() * 0.1);
    }
    
    // Delay tactic just affects timing (handled in the delay function)
    if (activePatternBreakers.delayTactic) {
        effectDescription += '⏱️ Response timing disrupted. ';
    }
    
    return {
        choice: modifiedChoice,
        effectApplied: effectDescription.length > 0,
        description: effectDescription
    };
}

export function getPatternBreakerStatus() {
    return {
        activeBreakers: Object.keys(activePatternBreakers).filter(key => activePatternBreakers[key]),
        totalBroken: gameState.patternsBroken,
        unpredictableActions: gameState.unpredictableActions
    };
}

export function resetPatternBreakers() {
    // Reset all pattern breaker tools for new scenario
    Object.keys(activePatternBreakers).forEach(key => {
        activePatternBreakers[key] = false;
    });
    
    // Re-enable tool buttons
    document.querySelectorAll('#randomize-approach, #delay-response, #reverse-logic').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
        btn.innerHTML = btn.innerHTML.replace('<i class="bi bi-check-lg mr-2"></i> USED', btn.textContent.trim());
    });
}

// Advanced pattern disruption for expert mode
export function activateQuantumUncertainty() {
    // Ultimate pattern breaker - complete chaos
    gameState.patternsBroken += 3;
    gameState.unpredictableActions += 3;
    gameState.aiConfidence = Math.max(5, gameState.aiConfidence - 50);
    gameState.predictabilityScore = Math.max(0, gameState.predictabilityScore - 60);
    
    const chaosOverlay = document.createElement('div');
    chaosOverlay.className = 'fixed inset-0 z-60 pointer-events-none';
    chaosOverlay.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-r from-red-600 via-purple-600 via-blue-600 via-green-600 to-yellow-600 opacity-30 animate-pulse"></div>
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
                <div class="text-8xl mb-4 animate-spin">⚛️</div>
                <div class="text-white font-bold text-3xl animate-bounce">QUANTUM CHAOS</div>
                <div class="text-gray-200 text-xl mt-2">Reality.exe has stopped working</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(chaosOverlay);
    
    setTimeout(() => {
        chaosOverlay.remove();
    }, 5000);
    
    updateMentorMessage("⚛️ QUANTUM UNCERTAINTY ACTIVATED! You've completely shattered the AI's behavioral models. Pure chaos mode!");
}
