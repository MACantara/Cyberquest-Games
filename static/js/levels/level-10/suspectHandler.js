import { gameState, updateConfidenceMeters } from './gameState.js';
import { suspects, getEvidenceLinkedToSuspect, calculateEvidenceScore } from './dataLoader.js';
import { showResultModal, updateArgusMessage, animateConfidenceUpdate } from './uiUpdates.js';

export function showSuspectDetails(suspectId) {
    const suspect = suspects[suspectId];
    if (!suspect) {
        console.error('Suspect not found:', suspectId);
        return;
    }
    
    const confidence = gameState.suspectConfidence[suspectId];
    const linkedEvidence = getEvidenceLinkedToSuspect(suspectId);
    const evidenceScore = calculateEvidenceScore(suspectId);
    
    showResultModal('👤', suspect.name, 
        `Comprehensive analysis of ${suspect.name}'s involvement in The Null operation.`,
        generateSuspectAnalysis(suspect, confidence, linkedEvidence, evidenceScore)
    );
}

function generateSuspectAnalysis(suspect, confidence, linkedEvidence, evidenceScore) {
    return `
        <div class="text-left space-y-4">
            <!-- Background Information -->
            <div class="bg-gray-800 rounded-lg p-4">
                <div class="text-gray-400 text-sm font-semibold mb-2">📋 Background Profile</div>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Position:</span>
                        <span class="text-white">${suspect.background.position}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Tenure:</span>
                        <span class="text-white">${suspect.background.tenure || 'Unknown'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Specialization:</span>
                        <span class="text-white">${suspect.background.specialization || 'General'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Status:</span>
                        <span class="text-white">${suspect.status}</span>
                    </div>
                </div>
            </div>
            
            <!-- Motive Analysis -->
            <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                <div class="text-red-300 text-sm font-semibold mb-2">🎯 Motive Assessment</div>
                <div class="space-y-2 text-sm">
                    <div>
                        <span class="text-red-400 font-semibold">Primary:</span>
                        <span class="text-red-200 ml-2">${suspect.motive.primary}</span>
                    </div>
                    ${suspect.motive.secondary ? `
                        <div>
                            <span class="text-red-400 font-semibold">Secondary:</span>
                            <span class="text-red-200 ml-2">${suspect.motive.secondary}</span>
                        </div>
                    ` : ''}
                    ${suspect.motive.personal ? `
                        <div>
                            <span class="text-red-400 font-semibold">Personal:</span>
                            <span class="text-red-200 ml-2">${suspect.motive.personal}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Means & Opportunity -->
            <div class="bg-orange-900/20 border border-orange-600 rounded-lg p-4">
                <div class="text-orange-300 text-sm font-semibold mb-2">🔧 Means & Opportunity</div>
                <div class="space-y-2 text-sm">
                    ${suspect.means?.technical ? `
                        <div>
                            <span class="text-orange-400 font-semibold">Technical Skills:</span>
                            <span class="text-orange-200 ml-2">${suspect.means.technical}</span>
                        </div>
                    ` : ''}
                    ${suspect.means?.access ? `
                        <div>
                            <span class="text-orange-400 font-semibold">System Access:</span>
                            <span class="text-orange-200 ml-2">${suspect.means.access}</span>
                        </div>
                    ` : ''}
                    ${suspect.opportunity?.timing ? `
                        <div>
                            <span class="text-orange-400 font-semibold">Timing:</span>
                            <span class="text-orange-200 ml-2">${suspect.opportunity.timing}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Evidence Analysis -->
            <div class="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                <div class="text-blue-300 text-sm font-semibold mb-2">🔍 Evidence Analysis</div>
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-blue-400">Evidence Pieces:</span>
                        <span class="text-white">${linkedEvidence.length}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-blue-400">Evidence Score:</span>
                        <span class="text-blue-300">${evidenceScore} points</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-blue-400">Confidence Level:</span>
                        <span class="text-blue-300">${confidence}%</span>
                    </div>
                </div>
                
                ${linkedEvidence.length > 0 ? `
                    <div class="mt-3">
                        <div class="text-blue-400 text-xs font-semibold mb-2">Linked Evidence:</div>
                        <div class="space-y-1">
                            ${linkedEvidence.slice(0, 3).map(evidence => `
                                <div class="text-blue-200 text-xs">• ${evidence.description || evidence.type}</div>
                            `).join('')}
                            ${linkedEvidence.length > 3 ? `
                                <div class="text-blue-300 text-xs">+ ${linkedEvidence.length - 3} more pieces</div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <!-- Psychological Profile -->
            ${suspect.psychProfile ? `
                <div class="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
                    <div class="text-purple-300 text-sm font-semibold mb-2">🧠 Psychological Profile</div>
                    <div class="text-purple-200 text-sm">${suspect.psychProfile}</div>
                </div>
            ` : ''}
            
            <!-- Risk Factors -->
            ${suspect.riskFactors ? `
                <div class="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                    <div class="text-yellow-300 text-sm font-semibold mb-2">⚠️ Risk Factors</div>
                    <div class="space-y-1">
                        ${suspect.riskFactors.slice(0, 3).map(factor => `
                            <div class="text-yellow-200 text-xs">• ${factor}</div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Alibi Information -->
            ${suspect.alibi ? `
                <div class="bg-green-900/20 border border-green-600 rounded-lg p-4">
                    <div class="text-green-300 text-sm font-semibold mb-2">✋ Stated Alibi</div>
                    <div class="text-green-200 text-sm italic">"${suspect.alibi}"</div>
                </div>
            ` : ''}
            
            <!-- Investigation Recommendation -->
            <div class="bg-slate-700 rounded-lg p-4">
                <div class="text-white text-sm font-semibold mb-2">🎯 Investigation Recommendation</div>
                <div class="text-slate-300 text-sm">
                    ${generateInvestigationRecommendation(suspect, confidence, evidenceScore)}
                </div>
            </div>
        </div>
    `;
}

function generateInvestigationRecommendation(suspect, confidence, evidenceScore) {
    if (confidence >= 70) {
        return `Strong evidence supports ${suspect.name} as a primary suspect. Consider presenting your case if sufficient evidence has been collected.`;
    } else if (confidence >= 50) {
        return `Moderate evidence against ${suspect.name}. Continue investigating to strengthen the case or explore alternative suspects.`;
    } else if (confidence >= 30) {
        return `Limited evidence against ${suspect.name}. Additional forensics analysis needed to establish stronger connections.`;
    } else {
        return `Minimal evidence against ${suspect.name}. Focus investigation efforts on other suspects or gather more comprehensive evidence.`;
    }
}

export function updateSuspectConfidence(suspectId, evidenceValue, evidenceType) {
    const oldConfidence = gameState.suspectConfidence[suspectId];
    const suspect = suspects[suspectId];
    
    if (!suspect) return;
    
    // Calculate confidence increase based on evidence value and type
    let confidenceIncrease = Math.min(25, evidenceValue || 10);
    
    // Apply evidence type multipliers
    const evidenceMultipliers = {
        'critical': 1.5,
        'strong': 1.2,
        'moderate': 1.0,
        'weak': 0.7
    };
    
    confidenceIncrease *= evidenceMultipliers[evidenceType] || 1.0;
    
    // Update confidence with cap
    const newConfidence = Math.min(
        suspect.maxConfidence || 100,
        oldConfidence + Math.round(confidenceIncrease)
    );
    
    gameState.suspectConfidence[suspectId] = newConfidence;
    
    // Animate the confidence change
    animateConfidenceUpdate(suspectId, newConfidence, oldConfidence);
    
    // Update all confidence meters
    updateConfidenceMeters();
    
    // Provide contextual feedback
    if (newConfidence > oldConfidence) {
        const confidenceChange = newConfidence - oldConfidence;
        updateArgusMessage(
            `Evidence strengthens case against ${suspect.name} (+${confidenceChange}% confidence). ` +
            `Current level: ${newConfidence}%. ` +
            (newConfidence >= 70 ? 
                'Strong evidence pattern - consider case presentation.' : 
                'Continue gathering evidence for stronger case.')
        );
    }
    
    return newConfidence;
}

export function compareSuspects() {
    const comparison = Object.entries(gameState.suspectConfidence)
        .map(([suspectId, confidence]) => ({
            suspect: suspects[suspectId],
            suspectId,
            confidence,
            evidenceCount: getEvidenceLinkedToSuspect(suspectId).length,
            evidenceScore: calculateEvidenceScore(suspectId)
        }))
        .sort((a, b) => b.confidence - a.confidence);
    
    return comparison;
}

export function getLeadingSuspect() {
    const comparison = compareSuspects();
    return comparison[0];
}

export function generateSuspectSummary() {
    const comparison = compareSuspects();
    
    return {
        leadingSuspect: comparison[0],
        allSuspects: comparison,
        evidenceDistribution: comparison.map(s => ({
            name: s.suspect.name,
            evidenceCount: s.evidenceCount,
            confidence: s.confidence
        })),
        recommendedAction: generateRecommendation(comparison[0])
    };
}

function generateRecommendation(leadingSuspect) {
    if (leadingSuspect.confidence >= 70) {
        return `Present case against ${leadingSuspect.suspect.name} - strong evidence collected`;
    } else if (leadingSuspect.confidence >= 50) {
        return `Continue investigating ${leadingSuspect.suspect.name} - moderate evidence needs strengthening`;
    } else {
        return 'Insufficient evidence against all suspects - conduct more comprehensive analysis';
    }
}

// Export suspect management functions
export function resetSuspectConfidence() {
    gameState.suspectConfidence = {
        dr: 20,
        mc: 20,
        zk: 20
    };
    updateConfidenceMeters();
}

export function setSuspectConfidence(suspectId, confidence) {
    const suspect = suspects[suspectId];
    if (suspect) {
        gameState.suspectConfidence[suspectId] = Math.min(
            suspect.maxConfidence || 100,
            Math.max(0, confidence)
        );
        updateConfidenceMeters();
    }
}

export function getSuspectRanking() {
    return Object.entries(gameState.suspectConfidence)
        .sort(([, a], [, b]) => b - a)
        .map(([suspectId, confidence], index) => ({
            rank: index + 1,
            suspectId,
            suspect: suspects[suspectId],
            confidence
        }));
}
