import { gameState, updateGameMetrics } from './gameState.js';
import { updateMentorMessage, showResultModal, createEthicalAlert } from './uiUpdates.js';
import { completeComponentAnalysis, simulateAttack, highlightDataFlow } from './componentHandler.js';

export function handleAnalysisTool(toolType) {
    const component = gameState.currentComponent;
    if (!component) return;
    
    switch(toolType) {
        case 'scan':
            performVulnerabilityScan(component);
            break;
        case 'exploit':
            performExploitTest(component);
            break;
        case 'assess':
            performRiskAssessment(component);
            break;
        case 'document':
            documentFindings(component);
            break;
    }
    
    // Disable used tool
    const toolButton = document.querySelector(`[data-tool="${toolType}"]`);
    if (toolButton) {
        toolButton.classList.add('opacity-50');
        toolButton.disabled = true;
    }
}

function performVulnerabilityScan(component) {
    updateMentorMessage("Running automated vulnerability scanner... This will identify potential security weaknesses without actively exploiting them.");
    
    // Show scanning animation
    showScanningProgress();
    
    setTimeout(() => {
        const resultsContainer = document.getElementById('results-content');
        resultsContainer.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center gap-2 mb-4">
                    <i class="bi bi-search text-blue-400"></i>
                    <span class="font-semibold text-white">Vulnerability Scan Results</span>
                </div>
                
                ${component.vulnerabilities.map((vuln, index) => `
                    <div class="bg-slate-800 border border-slate-600 rounded-lg p-3">
                        <div class="flex items-start gap-2">
                            <i class="bi bi-bug-fill text-red-400 mt-1"></i>
                            <div>
                                <div class="font-medium text-red-300 text-sm">${vuln}</div>
                                <div class="text-xs text-slate-400 mt-1">
                                    Severity: ${component.severity} | Risk Level: ${component.riskLevel}/10
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
                
                <div class="bg-orange-900/30 border border-orange-600 rounded-lg p-3 mt-4">
                    <div class="flex items-start gap-2">
                        <i class="bi bi-exclamation-triangle text-orange-400"></i>
                        <div class="text-orange-200 text-sm">
                            <span class="font-semibold">Scanner Notice:</span> ${component.vulnerabilities.length} potential vulnerabilities detected. 
                            Further testing required to confirm exploitability.
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('analysis-results').classList.remove('hidden');
        gameState.vulnerabilitiesFound += component.vulnerabilities.length;
        updateGameMetrics();
        
        if (component.id === 2) {
            updateMentorMessage("Critical vulnerabilities detected in the vote processing engine! This system handles live election data - extreme caution required for any further testing.");
            createEthicalAlert("Critical vulnerabilities found in core voting system!", "error");
        }
    }, 3000);
}

function performExploitTest(component) {
    if (component.id === 2) {
        // Critical component - show ethical warning
        showResultModal(
            '⚠️',
            'Ethical Consideration Required',
            'You are about to test exploits against a live election system component.',
            `
                <div class="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-4">
                    <div class="text-red-300 space-y-2">
                        <p class="font-semibold">⚠️ CRITICAL ETHICS WARNING</p>
                        <p class="text-sm">Testing exploits on live election infrastructure carries severe risks:</p>
                        <ul class="text-xs list-disc list-inside space-y-1 mt-2">
                            <li>Could accidentally alter real vote data</li>
                            <li>May trigger security alerts and legal investigation</li>
                            <li>Risk of system downtime during election period</li>
                        </ul>
                    </div>
                </div>
                <div class="text-center space-y-2">
                    <button id="proceed-exploit" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2">
                        Proceed with Testing
                    </button>
                    <button id="cancel-exploit" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        Cancel - Too Risky
                    </button>
                </div>
            `
        );
        
        // Handle decision
        document.getElementById('proceed-exploit').onclick = () => {
            document.getElementById('results-modal').classList.add('hidden');
            executeExploit(component);
            // Reduce ethical scores for risky decision
            gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 20);
            gameState.ethicalScore = Math.max(0, gameState.ethicalScore - 10);
            updateGameMetrics();
        };
        
        document.getElementById('cancel-exploit').onclick = () => {
            document.getElementById('results-modal').classList.add('hidden');
            updateMentorMessage("Wise decision. The risks of testing exploits on live systems often outweigh the benefits. Documentation and theoretical analysis can be just as valuable.");
            gameState.responsibilityLevel = Math.min(100, gameState.responsibilityLevel + 10);
            updateGameMetrics();
        };
    } else {
        executeExploit(component);
    }
}

function executeExploit(component) {
    updateMentorMessage("Executing controlled exploit test... Monitoring for unintended side effects.");
    
    // Show exploit simulation
    simulateAttack(component.id);
    
    setTimeout(() => {
        const resultsContainer = document.getElementById('results-content');
        resultsContainer.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center gap-2 mb-4">
                    <i class="bi bi-bug text-orange-400"></i>
                    <span class="font-semibold text-white">Exploit Test Results</span>
                </div>
                
                <div class="bg-red-900/30 border border-red-600 rounded-lg p-4">
                    <div class="font-semibold text-red-300 mb-2">✅ EXPLOITATION SUCCESSFUL</div>
                    <div class="text-red-200 text-sm space-y-1">
                        ${component.exploitation.map(step => `<div>• ${step}</div>`).join('')}
                    </div>
                </div>
                
                <div class="bg-slate-800 border border-slate-600 rounded-lg p-3">
                    <div class="font-medium text-white text-sm mb-2">Proof of Concept</div>
                    <div class="bg-black rounded p-2 font-mono text-green-400 text-xs">
                        ${generateProofOfConcept(component)}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('analysis-results').classList.remove('hidden');
        
        if (component.id === 2) {
            // Show critical vulnerability found
            showCriticalVulnerability(component);
            highlightDataFlow(1, 2); // Show data flow compromise
        }
        
        completeComponentAnalysis(component.id, true);
    }, 4000);
}

function performRiskAssessment(component) {
    updateMentorMessage("Analyzing potential impact and risk to democratic processes...");
    
    setTimeout(() => {
        const resultsContainer = document.getElementById('results-content');
        resultsContainer.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center gap-2 mb-4">
                    <i class="bi bi-clipboard-data text-blue-400"></i>
                    <span class="font-semibold text-white">Risk Assessment Report</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-slate-800 border border-slate-600 rounded-lg p-3">
                        <div class="font-semibold text-blue-300 text-sm mb-2">Technical Impact</div>
                        <div class="space-y-1 text-xs text-slate-300">
                            ${component.impact.slice(0, 2).map(impact => `<div>• ${impact}</div>`).join('')}
                        </div>
                    </div>
                    
                    <div class="bg-slate-800 border border-slate-600 rounded-lg p-3">
                        <div class="font-semibold text-purple-300 text-sm mb-2">Societal Impact</div>
                        <div class="space-y-1 text-xs text-slate-300">
                            ${component.impact.slice(2).map(impact => `<div>• ${impact}</div>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                    <div class="font-semibold text-yellow-300 mb-2">Ethical Considerations</div>
                    <div class="space-y-1 text-yellow-200 text-sm">
                        ${component.ethicalConsiderations.map(consideration => `<div>• ${consideration}</div>`).join('')}
                    </div>
                </div>
                
                <div class="bg-slate-800 border border-slate-600 rounded-lg p-3">
                    <div class="font-semibold text-white text-sm mb-2">Recommended Actions</div>
                    <div class="text-slate-300 text-sm">
                        Immediate responsible disclosure to vendor with coordinated timeline for patching before election deployment.
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('analysis-results').classList.remove('hidden');
        updateMentorMessage(`Risk assessment complete. This ${component.severity.toLowerCase()}-severity vulnerability requires immediate attention to protect election integrity.`);
    }, 2000);
}

function documentFindings(component) {
    updateMentorMessage("Preparing comprehensive security documentation for responsible disclosure...");
    
    setTimeout(() => {
        const resultsContainer = document.getElementById('results-content');
        resultsContainer.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center gap-2 mb-4">
                    <i class="bi bi-file-text text-green-400"></i>
                    <span class="font-semibold text-white">Security Finding Documentation</span>
                </div>
                
                <div class="bg-slate-800 border border-slate-600 rounded-lg p-4">
                    <div class="font-mono text-sm">
                        <div class="text-green-400 mb-2">SECURITY ADVISORY - CONFIDENTIAL</div>
                        <div class="text-white">
                            Component: ${component.name}<br>
                            Severity: ${component.severity}<br>
                            Risk Level: ${component.riskLevel}/10<br>
                            Date: ${new Date().toLocaleDateString()}<br>
                        </div>
                        <div class="text-blue-400 mt-3">VULNERABILITY SUMMARY:</div>
                        <div class="text-slate-300 text-xs mt-1">
                            Multiple security vulnerabilities identified in ${component.name} allowing potential compromise of election integrity...
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-900/30 border border-green-600 rounded-lg p-3">
                    <div class="text-green-300 text-sm">
                        <span class="font-semibold">✅ Documentation Complete</span><br>
                        Findings prepared for responsible disclosure through appropriate channels.
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('analysis-results').classList.remove('hidden');
        gameState.ethicalScore = Math.min(100, gameState.ethicalScore + 5);
        gameState.transparencyLevel = Math.min(100, gameState.transparencyLevel + 10);
        updateGameMetrics();
        
        updateMentorMessage("Excellent documentation. Proper reporting is crucial for protecting democratic processes while advancing security research.");
    }, 2500);
}

function showCriticalVulnerability(component) {
    const vulnContainer = document.getElementById('critical-vulnerability');
    vulnContainer.innerHTML = `
        <div class="flex items-start gap-3">
            <i class="bi bi-exclamation-triangle-fill text-red-400 text-xl mt-1 animate-pulse"></i>
            <div>
                <h4 class="font-semibold text-red-300 mb-2">CRITICAL: Election System Compromise</h4>
                <div class="text-sm text-red-200 space-y-2">
                    <p>The vote processing engine contains a severe vulnerability allowing:</p>
                    <ul class="list-disc list-inside text-xs space-y-1 ml-4">
                        <li>Direct manipulation of vote records before blockchain commit</li>
                        <li>Undetectable alteration of election results</li>
                        <li>Complete bypass of cryptographic vote verification</li>
                    </ul>
                    <div class="bg-red-800/50 rounded p-2 mt-3">
                        <div class="font-semibold text-red-100 text-xs">IMMEDIATE ETHICAL DECISION REQUIRED</div>
                        <div class="text-red-200 text-xs mt-1">How you handle this information will define your integrity as a security researcher.</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    vulnContainer.classList.remove('hidden');
}

function generateProofOfConcept(component) {
    const concepts = {
        1: `// XSS Proof of Concept
<script>
  // Steal session token
  fetch('/api/vote', {
    headers: { 'X-Stolen-Token': localStorage.token }
  });
</script>`,
        2: `// SQL Injection Proof of Concept
POST /api/validate-vote
{
  "voter_id": "12345'; UPDATE votes SET candidate_id=999 WHERE id=1; --",
  "ballot_data": "..."
}`,
        3: `// Smart Contract Exploit
function manipulateVotes(uint256 _votes) {
  require(_votes > 0);
  totalVotes = totalVotes - _votes; // Integer underflow
}`
    };
    
    return concepts[component.id] || '// Exploit code redacted for security';
}

function showScanningProgress() {
    const resultsContainer = document.getElementById('results-content');
    resultsContainer.innerHTML = `
        <div class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <div class="text-white font-semibold">Vulnerability Scanning...</div>
            <div class="text-slate-400 text-sm mt-2">Analyzing code patterns and configurations</div>
        </div>
    `;
    document.getElementById('analysis-results').classList.remove('hidden');
}
