export let gameState = {
    // Investigation progress
    evidenceCollected: 0,
    evidenceBoard: [],
    truthIndicators: 0,
    truthScore: 0,
    
    // Suspect confidence tracking
    suspectConfidence: {
        dr: 20,  // Dr. Alexis Reeves
        mc: 20,  // Marcus Chen
        zk: 20   // Zara Khan
    },
    
    // Case building
    caseReadyNotified: false,
    finalAccusationMade: false,
    accusedSuspect: null,
    
    // Investigation metrics
    logsAnalyzed: 0,
    hashesVerified: 0,
    metadataExtracted: 0,
    timelineAnalyzed: false,
    trafficAnalyzed: false,
    
    // Investigation tools used
    toolsUsed: {
        logs: false,
        hash: false,
        metadata: false,
        timeline: false,
        traffic: false
    },
    
    // Mission tracking
    missionStartTime: null,
    investigationComplete: false,
    
    // Evidence database reference
    evidenceDatabase: null,
    suspects: null
};

export function updateGameMetrics() {
    // Update evidence counter
    const evidenceCounter = document.getElementById('evidence-count');
    if (evidenceCounter) {
        evidenceCounter.textContent = `${gameState.evidenceCollected}/15`;
    }
    
    // Update category counters
    updateCategoryCounters();
    
    // Update confidence meters
    updateConfidenceMeters();
    
    // Check for investigation completion
    checkInvestigationCompletion();
}

function updateCategoryCounters() {
    // Update logs analyzed counter
    const logsElement = document.getElementById('logs-analyzed');
    if (logsElement) {
        logsElement.textContent = `${gameState.logsAnalyzed}/5`;
    }
    
    // Update hashes verified counter
    const hashesElement = document.getElementById('hashes-verified');
    if (hashesElement) {
        hashesElement.textContent = `${gameState.hashesVerified}/3`;
    }
    
    // Update metadata extracted counter
    const metadataElement = document.getElementById('metadata-extracted');
    if (metadataElement) {
        metadataElement.textContent = `${gameState.metadataExtracted}/4`;
    }
    
    // Update timeline events counter
    const timelineElement = document.getElementById('timeline-events');
    if (timelineElement) {
        timelineElement.textContent = gameState.timelineAnalyzed ? '2/2' : '0/2';
    }
    
    // Update traffic analysis counter
    const trafficElement = document.getElementById('traffic-analyzed');
    if (trafficElement) {
        trafficElement.textContent = gameState.trafficAnalyzed ? '1/1' : '0/1';
    }
}

export function updateConfidenceMeters() {
    // Update confidence display for each suspect
    Object.entries(gameState.suspectConfidence).forEach(([suspectId, confidence]) => {
        // Update confidence percentage display
        const confidenceElement = document.getElementById(`${suspectId}-confidence`);
        if (confidenceElement) {
            confidenceElement.textContent = `${confidence}%`;
        }
        
        // Update confidence bar
        const confidenceBar = document.getElementById(`${suspectId}-confidence-bar`);
        if (confidenceBar) {
            confidenceBar.style.width = `${confidence}%`;
            
            // Update color based on confidence level
            if (confidence >= 70) {
                confidenceBar.className = 'bg-red-400 h-1 rounded-full transition-all duration-500';
            } else if (confidence >= 50) {
                confidenceBar.className = 'bg-yellow-400 h-1 rounded-full transition-all duration-500';
            } else {
                confidenceBar.className = 'bg-blue-400 h-1 rounded-full transition-all duration-500';
            }
        }
        
        // Update suspect card styling based on confidence
        const suspectCard = document.querySelector(`[data-suspect="${suspectId}"]`);
        if (suspectCard) {
            suspectCard.classList.remove('border-red-600', 'border-yellow-600', 'border-blue-600');
            if (confidence >= 70) {
                suspectCard.classList.add('border-red-600');
            } else if (confidence >= 50) {
                suspectCard.classList.add('border-yellow-600');
            } else {
                suspectCard.classList.add('border-blue-600');
            }
        }
    });
}

export function incrementAnalysisCounter(toolType) {
    gameState.toolsUsed[toolType] = true;
    
    switch (toolType) {
        case 'logs':
            gameState.logsAnalyzed = Math.min(5, gameState.logsAnalyzed + 1);
            break;
        case 'hash':
            gameState.hashesVerified = Math.min(3, gameState.hashesVerified + 1);
            break;
        case 'metadata':
            gameState.metadataExtracted = Math.min(4, gameState.metadataExtracted + 1);
            break;
        case 'timeline':
            gameState.timelineAnalyzed = true;
            break;
        case 'traffic':
            gameState.trafficAnalyzed = true;
            break;
    }
    
    updateGameMetrics();
}

function checkInvestigationCompletion() {
    // Check if enough evidence has been collected
    const minEvidenceForCompletion = 10;
    const hasMinimumEvidence = gameState.evidenceCollected >= minEvidenceForCompletion;
    
    // Check if multiple tools have been used
    const toolsUsedCount = Object.values(gameState.toolsUsed).filter(used => used).length;
    const hasUsedMultipleTools = toolsUsedCount >= 3;
    
    // Check if high confidence has been achieved for at least one suspect
    const hasHighConfidence = Object.values(gameState.suspectConfidence).some(confidence => confidence >= 60);
    
    const isComplete = hasMinimumEvidence && hasUsedMultipleTools && hasHighConfidence;
    
    if (isComplete && !gameState.investigationComplete) {
        gameState.investigationComplete = true;
        
        // Enable case presentation buttons
        enableCasePresentationButtons();
        
        // Show completion notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-900 border border-green-500 text-green-300 px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="bi bi-check-circle text-lg"></i>
                <div>
                    <div class="font-semibold">Investigation Complete</div>
                    <div class="text-xs text-green-400">Ready to present your case</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

function enableCasePresentationButtons() {
    const accusationButtons = ['accuse-dr', 'accuse-mc', 'accuse-zk'];
    accusationButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.classList.remove('disabled:bg-gray-600', 'disabled:cursor-not-allowed');
            button.classList.add('hover:opacity-80', 'transition-opacity');
        }
    });
}

export function makeAccusation(suspectId) {
    if (gameState.finalAccusationMade) {
        console.warn('Accusation already made');
        return;
    }
    
    gameState.finalAccusationMade = true;
    gameState.accusedSuspect = suspectId;
    
    // Calculate case strength based on evidence and confidence
    const confidence = gameState.suspectConfidence[suspectId];
    const evidenceStrength = calculateEvidenceStrength(suspectId);
    
    return {
        suspectId,
        confidence,
        evidenceStrength,
        totalEvidence: gameState.evidenceCollected,
        truthScore: gameState.truthScore,
        investigationTime: gameState.missionStartTime ? Date.now() - gameState.missionStartTime : 0
    };
}

function calculateEvidenceStrength(suspectId) {
    // Calculate strength based on evidence pointing to suspect
    const relevantEvidence = gameState.evidenceBoard.filter(evidenceId => {
        // This would need to be implemented based on evidence-suspect links
        return true; // Placeholder
    });
    
    return Math.min(100, (relevantEvidence.length * 10) + gameState.truthScore);
}

export function resetGameState() {
    // Reset all investigation progress
    gameState.evidenceCollected = 0;
    gameState.evidenceBoard = [];
    gameState.truthIndicators = 0;
    gameState.truthScore = 0;
    
    // Reset suspect confidence to baseline
    gameState.suspectConfidence = {
        dr: 20,
        mc: 20,
        zk: 20
    };
    
    // Reset case building
    gameState.caseReadyNotified = false;
    gameState.finalAccusationMade = false;
    gameState.accusedSuspect = null;
    
    // Reset investigation metrics
    gameState.logsAnalyzed = 0;
    gameState.hashesVerified = 0;
    gameState.metadataExtracted = 0;
    gameState.timelineAnalyzed = false;
    gameState.trafficAnalyzed = false;
    
    // Reset tools usage
    Object.keys(gameState.toolsUsed).forEach(tool => {
        gameState.toolsUsed[tool] = false;
    });
    
    // Reset mission tracking
    gameState.missionStartTime = null;
    gameState.investigationComplete = false;
    
    console.log('Game state reset for Level 10');
}

export function getInvestigationSummary() {
    return {
        evidenceCollected: gameState.evidenceCollected,
        truthScore: gameState.truthScore,
        suspectConfidence: { ...gameState.suspectConfidence },
        toolsUsed: Object.entries(gameState.toolsUsed)
            .filter(([tool, used]) => used)
            .map(([tool]) => tool),
        investigationTime: gameState.missionStartTime ? Date.now() - gameState.missionStartTime : 0,
        isComplete: gameState.investigationComplete
    };
}

export function updateInvestigationNotes(note) {
    // Add investigation note to UI
    const notesContainer = document.getElementById('investigation-notes');
    if (!notesContainer) return;
    
    const noteElement = document.createElement('div');
    noteElement.className = 'bg-gray-800 border-l-2 border-blue-400 rounded p-2 mb-2 text-xs';
    noteElement.innerHTML = `
        <div class="text-gray-400">${new Date().toLocaleTimeString()}</div>
        <div class="text-white">${note}</div>
    `;
    
    notesContainer.insertBefore(noteElement, notesContainer.firstChild);
    
    // Keep only last 10 notes
    while (notesContainer.children.length > 10) {
        notesContainer.removeChild(notesContainer.lastChild);
    }
}

// Initialize game metrics display
document.addEventListener('DOMContentLoaded', () => {
    updateGameMetrics();
});
