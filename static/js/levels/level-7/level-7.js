import { gameState, updateGameMetrics } from './gameState.js';
import { loadScenarios, startScenario, handleChoice } from './scenarioHandler.js';
import { handleRandomizeApproach, handleDelayResponse, handleReverseLogic } from './patternBreakers.js';
import { startGlitchEffects } from './glitchEffects.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load scenario data
    await loadScenarios();
    
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

    // Event Listeners
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

    // Pattern breaker tools
    document.getElementById('randomize-approach').addEventListener('click', handleRandomizeApproach);
    document.getElementById('delay-response').addEventListener('click', handleDelayResponse);
    document.getElementById('reverse-logic').addEventListener('click', handleReverseLogic);

    // Modal and UI event handlers
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