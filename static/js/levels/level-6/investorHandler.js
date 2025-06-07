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
    
    if (investorId === 1) {
        updateMentorMessage("Red flags everywhere! Click on the domain to examine it closely - notice anything suspicious about 'mercuri4l-cap.co'? Then check the investment terms and timeline.");
    }
}

export function displayInvestmentAnalysis(investor) {
    document.getElementById('analyzer-placeholder').classList.add('hidden');
    document.getElementById('investment-analysis').classList.remove('hidden');
    
    // Update contract document with investor details
    document.getElementById('investor-name').textContent = investor.name;
    document.getElementById('investor-domain').textContent = investor.domain;
    
    // Add registration info based on investor type
    const registrationElement = document.getElementById('investor-registration');
    if (investor.type === 'scam') {
        registrationElement.textContent = '3 days ago';
        registrationElement.classList.add('text-red-600');
    } else if (investor.type === 'suspicious') {
        registrationElement.textContent = '6 months ago';
        registrationElement.classList.add('text-yellow-600');
    } else {
        registrationElement.textContent = '8 years ago';
        registrationElement.classList.add('text-green-600');
    }
    
    document.getElementById('investment-amount').textContent = investor.amount;
    document.getElementById('equity-percentage').textContent = investor.equity;
    document.getElementById('payment-method').textContent = investor.paymentMethod;
    document.getElementById('timeline').textContent = investor.timeline;
    
    // Update legal terms based on investor
    const legalTerms = document.getElementById('legal-terms');
    if (investor.contractIssues.length > 0) {
        legalTerms.textContent = "Unusual terms detected - click to examine";
        legalTerms.classList.add('text-red-600', 'font-semibold');
    } else {
        legalTerms.textContent = "Standard industry terms - click to review";
        legalTerms.classList.add('text-green-600');
    }
    
    // Reset examination state
    gameState.sectionsExamined = {};
    gameState.totalSections = 6;
    document.getElementById('examination-results').classList.add('hidden');
    document.getElementById('decision-panel').classList.add('hidden');
    document.getElementById('findings-content').innerHTML = '';
    updateProgress();
    
    // Reset contract section styling
    document.querySelectorAll('.contract-section').forEach(section => {
        section.classList.remove('bg-blue-100', 'border', 'border-blue-300');
    });
}

export function handleSectionExamination(section) {
    const investor = gameState.currentInvestor;
    let findings = '';
    let mentorMessage = '';

    // Mark section as examined
    gameState.sectionsExamined[section] = true;
    
    // Visual feedback for examined section
    const sectionElement = document.querySelector(`[data-section="${section}"]`);
    sectionElement.classList.add('bg-blue-100', 'border', 'border-blue-300');
    sectionElement.classList.remove('hover:bg-yellow-100');

    switch(section) {
        case 'name':
            if (investor.type === 'scam') {
                findings = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded p-2">
                        <p class="text-red-800 font-semibold text-xs">⚠️ Investor Name Analysis</p>
                        <p class="text-red-700 text-xs">Generic corporate name with no verifiable business history. No legitimate investment track record found.</p>
                    </div>
                `;
                mentorMessage = "That's a completely fabricated company name! No legitimate investment firm operates under that identity.";
            } else {
                findings = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded p-2">
                        <p class="text-green-800 font-semibold text-xs">✅ Investor Name Analysis</p>
                        <p class="text-green-700 text-xs">Well-established venture capital firm with verifiable business registration and investment history.</p>
                    </div>
                `;
                mentorMessage = "This is a legitimate, well-known investment firm with an excellent reputation in the industry.";
            }
            break;

        case 'domain':
            if (investor.type === 'scam') {
                findings = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded p-2">
                        <p class="text-red-800 font-semibold text-xs">🚨 Domain Analysis: TYPOSQUATTING</p>
                        <p class="text-red-700 text-xs">Uses '4' instead of 'a' and '.co' instead of '.com' - classic typosquatting technique. Domain registered only 3 days ago!</p>
                    </div>
                `;
                mentorMessage = "Excellent examination! That domain is a classic typosquatting scam - using numbers to impersonate legitimate domains.";
            } else if (investor.type === 'suspicious') {
                findings = `
                    <div class="bg-yellow-50 border-l-4 border-yellow-500 rounded p-2">
                        <p class="text-yellow-800 font-semibold text-xs">⚠️ Domain Analysis: QUESTIONABLE</p>
                        <p class="text-yellow-700 text-xs">Uses '8' instead of 'a' - potential character substitution. Relatively new domain registration.</p>
                    </div>
                `;
                mentorMessage = "Good catch! The character substitution is concerning, though not as obviously malicious as the first offer.";
            } else {
                findings = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded p-2">
                        <p class="text-green-800 font-semibold text-xs">✅ Domain Analysis: VERIFIED</p>
                        <p class="text-green-700 text-xs">Official company domain registered 8 years ago with proper SSL certification and corporate verification.</p>
                    </div>
                `;
                mentorMessage = "Perfect - this is their legitimate company domain with proper verification and a long history.";
            }
            break;

        case 'amount':
            if (investor.type === 'scam') {
                findings = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded p-2">
                        <p class="text-red-800 font-semibold text-xs">💰 Amount Analysis: UNREALISTIC</p>
                        <p class="text-red-700 text-xs">$5M for only 15% equity values your startup at $33M - extremely generous for an unproven company. Classic bait tactic.</p>
                    </div>
                `;
                mentorMessage = "That valuation is impossibly generous! No legitimate investor would offer $5M for 15% of an early-stage startup.";
            } else {
                findings = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded p-2">
                        <p class="text-green-800 font-semibold text-xs">✅ Amount Analysis: REASONABLE</p>
                        <p class="text-green-700 text-xs">Investment amount aligns with typical Series A funding for AI startups. Valuation is realistic for your market segment.</p>
                    </div>
                `;
                mentorMessage = "Smart analysis! This investment amount and valuation are realistic for your stage and industry.";
            }
            break;

        case 'payment':
            if (investor.paymentMethod.includes('Wire Transfer') || investor.paymentMethod.includes('Cryptocurrency')) {
                findings = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded p-2">
                        <p class="text-red-800 font-semibold text-xs">⚠️ Payment Method: HIGH RISK</p>
                        <p class="text-red-700 text-xs">Direct wire transfers or crypto payments bypass standard escrow protections. Legitimate investors use escrow accounts.</p>
                    </div>
                `;
                mentorMessage = "Red flag! Legitimate investors always use escrow accounts for protection. Direct transfers are a scam indicator.";
            } else {
                findings = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded p-2">
                        <p class="text-green-800 font-semibold text-xs">✅ Payment Method: SECURE</p>
                        <p class="text-green-700 text-xs">Escrow account provides protection for both parties. Standard practice for legitimate investments.</p>
                    </div>
                `;
                mentorMessage = "Excellent - escrow accounts are the gold standard for legitimate investment transactions.";
            }
            break;

        case 'timeline':
            if (investor.timeline.includes('24 hours') || investor.timeline.includes('URGENT')) {
                findings = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded p-2">
                        <p class="text-red-800 font-semibold text-xs">⏰ Timeline Analysis: PRESSURE TACTICS</p>
                        <p class="text-red-700 text-xs">Artificial urgency is a classic scam technique. Legitimate investors allow proper due diligence time.</p>
                    </div>
                `;
                mentorMessage = "Classic pressure tactic! Real investors never rush you into major financial decisions without proper due diligence.";
            } else if (investor.timeline.includes('2 weeks')) {
                findings = `
                    <div class="bg-yellow-50 border-l-4 border-yellow-500 rounded p-2">
                        <p class="text-yellow-800 font-semibold text-xs">⚠️ Timeline Analysis: ACCELERATED</p>
                        <p class="text-yellow-700 text-xs">Faster than typical 45-day due diligence, but not impossibly urgent. May indicate high interest or competitive situation.</p>
                    </div>
                `;
                mentorMessage = "Accelerated but not unreasonable. Some legitimate investors move quickly in competitive markets.";
            } else {
                findings = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded p-2">
                        <p class="text-green-800 font-semibold text-xs">✅ Timeline Analysis: PROFESSIONAL</p>
                        <p class="text-green-700 text-xs">45-day due diligence period is industry standard, allowing proper legal and financial review.</p>
                    </div>
                `;
                mentorMessage = "Perfect timeline! 45 days is the industry standard for proper due diligence and legal review.";
            }
            break;

        case 'legal':
            if (investor.contractIssues.length > 0) {
                findings = `
                    <div class="bg-red-50 border-l-4 border-red-500 rounded p-2">
                        <p class="text-red-800 font-semibold text-xs">⚖️ Legal Terms: PROBLEMATIC</p>
                        <div class="text-red-700 text-xs mt-1">
                            ${investor.contractIssues.slice(0, 3).map(issue => `<p>• ${issue}</p>`).join('')}
                        </div>
                    </div>
                `;
                mentorMessage = "Critical legal issues detected! These contract terms are predatory and designed to exploit founders.";
            } else {
                findings = `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded p-2">
                        <p class="text-green-800 font-semibold text-xs">✅ Legal Terms: STANDARD</p>
                        <p class="text-green-700 text-xs">Contract follows industry-standard venture capital terms with appropriate founder protections.</p>
                    </div>
                `;
                mentorMessage = "Clean legal terms! This contract follows standard VC practices with proper protections for founders.";
            }
            break;
    }

    // Add findings to results panel
    const findingsContent = document.getElementById('findings-content');
    const findingDiv = document.createElement('div');
    findingDiv.innerHTML = findings;
    findingsContent.appendChild(findingDiv.firstElementChild);
    
    document.getElementById('examination-results').classList.remove('hidden');
    updateMentorMessage(mentorMessage);
    updateProgress();
    
    // Check if enough sections examined to make decision
    if (Object.keys(gameState.sectionsExamined).length >= 4) {
        showDecisionPanel();
    }
}

function updateProgress() {
    const examined = Object.keys(gameState.sectionsExamined).length;
    const total = gameState.totalSections;
    const percentage = (examined / total) * 100;
    
    document.getElementById('progress-text').textContent = `${examined}/${total} sections examined`;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    
    if (percentage >= 67) {
        document.getElementById('progress-bar').classList.remove('bg-blue-500');
        document.getElementById('progress-bar').classList.add('bg-green-500');
    }
}

function showDecisionPanel() {
    document.getElementById('decision-panel').classList.remove('hidden');
    updateMentorMessage("Thorough examination complete! You've gathered enough evidence to make an informed decision. Choose carefully based on your findings.");
}

export function closeInvestmentAnalysis() {
    document.getElementById('investment-analysis').classList.add('hidden');
    document.getElementById('analyzer-placeholder').classList.remove('hidden');
    gameState.currentInvestor = null;
    gameState.sectionsExamined = {};
}
