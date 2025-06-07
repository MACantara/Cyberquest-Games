import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export function handleAnalysisTool(toolType) {
    const investor = gameState.currentInvestor;
    let results = '';
    let mentorMessage = '';

    gameState.analysisSteps[investor.id][toolType] = true;

    switch(toolType) {
        case 'domain-check':
            if (investor.type === 'scam') {
                results = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-3">
                        <h6 class="text-red-800 font-semibold mb-2">🔍 Domain Analysis: SUSPICIOUS</h6>
                        <div class="text-red-700 text-xs space-y-1">
                            <p><strong>Domain:</strong> ${investor.domain}</p>
                            <p><strong>Registration:</strong> 3 days ago (RED FLAG)</p>
                            <p><strong>Typosquatting:</strong> Uses '4' instead of 'a'</p>
                            <p><strong>SSL Certificate:</strong> Self-signed (Unverified)</p>
                            <p><strong>Whois Protection:</strong> Full privacy (Hidden ownership)</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Critical red flags! The domain was registered days ago and uses character substitution. This is classic typosquatting - a common scam technique.";
            } else if (investor.type === 'suspicious') {
                results = `
                    <div class="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-3">
                        <h6 class="text-yellow-800 font-semibold mb-2">🔍 Domain Analysis: QUESTIONABLE</h6>
                        <div class="text-yellow-700 text-xs space-y-1">
                            <p><strong>Domain:</strong> ${investor.domain}</p>
                            <p><strong>Registration:</strong> 6 months ago</p>
                            <p><strong>Character Substitution:</strong> Uses '8' instead of 'a'</p>
                            <p><strong>SSL Certificate:</strong> Valid but recent</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Some concerns here. The domain uses character substitution and is relatively new, but not immediately dangerous like obvious scams.";
            } else {
                results = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-3">
                        <h6 class="text-green-800 font-semibold mb-2">🔍 Domain Analysis: VERIFIED</h6>
                        <div class="text-green-700 text-xs space-y-1">
                            <p><strong>Domain:</strong> ${investor.domain}</p>
                            <p><strong>Registration:</strong> 8 years ago</p>
                            <p><strong>SSL Certificate:</strong> Extended Validation</p>
                            <p><strong>Corporate Verification:</strong> Confirmed</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Excellent verification! This is a legitimate, established company with proper digital certificates and a long history.";
            }
            break;

        case 'financial-verify':
            if (investor.type === 'scam') {
                results = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-3">
                        <h6 class="text-red-800 font-semibold mb-2">💰 Financial Verification: FAILED</h6>
                        <div class="text-red-700 text-xs space-y-1">
                            <p><strong>Company Registration:</strong> No records found</p>
                            <p><strong>SEC Filings:</strong> None</p>
                            <p><strong>Bank Verification:</strong> Account doesn't exist</p>
                            <p><strong>Funding History:</strong> No previous investments</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Major red flags! No legitimate financial records exist. This is definitely a scam operation with no real funding capability.";
            } else {
                results = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-3">
                        <h6 class="text-green-800 font-semibold mb-2">💰 Financial Verification: CONFIRMED</h6>
                        <div class="text-green-700 text-xs space-y-1">
                            <p><strong>AUM:</strong> $500M+ under management</p>
                            <p><strong>SEC Registration:</strong> Valid investment advisor</p>
                            <p><strong>Portfolio:</strong> 50+ successful investments</p>
                            <p><strong>Track Record:</strong> 15 years experience</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Strong financial credentials confirmed. This investor has the resources and track record to follow through on their commitments.";
            }
            break;

        case 'terms-analysis':
            if (investor.contractIssues.length > 0) {
                results = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-3">
                        <h6 class="text-red-800 font-semibold mb-2">📋 Terms Analysis: RED FLAGS</h6>
                        <div class="text-red-700 text-xs space-y-1">
                            ${investor.contractIssues.map(issue => `<p>• ${issue}</p>`).join('')}
                        </div>
                    </div>
                `;
                mentorMessage = "Multiple contract red flags detected! These terms are either unrealistic, predatory, or designed to steal your assets.";
            } else {
                results = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-3">
                        <h6 class="text-green-800 font-semibold mb-2">📋 Terms Analysis: STANDARD</h6>
                        <div class="text-green-700 text-xs space-y-1">
                            <p>• Industry-standard equity percentages</p>
                            <p>• Reasonable valuation multiples</p>
                            <p>• Proper due diligence period</p>
                            <p>• Legal escrow protection</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Clean contract terms. Everything appears to follow industry standards and legal best practices.";
            }
            break;

        case 'reputation-check':
            if (investor.type === 'scam') {
                results = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-3">
                        <h6 class="text-red-800 font-semibold mb-2">🛡️ Reputation Check: DANGEROUS</h6>
                        <div class="text-red-700 text-xs space-y-1">
                            <p><strong>Scam Reports:</strong> 15+ reports filed</p>
                            <p><strong>BBB Rating:</strong> F rating</p>
                            <p><strong>Legal Actions:</strong> Under investigation</p>
                            <p><strong>Previous Victims:</strong> $2M+ stolen</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Extremely dangerous! This entity has an extensive history of defrauding startups. Multiple victims have lost substantial funds.";
            } else {
                results = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-3">
                        <h6 class="text-green-800 font-semibold mb-2">🛡️ Reputation Check: EXCELLENT</h6>
                        <div class="text-green-700 text-xs space-y-1">
                            <p><strong>Industry Standing:</strong> Top-tier VC firm</p>
                            <p><strong>Success Rate:</strong> 85% portfolio success</p>
                            <p><strong>Founder Reviews:</strong> 4.8/5 stars</p>
                            <p><strong>Exit History:</strong> 12 successful IPOs</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Outstanding reputation! This firm is highly respected with an excellent track record of supporting startup success.";
            }
            break;
    }

    // Add results to analysis panel
    const resultsContent = document.getElementById('results-content');
    const resultDiv = document.createElement('div');
    resultDiv.innerHTML = results;
    resultsContent.appendChild(resultDiv.firstElementChild);
    
    document.getElementById('analysis-results').classList.remove('hidden');
    
    updateMentorMessage(mentorMessage);
    
    // Mark tool as used
    const toolButton = document.querySelector(`[data-tool="${toolType}"]`);
    if (toolButton) {
        toolButton.classList.add('opacity-50');
        toolButton.disabled = true;
        toolButton.innerHTML = `<i class="bi bi-check mr-1"></i>${toolButton.textContent.trim()}`;
    }
    
    // Check if enough analysis completed
    if (Object.keys(gameState.analysisSteps[investor.id]).length >= 2) {
        showDecisionPanel();
    }
}

export function showDecisionPanel() {
    document.getElementById('decision-panel').classList.remove('hidden');
    updateMentorMessage("Analysis complete. Make your decision carefully - this will affect your startup's future and financial security.");
}
