import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export let investors = {};

export async function loadInvestors() {
    try {
        const response = await fetch('/static/js/levels/level-6/data/investors.json');
        investors = await response.json();
    } catch (error) {
        console.error('Failed to load investors:', error);
    }
}

export function selectInvestor(investorId) {
    gameState.currentInvestor = investors[investorId];
    displayInvestmentAnalysis(gameState.currentInvestor);
    document.getElementById('tutorial-inbox').classList.add('hidden');
    
    if (investorId === 2) {
        updateMentorMessage("Red flags everywhere! The domain has a '4' instead of 'a', it's using .co instead of .com, and the offer is impossibly generous. This is definitely a scam.");
    }
}

export function displayInvestmentAnalysis(investor) {
    document.getElementById('analyzer-placeholder').classList.add('hidden');
    document.getElementById('investment-analysis').classList.remove('hidden');
    
    // Update contract document
    document.getElementById('investor-name').textContent = investor.name;
    document.getElementById('investor-domain').textContent = investor.domain;
    document.getElementById('investor-verification').innerHTML = investor.type === 'legitimate' ? 
        '<span class="text-green-600">✓ Verified</span>' : 
        '<span class="text-red-600">⚠ Unverified</span>';
    
    document.getElementById('investment-amount').textContent = investor.amount;
    document.getElementById('equity-percentage').textContent = investor.equity;
    document.getElementById('payment-method').textContent = investor.paymentMethod;
    document.getElementById('timeline').textContent = investor.timeline;
    
    // Populate contract analysis
    const contractAnalysis = document.getElementById('contract-analysis');
    if (investor.contractIssues.length > 0) {
        contractAnalysis.innerHTML = investor.contractIssues.map(issue => `
            <div class="flex items-center gap-2">
                <i class="bi bi-exclamation-triangle text-red-500"></i>
                <span class="text-red-600">${issue}</span>
            </div>
        `).join('');
    } else {
        contractAnalysis.innerHTML = '<div class="text-green-600 flex items-center gap-2"><i class="bi bi-check-circle"></i>Standard terms detected</div>';
    }
    
    // Reset analysis state
    gameState.analysisSteps[investor.id] = {};
    document.getElementById('analysis-results').classList.add('hidden');
    document.getElementById('decision-panel').classList.add('hidden');
    
    // Reset tool states
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.classList.remove('opacity-50');
        tool.disabled = false;
        tool.innerHTML = tool.innerHTML.replace('<i class="bi bi-check mr-1"></i>', '<i class="bi bi-' + tool.dataset.tool.split('-')[0] + ' mr-1"></i>');
    });
}

export function closeInvestmentAnalysis() {
    document.getElementById('investment-analysis').classList.add('hidden');
    document.getElementById('analyzer-placeholder').classList.remove('hidden');
    gameState.currentInvestor = null;
}
