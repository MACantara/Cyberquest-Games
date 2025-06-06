import { gameState, updateGameMetrics } from './gameState.js';
import { loadGameData } from './dataLoader.js';
import { selectTool, closeToolWorkspace } from './toolHandler.js';
import { showSuspectDetails } from './suspectHandler.js';
import { endGame } from './gameLogic.js';
import { updateArgusMessage, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load game data
    await loadGameData();
    
    // Initialize game
    function initGame() {
        showTutorial();
        updateGameMetrics();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-forensics').classList.remove('hidden');
            updateArgusMessage("Begin with the log viewer, Nova. System access logs will reveal the attacker's digital footprints. Look for anomalies in timing and behavior patterns.");
        }, 2000);
    }

    // Event Listeners
    // Tool selection
    document.querySelectorAll('.tool-item').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            selectTool(toolType);
            
            // Visual feedback
            document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    // Suspect profile interaction
    document.querySelectorAll('.suspect-profile').forEach(profile => {
        profile.addEventListener('click', function() {
            const suspectId = parseInt(this.dataset.suspect);
            showSuspectDetails(suspectId);
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

    document.getElementById('close-tool').addEventListener('click', closeToolWorkspace);

    document.getElementById('complete-level').addEventListener('click', endGame);

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});