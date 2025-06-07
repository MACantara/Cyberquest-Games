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
        setupEventListeners();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            // Create tutorial toast instead of showing panel
            createTutorialToast();
            updateMentorMessage("Start by scanning the Vote Processing Engine - the red component. It contains a critical vulnerability that could compromise the entire election.");
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
                    <div class="text-cyan-300 font-semibold text-sm mb-2">🎯 Security Audit Tutorial</div>
                    <div class="text-cyan-200 text-xs space-y-1">
                        <p>1. Click the <strong class="text-red-300">Vote Processing Engine</strong> (red component)</p>
                        <p>2. Use <strong class="text-blue-300">Vulnerability Scan</strong> first</p>
                        <p>3. Analyze findings and ethical implications</p>
                        <p>4. Make disclosure decision based on evidence</p>
                    </div>
                </div>
                <button class="close-tutorial text-cyan-400 hover:text-cyan-200 ml-2">
                    <i class="bi bi-x-lg text-sm"></i>
                </button>
            </div>
            <div class="mt-3 text-center">
                <button class="got-it-btn bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded">
                    Got it!
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
        
        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                dismissToast();
            }
        }, 15000);
    }

    function setupEventListeners() {
        // Component selection - use more specific selectors
        const componentElements = document.querySelectorAll('[data-component]');
        console.log('Found component elements:', componentElements.length);
        
        componentElements.forEach(item => {
            item.addEventListener('click', function() {
                const componentId = parseInt(this.dataset.component);
                console.log('Component clicked:', componentId);
                selectComponent(componentId);
                
                // Visual feedback
                document.querySelectorAll('[data-component]').forEach(c => c.classList.remove('ring-2', 'ring-cyan-400'));
                this.classList.add('ring-2', 'ring-cyan-400');
            });
        });

        // Analysis tools
        document.querySelectorAll('[data-tool]').forEach(tool => {
            tool.addEventListener('click', function() {
                const toolType = this.dataset.tool;
                if (gameState.currentComponent) {
                    handleAnalysisTool(toolType);
                    this.classList.add('opacity-50');
                    this.disabled = true;
                } else {
                    updateMentorMessage("Please select a component first before using analysis tools.");
                }
            });
        });

        // Disclosure actions
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', function() {
                const action = this.dataset.action;
                handleDisclosureDecision(action);
            });
        });

        const closeAnalysisBtn = document.getElementById('close-analysis');
        if (closeAnalysisBtn) {
            closeAnalysisBtn.addEventListener('click', closeComponentAnalysis);
        }

        const completeLevelBtn = document.getElementById('complete-level');
        if (completeLevelBtn) {
            completeLevelBtn.addEventListener('click', function() {
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
                
                const continueBtn = document.getElementById('continue-btn');
                if (continueBtn) {
                    continueBtn.onclick = function() {
                        window.location.href = '/level/9';
                    };
                }
            });
        }
    }

    // Set up cutscene modal event listeners immediately
    const startMissionBtn = document.getElementById('start-mission');
    if (startMissionBtn) {
        startMissionBtn.addEventListener('click', function() {
            console.log('Start mission clicked'); // Debug log
            const cutsceneModal = document.getElementById('cutscene-modal');
            if (cutsceneModal) {
                cutsceneModal.classList.add('hidden');
                console.log('Cutscene modal hidden'); // Debug log
            }
            initGame();
        });
    } else {
        console.error('start-mission button not found');
    }

    // Set up continue button for results modal
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            const resultsModal = document.getElementById('results-modal');
            if (resultsModal) {
                resultsModal.classList.add('hidden');
            }
        });
    }

    // Show opening cutscene
    const cutsceneModal = document.getElementById('cutscene-modal');
    if (cutsceneModal) {
        cutsceneModal.classList.remove('hidden');
        console.log('Cutscene modal shown'); // Debug log
    } else {
        console.error('cutscene-modal not found, starting game directly');
        initGame(); // Fallback if modal doesn't exist
    }
});