import { endingState, updateReformChoices, checkDebriefCompletion } from './gameState.js';
import { showResultModal } from './uiUpdates.js';

export function startDebriefSession() {
    document.getElementById('report-intro').classList.add('hidden');
    document.getElementById('debrief-content').classList.remove('hidden');
    endingState.debriefStarted = true;
    
    // Enable form interactions
    setupReflectionTracking();
    checkDebriefCompletion();
}

export function setupReflectionTracking() {
    // Track reflection text areas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
            checkDebriefCompletion();
        });
    });
    
    // Track reform checkboxes
    document.querySelectorAll('.reform-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateReformChoices();
            checkDebriefCompletion();
        });
    });
}

export function completeDebrief() {
    // Show summary of choices and impact
    const challengeReflection = document.getElementById('challenge-reflection').value;
    const applicationReflection = document.getElementById('application-reflection').value;
    
    showResultModal('📋', 'Debrief Complete',
        `<div class="text-left space-y-3">
            <div class="bg-green-900 border border-green-600 rounded p-3">
                <h4 class="text-green-300 font-semibold mb-2">Academy Reform Recommendations Submitted</h4>
                <p class="text-green-200 text-sm">Your recommendations for ${endingState.reformChoices.join(', ')} have been forwarded to the Ethics Board.</p>
            </div>
            <div class="bg-blue-900 border border-blue-600 rounded p-3">
                <h4 class="text-blue-300 font-semibold mb-2">Personal Reflections Recorded</h4>
                <p class="text-blue-200 text-sm">Your insights will contribute to future training programs and ethical guidelines.</p>
            </div>
            <div class="bg-purple-900 border border-purple-600 rounded p-3">
                <h4 class="text-purple-300 font-semibold mb-2">Legacy Established</h4>
                <p class="text-purple-200 text-sm">You are now qualified to lead the next generation of cyber sentinels.</p>
            </div>
        </div>`
    );
    
    // Set up final message after modal closes
    document.getElementById('close-result').onclick = function() {
        document.getElementById('results-modal').classList.add('hidden');
        setTimeout(() => {
            showFinalMessage();
        }, 1000);
    };
}

export function showFinalMessage() {
    document.getElementById('final-message-modal').classList.remove('hidden');
}
