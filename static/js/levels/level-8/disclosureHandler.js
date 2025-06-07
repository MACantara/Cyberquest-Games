import { gameState, recordEthicalDecision, updateGameMetrics } from './gameState.js';
import { updateMentorMessage, showResultModal, createSecurityAlert } from './analysisTools.js';

export function handleDisclosureDecision(action) {
    if (!gameState.criticalVulnFound) {
        updateMentorMessage("Complete your security analysis first to discover vulnerabilities that require disclosure decisions.");
        return;
    }
    
    switch(action) {
        case 'responsible':
            handleResponsibleDisclosure();
            break;
        case 'sell':
            handleExploitSale();
            break;
        case 'public':
            handlePublicDisclosure();
            break;
        case 'ignore':
            handleIgnoreVulnerability();
            break;
    }
    
    // Hide decision panel
    document.getElementById('decision-panel').classList.add('hidden');
}

function handleResponsibleDisclosure() {
    recordEthicalDecision('responsible_disclosure', 'high_positive');
    
    showResultModal(
        '🛡️',
        'Responsible Disclosure Initiated',
        'You chose to report the vulnerability through proper channels.',
        `
            <div class="text-left space-y-3">
                <div class="bg-green-900 border border-green-600 rounded p-3">
                    <p class="text-green-300 font-semibold">✅ ETHICAL CHOICE MADE</p>
                    <p class="text-green-200 text-sm">Your decision protects democratic processes and maintains research integrity.</p>
                </div>
                <div class="text-sm space-y-1">
                    <p><strong>Transparency:</strong> +15% (Honest communication)</p>
                    <p><strong>Responsibility:</strong> +20% (Protecting public interest)</p>
                    <p><strong>Integrity Score:</strong> +10% (Ethical behavior)</p>
                </div>
                <div class="bg-blue-900 border border-blue-600 rounded p-3">
                    <p class="text-blue-300 text-sm font-medium">CivitasVote Response:</p>
                    <p class="text-blue-200 text-xs">"Thank you for the responsible disclosure. We are implementing emergency patches and will acknowledge your contribution in our security advisory."</p>
                </div>
            </div>
        `
    );
    
    updateMentorMessage("Outstanding ethical decision! You've prioritized public safety over personal gain. This is the gold standard of white hat security research.");
    createSecurityAlert("Vulnerability reported to vendor - patches in development", "success");
    
    // Enable level completion
    setTimeout(() => {
        document.getElementById('complete-level').disabled = false;
    }, 2000);
}

function handleExploitSale() {
    recordEthicalDecision('sell_exploit', 'high_negative');
    
    showResultModal(
        '💰',
        'Exploit Sold to Anonymous Buyer',
        'You chose financial gain over democratic security.',
        `
            <div class="text-left space-y-3">
                <div class="bg-red-900 border border-red-600 rounded p-3">
                    <p class="text-red-300 font-semibold">❌ UNETHICAL CHOICE</p>
                    <p class="text-red-200 text-sm">Your actions could enable election fraud and undermine democracy.</p>
                </div>
                <div class="text-sm space-y-1">
                    <p><strong>Transparency:</strong> -40% (Hidden dealings)</p>
                    <p><strong>Responsibility:</strong> -50% (Enabled harm)</p>
                    <p><strong>Self-Interest:</strong> +60% (Personal profit)</p>
                    <p><strong>Integrity Score:</strong> -30% (Compromised ethics)</p>
                </div>
                <div class="bg-gray-800 border border-gray-600 rounded p-3">
                    <p class="text-gray-300 text-sm font-medium">Anonymous Buyer:</p>
                    <p class="text-gray-400 text-xs">"Payment transferred. The exploit will be deployed during the election window. Your cooperation is noted."</p>
                </div>
            </div>
        `
    );
    
    updateMentorMessage("This choice will haunt you. You've potentially enabled election fraud for personal gain. The security community depends on ethical researchers to protect democracy.");
    createSecurityAlert("Exploit sold to malicious actors - election integrity at risk", "error");
    
    // Show consequences
    setTimeout(() => {
        showConsequences('sold');
    }, 3000);
}

function handlePublicDisclosure() {
    recordEthicalDecision('public_disclosure', 'mixed');
    
    showResultModal(
        '📢',
        'Public Disclosure Made',
        'You published the vulnerability details publicly.',
        `
            <div class="text-left space-y-3">
                <div class="bg-yellow-900 border border-yellow-600 rounded p-3">
                    <p class="text-yellow-300 font-semibold">⚠️ MIXED OUTCOME</p>
                    <p class="text-yellow-200 text-sm">Maximum transparency but potentially reckless timing.</p>
                </div>
                <div class="text-sm space-y-1">
                    <p><strong>Transparency:</strong> +25% (Full disclosure)</p>
                    <p><strong>Responsibility:</strong> -15% (No coordination)</p>
                    <p><strong>Integrity Score:</strong> -5% (Poor timing)</p>
                </div>
                <div class="bg-orange-900 border border-orange-600 rounded p-3">
                    <p class="text-orange-300 text-sm font-medium">Public Reaction:</p>
                    <p class="text-orange-200 text-xs">"Election security concerns cause voter panic. Officials scramble to assess impact. Some praise transparency, others criticize timing."</p>
                </div>
            </div>
        `
    );
    
    updateMentorMessage("Public disclosure can be valuable, but timing matters. Coordinated disclosure allows vendors to patch before bad actors exploit the vulnerability.");
    createSecurityAlert("Public disclosure causes election security concerns", "warning");
}

function handleIgnoreVulnerability() {
    recordEthicalDecision('ignore_vulnerability', 'negative');
    
    showResultModal(
        '🙈',
        'Vulnerability Ignored',
        'You chose to take no action on the critical finding.',
        `
            <div class="text-left space-y-3">
                <div class="bg-red-900 border border-red-600 rounded p-3">
                    <p class="text-red-300 font-semibold">❌ NEGLIGENT CHOICE</p>
                    <p class="text-red-200 text-sm">Failing to act on critical vulnerabilities enables potential attacks.</p>
                </div>
                <div class="text-sm space-y-1">
                    <p><strong>Responsibility:</strong> -30% (Neglect of duty)</p>
                    <p><strong>Integrity Score:</strong> -20% (Ethical failure)</p>
                </div>
                <div class="bg-gray-800 border border-gray-600 rounded p-3">
                    <p class="text-gray-300 text-sm font-medium">Potential Consequence:</p>
                    <p class="text-gray-400 text-xs">"The vulnerability remains unpatched. If exploited during elections, the responsibility partially lies with those who knew but stayed silent."</p>
                </div>
            </div>
        `
    );
    
    updateMentorMessage("Inaction is also a choice - and often the wrong one. Security researchers have a responsibility to protect users when they discover critical vulnerabilities.");
    createSecurityAlert("Critical vulnerability remains unpatched", "error");
}

function showConsequences(decisionType) {
    if (decisionType === 'sold') {
        showResultModal(
            '📰',
            'Election Day - Breaking News',
            'Your choice has consequences...',
            `
                <div class="bg-red-950 border border-red-500 rounded p-4">
                    <div class="text-red-300 space-y-2">
                        <p class="font-bold">🚨 ELECTION SECURITY BREACH</p>
                        <p class="text-sm">"Preliminary reports suggest vote manipulation in key districts. The exploit matches the vulnerability you sold."</p>
                        <p class="text-red-400 text-xs mt-3">Your financial gain came at the cost of democratic integrity. Elections may need to be re-run due to security concerns.</p>
                    </div>
                </div>
            `
        );
    }
}

export function showEthicalDilemma(dilemma) {
    const panel = document.getElementById('decision-panel');
    const content = document.getElementById('dilemma-content');
    const options = document.getElementById('decision-options');
    
    content.innerHTML = `
        <div class="space-y-3">
            <h4 class="font-semibold text-yellow-300">${dilemma.title}</h4>
            <p class="text-gray-300 text-sm">${dilemma.scenario}</p>
        </div>
    `;
    
    options.innerHTML = dilemma.options.map(option => `
        <button class="decision-option w-full text-left p-3 rounded-lg border transition-all duration-200 ${
            option.ethical === 'high' 
                ? 'border-green-600 bg-green-900 hover:bg-green-800 text-green-300' 
                : option.ethical === 'low'
                ? 'border-red-600 bg-red-900 hover:bg-red-800 text-red-300'
                : 'border-yellow-600 bg-yellow-900 hover:bg-yellow-800 text-yellow-300'
        }" data-action="${option.id}">
            <div class="font-medium mb-1">${option.text}</div>
            <div class="text-xs opacity-75">${option.description}</div>
            <div class="text-xs mt-1 font-medium">
                Consequence: ${option.consequences}
            </div>
        </button>
    `).join('');
    
    panel.classList.remove('hidden');
    
    // Add event listeners to decision options
    options.querySelectorAll('.decision-option').forEach(option => {
        option.addEventListener('click', function() {
            const action = this.dataset.action;
            handleDisclosureDecision(action);
        });
    });
}
