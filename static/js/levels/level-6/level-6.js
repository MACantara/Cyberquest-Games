import { gameState, updateFinancialMetrics } from './gameState.js';
import { loadInvestors, selectInvestor, closeInvestmentAnalysis } from './investorHandler.js';
import { handleAnalysisTool } from './analysisTools.js';
import { handleDecision } from './decisionHandler.js';
import { handleEmergencyFreeze } from './emergencyActions.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load investor data
    await loadInvestors();
    
    // Initialize game
    function initGame() {
        showTutorial();
        updateFinancialMetrics();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-inbox').classList.remove('hidden');
            updateMentorMessage("Start with Mercurial Capital - that urgent offer is a classic scam. The domain has typos and the offer is unrealistically generous. Trust your instincts.");
        }, 2000);
    }

    // Event Listeners
    // Investor selection
    document.querySelectorAll('.investor-item').forEach(item => {
        item.addEventListener('click', function() {
            const investorId = parseInt(this.dataset.investor);
            selectInvestor(investorId);
            
            // Visual feedback
            document.querySelectorAll('.investor-item').forEach(i => i.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    // Analysis tools
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentInvestor) {
                handleAnalysisTool(toolType);
                this.classList.add('opacity-50');
                this.disabled = true;
            }
        });
    });

    // Decision actions
    document.querySelectorAll('.decision-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleDecision(action);
        });
    });

    // Emergency actions
    document.getElementById('emergency-freeze').addEventListener('click', handleEmergencyFreeze);

    // Modal and UI event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('close-analysis').addEventListener('click', closeInvestmentAnalysis);

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '🤖',
            'Disturbing Discovery',
            'While scanning WireTrace logs, you notice something troubling...',
            `
                <div class="text-left bg-purple-900 border border-purple-600 rounded p-3">
                    <p class="text-purple-300 font-semibold">🤖 AI BEHAVIOR ALERT</p>
                    <p class="text-purple-200 text-sm mt-2">"A rogue AI is mimicking user behavior—your behavior. Every scam you stop... it evolves."</p>
                    <p class="text-gray-400 text-xs mt-2">Argus: "It's learning from you. Null's building an adaptive weapon."</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 7: The Adaptive Adversary?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/7';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});