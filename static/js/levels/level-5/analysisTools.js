import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export function handleAnalysisTool(toolType) {
    const post = gameState.currentPost;
    let results = '';
    let mentorMessage = '';

    gameState.analysisSteps[post.id][toolType] = true;

    switch(toolType) {
        case 'analyze':
            if (post.type === 'privacy_violation') {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">🔍 Deep Analysis: PRIVACY VIOLATION</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p><strong>Violation Type:</strong> Unauthorized private content sharing</p>
                            <p><strong>Impact Level:</strong> High - damages trust and relationships</p>
                            <p><strong>Legal Risk:</strong> Potential harassment/privacy law violations</p>
                            <p><strong>Recommendation:</strong> Immediate mediation and education</p>
                        </div>
                    </div>
                `;
                mentorMessage = "The analysis confirms this is a serious privacy violation. Echo shared private messages without consent, violating both trust and digital ethics.";
            } else if (post.type === 'impersonation') {
                results = `
                    <div class="bg-purple-900 border border-purple-600 rounded p-3">
                        <h6 class="text-purple-300 font-semibold mb-2">🔍 Deep Analysis: IMPERSONATION DETECTED</h6>
                        <div class="text-purple-200 text-sm space-y-1">
                            <p><strong>Threat Type:</strong> Account impersonation</p>
                            <p><strong>Intent:</strong> Character assassination and manipulation</p>
                            <p><strong>Technical Markers:</strong> Timing, language patterns inconsistent</p>
                            <p><strong>Action:</strong> Counter with factual information</p>
                        </div>
                    </div>
                `;
                mentorMessage = "This is clearly a fake post designed to damage Echo's reputation. The language and timing don't match Echo's usual posting patterns.";
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Deep Analysis: POSITIVE CONTENT</h6>
                        <p class="text-green-200 text-sm">This post promotes healthy dialogue and conflict de-escalation.</p>
                    </div>
                `;
                mentorMessage = "This is a positive contribution trying to de-escalate the situation. We should amplify this type of constructive communication.";
            }
            break;

        case 'trace':
            results = `
                <div class="bg-blue-900 border border-blue-600 rounded p-3">
                    <h6 class="text-blue-300 font-semibold mb-2">📊 Spread Analysis</h6>
                    <div class="text-blue-200 text-sm space-y-1">
                        <p><strong>Primary Shares:</strong> ${Math.floor(Math.random() * 500) + 200}</p>
                        <p><strong>Secondary Shares:</strong> ${Math.floor(Math.random() * 1000) + 500}</p>
                        <p><strong>Bot Amplification:</strong> ${post.type === 'malicious' ? 'Detected' : 'Minimal'}</p>
                        <p><strong>Geographic Spread:</strong> Local community + ${Math.floor(Math.random() * 5) + 2} external networks</p>
                    </div>
                </div>
            `;
            mentorMessage = "The spread pattern shows how quickly content can go viral in social networks. Understanding this helps us plan containment strategies.";
            break;

        case 'verify':
            if (post.type === 'impersonation') {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">⚠️ Authenticity Check: FAKE ACCOUNT</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p><strong>Account Age:</strong> 2 hours (suspicious)</p>
                            <p><strong>Verification Status:</strong> Unverified</p>
                            <p><strong>Post Pattern:</strong> Inconsistent with user history</p>
                            <p><strong>Conclusion:</strong> Likely impersonation attack</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Verification confirms this is a fake account created to impersonate Echo. This is a coordinated attack on their reputation.";
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Authenticity Check: VERIFIED</h6>
                        <p class="text-green-200 text-sm">Account and content verified as authentic.</p>
                    </div>
                `;
                mentorMessage = "This account and post are verified as authentic.";
            }
            break;

        case 'educate':
            results = `
                <div class="bg-yellow-900 border border-yellow-600 rounded p-3">
                    <h6 class="text-yellow-300 font-semibold mb-2">📚 Educational Opportunity</h6>
                    <div class="text-yellow-200 text-sm space-y-1">
                        <p><strong>Key Lesson:</strong> Digital privacy and consent</p>
                        <p><strong>Teaching Moment:</strong> Think before you post</p>
                        <p><strong>Community Impact:</strong> How posts affect relationships</p>
                        <p><strong>Prevention:</strong> Healthy conflict resolution online</p>
                    </div>
                </div>
            `;
            mentorMessage = "This situation is a valuable teaching moment about digital citizenship and the importance of respecting privacy online.";
            break;
    }

    // Add results to analysis panel
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML += results;
    document.getElementById('analysis-results').classList.remove('hidden');
    
    updateMentorMessage(mentorMessage);
    
    // Check if enough analysis completed
    if (Object.keys(gameState.analysisSteps[post.id]).length >= 2) {
        showResponsePanel();
    }
}

export function showResponsePanel() {
    document.getElementById('response-panel').classList.remove('hidden');
    updateMentorMessage("You've gathered enough information. Now choose the most ethical and effective response strategy.");
}
