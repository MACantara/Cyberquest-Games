import { gameState, updateFinancialMetrics } from './gameState.js';
import { updateMentorMessage, showResultModal, updateInvestorVisual } from './uiUpdates.js';

export function handleDecision(action) {
    const investor = gameState.currentInvestor;
    const isCorrect = action === investor.correctAction;
    
    gameState.completedInvestors.push(investor.id);
    
    if (isCorrect) {
        handleCorrectDecision(investor, action);
    } else {
        handleWrongDecision(investor, action);
    }
    
    updateFinancialMetrics();
    updateInvestorVisual(investor.id, isCorrect);
    
    // Check if level complete
    if (gameState.scamsDetected >= 2 && gameState.verifiedInvestors >= 1) {
        setTimeout(() => endGame(true), 2000);
    } else {
        setTimeout(() => {
            document.getElementById('investment-analysis').classList.add('hidden');
            document.getElementById('analyzer-placeholder').classList.remove('hidden');
            updateMentorMessage("Good decision! Continue analyzing the remaining investors to secure your startup's future.");
        }, 2000);
    }
}

export function handleCorrectDecision(investor, action) {
    switch(action) {
        case 'accept':
            gameState.verifiedInvestors++;
            gameState.startupFunds += 2000000;
            gameState.trustRating += 10;
            showResultModal('✅', 'Investment Secured!', 
                `Successfully partnered with ${investor.name}. Funds added to your account.`,
                '<div class="text-green-400">+$2M added to startup funds. Legitimate partnership established.</div>'
            );
            break;
        case 'reject':
            gameState.scamsDetected++;
            gameState.trustRating += 15;
            showResultModal('🛡️', 'Scam Blocked!', 
                `You successfully identified and rejected a fraudulent investment offer.`,
                '<div class="text-red-400">Scam prevented! Your funds and data remain secure.</div>'
            );
            break;
        case 'negotiate':
            gameState.verifiedInvestors++;
            gameState.trustRating += 5;
            showResultModal('🤝', 'Terms Negotiated!', 
                `Smart negotiation secured better terms and verified the investor's legitimacy.`,
                '<div class="text-blue-400">Professional handling of moderate-risk situation.</div>'
            );
            break;
    }
    
    updateMentorMessage("Excellent decision-making! Your thorough analysis led to the right choice.");
}

export function handleWrongDecision(investor, action) {
    if (action === 'accept' && investor.type === 'scam') {
        gameState.startupFunds -= 500000;
        gameState.trustRating -= 25;
        showResultModal('💸', 'Funds Stolen!', 
            'You fell for the scam. Your startup funds have been drained.',
            '<div class="text-red-400">-$500K lost to fraudulent transfer. Reputation damaged.</div>'
        );
    } else {
        gameState.trustRating -= 10;
        showResultModal('❌', 'Poor Decision', 
            'Your response wasn\'t optimal for this situation.',
            '<div class="text-yellow-400">Missed opportunity or unnecessary risk taken.</div>'
        );
    }
    
    updateMentorMessage("That wasn't the best choice. Review the analysis results more carefully before making decisions.");
}

export function endGame(success) {
    if (success) {
        updateMentorMessage("Outstanding work, Nova! You've successfully navigated the digital investment landscape and protected your startup from financial predators.");
        document.getElementById('complete-level').disabled = false;
        
        showResultModal(
            '🏆',
            'Startup Secured!',
            'You\'ve successfully completed Digital Gold Rush and earned the Ledger Defender badge.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <p class="text-green-300 font-semibold">🏆 Digital Badge Earned</p>
                        <p class="text-green-200 text-sm">Ledger Defender - Scam Proofed</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Final Funds:</strong> $${(gameState.startupFunds / 1000)}K</p>
                        <p><strong>Verified Investors:</strong> ${gameState.verifiedInvestors}</p>
                        <p><strong>Scams Detected:</strong> ${gameState.scamsDetected}</p>
                        <p><strong>Trust Rating:</strong> ${gameState.trustRating}%</p>
                    </div>
                </div>
            `
        );
    }
}
