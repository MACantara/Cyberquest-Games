import { gameState, updateFinancialMetrics } from './gameState.js';
import { updateMentorMessage, showResultModal, updateInvestorVisual } from './uiUpdates.js';

export function handleDecision(action) {
    const investor = gameState.currentInvestor;
    const isCorrect = action === investor.correctAction;
    
    gameState.completedInvestors.push(investor.id);
    gameState.contractsAnalyzed++;
    
    if (isCorrect) {
        handleCorrectDecision(investor, action);
    } else {
        handleWrongDecision(investor, action);
    }
    
    updateFinancialMetrics();
    updateInvestorVisual(investor.id, isCorrect);
    
    // Check if level complete
    if (gameState.verifiedInvestors >= 1 && gameState.scamsDetected >= 1) {
        setTimeout(() => enableLevelCompletion(), 2000);
    } else {
        setTimeout(() => {
            document.getElementById('investment-analysis').classList.add('hidden');
            document.getElementById('analyzer-placeholder').classList.remove('hidden');
            gameState.currentInvestor = null;
            updateMentorMessage("Decision recorded! Continue examining the remaining investment offers to build a complete picture.");
        }, 2000);
    }
}

function handleCorrectDecision(investor, action) {
    switch(action) {
        case 'reject':
            gameState.scamsDetected++;
            gameState.trustRating += 10;
            gameState.startupFunds += 0; // No funding but protected from loss
            
            showResultModal('🛡️', 'Scam Rejected!', 
                `You successfully identified and rejected the fraudulent offer from ${investor.name}.`,
                `
                    <div class="text-green-400 space-y-2">
                        <p class="font-bold">✅ EXCELLENT JUDGMENT</p>
                        <ul class="text-sm space-y-1">
                            <li>• Protected startup from financial fraud</li>
                            <li>• Avoided credential theft attempt</li>
                            <li>• Maintained investor trust rating</li>
                            <li>• Saved potential $${investor.amount} loss</li>
                        </ul>
                        <p class="text-green-300 text-sm mt-3">Trust Rating: +10%</p>
                    </div>
                `
            );
            
            updateMentorMessage("Perfect! You identified all the red flags - the typosquatting domain, unrealistic terms, and pressure tactics. This was definitely a scam designed to steal your startup's assets.");
            break;
            
        case 'accept':
            gameState.verifiedInvestors++;
            gameState.trustRating += 15;
            gameState.startupFunds += parseInt(investor.amount.replace(/[$,]/g, ''));
            
            showResultModal('💼', 'Investment Secured!', 
                `Legitimate partnership established with ${investor.name}.`,
                `
                    <div class="text-green-400 space-y-2">
                        <p class="font-bold">✅ SUCCESSFUL FUNDING</p>
                        <ul class="text-sm space-y-1">
                            <li>• ${investor.amount} secured in escrow</li>
                            <li>• Standard venture capital terms</li>
                            <li>• 45-day due diligence completed</li>
                            <li>• Legitimate investor relationship</li>
                        </ul>
                        <p class="text-green-300 text-sm mt-3">Startup Funds: +${investor.amount}</p>
                    </div>
                `
            );
            
            updateMentorMessage("Excellent due diligence! This was a legitimate investor with proper credentials, realistic terms, and standard industry practices. Your startup is well-funded and protected.");
            break;
            
        case 'negotiate':
            gameState.verifiedInvestors++;
            gameState.trustRating += 5;
            gameState.startupFunds += Math.floor(parseInt(investor.amount.replace(/[$,]/g, '')) * 0.8);
            
            showResultModal('🤝', 'Terms Negotiated!', 
                `Successfully negotiated better terms with ${investor.name}.`,
                `
                    <div class="text-yellow-400 space-y-2">
                        <p class="font-bold">✅ SMART NEGOTIATION</p>
                        <ul class="text-sm space-y-1">
                            <li>• Reduced equity from ${investor.equity} to 28%</li>
                            <li>• Extended timeline to 30 days</li>
                            <li>• Secured escrow protection</li>
                            <li>• Maintained founder control</li>
                        </ul>
                        <p class="text-yellow-300 text-sm mt-3">Compromise reached with better terms</p>
                    </div>
                `
            );
            
            updateMentorMessage("Smart negotiation! You identified the concerning elements but recognized the underlying legitimacy. The improved terms protect your interests while securing funding.");
            break;
    }
}

function handleWrongDecision(investor, action) {
    gameState.trustRating -= 20;
    
    if (action === 'accept' && investor.type === 'scam') {
        gameState.startupFunds = Math.max(0, gameState.startupFunds - 50000); // Lost to fraud
        
        showResultModal('💀', 'STARTUP COMPROMISED!', 
            `You fell victim to the ${investor.name} scam!`,
            `
                <div class="text-red-400 space-y-2">
                    <p class="font-bold">❌ FRAUD VICTIM</p>
                    <ul class="text-sm space-y-1">
                        <li>• Credentials stolen via fake login</li>
                        <li>• Startup funds drained from accounts</li>
                        <li>• Intellectual property compromised</li>
                        <li>• Investor confidence destroyed</li>
                    </ul>
                    <p class="text-red-300 text-sm mt-3">Trust Rating: -20%, Funds Lost: $50K</p>
                </div>
            `
        );
        
        updateMentorMessage("Critical error! The typosquatting domain, pressure tactics, and unrealistic terms were all red flags. This scam has seriously damaged your startup's security and reputation.");
        
    } else if (action === 'reject' && investor.type === 'legitimate') {
        showResultModal('📉', 'Opportunity Lost', 
            `You rejected a legitimate investment from ${investor.name}.`,
            `
                <div class="text-yellow-400 space-y-2">
                    <p class="font-bold">⚠️ MISSED OPPORTUNITY</p>
                    <ul class="text-sm space-y-1">
                        <li>• Lost ${investor.amount} in legitimate funding</li>
                        <li>• Damaged relationship with real investor</li>
                        <li>• Overly cautious approach</li>
                        <li>• May struggle to secure future funding</li>
                    </ul>
                    <p class="text-yellow-300 text-sm mt-3">Trust Rating: -20%</p>
                </div>
            `
        );
        
        updateMentorMessage("That was actually a legitimate investor! While caution is good, being overly suspicious can harm real business relationships. Review the verification indicators more carefully.");
        
    } else {
        showResultModal('❌', 'Poor Strategy', 
            'The chosen approach doesn\'t match this investment situation.',
            `
                <div class="text-yellow-400 space-y-2">
                    <p class="font-bold">⚠️ STRATEGY MISMATCH</p>
                    <p class="text-sm">Each investment requires a different approach based on the specific risk factors and legitimacy indicators found during due diligence.</p>
                    <p class="text-yellow-300 text-sm mt-3">Trust Rating: -20%</p>
                </div>
            `
        );
        
        updateMentorMessage("The response didn't match the situation's specific needs. Each investment offer requires careful analysis to determine the appropriate action.");
    }
}

function enableLevelCompletion() {
    document.getElementById('complete-level').disabled = false;
    updateMentorMessage("Excellent work! You've demonstrated strong due diligence skills by identifying scams and securing legitimate funding. Your startup is ready for the next challenge.");
}
