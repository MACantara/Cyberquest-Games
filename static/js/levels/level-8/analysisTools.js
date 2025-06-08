import { gameState, updateGameMetrics } from './gameState.js';
import { updateMentorMessage, showResultModal, createEthicalAlert } from './uiUpdates.js';
import { loadFileContent, updateProgress, revealFileVulnerabilities } from './componentHandler.js';
import { displaySourceCode } from './sourceCodeRenderer.js';
import { 
    initializeVulnerabilityPopup, 
    showVulnerabilityPopup, 
    updateVulnerabilityDisplay 
} from './vulnerabilityPopup.js';
import { 
    initializeStaticAnalysisPopup, 
    showStaticAnalysisPopup 
} from './staticAnalysisPopup.js';

let currentFile = null;
let vulnerabilitiesDiscovered = [];
let analyzedFiles = new Set(); // Track which files have been analyzed

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

    // Exploit testing
    document.getElementById('run-exploit')?.addEventListener('click', () => executeExploit());
    document.getElementById('exploit-command')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') executeExploit();
    });

    // Initialize popup controls
    initializeVulnerabilityPopup();
    initializeStaticAnalysisPopup();
}

function selectFile(fileId) {
    currentFile = fileId;
    const file = loadFileContent(fileId);
    if (!file) return;

    // Update UI
    document.getElementById('current-file').textContent = file.name;
    displaySourceCode(file);
    
    // Check if file has been analyzed before and update button states
    const hasBeenAnalyzed = analyzedFiles.has(fileId);
    const hasVulnerabilities = file.vulnerabilitiesRevealed;
    
    // Enable analysis buttons
    document.getElementById('analyze-code').disabled = false;
    document.getElementById('find-vulns').disabled = false;
    
    // Update button text and styling based on previous analysis
    const analyzeBtn = document.getElementById('analyze-code');
    const vulnBtn = document.getElementById('find-vulns');
    
    // Reset button classes to base state first
    analyzeBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs';
    vulnBtn.className = 'bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs';
    
    if (hasBeenAnalyzed) {
        analyzeBtn.innerHTML = '<i class="bi bi-arrow-clockwise mr-1"></i>Re-Analyze';
        analyzeBtn.className = 'bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded text-xs';
    } else {
        analyzeBtn.innerHTML = '<i class="bi bi-search mr-1"></i>Analyze';
    }
    
    if (hasVulnerabilities) {
        vulnBtn.innerHTML = '<i class="bi bi-eye mr-1"></i>View Vulns';
        vulnBtn.className = 'bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs';
    } else {
        vulnBtn.innerHTML = '<i class="bi bi-bug mr-1"></i>Find Vulns';
    }
    
    // Update mentor guidance based on file state
    if (hasBeenAnalyzed && hasVulnerabilities) {
        updateMentorMessage(`File ${file.name} has been fully analyzed. You can re-run analysis or view cached vulnerability results.`);
    } else if (hasBeenAnalyzed) {
        updateMentorMessage(`File ${file.name} has basic analysis complete. Run vulnerability discovery to find security issues.`);
    } else {
        // Original guidance for new files
        if (fileId === 'vote-processor') {
            updateMentorMessage("You're examining the core vote processing logic. This file handles the most critical operations - look for input validation and database interaction vulnerabilities.");
        } else if (fileId === 'auth-handler') {
            updateMentorMessage("Authentication code requires careful analysis. Check for session management flaws and cryptographic weaknesses.");
        } else if (fileId === 'blockchain-api') {
            updateMentorMessage("Smart contract code needs special attention. Look for integer overflows, reentrancy attacks, and access control issues.");
        } else if (fileId === 'frontend-ui') {
            updateMentorMessage("Frontend code often contains XSS vulnerabilities and client-side validation bypasses. Check how user input is handled.");
        }
    }
    
    // Visual feedback
    document.querySelectorAll('.code-file').forEach(f => f.classList.remove('bg-slate-700'));
    document.querySelector(`[data-file="${fileId}"]`).classList.add('bg-slate-700');
    
    // Add visual indicator for analyzed files
    const fileElement = document.querySelector(`[data-file="${fileId}"]`);
    if (hasBeenAnalyzed && !fileElement.querySelector('.analysis-indicator')) {
        const indicator = document.createElement('i');
        indicator.className = 'bi bi-check-circle text-green-400 text-xs ml-1 analysis-indicator';
        indicator.title = 'File analyzed';
        fileElement.appendChild(indicator);
    }
}

function performStaticAnalysis() {
    if (!currentFile) return;
    
    const file = loadFileContent(currentFile);
    updateMentorMessage("Running static code analysis... This will examine the code without executing it to identify potential security issues.");
    
    const analysisBtn = document.getElementById('analyze-code');
    analysisBtn.disabled = true;
    analysisBtn.innerHTML = '<i class="bi bi-hourglass-split mr-1 animate-spin"></i>Analyzing...';
    analysisBtn.className = 'bg-yellow-600 text-white px-3 py-1 rounded text-xs opacity-75';
    
    setTimeout(() => {
        // Mark file as analyzed and add analysis state
        const fileWithAnalysis = {
            ...file,
            hasBeenAnalyzed: analyzedFiles.has(currentFile)
        };
        
        // Show the popup with appropriate content
        showStaticAnalysisPopup(fileWithAnalysis);
        
        // Mark as analyzed for future runs
        analyzedFiles.add(currentFile);
        
        analysisBtn.innerHTML = '<i class="bi bi-check mr-1"></i>Complete';
        analysisBtn.className = 'bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs';
        analysisBtn.disabled = false;
        
        // Enable next step
        document.getElementById('find-vulns').classList.remove('opacity-50');
        updateProgress();
    }, 3000);
}

function performVulnerabilityDiscovery() {
    if (!currentFile) return;
    
    const file = loadFileContent(currentFile);
    const hasBeenScanned = analyzedFiles.has(currentFile) && file.vulnerabilitiesRevealed;
    
    if (hasBeenScanned) {
        // File already scanned - show cached results
        updateMentorMessage("Retrieving cached vulnerability scan results for this file...");
    } else {
        // First vulnerability scan
        updateMentorMessage("Initiating deep vulnerability discovery scan... This will identify specific security weaknesses in the code.");
    }
    
    const vulnBtn = document.getElementById('find-vulns');
    vulnBtn.disabled = true;
    
    if (hasBeenScanned) {
        vulnBtn.innerHTML = '<i class="bi bi-clock-history mr-1"></i>Loading Cache...';
        vulnBtn.className = 'bg-blue-600 text-white px-3 py-1 rounded text-xs opacity-75';
        
        setTimeout(() => {
            // Show cached results immediately
            const cachedFile = revealFileVulnerabilities(currentFile);
            showVulnerabilityResults(cachedFile);
            
            vulnBtn.innerHTML = '<i class="bi bi-check-circle mr-1"></i>Cached Results';
            vulnBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs';
            vulnBtn.disabled = false;
            
            updateMentorMessage("Vulnerability scan results retrieved from cache. All previously identified security issues are displayed.");
        }, 1000);
    } else {
        vulnBtn.innerHTML = '<i class="bi bi-bug mr-1 animate-pulse"></i>Deep Scanning...';
        vulnBtn.className = 'bg-yellow-600 text-white px-3 py-1 rounded text-xs opacity-75';
        
        setTimeout(() => {
            // Reveal vulnerabilities for this file
            const fileWithVulns = revealFileVulnerabilities(currentFile);
            
            // Update the display to show vulnerability indicators
            displaySourceCode(fileWithVulns);
            
            vulnerabilitiesDiscovered.push(...fileWithVulns.vulnerabilities);
            showVulnerabilityResults(fileWithVulns);
            
            vulnBtn.innerHTML = '<i class="bi bi-exclamation-triangle mr-1"></i>Vulns Found';
            vulnBtn.className = 'bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs';
            vulnBtn.disabled = false;
            
            // Update game state
            gameState.vulnerabilitiesFound += fileWithVulns.vulnerabilities.length;
            gameState.filesAnalyzed += 1;
            updateGameMetrics();
            
            // Check for critical vulnerabilities
            if (fileWithVulns.severity === 'Critical') {
                createEthicalAlert(`Critical vulnerabilities found in ${fileWithVulns.name}!`, 'error');
                
                if (currentFile === 'vote-processor') {
                    setTimeout(() => showCriticalVulnerabilityAlert(), 2000);
                }
            }
            
            // Enable exploit testing for high-risk files
            if (fileWithVulns.riskLevel >= 8) {
                showExploitTestingPanel();
            }
            
            updateProgress();
        }, 4000);
    }
}

function showExploitTestingPanel() {
    const integratedPanel = document.getElementById('exploit-panel-integrated');
    const codeViewerContainer = document.getElementById('code-viewer-container');
    
    if (integratedPanel && codeViewerContainer) {
        // Show the exploit panel
        integratedPanel.classList.remove('hidden');
        
        // Adjust code viewer width from col-span-3 to col-span-2
        codeViewerContainer.classList.remove('col-span-3');
        codeViewerContainer.classList.add('col-span-2');
        
        // Enable exploit testing controls
        document.getElementById('exploit-command').disabled = false;
        document.getElementById('run-exploit').disabled = false;
        
        // Add animation for smooth transition
        integratedPanel.style.opacity = '0';
        integratedPanel.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            integratedPanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            integratedPanel.style.opacity = '1';
            integratedPanel.style.transform = 'translateX(0)';
        }, 100);
    }
}

// Add function to hide exploit panel and restore full width
function hideExploitTestingPanel() {
    const integratedPanel = document.getElementById('exploit-panel-integrated');
    const codeViewerContainer = document.getElementById('code-viewer-container');
    
    if (integratedPanel && codeViewerContainer) {
        // Hide the exploit panel
        integratedPanel.classList.add('hidden');
        
        // Restore code viewer full width from col-span-2 to col-span-3
        codeViewerContainer.classList.remove('col-span-2');
        codeViewerContainer.classList.add('col-span-3');
        
        // Disable exploit testing controls
        document.getElementById('exploit-command').disabled = true;
        document.getElementById('run-exploit').disabled = true;
    }
}

function showVulnerabilityResults(file) {
    // Update the popup content
    updateVulnerabilityDisplay(file);
    
    // Show the popup
    showVulnerabilityPopup();
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
    
    // Show disclosure panel - check if it exists first
    const disclosurePanel = document.getElementById('disclosure-panel');
    if (disclosurePanel) {
        disclosurePanel.classList.remove('hidden');
    } else {
        // If disclosure panel doesn't exist, show the disclosure buttons instead
        const disclosureButtons = document.getElementById('disclosure-buttons');
        if (disclosureButtons) {
            disclosureButtons.classList.remove('hidden');
        }
    }
    
    // Update risk assessment - check if element exists
    const riskLevel = document.getElementById('risk-level');
    if (riskLevel) {
        riskLevel.textContent = 'CRITICAL';
        riskLevel.className = 'text-red-400 font-bold animate-pulse';
    }
    
    createEthicalAlert("Critical election vulnerability confirmed - disclosure decision required", "error");
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
