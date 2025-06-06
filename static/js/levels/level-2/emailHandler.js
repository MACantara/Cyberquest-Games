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
    
    // Update email header information
    document.getElementById('email-subject').textContent = email.subject;
    document.getElementById('email-sender-name').textContent = email.senderName || 'Commander Vega';
    document.getElementById('email-from').textContent = email.from;
    document.getElementById('email-time').textContent = email.time;
    
    // Show verification badge for legitimate emails
    const verificationBadge = document.getElementById('email-verification');
    if (email.verified) {
        verificationBadge.classList.remove('hidden');
    } else {
        verificationBadge.classList.add('hidden');
    }
    
    // Format email body with proper line breaks
    document.getElementById('email-body').innerHTML = email.body.replace(/\n/g, '<br>');
    
    // Handle attachments
    if (email.hasAttachment) {
        document.getElementById('email-attachments').classList.remove('hidden');
    } else {
        document.getElementById('email-attachments').classList.add('hidden');
    }
    
    // Handle links
    if (email.hasLinks) {
        document.getElementById('email-links').classList.remove('hidden');
        document.getElementById('link-content').innerHTML = `
            <div class="bg-white border border-yellow-300 rounded-lg p-3">
                <a href="#" class="text-blue-600 text-sm hover:underline font-mono" onclick="return false;">
                    https://secure-academy-login.suspicious-site.com/verify
                </a>
                <p class="text-yellow-700 text-xs mt-1 flex items-center gap-1">
                    <i class="bi bi-exclamation-triangle"></i>
                    External domain - verify before clicking
                </p>
            </div>
        `;
    } else {
        document.getElementById('email-links').classList.add('hidden');
    }
    
    // Reset analysis state
    gameState.analysisSteps[email.id] = {};
    
    // Clear and hide analysis results
    const analysisResults = document.getElementById('analysis-results');
    const resultsContent = document.getElementById('results-content');
    const responsePanel = document.getElementById('response-panel');
    
    analysisResults.classList.add('hidden');
    responsePanel.classList.add('hidden');
    resultsContent.innerHTML = '';
    
    // Reset analysis tools
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.classList.remove('opacity-50', 'cursor-not-allowed');
        tool.disabled = false;
    });
    
    // Scroll to top of email content
    document.getElementById('email-content').scrollTop = 0;
    
    // Highlight selected email in list
    document.querySelectorAll('.email-item').forEach(item => {
        item.classList.remove('bg-blue-100', 'border-l-blue-500');
    });
    document.querySelector(`[data-email="${email.id}"]`).classList.add('bg-blue-100', 'border-l-blue-500');
}

export function closeEmail() {
    document.getElementById('email-content').classList.add('hidden');
    document.getElementById('email-placeholder').classList.remove('hidden');
    gameState.currentEmail = null;
}
