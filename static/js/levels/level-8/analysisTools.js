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

function performStaticAnalysis() {
    if (!currentFile) return;
    
    updateMentorMessage("Running static code analysis... This will examine the code without executing it to identify potential security issues.");
    
    const analysisBtn = document.getElementById('analyze-code');
    analysisBtn.disabled = true;
    analysisBtn.innerHTML = '<i class="bi bi-hourglass-split mr-1 animate-spin"></i>Analyzing...';
    
    setTimeout(() => {
        const file = loadFileContent(currentFile);
        // Show the popup instead of modal
        showStaticAnalysisPopup(file);
        
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
        // Reveal vulnerabilities for this file
        const fileWithVulns = revealFileVulnerabilities(currentFile);
        
        // Update the display to show vulnerability indicators
        displaySourceCode(fileWithVulns);
        
        vulnerabilitiesDiscovered.push(...fileWithVulns.vulnerabilities);
        showVulnerabilityResults(fileWithVulns);
        
        vulnBtn.innerHTML = '<i class="bi bi-exclamation-triangle mr-1"></i>Vulns Found';
        vulnBtn.classList.add('bg-red-600');
        
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
        
        // Enable exploit testing for high-risk files - use integrated panel with layout adjustment
        if (fileWithVulns.riskLevel >= 8) {
            showExploitTestingPanel();
        }
        
        updateProgress();
    }, 4000);
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

// Drag functionality
function startDrag(e) {
    if (e.target.closest('#minimize-popup') || e.target.closest('#close-popup')) return;
    
    dragState.isDragging = true;
    const popup = document.getElementById('vulnerability-popup');
    const rect = popup.getBoundingClientRect();
    
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    dragState.initialX = rect.left;
    dragState.initialY = rect.top;
    
    popup.style.transition = 'none';
    e.preventDefault();
}

function drag(e) {
    if (!dragState.isDragging) return;
    
    const popup = document.getElementById('vulnerability-popup');
    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;
    
    const newX = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, dragState.initialX + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, dragState.initialY + deltaY));
    
    popup.style.left = newX + 'px';
    popup.style.top = newY + 'px';
    popup.style.right = 'auto';
}

function stopDrag() {
    if (dragState.isDragging) {
        const popup = document.getElementById('vulnerability-popup');
        popup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        dragState.isDragging = false;
    }
}

// Resize functionality
function startResize(e) {
    resizeState.isResizing = true;
    const popup = document.getElementById('vulnerability-popup');
    const rect = popup.getBoundingClientRect();
    
    resizeState.startX = e.clientX;
    resizeState.startY = e.clientY;
    resizeState.initialWidth = rect.width;
    resizeState.initialHeight = rect.height;
    
    e.preventDefault();
}

function resize(e) {
    if (!resizeState.isResizing) return;
    
    const popup = document.getElementById('vulnerability-popup');
    const deltaX = e.clientX - resizeState.startX;
    const deltaY = e.clientY - resizeState.startY;
    
    const newWidth = Math.max(300, resizeState.initialWidth + deltaX);
    const newHeight = Math.max(200, resizeState.initialHeight + deltaY);
    
    popup.style.width = newWidth + 'px';
    popup.style.height = newHeight + 'px';
}

function stopResize() {
    resizeState.isResizing = false;
}
