import { gameState, updateGameMetrics } from './gameState.js';
import { loadComponents, selectComponent, closeComponentAnalysis } from './componentHandler.js';
import { handleAnalysisTool } from './analysisTools.js';
import { handleDisclosureDecision } from './disclosureHandler.js';
import { populateMessages } from './messageSystem.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load component data
    await loadComponents();
    
    // Initialize game
    function initGame() {
        showTutorial();
        updateGameMetrics();
        populateMessages();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-scanner').classList.remove('hidden');
            updateMentorMessage("Start by scanning the Vote Processing Engine - the red component. It contains a critical vulnerability that could compromise the entire election.");
        }, 2000);
    }

    // Event Listeners
    // Component selection
    document.querySelectorAll('.scan-item').forEach(item => {
        item.addEventListener('click', function() {
            const componentId = parseInt(this.dataset.component);
            selectComponent(componentId);
            
            // Visual feedback
            document.querySelectorAll('.scan-item').forEach(c => c.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    // Analysis tools
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentComponent) {
                handleAnalysisTool(toolType);
                this.classList.add('opacity-50');
                this.disabled = true;
            }
        });
    });

    // Disclosure actions
    document.querySelectorAll('.disclosure-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleDisclosureDecision(action);
        });
    });

    // Modal and UI event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('close-analysis').addEventListener('click', closeComponentAnalysis);

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '⚡',
            'Critical Intelligence',
            'While submitting your disclosure, you intercept disturbing metadata...',
            `
                <div class="text-left bg-red-900 border border-red-600 rounded p-3">
                    <p class="text-red-300 font-semibold">🔍 INTELLIGENCE BRIEFING</p>
                    <p class="text-red-200 text-sm mt-2">"GeoIP traces, network logs, and payment trails point to Null HQ nodes launching a DDoS against critical systems."</p>
                    <p class="text-gray-400 text-xs mt-2">Commander Vega: "This is no longer a simulation. We need every Sentinel ready."</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 9: Operation Blackout?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/9';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});