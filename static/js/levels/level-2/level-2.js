import { gameState } from './gameState.js';
import { loadEmails, selectEmail, closeEmail } from './emailHandler.js';
import { handleAnalysisTool } from './analysisTools.js';
import { handleResponse } from './responseHandler.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load email data
    await loadEmails();
    
    // Initialize game
    function initGame() {
        showTutorial();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-inbox').classList.remove('hidden');
            updateMentorMessage("Start with the red urgent message from 'Commander Vega.' Something about it should immediately raise red flags.");
        }, 2000);
    }

    // Event Listeners
    // Email selection
    document.querySelectorAll('.email-item').forEach(item => {
        item.addEventListener('click', function() {
            const emailId = parseInt(this.dataset.email);
            selectEmail(emailId);
            
            // Visual feedback
            document.querySelectorAll('.email-item').forEach(e => e.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    // Analysis tools
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentEmail) {
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

    document.getElementById('close-email').addEventListener('click', closeEmail);

    document.getElementById('download-attachment').addEventListener('click', function() {
        if (gameState.currentEmail && gameState.currentEmail.isPhishing) {
            handleResponse('open');
        }
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '🚨',
            'Incoming Alert',
            'As you file your security report, a new emergency alert appears...',
            `
                <div class="text-left bg-red-900 border border-red-600 rounded p-3">
                    <p class="text-red-300 font-semibold">🚨 EMERGENCY ALERT</p>
                    <p class="text-red-200 text-sm mt-2">"Nova—come quickly. Malware has been detected in the Academy's VR Gaming Arena. Tournament players are reporting system crashes."</p>
                    <p class="text-gray-400 text-xs mt-2">Source: Academy Emergency Response</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 3: Malware Mayhem?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/3';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});