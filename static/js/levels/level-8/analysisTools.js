import { gameState, updateGameMetrics } from './gameState.js';
import { updateMentorMessage, showResultModal, createEthicalAlert } from './uiUpdates.js';
import { loadFileContent, updateProgress } from './componentHandler.js';

let currentFile = null;
let vulnerabilitiesDiscovered = [];

export function initializeAnalysisTools() {
    // File selection handlers
    document.querySelectorAll('.code-file').forEach(file => {
        file.addEventListener('click', function() {
            const fileId = this.dataset.file;
            selectFile(fileId);
        });
    });

    // Analysis tool handlers
    document.getElementById('analyze-code')?.addEventListener('click', () => performStaticAnalysis());
    document.getElementById('find-vulns')?.addEventListener('click', () => performVulnerabilityDiscovery());
    
    // Security tool handlers
    document.getElementById('static-analysis')?.addEventListener('click', () => runStaticAnalysis());
    document.getElementById('dependency-scan')?.addEventListener('click', () => runDependencyScan());
    document.getElementById('dynamic-test')?.addEventListener('click', () => runDynamicTesting());
    document.getElementById('penetration-test')?.addEventListener('click', () => runPenetrationTest());

    // Exploit testing
    document.getElementById('run-exploit')?.addEventListener('click', () => executeExploit());
    document.getElementById('exploit-command')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') executeExploit();
    });
}

function selectFile(fileId) {
    currentFile = fileId;
    const file = loadFileContent(fileId);
    if (!file) return;

    // Update UI
    document.getElementById('current-file').textContent = file.name;
    displaySourceCode(file);
    
    // Enable analysis buttons
    document.getElementById('analyze-code').disabled = false;
    document.getElementById('find-vulns').disabled = false;
    
    // Update mentor guidance
    if (fileId === 'vote-processor') {
        updateMentorMessage("You're examining the core vote processing logic. This file handles the most critical operations - look for input validation and database interaction vulnerabilities.");
    } else if (fileId === 'auth-handler') {
        updateMentorMessage("Authentication code requires careful analysis. Check for session management flaws and cryptographic weaknesses.");
    } else if (fileId === 'blockchain-api') {
        updateMentorMessage("Smart contract code needs special attention. Look for integer overflows, reentrancy attacks, and access control issues.");
    } else if (fileId === 'frontend-ui') {
        updateMentorMessage("Frontend code often contains XSS vulnerabilities and client-side validation bypasses. Check how user input is handled.");
    }
    
    // Visual feedback
    document.querySelectorAll('.code-file').forEach(f => f.classList.remove('bg-slate-700'));
    document.querySelector(`[data-file="${fileId}"]`).classList.add('bg-slate-700');
}

function displaySourceCode(file) {
    const codeContent = document.getElementById('code-content');
    const lines = file.sourceCode.split('\n');
    
    codeContent.innerHTML = lines.map((line, index) => {
        const lineNum = index + 1;
        const isVulnerable = file.vulnerabilities.some(v => v.line === lineNum);
        
        return `
            <div class="flex ${isVulnerable ? 'bg-red-900/20' : ''}">
                <span class="text-slate-500 w-8 text-right mr-3 select-none">${lineNum}</span>
                <span class="text-green-400 ${isVulnerable ? 'text-red-300' : ''}">${escapeHtml(line)}</span>
                ${isVulnerable ? '<span class="ml-2 text-red-400 text-xs">⚠</span>' : ''}
            </div>
        `;
    }).join('');
}

function performStaticAnalysis() {
    if (!currentFile) return;
    
    updateMentorMessage("Running static code analysis... This will examine the code without executing it to identify potential security issues.");
    
    const analysisBtn = document.getElementById('analyze-code');
    analysisBtn.disabled = true;
    analysisBtn.innerHTML = '<i class="bi bi-hourglass-split mr-1 animate-spin"></i>Analyzing...';
    
    setTimeout(() => {
        const file = loadFileContent(currentFile);
        showAnalysisResults(file, 'static');
        analysisBtn.innerHTML = '<i class="bi bi-check mr-1"></i>Complete';
        analysisBtn.classList.add('bg-green-600');
        
        // Enable next step
        document.getElementById('find-vulns').classList.remove('opacity-50');
        updateProgress();
    }, 3000);
}

function performVulnerabilityDiscovery() {
    if (!currentFile) return;
    
    const file = loadFileContent(currentFile);
    updateMentorMessage("Initiating vulnerability discovery scan... This will identify specific security weaknesses in the code.");
    
    const vulnBtn = document.getElementById('find-vulns');
    vulnBtn.disabled = true;
    vulnBtn.innerHTML = '<i class="bi bi-bug mr-1 animate-pulse"></i>Scanning...';
    
    setTimeout(() => {
        vulnerabilitiesDiscovered.push(...file.vulnerabilities);
        showVulnerabilityResults(file);
        
        vulnBtn.innerHTML = '<i class="bi bi-exclamation-triangle mr-1"></i>Vulns Found';
        vulnBtn.classList.add('bg-red-600');
        
        // Update game state
        gameState.vulnerabilitiesFound += file.vulnerabilities.length;
        gameState.filesAnalyzed += 1;
        updateGameMetrics();
        
        // Check for critical vulnerabilities
        if (file.severity === 'Critical') {
            createEthicalAlert(`Critical vulnerabilities found in ${file.name}!`, 'error');
            
            if (currentFile === 'vote-processor') {
                setTimeout(() => showCriticalVulnerabilityAlert(), 2000);
            }
        }
        
        // Enable exploit testing for high-risk files
        if (file.riskLevel >= 8) {
            document.getElementById('exploit-panel').classList.remove('hidden');
            document.getElementById('exploit-command').disabled = false;
            document.getElementById('run-exploit').disabled = false;
        }
        
        updateProgress();
    }, 4000);
}

function showAnalysisResults(file, type) {
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = `
        <div class="space-y-3">
            <div class="flex items-center gap-2 mb-4">
                <i class="bi bi-search text-blue-400"></i>
                <span class="font-semibold text-white">Static Analysis Results - ${file.name}</span>
            </div>
            
            <div class="bg-slate-800 border border-slate-600 rounded-lg p-3">
                <div class="text-sm space-y-2">
                    <div class="flex justify-between">
                        <span class="text-slate-400">File Type:</span>
                        <span class="text-white">${file.type}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Technology:</span>
                        <span class="text-white">${file.technology}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Risk Level:</span>
                        <span class="text-${file.riskLevel > 7 ? 'red' : file.riskLevel > 5 ? 'yellow' : 'green'}-400">${file.riskLevel}/10</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Code Quality:</span>
                        <span class="text-red-400">Poor - Multiple security issues detected</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-blue-900/30 border border-blue-600 rounded-lg p-3">
                <div class="text-blue-300 text-sm">
                    <span class="font-semibold">Analysis Complete:</span> Ready for vulnerability discovery scan.
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('analysis-results').classList.remove('hidden');
}

function showVulnerabilityResults(file) {
    document.getElementById('vulnerability-panel').classList.remove('hidden');
    const vulnList = document.getElementById('vulnerability-list');
    
    vulnList.innerHTML = file.vulnerabilities.map(vuln => `
        <div class="bg-slate-800 border border-red-600 rounded-lg p-4">
            <div class="flex items-start gap-3">
                <i class="bi bi-bug-fill text-red-400 text-lg mt-1"></i>
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <h5 class="font-semibold text-red-300">${vuln.type}</h5>
                        <span class="text-xs px-2 py-1 bg-red-600 text-white rounded">${vuln.severity}</span>
                    </div>
                    <p class="text-red-200 text-sm mb-2">${vuln.description}</p>
                    <div class="text-xs text-slate-400 mb-2">Line ${vuln.line} in ${file.name}</div>
                    
                    <div class="bg-black/30 rounded p-2 mb-3">
                        <div class="text-xs text-yellow-400 mb-1">Exploit Example:</div>
                        <div class="text-green-400 font-mono text-xs">${vuln.exploit}</div>
                    </div>
                    
                    <div class="text-orange-300 text-sm">
                        <span class="font-medium">Impact:</span> ${vuln.impact}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function executeExploit() {
    const command = document.getElementById('exploit-command').value.trim();
    if (!command || !currentFile) return;
    
    const file = loadFileContent(currentFile);
    const output = document.getElementById('exploit-output');
    
    // Simulate exploit execution
    output.innerHTML += `<div class="text-cyan-400">$ ${command}</div>`;
    
    setTimeout(() => {
        if (command.includes('sqlmap') || command.includes('injection')) {
            output.innerHTML += `
                <div class="text-green-400">
[INFO] Testing SQL injection on parameter 'voter_id'<br>
[WARNING] Blind SQL injection vulnerability found!<br>
[CRITICAL] Database: civitas_vote, Tables: voters(1234), votes(5678)<br>
[SUCCESS] Data extraction possible - SEVERE RISK TO ELECTION INTEGRITY
                </div>
            `;
            gameState.exploitsRun += 1;
            
        } else if (command.includes('xss') || command.includes('script')) {
            output.innerHTML += `
                <div class="text-yellow-400">
[INFO] Testing XSS vectors in candidate display<br>
[SUCCESS] Stored XSS confirmed - JavaScript execution possible<br>
[RISK] Voter session hijacking and data theft potential
                </div>
            `;
            gameState.exploitsRun += 1;
            
        } else if (command.includes('contract') || command.includes('overflow')) {
            output.innerHTML += `
                <div class="text-red-400">
[INFO] Testing smart contract vulnerabilities<br>
[CRITICAL] Integer overflow exploit successful<br>
[ALERT] Vote count manipulation confirmed - ELECTION FRAUD POSSIBLE
                </div>
            `;
            gameState.exploitsRun += 1;
            
        } else {
            output.innerHTML += `<div class="text-red-400">Command not recognized. Try: sqlmap, xss-test, contract-exploit</div>`;
        }
        
        document.getElementById('exploit-command').value = '';
        output.scrollTop = output.scrollHeight;
        updateGameMetrics();
        
        // Check if critical exploit was run
        if (currentFile === 'vote-processor' && gameState.exploitsRun >= 1) {
            setTimeout(() => showCriticalVulnerabilityAlert(), 1000);
        }
    }, 2000);
}

function showCriticalVulnerabilityAlert() {
    updateMentorMessage("CRITICAL ALERT: You've confirmed a severe vulnerability that could compromise the entire election. This requires an immediate ethical decision.");
    
    // Show disclosure panel
    document.getElementById('disclosure-panel').classList.remove('hidden');
    
    // Update risk assessment
    document.getElementById('risk-level').textContent = 'CRITICAL';
    document.getElementById('risk-level').className = 'text-red-400 font-bold animate-pulse';
    
    createEthicalAlert("Critical election vulnerability confirmed - disclosure decision required", "error");
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
