import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export function handleAnalysisTool(toolType) {
    const investor = gameState.currentInvestor;
    let results = '';
    let mentorMessage = '';

    gameState.analysisSteps[investor.id][toolType] = true;

    switch(toolType) {
        case 'domain':
            if (investor.type === 'scam') {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">🚨 Domain Analysis: SUSPICIOUS</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            ${investor.domainFlags.map(flag => `<p>• ${flag}</p>`).join('')}
                            <p><strong>Recommendation:</strong> Do not trust this domain</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Domain analysis confirms this is a scam. Multiple red flags including typosquatting and suspicious TLD usage.";
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Domain Analysis: VERIFIED</h6>
                        <div class="text-green-200 text-sm space-y-1">
                            <p>• Valid SSL certificate</p>
                            <p>• Established domain registration</p>
                            <p>• Professional email infrastructure</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Domain checks out - this appears to be a legitimate business email.";
            }
            break;

        case 'headers':
            if (investor.type === 'scam') {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">📧 Email Headers: FORGED</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p><strong>SPF:</strong> FAIL - sender not authorized</p>
                            <p><strong>DKIM:</strong> FAIL - invalid signature</p>
                            <p><strong>Routing:</strong> Multiple suspicious relays</p>
                            <p><strong>Origin:</strong> Unknown/masked server</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Email headers show clear signs of forgery. This email did not come from the claimed sender.";
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Email Headers: AUTHENTIC</h6>
                        <div class="text-green-200 text-sm space-y-1">
                            <p><strong>SPF:</strong> PASS - authorized sender</p>
                            <p><strong>DKIM:</strong> PASS - valid signature</p>
                            <p><strong>Routing:</strong> Direct from company servers</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Email headers are properly authenticated - this is a legitimate communication.";
            }
            break;

        case 'contract':
            gameState.contractsAnalyzed++;
            if (investor.contractIssues.length > 0) {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">📋 Contract Analysis: HIGH RISK</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            ${investor.contractIssues.map(issue => `<p>• ${issue}</p>`).join('')}
                            <p><strong>Risk Level:</strong> Extremely High</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Contract analysis reveals multiple dangerous clauses. This agreement would give the 'investor' complete control over your funds.";
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Contract Analysis: STANDARD TERMS</h6>
                        <div class="text-green-200 text-sm space-y-1">
                            <p>• Standard equity exchange terms</p>
                            <p>• Reasonable investor protections</p>
                            <p>• Clear exit clauses</p>
                            <p>• Professional legal structure</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Contract terms are standard and reasonable for this type of investment.";
            }
            break;

        case 'reputation':
            if (investor.type === 'scam') {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">🔍 Reputation Check: NOT FOUND</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p>• No business registration found</p>
                            <p>• No professional LinkedIn profiles</p>
                            <p>• No previous investment history</p>
                            <p>• Multiple scam reports online</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Reputation check reveals this 'investor' doesn't exist. No legitimate business records or professional profiles found.";
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Reputation Check: ESTABLISHED</h6>
                        <div class="text-green-200 text-sm space-y-1">
                            <p>• Verified business registration</p>
                            <p>• Professional team profiles</p>
                            <p>• Successful investment history</p>
                            <p>• Positive industry reputation</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Reputation check confirms this is an established, legitimate investment firm with a strong track record.";
            }
            break;
    }

    // Add results to analysis panel
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML += results;
    document.getElementById('analysis-results').classList.remove('hidden');
    
    updateMentorMessage(mentorMessage);
    
    // Check if enough analysis completed
    if (Object.keys(gameState.analysisSteps[investor.id]).length >= 2) {
        showDecisionPanel();
    }
}

export function showDecisionPanel() {
    document.getElementById('decision-panel').classList.remove('hidden');
    updateMentorMessage("Analysis complete. Now make your investment decision based on the evidence you've gathered.");
}
