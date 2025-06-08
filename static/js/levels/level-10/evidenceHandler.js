import { gameState, updateGameMetrics, updateConfidenceMeters } from './gameState.js';
import { findEvidenceById, suspects, calculateEvidenceScore } from './dataLoader.js';
import { updateArgusMessage, createNotification } from './uiUpdates.js';

export function setupEvidenceCollection(toolType) {
    // Add click handlers to all evidence items in current display
    document.querySelectorAll(`[data-evidence]`).forEach(item => {
        if (!item.hasAttribute('data-evidence-handler')) {
            item.setAttribute('data-evidence-handler', 'true');
            item.addEventListener('click', function() {
                const evidenceId = this.dataset.evidence;
                collectEvidence(evidenceId, toolType);
            });
        }
    });
    
    console.log(`Evidence collection setup for ${toolType}`);
}

export function collectEvidence(evidenceId, toolType) {
    // Check if evidence already collected
    if (gameState.evidenceBoard.includes(evidenceId)) {
        createNotification('Evidence already collected', 'info', 2000);
        return;
    }
    
    const evidence = findEvidenceById(evidenceId);
    if (!evidence) {
        console.error('Evidence not found:', evidenceId);
        createNotification('Evidence not found', 'error');
        return;
    }
    
    // Add to evidence board
    gameState.evidenceBoard.push(evidenceId);
    gameState.evidenceCollected++;
    
    // Update scoring based on evidence value
    if (evidence.indicator) {
        gameState.truthIndicators++;
        gameState.truthScore += (evidence.evidenceValue || 10);
    }
    
    // Add to evidence display
    addToEvidenceBoard(evidence, toolType);
    
    // Update suspect confidence
    updateSuspectConfidence(evidence);
    
    // Update investigation notes
    addInvestigationNote(evidence, toolType);
    
    // Update game metrics
    updateGameMetrics();
    
    // Mark element as collected
    const evidenceElement = document.querySelector(`[data-evidence="${evidenceId}"]`);
    if (evidenceElement) {
        evidenceElement.classList.add('opacity-50', 'cursor-not-allowed', 'bg-green-900/20');
        evidenceElement.style.pointerEvents = 'none';
        
        // Add collected indicator
        if (!evidenceElement.querySelector('.collected-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'collected-indicator text-green-400 text-xs font-semibold mt-2';
            indicator.innerHTML = '✅ Evidence Collected';
            evidenceElement.appendChild(indicator);
        }
    }
    
    // Provide feedback
    const message = evidence.indicator ? 
        `Key evidence collected: ${evidence.description || evidence.file}` :
        `Evidence noted: ${evidence.description || evidence.file}`;
    
    createNotification(message, evidence.indicator ? 'success' : 'info');
    
    // Check for case readiness
    checkCaseReadiness();
    
    console.log('Evidence collected:', evidenceId, evidence);
}

export function addToEvidenceBoard(evidence, toolType) {
    const evidenceList = document.getElementById('evidence-list');
    
    // Clear placeholder text if this is first evidence
    if (gameState.evidenceCollected === 1) {
        evidenceList.innerHTML = '';
    }
    
    const evidenceDiv = document.createElement('div');
    evidenceDiv.className = `evidence-item bg-gray-700 rounded p-3 mb-2 cursor-pointer hover:bg-gray-600 transition ${
        evidence.indicator ? 'border-l-4 border-green-400' : 'border-l-4 border-blue-400'
    }`;
    
    evidenceDiv.innerHTML = `
        <div class="flex items-start justify-between mb-2">
            <div class="text-white text-xs font-semibold">${evidence.type || toolType.toUpperCase()}</div>
            <div class="text-xs px-2 py-1 rounded ${
                evidence.indicator ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
            }">
                ${evidence.evidenceValue || 5} pts
            </div>
        </div>
        <div class="text-gray-300 text-xs mb-1">${evidence.description || evidence.file}</div>
        ${evidence.suspectLink ? `
            <div class="text-yellow-400 text-xs">🎯 ${suspects[evidence.suspectLink].name}</div>
        ` : ''}
        ${evidence.indicator ? '<div class="text-green-400 text-xs font-semibold">⭐ Key Evidence</div>' : ''}
    `;
    
    // Add click handler for detailed view
    evidenceDiv.addEventListener('click', () => showEvidenceDetails(evidence));
    
    evidenceList.appendChild(evidenceDiv);
    
    // Update evidence counter in header
    updateEvidenceCounter();
}

export function updateSuspectConfidence(evidence) {
    if (!evidence.suspectLink) return;
    
    const suspectId = evidence.suspectLink;
    const confidenceIncrease = Math.min(25, evidence.evidenceValue || 10);
    
    // Update confidence scores
    if (gameState.suspectConfidence[suspectId] !== undefined) {
        const oldConfidence = gameState.suspectConfidence[suspectId];
        gameState.suspectConfidence[suspectId] = Math.min(
            suspects[suspectId].maxConfidence || 100,
            oldConfidence + confidenceIncrease
        );
        
        const newConfidence = gameState.suspectConfidence[suspectId];
        
        // Provide feedback on confidence change
        if (newConfidence > oldConfidence) {
            updateArgusMessage(
                `Evidence strengthens case against ${suspects[suspectId].name}. ` +
                `Confidence increased to ${newConfidence}%. ` +
                (newConfidence >= 70 ? 'Strong evidence pattern emerging.' : 'Continue gathering evidence.')
            );
        }
    }
    
    updateConfidenceMeters();
}

export function addInvestigationNote(evidence, toolType) {
    const notesContainer = document.getElementById('investigation-notes');
    
    // Clear placeholder if this is first note
    if (notesContainer.children.length === 1 && 
        notesContainer.children[0].textContent.includes('Notes will appear')) {
        notesContainer.innerHTML = '';
    }
    
    const noteDiv = document.createElement('div');
    noteDiv.className = `investigation-note bg-gray-800 rounded p-2 mb-2 text-xs ${
        evidence.indicator ? 'border-l-2 border-yellow-400' : 'border-l-2 border-gray-500'
    }`;
    
    noteDiv.innerHTML = `
        <div class="text-gray-400 text-xs">${new Date().toLocaleTimeString()} - ${toolType.toUpperCase()}</div>
        <div class="text-white">${evidence.description || evidence.file}</div>
        ${evidence.suspectLink ? `<div class="text-yellow-400 text-xs mt-1">Links to ${suspects[evidence.suspectLink].name}</div>` : ''}
    `;
    
    notesContainer.insertBefore(noteDiv, notesContainer.firstChild);
    
    // Keep only last 10 notes
    while (notesContainer.children.length > 10) {
        notesContainer.removeChild(notesContainer.lastChild);
    }
}

function showEvidenceDetails(evidence) {
    // Create detailed evidence modal or popup
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-60';
    modal.innerHTML = `
        <div class="bg-slate-800 rounded-lg p-6 max-w-md mx-4 border border-slate-600">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-white">Evidence Details</h3>
                <button class="text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="space-y-3 text-sm">
                <div>
                    <div class="text-gray-400">Type:</div>
                    <div class="text-white">${evidence.type || 'Evidence'}</div>
                </div>
                ${evidence.timestamp ? `
                    <div>
                        <div class="text-gray-400">Timestamp:</div>
                        <div class="text-white font-mono">${evidence.timestamp}</div>
                    </div>
                ` : ''}
                <div>
                    <div class="text-gray-400">Description:</div>
                    <div class="text-white">${evidence.description}</div>
                </div>
                ${evidence.details ? `
                    <div>
                        <div class="text-gray-400">Details:</div>
                        <div class="text-white">${evidence.details}</div>
                    </div>
                ` : ''}
                ${evidence.suspectLink ? `
                    <div>
                        <div class="text-gray-400">Suspect Link:</div>
                        <div class="text-yellow-400">${suspects[evidence.suspectLink].name}</div>
                    </div>
                ` : ''}
                <div>
                    <div class="text-gray-400">Evidence Value:</div>
                    <div class="text-green-400">${evidence.evidenceValue || 5} points</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function updateEvidenceCounter() {
    const counter = document.getElementById('evidence-count');
    if (counter) {
        const maxEvidence = Object.values(gameState.evidenceDatabase || {})
            .reduce((total, category) => total + (Array.isArray(category) ? category.length : 0), 0);
        counter.textContent = `${gameState.evidenceCollected}/${maxEvidence || 15}`;
    }
}

function checkCaseReadiness() {
    const minEvidenceRequired = 10;
    const canPresentCase = gameState.evidenceCollected >= minEvidenceRequired;
    
    // Enable/disable accusation buttons
    const accusationButtons = ['accuse-dr', 'accuse-mc', 'accuse-zk'];
    accusationButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = !canPresentCase;
            if (canPresentCase) {
                button.classList.remove('disabled:bg-gray-600', 'disabled:cursor-not-allowed');
                button.classList.add('hover:opacity-80');
            }
        }
    });
    
    // Update case presentation status
    if (canPresentCase && !gameState.caseReadyNotified) {
        gameState.caseReadyNotified = true;
        updateArgusMessage(
            `Case file ready for presentation! You've collected ${gameState.evidenceCollected} pieces of evidence. ` +
            `Analyze the confidence levels and select the mastermind to present your case.`
        );
        
        createNotification('Case ready for presentation! Choose your suspect.', 'success', 5000);
    }
}

// Auto-collect evidence when using "Collect Evidence" button
export function collectAllVisibleEvidence() {
    const evidenceElements = document.querySelectorAll('[data-evidence]:not(.opacity-50)');
    let collected = 0;
    
    evidenceElements.forEach(element => {
        const evidenceId = element.dataset.evidence;
        if (!gameState.evidenceBoard.includes(evidenceId)) {
            element.click();
            collected++;
        }
    });
    
    if (collected > 0) {
        createNotification(`Collected ${collected} pieces of evidence`, 'success');
    } else {
        createNotification('All visible evidence already collected', 'info');
    }
}

// Evidence board management
export function clearEvidenceBoard() {
    gameState.evidenceBoard = [];
    gameState.evidenceCollected = 0;
    
    const evidenceList = document.getElementById('evidence-list');
    if (evidenceList) {
        evidenceList.innerHTML = '<div class="text-gray-500 text-sm text-center py-4">No evidence collected yet</div>';
    }
    
    updateEvidenceCounter();
}

export function exportEvidenceReport() {
    const report = {
        investigator: 'Agent Nova',
        timestamp: new Date().toISOString(),
        evidenceCollected: gameState.evidenceBoard,
        totalEvidence: gameState.evidenceCollected,
        truthScore: gameState.truthScore,
        suspectConfidence: gameState.suspectConfidence,
        notes: 'Digital forensics investigation completed'
    };
    
    console.log('Evidence Report:', report);
    return report;
}
