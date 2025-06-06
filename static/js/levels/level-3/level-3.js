import { gameState } from './gameState.js';
import { loadSystems, selectSystem, closeSystem } from './systemHandler.js';
import { handleAnalysisTool } from './analysisTools.js';
import { handleResponse } from './responseHandler.js';
import { startSpreadTimer } from './spreadTimer.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load system data
    await loadSystems();
    
    // Initialize game
    function initGame() {
        startSpreadTimer();
        showTutorial();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            createNotification(
                'Emergency Protocol Activated',
                'Multiple VR terminals showing infection signs. Start with Terminal-02 - critical threat detected!',
                'warning'
            );
        }, 2000);
        
        // Start corruption effects immediately
        if (window.startCorruptionEffects) {
            window.startCorruptionEffects();
        }
    }

    // Event Listeners
    // System selection from file explorer
    document.querySelectorAll('.system-item').forEach(item => {
        item.addEventListener('click', function() {
            const systemId = parseInt(this.dataset.system);
            selectSystem(systemId);
            
            // Visual feedback in file explorer
            document.querySelectorAll('.system-item').forEach(s => s.classList.remove('bg-blue-200'));
            this.classList.add('bg-blue-200');
        });
    });

    // Analysis tools
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentSystem) {
                handleAnalysisTool(toolType);
                this.classList.add('opacity-50');
                this.disabled = true;
                
                // Visual feedback
                this.innerHTML = '<i class="bi bi-check-lg mr-1"></i> Completed';
            }
        });
    });

    // Response actions
    document.querySelectorAll('.response-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleResponse(action);
            
            // Disable all response buttons
            document.querySelectorAll('.response-action').forEach(btn => {
                btn.disabled = true;
                btn.classList.add('opacity-50');
            });
        });
    });

    // Close analysis window
    document.getElementById('close-analysis').addEventListener('click', closeSystem);

    // Modal handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
        
        createNotification(
            'Emergency Response Active',
            'Containment protocol initiated. Analyze infected systems and deploy countermeasures.',
            'info'
        );
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        // Stop all effects
        if (window.stopCorruptionEffects) {
            window.stopCorruptionEffects();
        }
        
        showResultModal(
            '🛡️',
            'VR Arena Secured',
            'Emergency containment successful. All systems restored to normal operation.',
            `
                <div class="text-left bg-green-900 border border-green-600 rounded p-3">
                    <p class="text-green-300 font-semibold">🏆 MISSION COMPLETE</p>
                    <p class="text-green-200 text-sm mt-2">VR tournament can resume safely. All player data recovered and systems hardened against future attacks.</p>
                    <p class="text-gray-400 text-xs mt-2">Next: Password security protocols require immediate attention...</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 4: The Password Heist?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/4';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});