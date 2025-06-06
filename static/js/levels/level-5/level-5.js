import { gameState, startSocialMetrics } from './gameState.js';
import { loadPosts, selectPost, closePostAnalysis } from './postHandler.js';
import { handleAnalysisTool } from './analysisTools.js';
import { handleResponse } from './responseHandler.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load post data
    await loadPosts();
    
    // Initialize game
    function initGame() {
        showTutorial();
        startSocialMetrics();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-feed').classList.remove('hidden');
            updateMentorMessage("Start with Echo's original post - the red one. This privacy violation started the whole crisis. Understanding the root cause is key to fixing it.");
        }, 2000);
    }

    // Event Listeners
    // Post selection
    document.querySelectorAll('.post-item').forEach(item => {
        item.addEventListener('click', function() {
            const postId = parseInt(this.dataset.post);
            selectPost(postId);
            
            // Visual feedback
            document.querySelectorAll('.post-item').forEach(p => p.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    // Analysis tools
    document.querySelectorAll('.action-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentPost) {
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

    document.getElementById('close-analysis').addEventListener('click', closePostAnalysis);

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '💰',
            'New Financial Alert',
            'As social trust stabilizes, a new crisis emerges in the digital economy...',
            `
                <div class="text-left bg-green-900 border border-green-600 rounded p-3">
                    <p class="text-green-300 font-semibold">💰 FINANCIAL SECURITY ALERT</p>
                    <p class="text-green-200 text-sm mt-2">"While we cleaned the social web, someone else got in—through a fake startup investment portal. We're bleeding credits."</p>
                    <p class="text-gray-400 text-xs mt-2">Commander Vega: "A cadet's digital wallet was drained. Time to secure our financial future."</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 6: Digital Gold Rush?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/6';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});