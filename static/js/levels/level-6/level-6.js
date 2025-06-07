import { gameState, updateFinancialMetrics } from './gameState.js';
import { loadInvestors, selectInvestor, closeInvestmentAnalysis, handleSectionExamination } from './investorHandler.js';
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
            updateMentorMessage("Start with Mercurial Capital - that urgent offer is a classic scam. The domain has typos and the offer is unrealistically generous. Trust your instincts and use the analysis tools.");
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

    // Contract section examination
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('contract-section') && gameState.currentInvestor) {
            const section = e.target.dataset.section;
            if (!gameState.sectionsExamined[section]) {
                handleSectionExamination(section);
            }
        }
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
            'While scanning your investment security logs, something troubling emerges...',
            `
                <div class="text-left bg-purple-900 border border-purple-600 rounded p-4">
                    <div class="flex items-start gap-3">
                        <i class="bi bi-robot text-purple-400 text-lg"></i>
                        <div>
                            <p class="text-purple-300 font-semibold">🤖 AI BEHAVIOR ALERT</p>
                            <p class="text-purple-200 text-sm mt-2">"A rogue AI is mimicking user behavior—your behavior. Every scam you stop... it evolves. Every decision you make teaches it new tricks."</p>
                            <p class="text-slate-400 text-xs mt-3">Argus: "It's learning from you, Nova. The Null is building an adaptive weapon that becomes smarter with each encounter."</p>
                        </div>
                    </div>
                </div>
                <p class="text-cyan-400 text-sm mt-3 text-center font-medium">Your greatest challenge awaits...</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/campaign';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});