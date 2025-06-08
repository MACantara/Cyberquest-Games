import { gameState, makeAccusation, getInvestigationSummary } from './gameState.js';
import { suspects, getEvidenceLinkedToSuspect, calculateEvidenceScore } from './dataLoader.js';
import { updateArgusMessage, showResultModal, createNotification } from './uiUpdates.js';
import { showSuspectDetails } from './suspectHandler.js';

export function initializeGameLogic() {
    // Initialize suspect interaction handlers
    initializeSuspectHandlers();
    
    // Initialize accusation handlers
    initializeAccusationHandlers();
    
    // Initialize case presentation logic
    initializeCasePresentationLogic();
    
    // Initialize investigation completion handlers
    initializeCompletionHandlers();
    
    console.log('Level 10 game logic initialized');
}

function initializeSuspectHandlers() {
    // Add click handlers to suspect cards
    document.querySelectorAll('.suspect-card').forEach(card => {
        card.addEventListener('click', function() {
            const suspectId = this.dataset.suspect;
            if (suspectId) {
                selectSuspectForAnalysis(suspectId);
            }
        });
        
        // Add hover effects for suspect cards
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.classList.add('transform', 'scale-105', 'shadow-lg');
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.classList.remove('transform', 'scale-105', 'shadow-lg');
            }
        });
    });
}

function selectSuspectForAnalysis(suspectId) {
    // Remove selection from other cards
    document.querySelectorAll('.suspect-card').forEach(card => {
        card.classList.remove('selected', 'ring-2', 'ring-blue-400');
    });
    
    // Add selection to current card
    const selectedCard = document.querySelector(`[data-suspect="${suspectId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected', 'ring-2', 'ring-blue-400');
    }
    
    // Show detailed analysis
    showSuspectDetails(suspectId);
    
    // Update investigation notes
    const suspect = suspects[suspectId];
    if (suspect) {
        updateArgusMessage(`Analyzing ${suspect.name}'s profile. Review their background, motive, and linked evidence to assess their role in The Null operation.`);
        
        // Track suspect analysis for game metrics
        if (!gameState.suspectsAnalyzed) {
            gameState.suspectsAnalyzed = [];
        }
        
        if (!gameState.suspectsAnalyzed.includes(suspectId)) {
            gameState.suspectsAnalyzed.push(suspectId);
        }
    }
}

function initializeAccusationHandlers() {
    const accusationButtons = ['accuse-dr', 'accuse-mc', 'accuse-zk'];
    
    accusationButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                const suspectId = buttonId.replace('accuse-', '');
                initiateAccusation(suspectId);
            });
        }
    });
}

function initiateAccusation(suspectId) {
    const suspect = suspects[suspectId];
    if (!suspect) {
        console.error('Suspect not found for accusation:', suspectId);
        return;
    }
    
    // Check if sufficient evidence has been collected
    const minEvidenceRequired = 8;
    if (gameState.evidenceCollected < minEvidenceRequired) {
        showInsufficientEvidenceWarning(minEvidenceRequired);
        return;
    }
    
    // Show confirmation dialog before final accusation
    showAccusationConfirmation(suspect, suspectId);
}

function showInsufficientEvidenceWarning(minRequired) {
    showResultModal(
        '⚠️',
        'Insufficient Evidence',
        `You need at least ${minRequired} pieces of evidence to present a case.`,
        `
            <div class="text-left space-y-3">
                <div class="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                    <div class="text-yellow-300 font-semibold mb-2">Evidence Requirements</div>
                    <div class="text-yellow-200 text-sm">
                        A successful prosecution requires comprehensive evidence gathering. Continue your forensics analysis to collect more evidence.
                    </div>
                </div>
                
                <div class="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                    <div class="text-blue-300 font-semibold mb-2">Current Progress</div>
                    <div class="text-blue-200 text-sm space-y-1">
                        <div>Evidence Collected: ${gameState.evidenceCollected}/${minRequired} required</div>
                        <div>Tools Used: ${Object.values(gameState.toolsUsed).filter(used => used).length}/5 available</div>
                        <div>Truth Score: ${gameState.truthScore} points</div>
                    </div>
                </div>
                
                <div class="bg-slate-700 rounded-lg p-4">
                    <div class="text-white font-semibold mb-2">Recommended Actions</div>
                    <div class="text-slate-300 text-sm space-y-1">
                        <div>• Use multiple forensics tools for comprehensive analysis</div>
                        <div>• Collect evidence from logs, metadata, and network traffic</div>
                        <div>• Perform deep analysis to strengthen your case</div>
                    </div>
                </div>
            </div>
        `
    );
    
    updateArgusMessage(`Insufficient evidence for case presentation. Continue your investigation using different forensics tools to gather the ${minRequired - gameState.evidenceCollected} additional pieces of evidence needed.`);
}

function showAccusationConfirmation(suspect, suspectId) {
    const confidence = gameState.suspectConfidence[suspectId];
    const evidenceScore = calculateEvidenceScore(suspectId);
    const linkedEvidence = getEvidenceLinkedToSuspect(suspectId);
    
    showResultModal(
        '⚖️',
        'Confirm Case Presentation',
        `Are you ready to present your case against ${suspect.name}?`,
        `
            <div class="text-left space-y-4">
                <div class="bg-slate-700 rounded-lg p-4">
                    <div class="text-white font-semibold mb-3">Case Strength Assessment</div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-slate-400">Evidence Confidence:</span>
                            <span class="text-white">${confidence}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Linked Evidence:</span>
                            <span class="text-white">${linkedEvidence.length} pieces</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Evidence Score:</span>
                            <span class="text-white">${evidenceScore} points</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Total Evidence:</span>
                            <span class="text-white">${gameState.evidenceCollected} collected</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-${confidence >= 70 ? 'green' : confidence >= 50 ? 'yellow' : 'red'}-900/30 border border-${confidence >= 70 ? 'green' : confidence >= 50 ? 'yellow' : 'red'}-600 rounded-lg p-4">
                    <div class="text-${confidence >= 70 ? 'green' : confidence >= 50 ? 'yellow' : 'red'}-300 font-semibold mb-2">
                        Case Assessment: ${confidence >= 70 ? 'Strong' : confidence >= 50 ? 'Moderate' : 'Weak'}
                    </div>
                    <div class="text-${confidence >= 70 ? 'green' : confidence >= 50 ? 'yellow' : 'red'}-200 text-sm">
                        ${confidence >= 70 ? 
                            'Your evidence strongly supports this accusation. The prosecution has a high probability of success.' :
                            confidence >= 50 ?
                            'Moderate evidence supports this accusation. Additional evidence would strengthen your case.' :
                            'Limited evidence supports this accusation. Consider gathering more evidence or analyzing other suspects.'
                        }
                    </div>
                </div>
                
                <div class="flex gap-3">
                    <button id="confirm-accusation" class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold">
                        Present Case Against ${suspect.name}
                    </button>
                    <button id="cancel-accusation" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                        Continue Investigation
                    </button>
                </div>
            </div>
        `
    );
    
    // Add event handlers for confirmation buttons
    setTimeout(() => {
        document.getElementById('confirm-accusation')?.addEventListener('click', () => {
            finalizeAccusation(suspectId);
            document.getElementById('results-modal').classList.add('hidden');
        });
        
        document.getElementById('cancel-accusation')?.addEventListener('click', () => {
            document.getElementById('results-modal').classList.add('hidden');
            updateArgusMessage("Case presentation cancelled. Continue gathering evidence to strengthen your investigation.");
        });
    }, 100);
}

function finalizeAccusation(suspectId) {
    const accusationResult = makeAccusation(suspectId);
    const suspect = suspects[suspectId];
    const isCorrect = suspect.isCorrectSuspect;
    
    // Disable all accusation buttons after decision is made
    ['accuse-dr', 'accuse-mc', 'accuse-zk'].forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
        }
    });
    
    if (isCorrect) {
        handleSuccessfulAccusation(suspect, accusationResult);
    } else {
        handleFailedAccusation(suspect, accusationResult);
    }
    
    // Enable level completion after brief delay
    setTimeout(() => {
        enableLevelCompletion(isCorrect);
    }, 3000);
}

function handleSuccessfulAccusation(suspect, result) {
    updateArgusMessage("Case presentation successful! Your forensics analysis correctly identified the mastermind behind The Null operation. Justice will be served.");
    
    showResultModal(
        '🎯',
        'Case Presentation: SUCCESSFUL',
        `Your evidence successfully proves ${suspect.name} is The Null's mastermind.`,
        generateSuccessResultContent(suspect, result)
    );
    
    // Update case success metrics
    gameState.caseSuccessful = true;
    gameState.finalScore = calculateFinalScore(result, true);
}

function handleFailedAccusation(suspect, result) {
    const correctSuspect = Object.values(suspects).find(s => s.isCorrectSuspect);
    
    updateArgusMessage("Case presentation unsuccessful. The evidence was insufficient to prove your accusation. The real mastermind remains at large.");
    
    showResultModal(
        '❌',
        'Case Presentation: INSUFFICIENT EVIDENCE',
        `Your accusation against ${suspect.name} could not be substantiated.`,
        generateFailureResultContent(suspect, result, correctSuspect)
    );
    
    // Update case failure metrics
    gameState.caseSuccessful = false;
    gameState.finalScore = calculateFinalScore(result, false);
}

function generateSuccessResultContent(suspect, result) {
    return `
        <div class="text-left space-y-4">
            <div class="bg-green-900/30 border border-green-600 rounded-lg p-4">
                <div class="text-green-300 font-semibold mb-2">✅ CORRECT IDENTIFICATION</div>
                <div class="text-green-200 text-sm">
                    Your forensics analysis correctly identified Dr. Alexis Reeves as The Null's mastermind. 
                    The evidence of revenge motivation, insider knowledge, and data exfiltration was compelling.
                </div>
            </div>
            
            <div class="bg-slate-700 rounded-lg p-4">
                <div class="text-white font-semibold mb-3">Investigation Summary</div>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-slate-400">Evidence Collected:</span>
                        <span class="text-white">${result.totalEvidence}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Truth Score:</span>
                        <span class="text-green-400">${result.truthScore}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Confidence Level:</span>
                        <span class="text-green-400">${result.confidence}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Investigation Time:</span>
                        <span class="text-white">${Math.round(result.investigationTime / 60000)}m</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-purple-900/30 border border-purple-600 rounded-lg p-4">
                <div class="text-purple-300 font-semibold mb-2">🎯 The Truth Revealed</div>
                <div class="text-purple-200 text-sm">
                    Dr. Reeves' dismissal for ethics violations created the perfect motive for revenge. 
                    Using retained system access and AI expertise, he orchestrated The Null's attacks 
                    to expose what he saw as Academy hypocrisy while destroying the institution that rejected him.
                </div>
            </div>
            
            <div class="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                <div class="text-blue-300 font-semibold mb-2">Commander Vega</div>
                <div class="text-blue-200 text-sm italic">
                    "Exceptional work, Nova. Your forensics analysis uncovered the truth that could have remained hidden forever. 
                    The Academy is safe, and justice will be served. You've proven yourself as both a skilled investigator and a guardian of truth."
                </div>
            </div>
        </div>
    `;
}

function generateFailureResultContent(suspect, result, correctSuspect) {
    return `
        <div class="text-left space-y-4">
            <div class="bg-red-900/30 border border-red-600 rounded-lg p-4">
                <div class="text-red-300 font-semibold mb-2">❌ INCORRECT IDENTIFICATION</div>
                <div class="text-red-200 text-sm">
                    While ${suspect.name} had some suspicious connections, the evidence was insufficient 
                    to prove their role as The Null's mastermind. The real perpetrator remains at large.
                </div>
            </div>
            
            <div class="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                <div class="text-yellow-300 font-semibold mb-2">📊 Investigation Analysis</div>
                <div class="text-yellow-200 text-sm space-y-1">
                    <div>• Evidence pointing to ${suspect.name}: Limited</div>
                    <div>• Confidence level achieved: ${result.confidence}%</div>
                    <div>• Critical evidence missed: High</div>
                    <div>• Alternative suspects not fully investigated</div>
                </div>
            </div>
            
            <div class="bg-slate-700 rounded-lg p-4">
                <div class="text-white font-semibold mb-2">The Truth</div>
                <div class="text-slate-300 text-sm">
                    ${correctSuspect.name} was the actual mastermind. Key evidence pointing to them included 
                    ${correctSuspect.background.position.toLowerCase()}, direct system access, and strong motive 
                    based on ${correctSuspect.motive.primary.toLowerCase()}.
                </div>
            </div>
            
            <div class="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                <div class="text-blue-300 font-semibold mb-2">Learning Opportunity</div>
                <div class="text-blue-200 text-sm">
                    Digital forensics requires careful analysis of all evidence types. Consider revisiting 
                    the investigation with focus on timeline analysis and network traffic data for stronger conclusions.
                </div>
            </div>
        </div>
    `;
}

function calculateFinalScore(result, isSuccessful) {
    let score = 0;
    
    // Base score for evidence collection
    score += gameState.evidenceCollected * 10;
    
    // Truth score contribution
    score += gameState.truthScore;
    
    // Success bonus
    if (isSuccessful) {
        score += 200;
        
        // Confidence bonus
        score += Math.max(0, result.confidence - 50);
        
        // Speed bonus (less time = higher bonus)
        const timeBonus = Math.max(0, 100 - (result.investigationTime / 60000));
        score += timeBonus;
    } else {
        // Partial credit for unsuccessful but thorough investigation
        score += Math.floor(score * 0.3);
    }
    
    // Tools usage bonus
    const toolsUsed = Object.values(gameState.toolsUsed).filter(used => used).length;
    score += toolsUsed * 25;
    
    return Math.round(score);
}

function initializeCasePresentationLogic() {
    // Monitor evidence collection for case readiness
    setInterval(() => {
        updateCaseReadinessStatus();
    }, 2000);
}

function updateCaseReadinessStatus() {
    const minEvidence = 8;
    const canPresentCase = gameState.evidenceCollected >= minEvidence;
    
    // Update accusation button states
    ['accuse-dr', 'accuse-mc', 'accuse-zk'].forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button && !gameState.finalAccusationMade) {
            button.disabled = !canPresentCase;
            
            if (canPresentCase) {
                button.classList.remove('opacity-50', 'cursor-not-allowed');
                button.classList.add('hover:opacity-80');
            } else {
                button.classList.add('opacity-50', 'cursor-not-allowed');
                button.classList.remove('hover:opacity-80');
            }
        }
    });
}

function initializeCompletionHandlers() {
    const completeBtn = document.getElementById('complete-level');
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            completeInvestigation();
        });
    }
}

function enableLevelCompletion(isSuccessful) {
    const completeBtn = document.getElementById('complete-level');
    if (completeBtn) {
        completeBtn.disabled = false;
        completeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        
        if (isSuccessful) {
            completeBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            completeBtn.innerHTML = '🎉 Complete Investigation <i class="bi bi-arrow-right ml-2"></i>';
        } else {
            completeBtn.classList.add('bg-orange-600', 'hover:bg-orange-700');
            completeBtn.innerHTML = 'Review Investigation <i class="bi bi-arrow-right ml-2"></i>';
        }
    }
}

function completeInvestigation() {
    const summary = getInvestigationSummary();
    const isSuccess = gameState.caseSuccessful;
    
    if (isSuccess) {
        // Redirect to campaign with success status
        window.location.href = `/campaign?level=10&status=complete&score=${gameState.finalScore}`;
    } else {
        // Show retry or continue options
        showInvestigationReview();
    }
}

function showInvestigationReview() {
    showResultModal(
        '🔄',
        'Investigation Review',
        'Would you like to restart the investigation with what you\'ve learned?',
        `
            <div class="text-center space-y-4">
                <div class="bg-yellow-900/30 border border-yellow-600 rounded p-3">
                    <div class="text-yellow-300 text-sm">
                        Understanding digital forensics takes practice. Each investigation teaches valuable lessons 
                        about evidence analysis and suspect evaluation.
                    </div>
                </div>
                
                <div class="bg-slate-700 rounded p-3">
                    <div class="text-white font-semibold mb-2">Investigation Score: ${gameState.finalScore}</div>
                    <div class="text-slate-300 text-sm">
                        You collected ${gameState.evidenceCollected} pieces of evidence and achieved a truth score of ${gameState.truthScore}.
                    </div>
                </div>
                
                <div class="flex gap-3">
                    <button id="restart-investigation" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Restart Investigation
                    </button>
                    <button id="continue-campaign" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        Continue to Campaign
                    </button>
                </div>
            </div>
        `
    );
    
    // Add restart functionality
    setTimeout(() => {
        document.getElementById('restart-investigation')?.addEventListener('click', () => {
            location.reload();
        });
        
        document.getElementById('continue-campaign')?.addEventListener('click', () => {
            window.location.href = '/campaign';
        });
    }, 100);
}

// Export game logic functions
export function getCurrentCaseStrength() {
    const totalEvidence = gameState.evidenceCollected;
    const truthScore = gameState.truthScore;
    const maxConfidence = Math.max(...Object.values(gameState.suspectConfidence));
    
    return {
        evidenceStrength: Math.min(100, (totalEvidence / 15) * 100),
        truthStrength: Math.min(100, (truthScore / 300) * 100),
        suspectStrength: maxConfidence,
        overallStrength: Math.round(((totalEvidence / 15) * 40) + ((truthScore / 300) * 30) + (maxConfidence * 0.3))
    };
}

export function getOptimalSuspect() {
    return Object.entries(gameState.suspectConfidence)
        .sort(([,a], [,b]) => b - a)
        .map(([suspectId]) => ({ suspectId, suspect: suspects[suspectId] }))[0];
}
