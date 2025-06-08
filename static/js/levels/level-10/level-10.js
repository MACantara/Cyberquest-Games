import { gameState, updateGameMetrics, resetGameState, makeAccusation, incrementAnalysisCounter } from './gameState.js';
import { loadGameData, suspects, evidenceDatabase } from './dataLoader.js';
import { displayLogAnalysis, displayHashAnalysis, displayMetadataAnalysis, displayTimelineAnalysis, displayTrafficAnalysis } from './analysisDisplays.js';
import { setupEvidenceCollection, collectAllVisibleEvidence } from './evidenceHandler.js';
import { updateArgusMessage, showResultModal, createNotification } from './uiUpdates.js';

let levelInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeLevel10();
});

async function initializeLevel10() {
    if (levelInitialized) return;
    
    console.log('Initializing Level 10: The Final Hunt - Digital Forensics');
    
    // Load game data first
    await loadGameData();
    
    // Initialize UI components
    initializeUIHandlers();
    
    // Initialize forensics tools
    initializeForensicsTools();
    
    // Initialize suspect cards
    initializeSuspectCards();
    
    // Initialize accusation buttons
    initializeAccusationButtons();
    
    // Show opening cutscene
    showOpeningCutscene();
    
    levelInitialized = true;
}

function showOpeningCutscene() {
    const modal = document.getElementById('cutscene-modal');
    const startBtn = document.getElementById('start-investigation');
    
    if (modal && startBtn) {
        modal.classList.remove('hidden');
        
        startBtn.addEventListener('click', () => {
            startInvestigation();
        });
    }
}

function startInvestigation() {
    const modal = document.getElementById('cutscene-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    
    // Reset game state for new investigation
    resetGameState();
    gameState.missionStartTime = Date.now();
    
    // Update initial UI state
    updateGameMetrics();
    
    updateArgusMessage("Digital forensics investigation initiated. Begin by selecting a forensics tool from the toolbar. Each tool will reveal different types of evidence. The truth about The Null's mastermind lies hidden in the data.");
    
    // Show initial briefing
    setTimeout(() => {
        showMissionBriefing();
    }, 2000);
}

function showMissionBriefing() {
    updateArgusMessage("Three primary suspects have been identified. Dr. Reeves was dismissed for ethics violations, Marcus Chen has full system access, and Zara Khan recently resigned. Analyze all evidence carefully before making your accusation.");
}

function initializeUIHandlers() {
    // Results modal continue button
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            document.getElementById('results-modal').classList.add('hidden');
        });
    }
    
    // Complete level button
    const completeLevelBtn = document.getElementById('complete-level');
    if (completeLevelBtn) {
        completeLevelBtn.addEventListener('click', () => {
            completeInvestigation();
        });
    }
}

function initializeForensicsTools() {
    // Add click handlers to forensics tool buttons
    document.querySelectorAll('.forensic-tool').forEach(button => {
        button.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            activateForensicsTool(toolType);
        });
    });
    
    // Evidence collection button
    const collectBtn = document.getElementById('collect-evidence');
    if (collectBtn) {
        collectBtn.addEventListener('click', () => {
            collectAllVisibleEvidence();
        });
    }
    
    // Deep analysis button
    const analyzeBtn = document.getElementById('analyze-deeper');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            performDeepAnalysis();
        });
    }
}

function activateForensicsTool(toolType) {
    // Update tool button states
    document.querySelectorAll('.forensic-tool').forEach(btn => {
        btn.classList.remove('opacity-75', 'ring-2', 'ring-cyan-400');
    });
    
    document.querySelector(`[data-tool="${toolType}"]`).classList.add('opacity-75', 'ring-2', 'ring-cyan-400');
    
    // Increment analysis counter
    incrementAnalysisCounter(toolType);
    
    // Display appropriate analysis
    switch (toolType) {
        case 'logs':
            displayLogAnalysis();
            break;
        case 'hash':
            displayHashAnalysis();
            break;
        case 'metadata':
            displayMetadataAnalysis();
            break;
        case 'timeline':
            displayTimelineAnalysis();
            break;
        case 'traffic':
            displayTrafficAnalysis();
            break;
        default:
            console.error('Unknown tool type:', toolType);
    }
    
    // Show evidence collection controls
    document.getElementById('collect-evidence').classList.remove('hidden');
    document.getElementById('analyze-deeper').classList.remove('hidden');
}

function performDeepAnalysis() {
    const currentTool = document.querySelector('.forensic-tool.opacity-75')?.dataset.tool;
    if (!currentTool) {
        createNotification('Select a forensics tool first', 'warning');
        return;
    }
    
    const deepAnalysisMessages = {
        logs: "Cross-referencing log timestamps reveals a coordinated attack pattern. The sequence of events strongly implicates an insider with intimate knowledge of security protocols.",
        hash: "Cryptographic analysis confirms systematic tampering. File modification timestamps correlate with known suspect access windows.",
        metadata: "Metadata pattern analysis reveals sophisticated operational security practices. Author attribution and geolocation data provide concrete suspect links.",
        timeline: "Temporal correlation analysis establishes clear motive, means, and opportunity for the primary suspect. The dismissal event appears to be the catalyst.",
        traffic: "Deep packet inspection confirms data exfiltration through advanced anonymization techniques. Source attribution is definitive."
    };
    
    updateArgusMessage(deepAnalysisMessages[currentTool] || "Deep analysis complete. Continue gathering evidence to build your case.");
    createNotification('Deep analysis complete', 'success');
}

function initializeSuspectCards() {
    document.querySelectorAll('.suspect-card').forEach(card => {
        card.addEventListener('click', function() {
            const suspectId = this.dataset.suspect;
            showSuspectDetails(suspectId);
        });
    });
}

function showSuspectDetails(suspectId) {
    const suspect = suspects[suspectId];
    if (!suspect) {
        console.error('Suspect not found:', suspectId);
        return;
    }
    
    const confidence = gameState.suspectConfidence[suspectId];
    
    showResultModal('👤', suspect.name, 
        `Detailed analysis of ${suspect.name}'s involvement in The Null operation.`,
        `
            <div class="text-left space-y-4">
                <div class="bg-gray-800 rounded p-3">
                    <div class="text-gray-400 text-sm font-semibold mb-1">Background</div>
                    <div class="text-gray-300 text-sm">${suspect.background.position}</div>
                    <div class="text-gray-400 text-xs mt-1">Tenure: ${suspect.background.tenure || 'N/A'}</div>
                </div>
                
                <div class="bg-gray-800 rounded p-3">
                    <div class="text-gray-400 text-sm font-semibold mb-1">Primary Motive</div>
                    <div class="text-gray-300 text-sm">${suspect.motive.primary}</div>
                </div>
                
                <div class="bg-gray-800 rounded p-3">
                    <div class="text-gray-400 text-sm font-semibold mb-1">Technical Capabilities</div>
                    <div class="text-gray-300 text-sm">${suspect.means?.technical || 'Unknown technical capabilities'}</div>
                </div>
                
                <div class="bg-gray-800 rounded p-3">
                    <div class="text-gray-400 text-sm font-semibold mb-1">Current Evidence Confidence</div>
                    <div class="flex items-center gap-3">
                        <div class="flex-1 bg-gray-700 rounded-full h-2">
                            <div class="h-2 rounded-full ${confidence >= 70 ? 'bg-red-400' : confidence >= 50 ? 'bg-yellow-400' : 'bg-blue-400'}" 
                                 style="width: ${confidence}%"></div>
                        </div>
                        <span class="text-white font-semibold">${confidence}%</span>
                    </div>
                </div>
                
                ${suspect.alibi ? `
                    <div class="bg-blue-900/30 border border-blue-600 rounded p-3">
                        <div class="text-blue-300 text-sm font-semibold mb-1">Stated Alibi</div>
                        <div class="text-blue-200 text-sm">${suspect.alibi}</div>
                    </div>
                ` : ''}
            </div>
        `
    );
}

function initializeAccusationButtons() {
    const buttons = ['accuse-dr', 'accuse-mc', 'accuse-zk'];
    
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                const suspectId = buttonId.replace('accuse-', '');
                presentCase(suspectId);
            });
        }
    });
}

function presentCase(suspectId) {
    if (gameState.evidenceCollected < 10) {
        createNotification('Insufficient evidence. Collect at least 10 pieces of evidence before presenting your case.', 'warning', 5000);
        return;
    }
    
    const accusationResult = makeAccusation(suspectId);
    const suspect = suspects[suspectId];
    const isCorrect = suspect.isCorrectSuspect;
    
    if (isCorrect) {
        showSuccessfulAccusation(suspect, accusationResult);
    } else {
        showFailedAccusation(suspect, accusationResult);
    }
    
    // Enable level completion after accusation
    setTimeout(() => {
        const completeBtn = document.getElementById('complete-level');
        if (completeBtn) {
            completeBtn.disabled = false;
            completeBtn.classList.remove('disabled:bg-gray-600', 'disabled:cursor-not-allowed');
            
            if (isCorrect) {
                completeBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                completeBtn.innerHTML = '🎉 Investigation Complete <i class="bi bi-arrow-right ml-2"></i>';
            } else {
                completeBtn.classList.add('bg-red-600', 'hover:bg-red-700');
                completeBtn.innerHTML = 'Review Investigation <i class="bi bi-arrow-right ml-2"></i>';
            }
        }
    }, 3000);
}

function showSuccessfulAccusation(suspect, result) {
    showResultModal('⚖️', 'Case Presentation: SUCCESSFUL', 
        `Your evidence successfully proves ${suspect.name} is The Null's mastermind.`,
        `
            <div class="text-left space-y-4">
                <div class="bg-green-900/30 border border-green-600 rounded-lg p-4">
                    <div class="text-green-300 font-semibold mb-2">✅ CORRECT IDENTIFICATION</div>
                    <div class="text-green-200 text-sm">
                        Your forensics analysis correctly identified Dr. Alexis Reeves as The Null's mastermind. 
                        The evidence of revenge motivation, insider knowledge, and data exfiltration was compelling.
                    </div>
                </div>
                
                <div class="bg-gray-800 rounded p-3">
                    <div class="text-white font-semibold mb-2">Investigation Summary</div>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Evidence Collected:</span>
                            <span class="text-white">${result.totalEvidence}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Truth Score:</span>
                            <span class="text-green-400">${result.truthScore}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Confidence Level:</span>
                            <span class="text-green-400">${result.confidence}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Investigation Time:</span>
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
        `
    );
    
    updateArgusMessage("Investigation complete! Dr. Reeves has been apprehended and The Null's operations have been shut down. Your forensics expertise saved the Academy and prevented future attacks.");
}

function showFailedAccusation(suspect, result) {
    const correctSuspect = Object.values(suspects).find(s => s.isCorrectSuspect);
    
    showResultModal('⚖️', 'Case Presentation: INSUFFICIENT EVIDENCE', 
        `Your accusation against ${suspect.name} could not be substantiated.`,
        `
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
                
                <div class="bg-gray-800 rounded p-3">
                    <div class="text-white font-semibold mb-2">The Truth</div>
                    <div class="text-gray-300 text-sm">
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
        `
    );
    
    updateArgusMessage("The investigation was inconclusive. While you gathered significant evidence, the true mastermind escaped justice. Digital forensics requires thorough analysis of all available data sources.");
}

function completeInvestigation() {
    const isSuccess = gameState.accusedSuspect && suspects[gameState.accusedSuspect]?.isCorrectSuspect;
    
    if (isSuccess) {
        // Show success completion
        window.location.href = '/campaign?level=10&status=complete';
    } else {
        // Show failure/retry option
        showResultModal('🔄', 'Investigation Review', 
            'Would you like to restart the investigation with what you\'ve learned?',
            `
                <div class="text-center space-y-4">
                    <div class="bg-yellow-900/30 border border-yellow-600 rounded p-3">
                        <div class="text-yellow-300 text-sm">
                            Understanding digital forensics takes practice. Each investigation teaches valuable lessons 
                            about evidence analysis and suspect evaluation.
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
}

// Export for external access
window.Level10 = {
    startInvestigation,
    completeInvestigation,
    resetLevel: () => {
        resetGameState();
        updateGameMetrics();
    }
};