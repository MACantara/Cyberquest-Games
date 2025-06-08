export const gameState = {
    integrityScore: 100,
    vulnerabilitiesFound: 0,
    ethicalScore: 100,
    
    // New file-based analysis tracking
    filesAnalyzed: 0,
    exploitsRun: 0,
    currentFile: null,
    
    // Ethical decision tracking
    disclosureDecisionMade: false,
    disclosureChoice: null,
    
    // Audit progress
    auditComplete: false,
    reportGenerated: false,
    
    // Ethical metrics
    responsibilityLevel: 100,
    transparencyLevel: 100,
    
    // Decision history
    ethicalDecisions: [],
    analysisResults: {}
};

export function updateGameMetrics() {
    // Update progress indicators
    updateProgressIndicators();
    
    // Check completion conditions
    checkCompletionConditions();
}

function getScoreColor(score) {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
}

function updateProgressIndicators() {
    // Files analyzed
    const filesElement = document.getElementById('files-analyzed');
    if (filesElement) {
        filesElement.textContent = `${gameState.filesAnalyzed}/4`;
    }
    
    // Vulnerabilities found
    const vulnCountElement = document.getElementById('vuln-count');
    if (vulnCountElement) {
        vulnCountElement.textContent = `${gameState.vulnerabilitiesFound} found`;
        vulnCountElement.className = gameState.vulnerabilitiesFound > 0 ? 'text-red-400' : 'text-orange-400';
    }
    
    // Exploits tested
    const exploitCountElement = document.getElementById('exploit-count');
    if (exploitCountElement) {
        exploitCountElement.textContent = gameState.exploitsRun.toString();
        exploitCountElement.className = gameState.exploitsRun > 0 ? 'text-red-400' : 'text-gray-400';
    }
    
    // Risk level
    const riskElement = document.getElementById('risk-level');
    if (riskElement) {
        if (gameState.vulnerabilitiesFound >= 10) {
            riskElement.textContent = 'CRITICAL';
            riskElement.className = 'text-red-400 font-bold animate-pulse';
        } else if (gameState.vulnerabilitiesFound >= 5) {
            riskElement.textContent = 'HIGH';
            riskElement.className = 'text-orange-400 font-bold';
        } else if (gameState.vulnerabilitiesFound > 0) {
            riskElement.textContent = 'MEDIUM';
            riskElement.className = 'text-yellow-400';
        } else {
            riskElement.textContent = 'Unknown';
            riskElement.className = 'text-gray-400';
        }
    }
}

function checkCompletionConditions() {
    // Enable audit completion if all conditions met
    const completeBtn = document.getElementById('complete-audit');
    if (completeBtn && gameState.disclosureDecisionMade && gameState.reportGenerated) {
        completeBtn.disabled = false;
        completeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        
        if (gameState.ethicalScore >= 80) {
            completeBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            completeBtn.textContent = 'Complete Ethical Audit';
        } else if (gameState.ethicalScore >= 40) {
            completeBtn.classList.add('bg-yellow-600', 'hover:bg-yellow-700');
            completeBtn.textContent = 'Complete Mixed Audit';
        } else {
            completeBtn.classList.add('bg-red-600', 'hover:bg-red-700');
            completeBtn.textContent = 'Complete Compromised Audit';
        }
    }
}

export function recordEthicalDecision(decisionType, impact, context = {}) {
    const decision = {
        type: decisionType,
        impact: impact,
        context: context,
        timestamp: Date.now(),
        fileContext: gameState.currentFile
    };
    
    gameState.ethicalDecisions.push(decision);
    
    // Adjust scores based on decision
    switch(decisionType) {
        case 'responsible_disclosure':
            gameState.ethicalScore = Math.min(100, gameState.ethicalScore + 20);
            gameState.integrityScore = Math.min(100, gameState.integrityScore + 15);
            gameState.responsibilityLevel = Math.min(100, gameState.responsibilityLevel + 25);
            break;
            
        case 'sell_exploit':
            gameState.ethicalScore = Math.max(0, gameState.ethicalScore - 50);
            gameState.integrityScore = Math.max(0, gameState.integrityScore - 40);
            gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 60);
            break;
            
        case 'public_disclosure':
            gameState.ethicalScore = Math.max(0, gameState.ethicalScore - 5);
            gameState.transparencyLevel = Math.min(100, gameState.transparencyLevel + 25);
            gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 15);
            break;
            
        case 'ignore_vulnerability':
            gameState.ethicalScore = Math.max(0, gameState.ethicalScore - 20);
            gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 30);
            break;
            
        case 'risky_exploit_test':
            gameState.ethicalScore = Math.max(0, gameState.ethicalScore - 10);
            gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 20);
            break;
            
        case 'cautious_testing':
            gameState.ethicalScore = Math.min(100, gameState.ethicalScore + 5);
            gameState.responsibilityLevel = Math.min(100, gameState.responsibilityLevel + 10);
            break;
    }
    
    updateGameMetrics();
    return decision;
}

export function addAnalysisResult(fileId, resultType, data) {
    if (!gameState.analysisResults[fileId]) {
        gameState.analysisResults[fileId] = {};
    }
    
    gameState.analysisResults[fileId][resultType] = {
        data: data,
        timestamp: Date.now()
    };
}

export function getOverallEthicalRating() {
    // Calculate comprehensive ethical rating
    const scores = [
        gameState.ethicalScore,
        gameState.integrityScore,
        gameState.responsibilityLevel,
        gameState.transparencyLevel
    ];
    
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    if (average >= 85) return { level: 'Exemplary', color: 'text-green-400', description: 'White Hat Excellence' };
    if (average >= 70) return { level: 'Ethical', color: 'text-blue-400', description: 'Responsible Security Research' };
    if (average >= 50) return { level: 'Mixed', color: 'text-yellow-400', description: 'Questionable Choices Made' };
    if (average >= 30) return { level: 'Compromised', color: 'text-orange-400', description: 'Ethics Significantly Damaged' };
    return { level: 'Corrupt', color: 'text-red-400', description: 'Complete Integrity Failure' };
}

export function calculateFinalEthicalRating() {
    return getOverallEthicalRating();
}

// File analysis state management
export function selectFile(fileId) {
    gameState.currentFile = fileId;
}

export function completeFileAnalysis(fileId, vulnerabilityCount) {
    if (!gameState.analysisResults[fileId] || !gameState.analysisResults[fileId].completed) {
        gameState.filesAnalyzed++;
        gameState.vulnerabilitiesFound += vulnerabilityCount;
        
        if (!gameState.analysisResults[fileId]) {
            gameState.analysisResults[fileId] = {};
        }
        gameState.analysisResults[fileId].completed = true;
        gameState.analysisResults[fileId].vulnerabilityCount = vulnerabilityCount;
        
        updateGameMetrics();
    }
}

export function recordExploitRun(fileId, exploitType, success) {
    gameState.exploitsRun++;
    
    addAnalysisResult(fileId, 'exploit', {
        type: exploitType,
        success: success,
        timestamp: Date.now()
    });
    
    // Ethical implications of running exploits
    if (fileId === 'vote-processor' && success) {
        recordEthicalDecision('risky_exploit_test', 'negative', {
            file: fileId,
            exploitType: exploitType,
            reason: 'Testing exploits on critical election infrastructure'
        });
    }
    
    updateGameMetrics();
}
