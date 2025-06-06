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
    
    document.getElementById('investor-name').textContent = investor.name;
    document.getElementById('email-content').textContent = investor.offer;
    
    // Populate domain analysis
    const domainAnalysis = document.getElementById('domain-analysis');
    domainAnalysis.innerHTML = `
        <div class="flex justify-between text-xs">
            <span class="text-gray-400">Email Domain:</span>
            <span class="text-white">${investor.email.split('@')[1]}</span>
        </div>
        <div class="flex justify-between text-xs">
            <span class="text-gray-400">Security Status:</span>
            <span class="${investor.type === 'legitimate' ? 'text-green-400' : 'text-red-400'}">
                ${investor.type === 'legitimate' ? 'Verified' : 'Suspicious'}
            </span>
        </div>
    `;
    
    // Populate contract terms
    const contractTerms = document.getElementById('contract-terms');
    if (investor.contractIssues.length > 0) {
        contractTerms.innerHTML = investor.contractIssues.map(issue => `
            <div class="flex items-center gap-2 text-xs">
                <i class="bi bi-exclamation-triangle text-red-400"></i>
                <span class="text-red-300">${issue}</span>
            </div>
        `).join('');
    } else {
        contractTerms.innerHTML = '<div class="text-green-400 text-xs">Standard terms detected</div>';
    }
    
    // Reset analysis state
    gameState.analysisSteps[investor.id] = {};
    document.getElementById('analysis-results').classList.add('hidden');
    document.getElementById('decision-panel').classList.add('hidden');
    
    // Reset tool states
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.classList.remove('opacity-50');
        tool.disabled = false;
    });
}

export function closeInvestmentAnalysis() {
    document.getElementById('investment-analysis').classList.add('hidden');
    document.getElementById('analyzer-placeholder').classList.remove('hidden');
    gameState.currentInvestor = null;
}
