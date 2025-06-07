import { gameState, updateGameMetrics, trackPlayerPattern, simulateAILearning, generateGhostPrediction } from './gameState.js';
import { updateMentorMessage, showResultModal, updateAILearningFeed } from './uiUpdates.js';
import { triggerPatternBreakEffect, intensifyGlitchEffects } from './glitchEffects.js';
import { checkPatternBreakerEffects, resetPatternBreakers } from './patternBreakers.js';

export let scenarios = {};
let scenarioStartTime = 0;
let countdownTimer = null;

export async function loadScenarios() {
    try {
        const response = await fetch('/static/js/levels/level-7/data/scenarios.json');
        scenarios = await response.json();
        console.log('Blue vs Red scenarios loaded');
    } catch (error) {
        console.error('Failed to load scenarios:', error);
    }
}

export function startScenario(scenarioId) {
    const scenario = scenarios[scenarioId];
    if (!scenario || gameState.completedScenarios.includes(scenarioId)) {
        return;
    }
    
    gameState.currentScenario = scenario;
    gameState.battlePhase = 'active';
    scenarioStartTime = Date.now();
    gameState.scenarioStartTime = scenarioStartTime;
    
    displayScenario(scenario);
    startScenarioTimer(scenario.timeLimit);
    generateAIPrediction(scenario);
    
    updateMentorMessage(`Red Team scenario detected: ${scenario.name}. The AI has ${scenario.timeLimit} seconds to predict your response. Stay unpredictable!`);
}

function displayScenario(scenario) {
    // Hide placeholder, show active scenario
    document.getElementById('scenario-placeholder').classList.add('hidden');
    document.getElementById('scenario-active').classList.remove('hidden');
    
    // Update scenario content
    document.getElementById('scenario-description').innerHTML = `
        <div class="flex items-start gap-3 mb-3">
            <div class="text-2xl">${getScenarioIcon(scenario.category)}</div>
            <div>
                <h4 class="text-blue-300 font-bold">${scenario.name}</h4>
                <span class="text-xs px-2 py-1 rounded ${getDifficultyColor(scenario.difficulty)} font-medium">
                    ${scenario.difficulty}
                </span>
            </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">${scenario.description}</p>
    `;
    
    // Generate and display ghost prediction
    const ghostPredictions = generateGhostPrediction(scenario);
    updateGhostDisplay(ghostPredictions);
    
    // Populate response options
    populateResponseOptions(scenario);
    
    // Update AI prediction warning
    updateAIPredictionWarning(scenario);
}

function getScenarioIcon(category) {
    const icons = {
        'email_security': '🎣',
        'access_management': '🔐', 
        'malware_defense': '🦠',
        'incident_management': '🚨',
        'vulnerability_management': '🏴‍☠️'
    };
    return icons[category] || '⚔️';
}

function getDifficultyColor(difficulty) {
    const colors = {
        'Basic': 'bg-blue-600 text-white',
        'Intermediate': 'bg-purple-600 text-white',
        'Advanced': 'bg-orange-600 text-white',
        'Expert': 'bg-red-600 text-white',
        'Master': 'bg-pink-600 text-white'
    };
    return colors[difficulty] || 'bg-gray-600 text-white';
}

function populateResponseOptions(scenario) {
    const optionsContainer = document.getElementById('response-options');
    optionsContainer.innerHTML = scenario.options.map(option => `
        <button class="response-option w-full text-left p-3 rounded-lg border transition-all duration-200 ${
            option.breakPattern 
                ? 'border-green-500 bg-green-900 hover:bg-green-800 text-green-300' 
                : 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300'
        }" data-option="${option.id}" data-breaks-pattern="${option.breakPattern}">
            <div class="flex items-center justify-between">
                <span class="font-medium">${option.text}</span>
                ${option.breakPattern 
                    ? '<span class="text-green-400 text-xs">🔀 UNPREDICTABLE</span>' 
                    : '<span class="text-gray-500 text-xs">📊 PREDICTABLE</span>'
                }
            </div>
            <div class="text-xs text-gray-400 mt-1">${option.logic}</div>
        </button>
    `).join('');
}

function updateAIPredictionWarning(scenario) {
    const warningElement = document.getElementById('ai-prediction-warning');
    const predictionText = document.getElementById('ai-prediction-text');
    
    if (warningElement && predictionText) {
        const predictions = [
            `AI expects you to choose "${scenario.predictedResponse}" based on your Level ${Math.floor(Math.random() * 6) + 1} behavior patterns.`,
            `Behavioral analysis suggests ${Math.floor(Math.random() * 20) + 70}% probability of standard defensive response.`,
            `Your response time pattern indicates ${gameState.playerPatterns.responseSpeed.length > 0 ? 
                (gameState.playerPatterns.responseSpeed.reduce((a,b) => a+b,0)/gameState.playerPatterns.responseSpeed.length).toFixed(1) + 's' : '3.2s'} average - AI adjusting pressure accordingly.`,
            `Risk tolerance analysis: ${gameState.predictabilityScore}% predictable - countermeasures prepared.`
        ];
        
        predictionText.textContent = predictions[Math.floor(Math.random() * predictions.length)];
        warningElement.classList.remove('hidden');
    }
}

function updateGhostDisplay(ghostPredictions) {
    const ghostElement = document.getElementById('ghost-predictions');
    if (ghostElement && ghostPredictions.length > 0) {
        let currentIndex = 0;
        
        const showNextPrediction = () => {
            if (currentIndex < ghostPredictions.length) {
                ghostElement.innerHTML = `<span class="text-purple-300 text-sm animate-pulse">👻 ${ghostPredictions[currentIndex]}</span>`;
                currentIndex++;
                setTimeout(showNextPrediction, 2000);
            } else {
                ghostElement.innerHTML = '<span class="text-purple-400 text-sm">Quantum probability scanner active...</span>';
            }
        };
        
        showNextPrediction();
    }
}

function startScenarioTimer(timeLimit) {
    let timeRemaining = timeLimit;
    const timerElement = document.getElementById('scenario-timer');
    
    gameState.scenarioTimer = setInterval(() => {
        timeRemaining--;
        
        if (timerElement) {
            timerElement.textContent = timeRemaining + 's';
            
            if (timeRemaining <= 5) {
                timerElement.className = 'text-red-400 font-mono text-sm animate-pulse';
            } else if (timeRemaining <= 10) {
                timerElement.className = 'text-yellow-400 font-mono text-sm';
            }
        }
        
        if (timeRemaining <= 10) {
            gameState.aiConfidence = Math.min(95, gameState.aiConfidence + 1);
            updateGameMetrics();
        }
        
        if (timeRemaining <= 0) {
            clearInterval(gameState.scenarioTimer);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    gameState.aiConfidence = Math.min(95, gameState.aiConfidence + 20);
    gameState.predictabilityScore = Math.min(100, gameState.predictabilityScore + 15);
    gameState.roundsLost++;
    gameState.totalRounds++;
    
    updateMentorMessage("Time pressure worked against you! The AI exploited your hesitation. Speed up your decision-making to stay unpredictable.");
    
    showResultModal('⏰', 'Time Pressure Victory', 
        'The AI exploited your decision delay to increase prediction confidence.',
        `
            <div class="text-yellow-400 space-y-2">
                <p class="font-bold">⚠️ AI PSYCHOLOGICAL VICTORY</p>
                <p class="text-sm">Time pressure is a classic manipulation tactic. The AI used your hesitation to strengthen its behavioral models.</p>
                <ul class="text-xs list-disc list-inside space-y-1 mt-2">
                    <li>AI confidence increased to ${gameState.aiConfidence}%</li>
                    <li>Your predictability pattern reinforced</li>
                    <li>Pressure tactics proven effective</li>
                </ul>
                <p class="text-yellow-300 text-sm mt-3">Adapt faster to counter AI manipulation!</p>
            </div>
        `
    );
    
    simulateAILearning();
    updateGameMetrics();
    
    setTimeout(() => {
        closeScenario();
    }, 3000);
}

export function handleDecision(optionId, responseTime, riskLevel) {
    const scenario = gameState.currentScenario;
    if (!scenario) return;
    
    if (gameState.scenarioTimer) {
        clearInterval(gameState.scenarioTimer);
        gameState.scenarioTimer = null;
    }
    
    const patternResult = checkPatternBreakerEffects(optionId, scenario);
    const finalChoice = patternResult.choice;
    const selectedOption = scenario.options.find(opt => opt.id === finalChoice);
    
    trackPlayerPattern(finalChoice, responseTime / 1000, riskLevel);
    
    const aiPredictedCorrectly = finalChoice === scenario.predictedResponse;
    gameState.aiPredictions++;
    
    if (aiPredictedCorrectly && !patternResult.effectApplied) {
        gameState.correctPredictions++;
        gameState.aiConfidence = Math.min(95, gameState.aiConfidence + 15);
        gameState.roundsLost++;
        
        showResultModal('🤖', 'AI PREDICTED CORRECTLY!', 
            `The Red Team AI successfully predicted your "${selectedOption.text}" response.`,
            `
                <div class="text-red-400 space-y-2">
                    <p class="font-bold">❌ BLUE TEAM OUTMANEUVERED</p>
                    <p class="text-sm">Your behavioral patterns from previous levels allowed the AI to predict this choice with high confidence.</p>
                    <div class="bg-red-900 border border-red-600 rounded p-2 mt-2">
                        <p class="text-red-300 text-xs font-medium">AI Analysis:</p>
                        <p class="text-red-200 text-xs">${scenario.aiCountermeasure}</p>
                    </div>
                    <p class="text-red-300 text-sm mt-3">AI Confidence: +15% → ${gameState.aiConfidence}%</p>
                </div>
            `
        );
        
        updateMentorMessage("The AI read you perfectly! It used your behavioral patterns from earlier levels to predict that exact response. You need to break your patterns!");
        
    } else {
        gameState.aiConfidence = Math.max(10, gameState.aiConfidence - 10);
        gameState.roundsWon++;
        
        if (selectedOption.breakPattern || patternResult.effectApplied) {
            gameState.patternsBroken++;
            gameState.predictabilityScore = Math.max(0, gameState.predictabilityScore - 20);
        }
        
        let title = patternResult.effectApplied ? 'PATTERN DISRUPTED!' : 'AI PREDICTION FAILED!';
        let message = patternResult.effectApplied 
            ? `Pattern breaker tool changed your choice to "${selectedOption.text}"`
            : `You chose "${selectedOption.text}" - the AI expected "${scenario.predictedResponse}"`;
        
        showResultModal('🛡️', title, message,
            `
                <div class="text-green-400 space-y-2">
                    <p class="font-bold">✅ BLUE TEAM VICTORY</p>
                    <p class="text-sm">${patternResult.effectApplied ? patternResult.description : 'Your unpredictable choice disrupted the AI\'s behavioral models.'}</p>
                    ${selectedOption.breakPattern ? `
                        <div class="bg-green-900 border border-green-600 rounded p-2 mt-2">
                            <p class="text-green-300 text-xs font-medium">Pattern Analysis:</p>
                            <p class="text-green-200 text-xs">${selectedOption.logic}</p>
                        </div>
                    ` : ''}
                    <p class="text-green-300 text-sm mt-3">AI Confidence: -10% → ${gameState.aiConfidence}%</p>
                </div>
            `
        );
        
        updateMentorMessage(patternResult.effectApplied 
            ? `Excellent! The pattern breaker completely confused the AI. Your unpredictability is working!`
            : `Great choice! You avoided the AI's prediction trap by thinking outside your usual patterns.`);
    }
    
    gameState.totalRounds++;
    gameState.completedScenarios.push(scenario.id);
    
    simulateAILearning();
    updateGameMetrics();
    
    checkBattleStatus();
    
    setTimeout(() => {
        closeScenario();
    }, 3000);
}

function checkBattleStatus() {
    if (gameState.patternsBroken >= 3 && gameState.aiConfidence <= 30) {
        setTimeout(() => {
            showResultModal('🏆', 'BLUE TEAM VICTORY!', 
                'You have successfully disrupted the adaptive AI and broken free from its predictions!',
                `
                    <div class="text-green-400 space-y-2">
                        <p class="font-bold">🏆 ADAPTIVE AI DEFEATED</p>
                        <p class="text-sm">Your unpredictable tactics and pattern disruption have rendered the AI's behavioral models useless.</p>
                        <div class="text-xs mt-2 space-y-1">
                            <p>• Patterns Broken: ${gameState.patternsBroken}</p>
                            <p>• AI Confidence Reduced: ${100 - gameState.aiConfidence}%</p>
                            <p>• Battle Scenarios Won: ${gameState.roundsWon}/${gameState.totalRounds}</p>
                        </div>
                        <p class="text-green-300 text-sm mt-3">The Null's learning algorithm has been neutralized!</p>
                    </div>
                `
            );
            
            document.getElementById('complete-level').disabled = false;
            updateMentorMessage("Outstanding! You've completely outmaneuvered the adaptive AI. No algorithm can predict true human creativity and adaptability!");
        }, 2000);
        
    } else if (gameState.aiConfidence >= 90 && gameState.totalRounds >= 3) {
        setTimeout(() => {
            showResultModal('🤖', 'RED TEAM VICTORY', 
                'The adaptive AI has achieved complete behavioral prediction dominance.',
                `
                    <div class="text-red-400 space-y-2">
                        <p class="font-bold">❌ AI SUPREMACY ACHIEVED</p>
                        <p class="text-sm">Your patterns were too predictable. The AI successfully mapped your behavioral responses.</p>
                        <div class="text-xs mt-2 space-y-1">
                            <p>• AI Confidence: ${gameState.aiConfidence}%</p>
                            <p>• Predictability Score: ${gameState.predictabilityScore}%</p>
                            <p>• Successful Predictions: ${gameState.correctPredictions}/${gameState.aiPredictions}</p>
                        </div>
                        <p class="text-red-300 text-sm mt-3">Try breaking your patterns more aggressively!</p>
                    </div>
                `
            );
            
            updateMentorMessage("The AI learned your patterns too well. This is why The Null is so dangerous - it adapts to counter every strategy. You need to become more unpredictable!");
        }, 2000);
    } else if (gameState.totalRounds >= 5) {
        updateMentorMessage("The battle continues! The AI is learning, but you're staying ahead. Keep using pattern breakers and unpredictable tactics.");
    }
}

export function closeScenario() {
    document.getElementById('scenario-active').classList.add('hidden');
    document.getElementById('scenario-placeholder').classList.remove('hidden');
    
    gameState.currentScenario = null;
    gameState.battlePhase = 'preparation';
    
    resetPatternBreakers();
    
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-white');
    });
}

function generateAIPrediction(scenario) {
    // Update AI prediction display
    updateAILearningFeed(`Analyzing scenario: ${scenario.name}`);
    updateAILearningFeed(`Expected response: ${scenario.predictedResponse}`);
    updateAILearningFeed(`Confidence level: ${gameState.aiConfidence}%`);
}
