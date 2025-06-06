import { endingState, updateFinalStats } from './gameState.js';
import { loadEndingData } from './dataLoader.js';
import { setupMemoryWallInteractions } from './memoryWall.js';
import { startDebriefSession, completeDebrief } from './debriefHandler.js';
import { setupCharacterEpilogues } from './characterEpilogues.js';
import { handleReplayCampaign, showArchives, showCredits } from './finalActions.js';
import { showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load ending data
    await loadEndingData();
    
    // Initialize ending sequence
    function initEndingSequence() {
        // Simulate getting player stats from completed campaign
        updateFinalStats();
    }

    // Event Listeners
    // Memory wall interactions
    setupMemoryWallInteractions();

    // Debrief session
    document.getElementById('start-debrief').addEventListener('click', startDebriefSession);

    // Character epilogues
    setupCharacterEpilogues();

    // Complete debrief
    document.getElementById('complete-debrief').addEventListener('click', completeDebrief);

    // Final options
    document.getElementById('replay-campaign').addEventListener('click', handleReplayCampaign);
    document.getElementById('view-archives').addEventListener('click', showArchives);
    document.getElementById('final-logout').addEventListener('click', showCredits);

    // Modal event handlers
    document.getElementById('begin-debrief').addEventListener('click', function() {
        document.getElementById('ending-intro-modal').classList.add('hidden');
        initEndingSequence();
    });

    document.getElementById('close-result').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    // Show initial modal
    document.getElementById('ending-intro-modal').classList.remove('hidden');
});