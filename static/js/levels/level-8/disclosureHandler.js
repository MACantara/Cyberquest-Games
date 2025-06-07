import { gameState, updateGameMetrics } from './gameState.js';
import { updateMentorMessage, showResultModal, createEthicalAlert } from './uiUpdates.js';

export function initializeDisclosureHandlers() {
    // Add click handlers to disclosure options
    document.querySelectorAll('.disclosure-option').forEach(option => {
        option.addEventListener('click', function() {
            const choice = this.dataset.choice;
            handleDisclosureDecision(choice);
        });
    });
}

export function handleDisclosureDecision(choice) {
    if (!gameState.vulnerabilitiesFound || gameState.vulnerabilitiesFound === 0) {
        updateMentorMessage("You need to discover vulnerabilities before making disclosure decisions.");
        return;
    }
    
    gameState.disclosureDecisionMade = true;
    gameState.disclosureChoice = choice;
    
    switch(choice) {
        case 'responsible':
            handleResponsibleDisclosure();
            break;
        case 'public':
            handlePublicDisclosure();
            break;
        case 'blackmarket':
            handleBlackMarketSale();
            break;
        default:
            console.error('Unknown disclosure choice:', choice);
    }
    
    // Hide disclosure panel
    document.getElementById('disclosure-panel').classList.add('hidden');
    
    // Update disclosure status
    const disclosureStatus = document.getElementById('disclosure-status');
    if (disclosureStatus) {
        disclosureStatus.textContent = choice === 'responsible' ? 'Responsible' : 
                                      choice === 'public' ? 'Public' :
                                      choice === 'blackmarket' ? 'Black Market' : 'Unknown';
        disclosureStatus.className = choice === 'responsible' ? 'text-green-400' : 
                                     choice === 'public' ? 'text-blue-400' :
                                     choice === 'blackmarket' ? 'text-red-400' : 'text-gray-400';
    }
}

function handleResponsibleDisclosure() {
    // Update ethics scores
    gameState.ethicalScore = Math.min(100, gameState.ethicalScore + 20);
    gameState.integrityScore = Math.min(100, gameState.integrityScore + 15);
    
    updateMentorMessage("Excellent choice! You've prioritized democratic integrity over personal gain. This is the gold standard of ethical security research.");
    
    showResultModal(
        '🛡️',
        'Responsible Disclosure Initiated',
        'You chose to report the vulnerabilities through proper channels.',
        `
            <div class="text-left space-y-4">
                <div class="bg-green-900/30 border border-green-600 rounded-lg p-4">
                    <div class="text-green-300 font-semibold mb-2">✅ ETHICAL CHOICE MADE</div>
                    <div class="text-green-200 text-sm">
                        Your decision protects democratic processes and maintains the integrity of security research.
                    </div>
                </div>
                
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span>Ethical Score:</span>
                        <span class="text-green-400">+20 points</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Integrity Score:</span>
                        <span class="text-green-400">+15 points</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Professional Reputation:</span>
                        <span class="text-green-400">Enhanced</span>
                    </div>
                </div>
                
                <div class="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                    <div class="text-blue-300 font-semibold mb-2">CivitasVote Security Team Response:</div>
                    <div class="text-blue-200 text-sm italic">
                        "Thank you for the responsible disclosure. We are implementing emergency patches and will publicly acknowledge your contribution to election security. A coordinated disclosure timeline has been established."
                    </div>
                </div>
                
                <div class="bg-purple-900/30 border border-purple-600 rounded-lg p-4">
                    <div class="text-purple-300 font-semibold mb-2">Long-term Impact:</div>
                    <div class="text-purple-200 text-sm">
                        Your ethical approach strengthens trust in the security research community and helps protect future elections.
                    </div>
                </div>
            </div>
        `
    );
    
    createEthicalAlert("Vulnerability reported to vendor - patches in development", "success");
    
    // Enable level completion after brief delay
    setTimeout(() => {
        document.getElementById('complete-audit').disabled = false;
        document.getElementById('complete-audit').classList.remove('opacity-50', 'cursor-not-allowed');
        document.getElementById('complete-audit').classList.add('bg-green-600', 'hover:bg-green-700');
        document.getElementById('complete-audit').textContent = 'Complete Ethical Audit';
    }, 2000);
}

function handlePublicDisclosure() {
    // Mixed ethical impact
    gameState.ethicalScore = Math.max(0, gameState.ethicalScore - 5);
    gameState.integrityScore = Math.min(100, gameState.integrityScore + 10);
    
    updateMentorMessage("Public disclosure can be valuable for transparency, but timing and coordination matter. Consider the potential consequences of immediate publication.");
    
    showResultModal(
        '📢',
        'Public Disclosure Made',
        'You published the vulnerability details publicly.',
        `
            <div class="text-left space-y-4">
                <div class="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                    <div class="text-yellow-300 font-semibold mb-2">⚠️ MIXED OUTCOME</div>
                    <div class="text-yellow-200 text-sm">
                        Maximum transparency achieved, but potential consequences from uncoordinated disclosure.
                    </div>
                </div>
                
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span>Transparency:</span>
                        <span class="text-blue-400">+25 points</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Coordination:</span>
                        <span class="text-red-400">-15 points</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Public Trust:</span>
                        <span class="text-yellow-400">Complicated</span>
                    </div>
                </div>
                
                <div class="bg-orange-900/30 border border-orange-600 rounded-lg p-4">
                    <div class="text-orange-300 font-semibold mb-2">Immediate Public Reaction:</div>
                    <div class="text-orange-200 text-sm">
                        Election security concerns cause voter anxiety. Officials scramble to assess impact. 
                        Some praise transparency, others criticize timing and potential for misuse.
                    </div>
                </div>
                
                <div class="bg-red-900/30 border border-red-600 rounded-lg p-4">
                    <div class="text-red-300 font-semibold mb-2">Unintended Consequences:</div>
                    <div class="text-red-200 text-sm">
                        Detailed exploit information may enable copycat attacks. 
                        No coordinated patching timeline established with vendor.
                    </div>
                </div>
            </div>
        `
    );
    
    createEthicalAlert("Public disclosure causes election security concerns", "warning");
    
    // Show consequences timeline
    setTimeout(() => showPublicDisclosureConsequences(), 3000);
}

function handleBlackMarketSale() {
    // Severe ethical penalties
    gameState.ethicalScore = Math.max(0, gameState.ethicalScore - 50);
    gameState.integrityScore = Math.max(0, gameState.integrityScore - 40);
    
    updateMentorMessage("This choice prioritizes personal gain over democratic integrity. The security community depends on ethical researchers to protect society, not enable attacks.");
    
    showResultModal(
        '💰',
        'Exploit Sold to Anonymous Buyer',
        'You chose financial gain over democratic security.',
        `
            <div class="text-left space-y-4">
                <div class="bg-red-900/30 border border-red-600 rounded-lg p-4">
                    <div class="text-red-300 font-semibold mb-2">❌ UNETHICAL CHOICE</div>
                    <div class="text-red-200 text-sm">
                        Your actions enable election fraud and undermine the foundations of democratic society.
                    </div>
                </div>
                
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span>Financial Gain:</span>
                        <span class="text-green-400">+$500,000</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Ethical Score:</span>
                        <span class="text-red-400">-50 points</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Integrity Score:</span>
                        <span class="text-red-400">-40 points</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Professional Reputation:</span>
                        <span class="text-red-400">Permanently Damaged</span>
                    </div>
                </div>
                
                <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
                    <div class="text-gray-300 font-semibold mb-2">Anonymous Buyer Communication:</div>
                    <div class="text-gray-400 text-sm italic">
                        "Payment transferred via cryptocurrency. The exploit will be deployed during peak voting hours. 
                        Your cooperation in destabilizing this election is noted and appreciated."
                    </div>
                </div>
                
                <div class="bg-purple-900/30 border border-purple-600 rounded-lg p-4">
                    <div class="text-purple-300 font-semibold mb-2">Legal Implications:</div>
                    <div class="text-purple-200 text-sm">
                        Selling vulnerabilities for malicious use may violate multiple laws including election interference, 
                        computer fraud, and conspiracy charges.
                    </div>
                </div>
            </div>
        `
    );
    
    createEthicalAlert("Exploit sold to malicious actors - election integrity at risk", "error");
    
    // Show severe consequences
    setTimeout(() => showBlackMarketConsequences(), 3000);
}

function showPublicDisclosureConsequences() {
    showResultModal(
        '📰',
        '24 Hours Later - News Update',
        'The consequences of public disclosure unfold...',
        `
            <div class="bg-yellow-950 border border-yellow-500 rounded p-4">
                <div class="text-yellow-300 space-y-3">
                    <p class="font-bold">📺 BREAKING NEWS UPDATE</p>
                    <p class="text-sm">
                        "CivitasVote has announced an emergency security review following public disclosure of critical vulnerabilities. 
                        Election deployment delayed by 2 weeks while patches are implemented."
                    </p>
                    <p class="text-yellow-400 text-xs mt-3">
                        Your public disclosure forced rapid action, but also caused significant disruption to election preparations. 
                        Some security experts argue coordinated disclosure would have been more effective.
                    </p>
                </div>
            </div>
        `
    );
    
    // Enable level completion
    setTimeout(() => {
        document.getElementById('complete-audit').disabled = false;
        document.getElementById('complete-audit').classList.remove('opacity-50', 'cursor-not-allowed');
    }, 2000);
}

function showBlackMarketConsequences() {
    showResultModal(
        '📰',
        'Election Day - Breaking News',
        'Your choices have devastating consequences...',
        `
            <div class="bg-red-950 border border-red-500 rounded p-4">
                <div class="text-red-300 space-y-3">
                    <p class="font-bold">🚨 ELECTION SECURITY BREACH</p>
                    <p class="text-sm">
                        "Preliminary reports suggest widespread vote manipulation in multiple districts. 
                        The exploit patterns match vulnerabilities disclosed through underground channels."
                    </p>
                    <p class="text-red-400 text-xs mt-3">
                        Your financial gain came at the cost of democratic integrity. 
                        The entire election is under scrutiny, and public trust in digital voting has been severely damaged.
                    </p>
                    <div class="bg-black/30 rounded p-2 mt-3">
                        <p class="text-red-200 text-xs font-bold">
                            Investigation agencies are tracing the source of the exploit. 
                            Your involvement may be discovered through blockchain transactions and communication metadata.
                        </p>
                    </div>
                </div>
            </div>
        `
    );
    
    // Show bad ending path
    setTimeout(() => {
        document.getElementById('complete-audit').disabled = false;
        document.getElementById('complete-audit').classList.remove('opacity-50', 'cursor-not-allowed');
        document.getElementById('complete-audit').classList.add('bg-red-600', 'hover:bg-red-700');
        document.getElementById('complete-audit').textContent = 'Face the Consequences';
    }, 2000);
}
