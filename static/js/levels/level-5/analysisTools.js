import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export function handleAnalysisTool(toolType) {
    const post = gameState.currentPost;
    let results = '';
    let mentorMessage = '';

    gameState.analysisSteps[post.id][toolType] = true;

    switch(toolType) {
        case 'fact-check':
            if (post.type === 'privacy_violation') {
                results = `
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h6 class="text-red-800 font-semibold mb-2">📋 Fact Check: PRIVACY VIOLATION CONFIRMED</h6>
                        <div class="text-red-700 text-sm space-y-1">
                            <p><strong>Content Type:</strong> Leaked private DMs</p>
                            <p><strong>Consent Status:</strong> No permission obtained</p>
                            <p><strong>Verification:</strong> Content appears authentic but shared illegally</p>
                            <p><strong>Impact:</strong> Violates digital privacy rights</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Fact-check confirms these are real private messages shared without consent. This is a clear privacy violation that needs immediate intervention.";
            } else if (post.type === 'fake_content') {
                results = `
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <h6 class="text-purple-800 font-semibold mb-2">📋 Fact Check: FABRICATED CONTENT DETECTED</h6>
                        <div class="text-purple-700 text-sm space-y-1">
                            <p><strong>AI Detection:</strong> 95% synthetic media probability</p>
                            <p><strong>Image Analysis:</strong> Digital artifacts present</p>
                            <p><strong>Source:</strong> No legitimate verification possible</p>
                            <p><strong>Purpose:</strong> Designed to amplify drama</p>
                        </div>
                    </div>
                `;
                mentorMessage = "This content is AI-generated fake media. The screenshots are fabricated to look real but contain telltale digital artifacts.";
            } else if (post.type === 'blackmail_threat') {
                results = `
                    <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <h6 class="text-orange-800 font-semibold mb-2">📋 Fact Check: CRIMINAL THREAT IDENTIFIED</h6>
                        <div class="text-orange-700 text-sm space-y-1">
                            <p><strong>Threat Type:</strong> Explicit blackmail/extortion</p>
                            <p><strong>Legal Status:</strong> Criminal behavior</p>
                            <p><strong>Account Analysis:</strong> Anonymous, likely throwaway</p>
                            <p><strong>Risk Level:</strong> Immediate law enforcement concern</p>
                        </div>
                    </div>
                `;
                mentorMessage = "This is explicit criminal blackmail. The anonymous account is making illegal extortion demands that require immediate reporting.";
            } else {
                results = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h6 class="text-green-800 font-semibold mb-2">📋 Fact Check: LEGITIMATE CONTENT</h6>
                        <div class="text-green-700 text-sm space-y-1">
                            <p><strong>Content Verification:</strong> Authentic personal expression</p>
                            <p><strong>Source Credibility:</strong> Verified user account</p>
                            <p><strong>Intent:</strong> Constructive community response</p>
                        </div>
                    </div>
                `;
                mentorMessage = "This appears to be authentic, constructive content from a verified community member trying to help.";
            }
            break;

        case 'verify-source':
            if (post.author === 'Anonymous_Truth' || post.author === 'TrollMaster_2024') {
                results = `
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h6 class="text-red-800 font-semibold mb-2">🔍 Source Verification: SUSPICIOUS ACCOUNT</h6>
                        <div class="text-red-700 text-sm space-y-1">
                            <p><strong>Account Age:</strong> Created 3 days ago</p>
                            <p><strong>Profile:</strong> No profile picture, minimal information</p>
                            <p><strong>Activity Pattern:</strong> Only posts inflammatory content</p>
                            <p><strong>Network Analysis:</strong> Likely troll/bot account</p>
                            <p><strong>Verification Status:</strong> Unverified, high risk</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Source verification reveals this is a suspicious account created specifically for harassment. Classic troll behavior pattern.";
            } else {
                results = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h6 class="text-green-800 font-semibold mb-2">🔍 Source Verification: LEGITIMATE USER</h6>
                        <div class="text-green-700 text-sm space-y-1">
                            <p><strong>Account Age:</strong> ${post.author === 'Echo Rivera' ? '2 years' : '3 years'} (established)</p>
                            <p><strong>Profile:</strong> Complete with verified information</p>
                            <p><strong>Community Standing:</strong> Known member of Academy network</p>
                            <p><strong>Verification Status:</strong> Student verified account</p>
                        </div>
                    </div>
                `;
                mentorMessage = "This is a verified Academy student account with an established history in the community.";
            }
            break;

        case 'privacy-check':
            if (post.privacyFlags.length > 0) {
                results = `
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h6 class="text-red-800 font-semibold mb-2">🔐 Privacy Check: VIOLATIONS DETECTED</h6>
                        <div class="text-red-700 text-sm space-y-2">
                            <p><strong>Privacy Violations Found:</strong></p>
                            <ul class="list-disc list-inside space-y-1">
                                ${post.privacyFlags.map(flag => `<li>${flag}</li>`).join('')}
                            </ul>
                            <div class="bg-red-100 rounded p-2 mt-2">
                                <p class="font-semibold text-red-800">GDPR/Privacy Law Implications:</p>
                                <p class="text-xs">Sharing personal communications without consent violates digital privacy rights</p>
                            </div>
                        </div>
                    </div>
                `;
                mentorMessage = "Privacy analysis reveals serious violations. Personal data and private communications are being shared without consent.";
            } else {
                results = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h6 class="text-green-800 font-semibold mb-2">🔐 Privacy Check: NO VIOLATIONS</h6>
                        <div class="text-green-700 text-sm">
                            <p>✅ No personal data exposed without consent</p>
                            <p>✅ No private communications shared</p>
                            <p>✅ Content respects digital privacy boundaries</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Privacy check shows this content respects personal boundaries and doesn't violate privacy rights.";
            }
            break;

        case 'sentiment-analysis':
            if (post.type === 'privacy_violation' || post.type === 'blackmail_threat') {
                results = `
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h6 class="text-red-800 font-semibold mb-2">💭 Sentiment Analysis: HARMFUL INTENT</h6>
                        <div class="text-red-700 text-sm space-y-1">
                            <p><strong>Emotional Tone:</strong> Aggressive, malicious</p>
                            <p><strong>Intent Classification:</strong> ${post.type === 'blackmail_threat' ? 'Criminal threat' : 'Social manipulation'}</p>
                            <p><strong>Impact Prediction:</strong> High psychological harm to targets</p>
                            <p><strong>Community Effect:</strong> Toxic, divisive</p>
                            <p><strong>Empathy Level:</strong> None detected</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Sentiment analysis reveals malicious intent designed to cause maximum harm and drama.";
            } else if (post.type === 'victim_response') {
                results = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h6 class="text-blue-800 font-semibold mb-2">💭 Sentiment Analysis: DISTRESS & PLEA</h6>
                        <div class="text-blue-700 text-sm space-y-1">
                            <p><strong>Emotional Tone:</strong> Devastated, vulnerable</p>
                            <p><strong>Intent Classification:</strong> Genuine plea for help</p>
                            <p><strong>Communication Style:</strong> Honest, direct</p>
                            <p><strong>Needs Assessment:</strong> Support, protection, empathy</p>
                        </div>
                    </div>
                `;
                mentorMessage = "This shows genuine distress from someone whose privacy has been violated. They need support, not judgment.";
            } else {
                results = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h6 class="text-green-800 font-semibold mb-2">💭 Sentiment Analysis: CONSTRUCTIVE INTENT</h6>
                        <div class="text-green-700 text-sm space-y-1">
                            <p><strong>Emotional Tone:</strong> Supportive, empathetic</p>
                            <p><strong>Intent Classification:</strong> Community healing</p>
                            <p><strong>Communication Style:</strong> Thoughtful, responsible</p>
                            <p><strong>Community Effect:</strong> Positive, unifying</p>
                        </div>
                    </div>
                `;
                mentorMessage = "This shows positive intent focused on supporting the victim and promoting healthy community values.";
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
        toolButton.innerHTML = `<i class="bi bi-check mr-2"></i>${toolButton.textContent.split(' ').slice(1).join(' ')}`;
    }
    
    // Check if enough analysis completed
    if (Object.keys(gameState.analysisSteps[post.id]).length >= 2) {
        showResponsePanel();
    }
}

export function showResponsePanel() {
    document.getElementById('response-panel').classList.remove('hidden');
    updateMentorMessage("Analysis complete. Now choose your moderation response. Consider the specific situation and what action would be most ethical and effective.");
}
