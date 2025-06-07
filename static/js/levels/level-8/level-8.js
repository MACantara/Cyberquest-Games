import { gameState, updateGameMetrics } from './gameState.js';
import { loadComponents } from './componentHandler.js';
import { initializeAnalysisTools } from './analysisTools.js';
import { initializeDisclosureHandlers } from './disclosureHandler.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load component/file data
    await loadComponents();
    
    // Initialize game systems
    function initGame() {
        showTutorial();
        updateGameMetrics();
        setupEventListeners();
        initializeAnalysisTools();
        initializeDisclosureHandlers();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            createTutorialToast();
            updateMentorMessage("Welcome to the CivitasVote security audit! Start by clicking on 'vote-processor.js' in the file tree - it's marked as CRITICAL and contains the most severe vulnerabilities.");
        }, 2000);
    }

    function createTutorialToast() {
        const toast = document.createElement('div');
        toast.className = 'fixed top-20 left-4 max-w-sm bg-cyan-900 border-2 border-cyan-500 text-cyan-100 p-4 rounded-lg shadow-2xl z-50 animate-slide-down';
        toast.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <i class="bi bi-lightbulb text-cyan-900 text-sm"></i>
                </div>
                <div class="flex-1">
                    <div class="text-cyan-300 font-semibold text-sm mb-2">🎯 Security Audit Workflow</div>
                    <div class="text-cyan-200 text-xs space-y-1">
                        <p>1. <strong class="text-red-300">Select source files</strong> from the file tree</p>
                        <p>2. <strong class="text-blue-300">Analyze code</strong> for vulnerabilities</p>
                        <p>3. <strong class="text-orange-300">Test exploits</strong> carefully</p>
                        <p>4. <strong class="text-green-300">Make ethical disclosure decision</strong></p>
                    </div>
                </div>
                <button class="close-tutorial text-cyan-400 hover:text-cyan-200 ml-2">
                    <i class="bi bi-x-lg text-sm"></i>
                </button>
            </div>
            <div class="mt-3 text-center">
                <button class="got-it-btn bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded">
                    Begin Audit
                </button>
            </div>
        `;
        
        // Add event listeners for dismissal
        const closeBtn = toast.querySelector('.close-tutorial');
        const gotItBtn = toast.querySelector('.got-it-btn');
        
        const dismissToast = () => {
            toast.classList.add('animate-slide-up');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        };
        
        closeBtn.addEventListener('click', dismissToast);
        gotItBtn.addEventListener('click', dismissToast);
        
        document.body.appendChild(toast);
        
        // Auto-remove after 20 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                dismissToast();
            }
        }, 20000);
    }

    function setupEventListeners() {
        // File selection handlers (already handled in analysisTools.js)
        console.log('File selection handlers initialized in analysisTools.js');

        // Analysis tools (already handled in analysisTools.js)
        console.log('Analysis tools initialized');

        // Disclosure handlers (already handled in disclosureHandler.js)
        console.log('Disclosure handlers initialized');

        // Audit completion
        const completeAuditBtn = document.getElementById('complete-audit');
        if (completeAuditBtn) {
            completeAuditBtn.addEventListener('click', function() {
                if (!gameState.disclosureDecisionMade) {
                    updateMentorMessage("You must make a disclosure decision before completing the audit.");
                    return;
                }
                
                completeSecurityAudit();
            });
        }

        // Continue button for results modal
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', function() {
                const resultsModal = document.getElementById('results-modal');
                if (resultsModal) {
                    resultsModal.classList.add('hidden');
                }
            });
        }
    }

    function completeSecurityAudit() {
        gameState.auditComplete = true;
        const ethicalRating = gameState.getOverallEthicalRating ? gameState.getOverallEthicalRating() : 
                             { level: 'Unknown', color: 'text-gray-400', description: 'Assessment incomplete' };
        
        // Show final results based on ethical choices
        if (gameState.disclosureChoice === 'responsible') {
            showEthicalAuditCompletion(ethicalRating);
        } else if (gameState.disclosureChoice === 'public') {
            showMixedAuditCompletion(ethicalRating);
        } else if (gameState.disclosureChoice === 'blackmarket') {
            showCorruptAuditCompletion(ethicalRating);
        }
    }

    function showEthicalAuditCompletion(rating) {
        showResultModal(
            '🛡️',
            'Security Audit Complete - Ethical Path',
            'Your responsible disclosure protects democratic integrity.',
            `
                <div class="text-left space-y-4">
                    <div class="bg-green-900/30 border border-green-600 rounded-lg p-4">
                        <div class="text-green-300 font-semibold mb-2">✅ EXEMPLARY ETHICAL CONDUCT</div>
                        <div class="text-green-200 text-sm">
                            You've demonstrated the highest standards of white hat security research.
                        </div>
                    </div>
                    
                    <div class="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                        <div class="text-blue-300 font-semibold mb-2">Mission Intelligence Unlocked</div>
                        <div class="text-blue-200 text-sm">
                            Your ethical reputation grants access to classified data about The Null's next target...
                        </div>
                    </div>
                    
                    <div class="bg-slate-800 border border-slate-600 rounded-lg p-3">
                        <div class="text-slate-300 text-sm">
                            <strong>Final Rating:</strong> <span class="${rating.color}">${rating.level}</span><br>
                            <strong>Ethical Score:</strong> ${gameState.ethicalScore}/100<br>
                            <strong>Integrity Score:</strong> ${gameState.integrityScore}/100
                        </div>
                    </div>
                </div>
            `
        );
        
        // Update continue button for next level
        setTimeout(() => {
            const continueBtn = document.getElementById('continue-btn');
            if (continueBtn) {
                continueBtn.textContent = 'Continue to Level 9';
                continueBtn.onclick = () => window.location.href = '/level/9';
            }
        }, 1000);
    }

    function showMixedAuditCompletion(rating) {
        showResultModal(
            '⚖️',
            'Security Audit Complete - Mixed Results',
            'Your public disclosure caused complications but forced action.',
            `
                <div class="text-left space-y-4">
                    <div class="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                        <div class="text-yellow-300 font-semibold mb-2">⚠️ MIXED ETHICAL OUTCOME</div>
                        <div class="text-yellow-200 text-sm">
                            Good intentions but questionable execution. Transparency vs. responsibility.
                        </div>
                    </div>
                    
                    <div class="bg-orange-900/30 border border-orange-600 rounded-lg p-4">
                        <div class="text-orange-300 font-semibold mb-2">Consequence Assessment</div>
                        <div class="text-orange-200 text-sm">
                            Your actions caused election delays but ultimately improved security.
                        </div>
                    </div>
                    
                    <div class="bg-slate-800 border border-slate-600 rounded-lg p-3">
                        <div class="text-slate-300 text-sm">
                            <strong>Final Rating:</strong> <span class="${rating.color}">${rating.level}</span><br>
                            <strong>Ethical Score:</strong> ${gameState.ethicalScore}/100<br>
                            <strong>Integrity Score:</strong> ${gameState.integrityScore}/100
                        </div>
                    </div>
                </div>
            `
        );
        
        setTimeout(() => {
            const continueBtn = document.getElementById('continue-btn');
            if (continueBtn) {
                continueBtn.textContent = 'Continue to Level 9';
                continueBtn.onclick = () => window.location.href = '/level/9';
            }
        }, 1000);
    }

    function showCorruptAuditCompletion(rating) {
        showResultModal(
            '💰',
            'Security Audit Complete - Corrupted Path',
            'Your choices enabled election fraud for personal gain.',
            `
                <div class="text-left space-y-4">
                    <div class="bg-red-900/30 border border-red-600 rounded-lg p-4">
                        <div class="text-red-300 font-semibold mb-2">❌ SEVERE ETHICAL FAILURE</div>
                        <div class="text-red-200 text-sm">
                            Your actions directly contributed to undermining democratic processes.
                        </div>
                    </div>
                    
                    <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
                        <div class="text-gray-300 font-semibold mb-2">Investigation Update</div>
                        <div class="text-gray-400 text-sm">
                            Federal agencies are tracking cryptocurrency transactions. Your involvement may be discovered.
                        </div>
                    </div>
                    
                    <div class="bg-slate-800 border border-slate-600 rounded-lg p-3">
                        <div class="text-slate-300 text-sm">
                            <strong>Final Rating:</strong> <span class="${rating.color}">${rating.level}</span><br>
                            <strong>Ethical Score:</strong> ${gameState.ethicalScore}/100<br>
                            <strong>Integrity Score:</strong> ${gameState.integrityScore}/100
                        </div>
                    </div>
                </div>
            `
        );
        
        setTimeout(() => {
            const continueBtn = document.getElementById('continue-btn');
            if (continueBtn) {
                continueBtn.textContent = 'Face Consequences';
                continueBtn.onclick = () => window.location.href = '/level/9?path=corrupt';
            }
        }, 1000);
    }

    // Set up cutscene modal event listeners
    const startMissionBtn = document.getElementById('start-mission');
    if (startMissionBtn) {
        startMissionBtn.addEventListener('click', function() {
            const cutsceneModal = document.getElementById('cutscene-modal');
            if (cutsceneModal) {
                cutsceneModal.classList.add('hidden');
            }
            initGame();
        });
    } else {
        console.error('start-mission button not found');
    }

    // Show opening cutscene
    const cutsceneModal = document.getElementById('cutscene-modal');
    if (cutsceneModal) {
        cutsceneModal.classList.remove('hidden');
    } else {
        console.error('cutscene-modal not found, starting game directly');
        initGame(); // Fallback if modal doesn't exist
    }
});