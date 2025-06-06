import { gameState } from './gameState.js';
import { updateMentorMessage, updateSenderInfo, updateLinkInfo } from './uiUpdates.js';

export function handleAnalysisTool(toolType) {
    const email = gameState.currentEmail;
    let results = '';
    let mentorMessage = '';

    gameState.analysisSteps[email.id][toolType] = true;

    // Mark tool as used
    const toolButton = document.querySelector(`[data-tool="${toolType}"]`);
    toolButton.classList.add('opacity-50', 'cursor-not-allowed');
    toolButton.disabled = true;

    switch(toolType) {
        case 'headers':
            if (email.isPhishing) {
                results = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                        <div class="flex items-start gap-3">
                            <i class="bi bi-exclamation-triangle text-red-600 text-lg mt-0.5"></i>
                            <div>
                                <h6 class="font-semibold text-red-800 mb-2">Header Analysis: SUSPICIOUS</h6>
                                <div class="text-red-700 text-sm space-y-1 font-mono">
                                    <p><strong>Return-Path:</strong> bounce@suspicious-server.com</p>
                                    <p><strong>Authentication:</strong> SPF=FAIL, DKIM=FAIL</p>
                                    <p><strong>Origin:</strong> Unknown external relay</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                mentorMessage = "Excellent! The email headers reveal this message failed authentication. The routing path shows it didn't come from our servers.";
                updateSenderInfo("🔴 FAILED AUTHENTICATION");
            } else {
                results = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                        <div class="flex items-start gap-3">
                            <i class="bi bi-check-circle text-green-600 text-lg mt-0.5"></i>
                            <div>
                                <h6 class="font-semibold text-green-800 mb-2">Header Analysis: LEGITIMATE</h6>
                                <div class="text-green-700 text-sm space-y-1 font-mono">
                                    <p><strong>Return-Path:</strong> admin@interworld.academy</p>
                                    <p><strong>Authentication:</strong> SPF=PASS, DKIM=PASS</p>
                                    <p><strong>Origin:</strong> mail.interworld.academy</p>
                                </div>
                            </div>
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
                    <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                        <div class="flex items-start gap-3">
                            <i class="bi bi-person-x text-red-600 text-lg mt-0.5"></i>
                            <div>
                                <h6 class="font-semibold text-red-800 mb-2">Sender Verification: FAILED</h6>
                                <div class="text-red-700 text-sm space-y-1">
                                    <p><strong>Domain:</strong> <span class="font-mono">interw0r1d.net</span> <span class="bg-red-600 text-white px-2 py-1 rounded text-xs">SUSPICIOUS</span></p>
                                    <p><strong>Legitimate:</strong> <span class="font-mono">interworld.academy</span></p>
                                    <p><strong>Registration:</strong> 2 days ago (RED FLAG)</p>
                                    <p><strong>Typosquatting:</strong> Uses '0' instead of 'o'</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                mentorMessage = "Perfect catch! The domain uses a zero instead of 'o' - a classic typosquatting attack. Real Academy emails come from interworld.academy.";
            } else {
                results = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                        <div class="flex items-start gap-3">
                            <i class="bi bi-person-check text-green-600 text-lg mt-0.5"></i>
                            <div>
                                <h6 class="font-semibold text-green-800 mb-2">Sender Verification: VERIFIED</h6>
                                <div class="text-green-700 text-sm space-y-1">
                                    <p><strong>Domain:</strong> <span class="font-mono">interworld.academy</span> <span class="bg-green-600 text-white px-2 py-1 rounded text-xs">VERIFIED</span></p>
                                    <p><strong>Certificate:</strong> Valid organization certificate</p>
                                    <p><strong>Reputation:</strong> Trusted sender</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                mentorMessage = "Excellent verification! This sender is legitimate and from our official domain.";
            }
            break;

        case 'links':
            if (email.hasLinks) {
                results = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                        <div class="flex items-start gap-3">
                            <i class="bi bi-link text-red-600 text-lg mt-0.5"></i>
                            <div>
                                <h6 class="font-semibold text-red-800 mb-2">Link Analysis: MALICIOUS</h6>
                                <div class="text-red-700 text-sm space-y-2">
                                    <div class="bg-white border border-red-300 rounded p-2 font-mono text-xs">
                                        suspicious-site.com/credential-harvest
                                    </div>
                                    <p><strong>Purpose:</strong> Credential harvesting</p>
                                    <p><strong>Threat Level:</strong> HIGH - DO NOT CLICK</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                mentorMessage = "Dangerous! That link leads to a fake login page designed to steal credentials. Never click suspicious links.";
                updateLinkInfo("🔴 MALICIOUS LINK DETECTED");
            } else {
                results = `
                    <div class="bg-gray-50 border-l-4 border-gray-400 rounded-lg p-4">
                        <div class="flex items-start gap-3">
                            <i class="bi bi-info-circle text-gray-600 text-lg mt-0.5"></i>
                            <div>
                                <h6 class="font-semibold text-gray-800 mb-2">Link Analysis: NO LINKS</h6>
                                <p class="text-gray-600 text-sm">No external links detected in this email.</p>
                            </div>
                        </div>
                    </div>
                `;
                mentorMessage = "No links found in this email - that's actually a good sign for legitimacy.";
                updateLinkInfo("No links detected");
            }
            break;

        case 'content':
            if (email.isPhishing) {
                results = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                        <div class="flex items-start gap-3">
                            <i class="bi bi-search text-red-600 text-lg mt-0.5"></i>
                            <div>
                                <h6 class="font-semibold text-red-800 mb-2">Content Analysis: SUSPICIOUS</h6>
                                <div class="text-red-700 text-sm space-y-1">
                                    <div class="bg-red-100 rounded p-2">
                                        <p class="font-semibold">Red Flags Detected:</p>
                                        <ul class="list-disc list-inside space-y-1 mt-1">
                                            <li>Excessive urgency ("IMMEDIATELY", "PRIORITY 1")</li>
                                            <li>Unusual secrecy requests</li>
                                            <li>Generic signature</li>
                                            <li>Pressure tactics</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                mentorMessage = "Great analysis! Phishing emails often use urgency and fear to bypass critical thinking. Real commanders don't demand immediate file downloads.";
            } else {
                results = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                        <div class="flex items-start gap-3">
                            <i class="bi bi-check-circle text-green-600 text-lg mt-0.5"></i>
                            <div>
                                <h6 class="font-semibold text-green-800 mb-2">Content Analysis: LEGITIMATE</h6>
                                <div class="text-green-700 text-sm space-y-1">
                                    <ul class="list-disc list-inside space-y-1">
                                        <li>Professional tone and language</li>
                                        <li>Proper contact information</li>
                                        <li>Reasonable requests</li>
                                        <li>Official formatting</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                mentorMessage = "Good analysis! This content follows proper professional communication standards.";
            }
            break;
    }

    // Add results to analysis panel
    const resultsContent = document.getElementById('results-content');
    resultsContent.appendChild(createResultElement(results));
    document.getElementById('analysis-results').classList.remove('hidden');
    
    updateMentorMessage(mentorMessage);
    
    // Check if enough analysis completed
    if (Object.keys(gameState.analysisSteps[email.id]).length >= 2) {
        showResponsePanel();
    }
}

function createResultElement(htmlContent) {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    return div.firstElementChild;
}

export function showResponsePanel() {
    document.getElementById('response-panel').classList.remove('hidden');
    updateMentorMessage("You've gathered enough evidence. Now choose your response action. Think carefully about the appropriate escalation level.");
}
