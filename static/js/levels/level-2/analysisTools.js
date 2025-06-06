import { gameState } from './gameState.js';
import { updateMentorMessage, updateSenderInfo, updateLinkInfo } from './uiUpdates.js';

export function handleAnalysisTool(toolType) {
    const email = gameState.currentEmail;
    let results = '';
    let mentorMessage = '';

    gameState.analysisSteps[email.id][toolType] = true;

    switch(toolType) {
        case 'headers':
            if (email.isPhishing) {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">⚠️ Header Analysis: SUSPICIOUS</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p><strong>Return-Path:</strong> bounce@suspicious-server.com</p>
                            <p><strong>Received:</strong> from unknown-relay.net</p>
                            <p><strong>SPF:</strong> FAIL (domain mismatch)</p>
                            <p><strong>DKIM:</strong> FAIL (invalid signature)</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Excellent! The email headers reveal this message failed authentication. The routing path shows it didn't come from our servers.";
                updateSenderInfo("🔴 FAILED AUTHENTICATION");
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Header Analysis: LEGITIMATE</h6>
                        <div class="text-green-200 text-sm space-y-1">
                            <p><strong>Return-Path:</strong> admin@interworld.academy</p>
                            <p><strong>Received:</strong> from mail.interworld.academy</p>
                            <p><strong>SPF:</strong> PASS</p>
                            <p><strong>DKIM:</strong> PASS</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Good analysis! The headers confirm this email is legitimate and properly authenticated.";
                updateSenderInfo("✅ AUTHENTICATED");
            }
            break;

        case 'sender':
            if (email.isPhishing) {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">⚠️ Sender Verification: FAILED</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p><strong>Domain:</strong> interw0r1d.net (SUSPICIOUS)</p>
                            <p><strong>Legitimate Domain:</strong> interworld.academy</p>
                            <p><strong>Registration:</strong> 2 days ago (RED FLAG)</p>
                            <p><strong>Registrar:</strong> Anonymous proxy service</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Perfect catch! The domain uses a zero instead of 'o' - a classic typosquatting attack. Real Academy emails come from interworld.academy.";
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Sender Verification: VERIFIED</h6>
                        <div class="text-green-200 text-sm space-y-1">
                            <p><strong>Domain:</strong> interworld.academy ✓</p>
                            <p><strong>Certificate:</strong> Valid organization certificate</p>
                            <p><strong>Reputation:</strong> Trusted sender</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Excellent verification! This sender is legitimate and from our official domain.";
            }
            break;

        case 'links':
            if (email.hasLinks) {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">⚠️ Link Analysis: MALICIOUS</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p><strong>Destination:</strong> suspicious-site.com</p>
                            <p><strong>Purpose:</strong> Credential harvesting</p>
                            <p><strong>Threat Level:</strong> HIGH</p>
                            <p><strong>Action:</strong> DO NOT CLICK</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Dangerous! That link leads to a fake login page designed to steal credentials. Never click suspicious links.";
                updateLinkInfo("🔴 MALICIOUS LINK DETECTED");
            } else {
                results = `
                    <div class="bg-gray-700 border border-gray-600 rounded p-3">
                        <h6 class="text-gray-300 font-semibold mb-2">ℹ️ Link Analysis: NO LINKS</h6>
                        <p class="text-gray-400 text-sm">No external links detected in this email.</p>
                    </div>
                `;
                mentorMessage = "No links found in this email - that's actually a good sign for legitimacy.";
                updateLinkInfo("No links detected");
            }
            break;

        case 'content':
            if (email.isPhishing) {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">⚠️ Content Analysis: SUSPICIOUS</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p>• Excessive urgency ("IMMEDIATELY", "PRIORITY 1")</p>
                            <p>• Unusual secrecy requests</p>
                            <p>• Generic signature</p>
                            <p>• Pressure tactics</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Great analysis! Phishing emails often use urgency and fear to bypass critical thinking. Real commanders don't demand immediate file downloads.";
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Content Analysis: LEGITIMATE</h6>
                        <div class="text-green-200 text-sm space-y-1">
                            <p>• Professional tone and language</p>
                            <p>• Proper contact information</p>
                            <p>• Reasonable requests</p>
                            <p>• Official formatting</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Good analysis! This content follows proper professional communication standards.";
            }
            break;
    }

    // Add results to analysis panel
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML += results;
    document.getElementById('analysis-results').classList.remove('hidden');
    
    updateMentorMessage(mentorMessage);
    
    // Check if enough analysis completed
    if (Object.keys(gameState.analysisSteps[email.id]).length >= 2) {
        showResponsePanel();
    }
}

export function showResponsePanel() {
    document.getElementById('response-panel').classList.remove('hidden');
    updateMentorMessage("You've gathered enough evidence. Now choose your response action. Think carefully about the appropriate escalation level.");
}
