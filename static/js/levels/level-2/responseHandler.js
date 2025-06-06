import { gameState, updateGameStats } from './gameState.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

export function handleResponse(action) {
    const email = gameState.currentEmail;
    const isCorrect = action === email.correctAction;
    
    gameState.emailsAnalyzed++;
    gameState.completedEmails.push(email.id);
    
    if (isCorrect) {
        handleCorrectResponse(email, action);
    } else {
        handleWrongResponse(email, action);
    }
    
    updateGameStats();
    
    // Check if level complete
    if (gameState.emailsAnalyzed >= 3) {
        setTimeout(() => endGame(true), 2000);
    } else {
        setTimeout(() => {
            document.getElementById('email-content').classList.add('hidden');
            document.getElementById('email-placeholder').classList.remove('hidden');
            updateMentorMessage("Good work! Now analyze another email. The real Commander Vega's message might provide important context.");
        }, 2000);
    }
}

export function handleCorrectResponse(email, action) {
    gameState.securityScore += 25;
    gameState.blocksCount++;
    
    if (email.isPhishing) {
        gameState.phishingCount++;
    }
    
    let title, message, feedback;
    
    switch(action) {
        case 'report':
            title = "Threat Contained!";
            message = "You correctly identified and reported the phishing attempt.";
            feedback = `
                <div class="space-y-3">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p class="text-green-800 font-semibold">✅ Correct Action: Report Phishing</p>
                        <p class="text-green-700 text-sm mt-1">Your quick action prevented a security breach.</p>
                    </div>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p class="text-blue-800 text-sm font-medium">Evidence you found:</p>
                        <ul class="text-blue-700 text-sm space-y-1 mt-2">
                            ${email.redFlags.map(flag => `<li class="flex items-start gap-2"><i class="bi bi-dot text-blue-600 mt-1"></i>${flag}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="text-center">
                        <span class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">+25 Security Points</span>
                    </div>
                </div>
            `;
            break;
        case 'escalate':
            title = "Proper Escalation!";
            message = "You correctly escalated this to the security team.";
            feedback = `
                <div class="space-y-3">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p class="text-green-800 font-semibold">✅ Correct Action: Security Escalation</p>
                        <p class="text-green-700 text-sm mt-1">This legitimate concern was properly escalated to investigate the impersonation attack.</p>
                    </div>
                    <div class="text-center">
                        <span class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">+25 Security Points</span>
                    </div>
                </div>
            `;
            break;
    }
    
    showResultModal('✅', title, message, feedback);
    updateMentorMessage("Excellent decision, Nova. Your quick action prevented a security breach.");
}

export function handleWrongResponse(email, action) {
    gameState.securityScore -= 20;
    gameState.threatLevel += 30;
    gameState.cadetsAffected += Math.floor(Math.random() * 5) + 1;
    
    let title, message, feedback;
    
    if (action === 'open' && email.isPhishing) {
        title = "Security Breach!";
        message = "You fell for the phishing attack. Malware is spreading!";
        feedback = `
            <div class="space-y-2">
                <p class="text-red-400 font-semibold">❌ Dangerous Action: Followed Malicious Instructions</p>
                <p class="text-sm text-gray-300">What you missed:</p>
                <ul class="text-sm text-gray-400 space-y-1">
                    ${email.redFlags.map(flag => `<li>• ${flag}</li>`).join('')}
                </ul>
                <p class="text-red-400 text-sm mt-3">-20 Security Points • ${gameState.cadetsAffected} Cadets Affected</p>
            </div>
        `;
    } else {
        title = "Incorrect Response";
        message = "Your response wasn't appropriate for this situation.";
        feedback = `
            <div class="space-y-2">
                <p class="text-red-400 font-semibold">❌ Incorrect Action</p>
                <p class="text-sm text-gray-300">The correct action was: ${email.correctAction}</p>
                <p class="text-red-400 text-sm mt-3">-20 Security Points</p>
            </div>
        `;
    }
    
    showResultModal('❌', title, message, feedback);
    updateMentorMessage("That wasn't the best choice, Nova. Learn from this mistake and be more careful with the next email.");
}

export function endGame(success) {
    if (success) {
        updateMentorMessage("Outstanding work, Nova! You've successfully identified the phishing threat and protected the Academy. Your email security skills are impressive.");
        document.getElementById('complete-level').disabled = false;
        
        showResultModal(
            '🏆',
            'Mission Complete!',
            'You\'ve successfully completed Shadow in the Inbox and earned the Phish Fighter badge.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-blue-900 border border-blue-600 rounded p-3">
                        <p class="text-blue-300 font-semibold">🏆 Digital Badge Earned</p>
                        <p class="text-blue-200 text-sm">Phish Fighter - Inbox Defender</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Final Security Score:</strong> ${gameState.securityScore}/100</p>
                        <p><strong>Threat Level:</strong> ${gameState.threatLevel}% (${gameState.threatLevel < 30 ? 'Well Contained' : 'Needs Improvement'})</p>
                        <p><strong>Phishing Blocked:</strong> ${gameState.phishingCount}</p>
                        <p><strong>Cadets Protected:</strong> ${Math.max(0, 10 - gameState.cadetsAffected)}</p>
                    </div>
                </div>
            `
        );
    }
}
