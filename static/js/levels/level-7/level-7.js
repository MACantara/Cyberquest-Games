import { gameState, updateGameMetrics } from './gameState.js';
import { loadScenarios, startScenario, closeScenario, handleDecision } from './scenarioHandler.js';
import { startGlitchEffects, stopGlitchEffects } from './glitchEffects.js';
import { activateRandomization, activateDelayTactic, activateReverseLogic } from './patternBreakers.js';
import { updateMentorMessage, showResultModal, updateAILearningFeed } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load Blue vs Red scenario data
    await loadScenarios();
    
    // Initialize adaptive AI battle
    function initAdaptiveBattle() {
        startGlitchEffects();
        showAdaptiveTutorial();
        startAILearningSimulation();
        enablePatternBreakers();
    }

    // Tutorial system for adaptive AI battle
    function showAdaptiveTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-behavior').classList.remove('hidden');
            updateMentorMessage("This isn't just any AI—it's learned from watching you across all previous levels. Your usual patterns won't work. Use the pattern disruption tools and think unpredictably!");
        }, 3000);
    }

    // Start real-time AI adaptation simulation
    function startAILearningSimulation() {
        setInterval(() => {
            if (gameState.currentScenario) {
                const learningMessages = [
                    `Analyzing decision latency: ${2.1 + Math.random() * 2}s average`,
                    `Pattern confidence increasing: ${gameState.predictabilityScore}%`,
                    `Countermeasure effectiveness: ${Math.floor(Math.random() * 30) + 60}%`,
                    `Behavioral model updating based on Level ${Math.floor(Math.random() * 6) + 1} data`,
                    `Prediction accuracy: ${Math.floor(gameState.aiConfidence)}%`,
                    `Deploying psychological pressure tactics...`,
                    `Adaptive response matrix recalibrating...`
                ];
                
                updateAILearningFeed(learningMessages[Math.floor(Math.random() * learningMessages.length)]);
            }
        }, 2000);
    }

    function enablePatternBreakers() {
        setTimeout(() => {
            document.querySelectorAll('#randomize-approach, #delay-response, #reverse-logic').forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('opacity-50');
            });
            
            updateMentorMessage("Pattern breaker tools are now online! Use them strategically to disrupt the AI's predictions.");
        }, 5000);
    }

    // Event Listeners for Blue vs Red battle

    // Scenario selection (defensive scenarios)
    document.querySelectorAll('.scenario-btn').forEach(button => {
        button.addEventListener('click', function() {
            const scenarioId = parseInt(this.dataset.scenario);
            startScenario(scenarioId);
            
            // Visual feedback for scenario selection
            document.querySelectorAll('.scenario-btn').forEach(btn => {
                btn.classList.remove('ring-2', 'ring-white');
            });
            this.classList.add('ring-2', 'ring-white');
            
            // Update AI prediction display
            setTimeout(() => {
                document.getElementById('ai-prediction-warning').classList.remove('hidden');
            }, 1000);
        });
    });

    // Response selection with pattern tracking
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('response-option') && gameState.currentScenario) {
            const optionId = e.target.dataset.option;
            const breaksPattern = e.target.dataset.breaksPattern === 'true';
            
            // Track response time for pattern analysis
            const responseTime = Date.now() - gameState.scenarioStartTime;
            const riskLevel = breaksPattern ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3; // Pattern-breaking is riskier
            
            handleDecision(optionId, responseTime, riskLevel);
        }
    });

    // Pattern Breaker Tools
    document.getElementById('randomize-approach').addEventListener('click', function() {
        if (!this.disabled) {
            activateRandomization();
            this.disabled = true;
            this.innerHTML = '<i class="bi bi-check-lg mr-2"></i> USED';
            this.classList.add('opacity-50');
            
            updateMentorMessage("Randomization active! Your next choice will be completely unpredictable to the AI.");
        }
    });

    document.getElementById('delay-response').addEventListener('click', function() {
        if (!this.disabled) {
            activateDelayTactic();
            this.disabled = true;
            this.innerHTML = '<i class="bi bi-check-lg mr-2"></i> USED';
            this.classList.add('opacity-50');
            
            updateMentorMessage("Delay tactic engaged! The AI's time-based predictions will be disrupted.");
        }
    });

    document.getElementById('reverse-logic').addEventListener('click', function() {
        if (!this.disabled) {
            activateReverseLogic();
            this.disabled = true;
            this.innerHTML = '<i class="bi bi-check-lg mr-2"></i> USED';
            this.classList.add('opacity-50');
            
            updateMentorMessage("Logic reversal active! Do the opposite of what the AI expects for maximum disruption.");
        }
    });

    // Modal and UI event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initAdaptiveBattle();
        
        updateMentorMessage("Blue vs Red team battle initiated! You are the Blue Team defender. The Red Team AI has studied your behavior patterns from all previous levels. Stay unpredictable!");
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        stopGlitchEffects();
        
        showResultModal(
            '🏆',
            'ADAPTIVE AI DEFEATED!',
            'You successfully outmaneuvered the learning algorithm through unpredictable tactics.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <p class="text-green-300 font-semibold">🏆 FINAL MISSION COMPLETE</p>
                        <p class="text-green-200 text-sm">Pattern Breaker - Adaptive AI Counter-Intelligence Specialist</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Patterns Disrupted:</strong> ${gameState.patternsBroken}</p>
                        <p><strong>AI Confidence Reduced:</strong> ${100 - gameState.aiConfidence}%</p>
                        <p><strong>Unpredictable Actions:</strong> ${gameState.unpredictableActions}</p>
                        <p><strong>Battle Scenarios Won:</strong> ${gameState.roundsWon}/${gameState.totalRounds}</p>
                    </div>
                    <div class="bg-blue-900 border border-blue-600 rounded p-3">
                        <p class="text-blue-300 font-semibold">🎓 CYBERSECURITY ACADEMY COMPLETE</p>
                        <p class="text-blue-200 text-sm">You have mastered all levels of cyber defense. The digital realm is safer with you as a guardian.</p>
                    </div>
                </div>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/campaign';
        };
    });

    // Real-time AI adaptation display updates
    setInterval(() => {
        if (gameState.battlePhase === 'active') {
            updateDetectedPatterns();
            updateAICountermeasures();
            
            if (gameState.predictabilityScore > 60) {
                updateGhostPredictions();
            }
        }
    }, 4000);

    function updateDetectedPatterns() {
        const patternsContainer = document.getElementById('detected-patterns');
        if (patternsContainer && gameState.playerPatterns.responseSpeed.length > 2) {
            const avgSpeed = gameState.playerPatterns.responseSpeed.reduce((a, b) => a + b, 0) / gameState.playerPatterns.responseSpeed.length;
            const riskTolerance = gameState.playerPatterns.riskTolerance.length > 0 
                ? (gameState.playerPatterns.riskTolerance.reduce((a, b) => a + b, 0) / gameState.playerPatterns.riskTolerance.length)
                : 0.5;
            
            const patterns = [
                `🎯 Response time: ${avgSpeed.toFixed(1)}s average (${avgSpeed < 3 ? 'Fast' : avgSpeed < 6 ? 'Moderate' : 'Slow'})`,
                `🎯 Risk preference: ${(riskTolerance * 100).toFixed(0)}% (${riskTolerance < 0.3 ? 'Conservative' : riskTolerance < 0.7 ? 'Balanced' : 'Aggressive'})`,
                `🎯 Predictability: ${gameState.predictabilityScore}% (${gameState.predictabilityScore > 70 ? 'High' : gameState.predictabilityScore > 40 ? 'Medium' : 'Low'})`
            ];
            
            patternsContainer.innerHTML = patterns.map(pattern => 
                `<div class="text-yellow-400 text-sm animate-pulse">${pattern}</div>`
            ).join('');
        }
    }

    function updateAICountermeasures() {
        const countermeasuresContainer = document.getElementById('ai-countermeasures');
        if (countermeasuresContainer) {
            const countermeasures = [
                `🤖 Time pressure tactics ${gameState.aiConfidence > 60 ? 'prepared' : 'disabled'}`,
                `🤖 Logic traps ${gameState.predictabilityScore > 50 ? 'armed' : 'disarmed'}`,
                `🤖 Pattern exploitation ${gameState.patternsBroken < 3 ? 'active' : 'neutralized'}`,
                `🤖 Psychological manipulation ${gameState.aiConfidence > 80 ? 'deployed' : 'ineffective'}`
            ];
            
            countermeasuresContainer.innerHTML = countermeasures.map(measure => 
                `<div class="text-red-400 text-sm">${measure}</div>`
            ).join('');
        }
    }

    function updateGhostPredictions() {
        const ghostContainer = document.getElementById('ghost-predictions');
        if (ghostContainer) {
            const predictions = [
                'Simulating decision outcome... 73% match probability',
                'Ghost echo: You choose logical response, AI spawns counter-logic',
                'Parallel timeline: Conservative choice leads to AI exploitation',
                'Quantum prediction: Fast response triggers time-pressure trap',
                'Alternative self: Pattern detected, countermeasures deployed'
            ];
            
            const prediction = predictions[Math.floor(Math.random() * predictions.length)];
            ghostContainer.innerHTML = `<span class="text-purple-300 text-sm animate-pulse">👻 ${prediction}</span>`;
        }
    }

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});