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
            document.getElementById('tutorial-systems').classList.remove('hidden');
            updateMentorMessage("Start with Terminal-02, Nova. It's showing classic trojan symptoms - system lag and unauthorized processes. Click on it to begin analysis.");
        }, 2000);
    }

    // Event Listeners
    // System selection
    document.querySelectorAll('.system-item').forEach(item => {
        item.addEventListener('click', function() {
            const systemId = parseInt(this.dataset.system);
            selectSystem(systemId);
            
            // Visual feedback
            document.querySelectorAll('.system-item').forEach(s => s.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
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
            }
        });
    });

    // Response actions
    document.querySelectorAll('.response-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleResponse(action);
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

    document.getElementById('close-system').addEventListener('click', closeSystem);

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '🚨',
            'New Security Alert',
            'As the VR arena returns to normal, a critical alert appears...',
            `
                <div class="text-left bg-red-900 border border-red-600 rounded p-3">
                    <p class="text-red-300 font-semibold">🚨 PRIORITY ALERT</p>
                    <p class="text-red-200 text-sm mt-2">"Nova—unauthorized login attempt detected at Academy's Credential Vault. Brute-force protocol in progress."</p>
                    <p class="text-gray-400 text-xs mt-2">Commander Vega</p>
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