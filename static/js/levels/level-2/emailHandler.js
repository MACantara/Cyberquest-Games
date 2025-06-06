import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export let emails = {};

export async function loadEmails() {
    try {
        const response = await fetch('/static/js/levels/level-2/data/emails.json');
        emails = await response.json();
    } catch (error) {
        console.error('Failed to load emails:', error);
    }
}

export function selectEmail(emailId) {
    gameState.currentEmail = emails[emailId];
    displayEmail(gameState.currentEmail);
    document.getElementById('tutorial-inbox').classList.add('hidden');
    
    if (emailId === 1) {
        updateMentorMessage("Good choice. Look at the sender address carefully. Do you notice anything suspicious about 'interw0r1d.net'? Use the analysis tools to investigate.");
    }
}

export function displayEmail(email) {
    document.getElementById('email-placeholder').classList.add('hidden');
    document.getElementById('email-content').classList.remove('hidden');
    
    document.getElementById('email-subject').textContent = email.subject;
    document.getElementById('email-from').textContent = email.from;
    document.getElementById('email-time').textContent = email.time;
    document.getElementById('email-body').textContent = email.body;
    
    // Show attachments if present
    if (email.hasAttachment) {
        document.getElementById('email-attachments').classList.remove('hidden');
    } else {
        document.getElementById('email-attachments').classList.add('hidden');
    }
    
    // Show links if present
    if (email.hasLinks) {
        document.getElementById('email-links').classList.remove('hidden');
        document.getElementById('link-content').innerHTML = `
            <div class="bg-red-800 rounded p-2 mb-2">
                <a href="#" class="text-red-300 text-sm hover:underline" onclick="return false;">
                    https://secure-academy-login.suspicious-site.com/verify
                </a>
                <p class="text-red-200 text-xs mt-1">⚠️ Suspicious external domain</p>
            </div>
        `;
    } else {
        document.getElementById('email-links').classList.add('hidden');
    }
    
    // Reset analysis state
    gameState.analysisSteps[email.id] = {};
    document.getElementById('analysis-results').classList.add('hidden');
    document.getElementById('response-panel').classList.add('hidden');
    
    // Reset tool states
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.classList.remove('opacity-50');
        tool.disabled = false;
    });
}

export function closeEmail() {
    document.getElementById('email-content').classList.add('hidden');
    document.getElementById('email-placeholder').classList.remove('hidden');
    gameState.currentEmail = null;
}
