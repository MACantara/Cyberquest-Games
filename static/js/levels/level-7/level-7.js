document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let gameState = {
        predictabilityScore: 75,
        patternsBroken: 0,
        aiPredictions: 0,
        systemIntegrity: 100,
        adaptationCycles: 1,
        currentScenario: null,
        playerBehavior: {},
        aiConfidence: 75,
        completedScenarios: []
    };

    // Scenarios data
    const scenarios = {
        1: {
            id: 1,
            title: 'Adaptive Phishing Attack',
            description: 'The AI has crafted a phishing email that changes based on your past clicking patterns. It knows you tend to click links quickly.',
            predictedResponse: 'click_link',
            options: [
                { id: 'verify_sender', text: 'Take time to verify sender (breaks pattern)', breakPattern: true },
                { id: 'click_link', text: 'Click the link immediately', breakPattern: false },
                { id: 'forward_team', text: 'Forward to security team first', breakPattern: true },
                { id: 'ignore_email', text: 'Delete without reading', breakPattern: true }
            ]
        },
        2: {
            id: 2,
            title: 'Behavior-Based Malware',
            description: 'This malware activates only when it detects your typical security-first approach. It waits until you secure email, then attacks through DNS.',
            predictedResponse: 'secure_email',
            options: [
                { id: 'secure_dns', text: 'Check DNS integrity first (breaks pattern)', breakPattern: true },
                { id: 'secure_email', text: 'Secure email first as usual', breakPattern: false },
                { id: 'parallel_check', text: 'Check all vectors simultaneously', breakPattern: true },
                { id: 'wait_observe', text: 'Wait and observe system behavior', breakPattern: true }
            ]
        },
        3: {
            id: 3,
            title: 'Time-Pressure Attack',
            description: 'The AI exploits your thorough analysis habit by creating a time-critical situation where delayed response causes system damage.',
            predictedResponse: 'analyze_thoroughly',
            options: [
                { id: 'quick_decision', text: 'Make rapid decision (breaks pattern)', breakPattern: true },
                { id: 'analyze_thoroughly', text: 'Analyze all evidence carefully', breakPattern: false },
                { id: 'partial_analysis', text: 'Quick scan then decide', breakPattern: true },
                { id: 'delegate_decision', text: 'Escalate to team lead', breakPattern: true }
            ]
        }
    };

    // Initialize game
    function initGame() {
        showTutorial();
        updateGameMetrics();
        startGlitchEffects();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-behavior').classList.remove('hidden');
            updateMentorMessage("The AI has analyzed your behavioral patterns from previous levels. To defeat it, you must do the unexpected. Choose scenarios to test your adaptive thinking.");
        }, 2000);
    }

    // Glitch effects for immersion
    function startGlitchEffects() {
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

    // Scenario selection
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const scenarioId = parseInt(this.dataset.scenario);
            if (!gameState.completedScenarios.includes(scenarioId)) {
                startScenario(scenarioId);
                
                // Visual feedback
                document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('ring-2', 'ring-cyan-400'));
                this.classList.add('ring-2', 'ring-cyan-400');
            }
        });
    });

    function startScenario(scenarioId) {
        gameState.currentScenario = scenarios[scenarioId];
        displayScenario(gameState.currentScenario);
        document.getElementById('tutorial-behavior').classList.add('hidden');
        
        updateMentorMessage(`Scenario ${scenarioId} active. The AI expects you to ${gameState.currentScenario.predictedResponse.replace('_', ' ')}. Surprise it!`);
    }

    function displayScenario(scenario) {
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

    function handleChoice(optionId, breaksPattern) {
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

    function handlePatternBreak(scenario, optionId) {
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

    function handlePredictableChoice(scenario, optionId) {
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

    // Pattern breaker tools
    document.getElementById('randomize-approach').addEventListener('click', function() {
        gameState.predictabilityScore = Math.max(0, gameState.predictabilityScore - 10);
        showResultModal('🎲', 'Approach Randomized', 
            'You activated random behavior mode.',
            '<div class="text-blue-400">Temporary unpredictability boost applied.</div>'
        );
        updateGameMetrics();
    });

    document.getElementById('delay-response').addEventListener('click', function() {
        gameState.predictabilityScore = Math.max(0, gameState.predictabilityScore - 15);
        showResultModal('⏱️', 'Response Delayed', 
            'You introduced deliberate delays to break timing patterns.',
            '<div class="text-orange-400">AI timing analysis disrupted.</div>'
        );
        updateGameMetrics();
    });

    document.getElementById('reverse-logic').addEventListener('click', function() {
        gameState.predictabilityScore = Math.max(0, gameState.predictabilityScore - 25);
        showResultModal('🔄', 'Logic Reversed', 
            'You chose the opposite of your usual logical approach.',
            '<div class="text-purple-400">AI logic prediction algorithm confused.</div>'
        );
        updateGameMetrics();
    });

    // Helper functions
    function updateMentorMessage(message) {
        document.getElementById('mentor-message').textContent = message;
    }

    function updateGameMetrics() {
        document.getElementById('predictability-score').textContent = gameState.predictabilityScore;
        document.getElementById('patterns-broken').textContent = gameState.patternsBroken;
        document.getElementById('ai-predictions').textContent = gameState.aiPredictions;
        document.getElementById('system-integrity').textContent = gameState.systemIntegrity;
        document.getElementById('adaptation-cycles').textContent = gameState.adaptationCycles;
        
        // Update progress bars
        document.getElementById('core-integrity').style.width = gameState.systemIntegrity + '%';
        document.getElementById('ai-confidence').style.width = gameState.aiConfidence + '%';
        
        // Update adaptation status
        document.getElementById('learning-rate').textContent = gameState.aiConfidence > 60 ? 'High' : gameState.aiConfidence > 30 ? 'Medium' : 'Low';
        document.getElementById('prediction-confidence').textContent = gameState.aiConfidence + '%';
        document.getElementById('next-move').textContent = gameState.predictabilityScore > 60 ? 'Predictable' : gameState.predictabilityScore > 30 ? 'Uncertain' : 'Unpredictable';
    }

    function showResultModal(icon, title, message, feedback) {
        document.getElementById('result-icon').textContent = icon;
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-message').textContent = message;
        document.getElementById('result-feedback').innerHTML = feedback;
        document.getElementById('results-modal').classList.remove('hidden');
    }

    function endGame(success) {
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

    // Event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '🧑‍💻',
            'Disturbing Discovery',
            'After neutralizing the AI, you find a final message embedded in its code...',
            `
                <div class="text-left bg-red-900 border border-red-600 rounded p-3">
                    <p class="text-red-300 font-semibold">📊 FINAL LOG ENTRY</p>
                    <p class="text-red-200 text-sm mt-2">"The Null doesn't want control. They want chaos. And next... they're going after the vote."</p>
                    <p class="text-gray-400 text-xs mt-2">Commander Vega: "We're deploying all units. You're being assigned to the White Hat Test."</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 8: The White Hat Test?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/8';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});