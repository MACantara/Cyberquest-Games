import { gameState, updateGameMetrics } from './gameState.js';
import { findEvidenceById, suspects } from './dataLoader.js';
import { showResultModal } from './uiUpdates.js';
import { updateConfidenceMeters } from './gameState.js';

export function setupEvidenceCollection(toolType) {
    document.querySelectorAll(`[data-evidence]`).forEach(item => {
        item.addEventListener('click', function() {
            const evidenceId = this.dataset.evidence;
            collectEvidence(evidenceId, toolType);
            this.classList.add('opacity-50', 'cursor-not-allowed');
            this.style.pointerEvents = 'none';
        });
    });
}

export function collectEvidence(evidenceId, toolType) {
    const evidence = findEvidenceById(evidenceId);
    if (evidence && !gameState.evidenceBoard.includes(evidenceId)) {
        gameState.evidenceBoard.push(evidenceId);
        gameState.evidenceCollected++;
        
        if (evidence.indicator) {
            gameState.truthIndicators++;
            gameState.truthScore += 10;
        }
        
        addToEvidenceBoard(evidence, toolType);
        updateGameMetrics();
        
        // Update suspect confidence based on evidence
        updateSuspectConfidence(evidenceId);
        
        showResultModal('🔍', 'Evidence Collected', 
            `Added "${evidence.description || evidence.file}" to evidence board.`,
            evidence.indicator ? 
            '<div class="text-green-400">This evidence supports the investigation!</div>' :
            '<div class="text-blue-400">Evidence noted for completeness.</div>'
        );
    }
}

export function addToEvidenceBoard(evidence, toolType) {
    const evidenceBoard = document.getElementById('evidence-board');
    
    // Clear placeholder if first evidence
    if (gameState.evidenceCollected === 1) {
        evidenceBoard.innerHTML = '';
    }
    
    const evidenceDiv = document.createElement('div');
    evidenceDiv.className = `evidence-item bg-gray-700 rounded p-2 cursor-pointer hover:bg-gray-600 transition ${evidence.indicator ? 'border-l-4 border-green-400' : ''}`;
    evidenceDiv.innerHTML = `
        <div class="text-white text-xs font-semibold">${evidence.type || toolType.toUpperCase()}</div>
        <div class="text-gray-300 text-xs">${evidence.description || evidence.file}</div>
        ${evidence.indicator ? '<div class="text-green-400 text-xs">⭐ Key evidence</div>' : ''}
    `;
    
    evidenceBoard.appendChild(evidenceDiv);
}

export function updateSuspectConfidence(evidenceId) {
    // Update confidence based on evidence-suspect correlation
    if (suspects[1].evidence.includes(evidenceId)) {
        gameState.suspectConfidence.dr += 15;
    }
    if (suspects[2].evidence.includes(evidenceId)) {
        gameState.suspectConfidence.mc += 10;
    }
    if (suspects[3].evidence.includes(evidenceId)) {
        gameState.suspectConfidence.zk += 10;
    }
    
    updateConfidenceMeters();
}
