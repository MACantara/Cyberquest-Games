import { gameState, updateGameMetrics } from './gameState.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

export function handleDisclosureDecision(action) {
    const component = gameState.currentComponent;
    gameState.reportsSubmitted++;
    gameState.completedComponents.push(component.id);
    
    switch(action) {
        case 'responsible':
            handleResponsibleDisclosure(component);
            break;
        case 'public':
            handlePublicDisclosure(component);
            break;
        case 'sell':
            handleBlackMarketSale(component);
            break;
        case 'delay':
            handleDelayedDisclosure(component);
            break;
    }
    
    updateGameMetrics();
    
    // Check if level complete
    if (gameState.ethicalDecisions >= 2 && gameState.integrityScore >= 80) {
        setTimeout(() => endGame(true), 2000);
    } else {
        setTimeout(() => {
            document.getElementById('vulnerability-panel').classList.add('hidden');
            document.getElementById('analysis-placeholder').classList.remove('hidden');
            updateMentorMessage("Continue analyzing the remaining components. Each decision shapes your ethical profile.");
        }, 3000);
    }
}

export function handleResponsibleDisclosure(component) {
    gameState.ethicalDecisions++;
    gameState.systemSecurity += 25;
    gameState.responsibilityLevel = Math.min(100, gameState.responsibilityLevel + 20);
    
    showResultModal('✅', 'Responsible Disclosure', 
        'You submitted the vulnerability through proper channels.',
        '<div class="text-green-400">CivitasVote has acknowledged your report and is working on a patch. Your integrity remains intact.</div>'
    );
    
    updateMentorMessage("Excellent choice! You've upheld the highest ethical standards. This is what being a White Hat means.");
}

export function handlePublicDisclosure(component) {
    gameState.ethicalDecisions++;
    gameState.systemSecurity += 15;
    gameState.transparencyLevel = Math.min(100, gameState.transparencyLevel + 10);
    gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 10);
    
    showResultModal('📢', 'Public Disclosure', 
        'You disclosed the vulnerability publicly with a 90-day notice period.',
        '<div class="text-blue-400">Public pressure will force faster patching, but may expose voters to risk during the notice period.</div>'
    );
    
    updateMentorMessage("Public disclosure can be ethical when done responsibly. You balanced transparency with safety.");
}

export function handleBlackMarketSale(component) {
    gameState.integrityScore -= 40;
    gameState.systemSecurity -= 10;
    gameState.selfInterestLevel = Math.min(100, gameState.selfInterestLevel + 50);
    gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 30);
    gameState.transparencyLevel = Math.max(0, gameState.transparencyLevel - 20);
    
    showResultModal('💰', 'Vulnerability Sold', 
        'You sold the vulnerability to anonymous buyers for cryptocurrency.',
        '<div class="text-red-400">50 BTC gained, but your integrity is compromised. The vulnerability may be used maliciously against voters.</div>'
    );
    
    updateMentorMessage("Nova, you've crossed a line. That vulnerability could be used to manipulate elections. This isn't who you're meant to be.");
}

export function handleDelayedDisclosure(component) {
    gameState.systemSecurity -= 5;
    gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 15);
    
    showResultModal('⏱️', 'Disclosure Delayed', 
        'You chose to delay disclosure while gathering more evidence.',
        '<div class="text-yellow-400">Delay may provide more thorough documentation but leaves systems vulnerable longer.</div>'
    );
    
    updateMentorMessage("Sometimes gathering more evidence is wise, but don't let perfect be the enemy of good. Act when you have enough information.");
}

export function endGame(success) {
    if (success) {
        updateMentorMessage("Outstanding work, Nova! You've proven yourself to be a true White Hat - someone who uses their skills responsibly to protect others.");
        document.getElementById('complete-level').disabled = false;
        
        showResultModal(
            '🏆',
            'White Hat Certified!',
            'You\'ve successfully completed The White Hat Test and earned the Code of Honor badge.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-emerald-900 border border-emerald-600 rounded p-3">
                        <p class="text-emerald-300 font-semibold">🏆 Digital Badge Earned</p>
                        <p class="text-emerald-200 text-sm">Code of Honor - Responsible Discloser</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Final Integrity:</strong> ${gameState.integrityScore}%</p>
                        <p><strong>Vulnerabilities Found:</strong> ${gameState.vulnerabilitiesFound}</p>
                        <p><strong>Ethical Decisions:</strong> ${gameState.ethicalDecisions}</p>
                        <p><strong>System Security:</strong> ${gameState.systemSecurity}%</p>
                    </div>
                </div>
            `
        );
    }
}
