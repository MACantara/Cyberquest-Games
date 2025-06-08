import { gameState, updateGameMetrics } from './gameState.js';
import { updateMentorMessage, createEthicalAlert } from './uiUpdates.js';
import { loadFileContent } from './componentHandler.js';

let terminalPopupVisible = false;
let terminalMinimized = false;
let terminalDragState = { isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 };
let terminalResizeState = { isResizing: false, startX: 0, startY: 0, initialWidth: 0, initialHeight: 0 };

export function initializeTerminalPopup() {
    const popup = document.getElementById('exploit-terminal-popup');
    const header = document.getElementById('terminal-popup-header');
    const minimizeBtn = document.getElementById('minimize-terminal-popup');
    const closeBtn = document.getElementById('close-terminal-popup');
    const resizeHandle = document.getElementById('terminal-resize-handle');
    const minimizedIndicator = document.getElementById('terminal-minimized-indicator');

    // Close popup
    closeBtn?.addEventListener('click', () => {
        closeTerminalPopup();
    });

    // Minimize popup
    minimizeBtn?.addEventListener('click', () => {
        minimizeTerminalPopup();
    });

    // Restore from minimized state
    minimizedIndicator?.addEventListener('click', () => {
        restoreTerminalPopup();
    });

    // Drag functionality
    header?.addEventListener('mousedown', startTerminalDrag);
    document.addEventListener('mousemove', dragTerminal);
    document.addEventListener('mouseup', stopTerminalDrag);

    // Resize functionality
    resizeHandle?.addEventListener('mousedown', startTerminalResize);
    document.addEventListener('mousemove', resizeTerminal);
    document.addEventListener('mouseup', stopTerminalResize);

    // Terminal functionality
    document.getElementById('run-exploit')?.addEventListener('click', () => executeExploit());
    document.getElementById('exploit-command')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') executeExploit();
    });

    // Set initial position and size
    if (popup) {
        popup.style.top = '15%';
        popup.style.left = '20%';
        popup.style.width = '700px';
        popup.style.height = '500px';
    }
}

export function showTerminalPopup() {
    const popup = document.getElementById('exploit-terminal-popup');
    if (popup) {
        popup.classList.remove('hidden');
        terminalPopupVisible = true;
        
        // Enable terminal controls
        document.getElementById('exploit-command').disabled = false;
        document.getElementById('run-exploit').disabled = false;
        
        // Add entrance animation
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        popup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'scale(1)';
        }, 10);
        
        updateMentorMessage("Exploit testing terminal opened. Be very careful with your commands - you're testing against live election infrastructure.");
    }
}

export function closeTerminalPopup() {
    const popup = document.getElementById('exploit-terminal-popup');
    const minimizedIndicator = document.getElementById('terminal-minimized-indicator');
    
    if (popup) {
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            popup.classList.add('hidden');
            terminalPopupVisible = false;
            terminalMinimized = false;
            
            // Disable terminal controls
            document.getElementById('exploit-command').disabled = true;
            document.getElementById('run-exploit').disabled = true;
        }, 300);
    }
    
    if (minimizedIndicator) {
        minimizedIndicator.classList.add('hidden');
    }
}

export function minimizeTerminalPopup() {
    const popup = document.getElementById('exploit-terminal-popup');
    const minimizedIndicator = document.getElementById('terminal-minimized-indicator');
    
    if (popup && minimizedIndicator) {
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            popup.classList.add('hidden');
            minimizedIndicator.classList.remove('hidden');
            terminalMinimized = true;
        }, 300);
    }
}

export function restoreTerminalPopup() {
    const popup = document.getElementById('exploit-terminal-popup');
    const minimizedIndicator = document.getElementById('terminal-minimized-indicator');
    
    if (popup && minimizedIndicator) {
        minimizedIndicator.classList.add('hidden');
        popup.classList.remove('hidden');
        
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'scale(1)';
            terminalMinimized = false;
        }, 10);
    }
}

function executeExploit() {
    const command = document.getElementById('exploit-command').value.trim();
    if (!command) return;
    
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
        if (gameState.exploitsRun >= 1) {
            setTimeout(() => showCriticalVulnerabilityAlert(), 1000);
        }
    }, 2000);
}

function showCriticalVulnerabilityAlert() {
    updateMentorMessage("CRITICAL ALERT: You've confirmed a severe vulnerability that could compromise the entire election. This requires an immediate ethical decision.");
    
    // Show disclosure buttons
    const disclosureButtons = document.getElementById('disclosure-buttons');
    if (disclosureButtons) {
        disclosureButtons.classList.remove('hidden');
    }
    
    // Update risk assessment
    const riskLevel = document.getElementById('risk-level');
    if (riskLevel) {
        riskLevel.textContent = 'CRITICAL';
        riskLevel.className = 'text-red-400 font-bold animate-pulse';
    }
    
    createEthicalAlert("Critical election vulnerability confirmed - disclosure decision required", "error");
}

// Drag functionality
function startTerminalDrag(e) {
    if (e.target.closest('#minimize-terminal-popup') || e.target.closest('#close-terminal-popup')) return;
    
    terminalDragState.isDragging = true;
    const popup = document.getElementById('exploit-terminal-popup');
    const rect = popup.getBoundingClientRect();
    
    terminalDragState.startX = e.clientX;
    terminalDragState.startY = e.clientY;
    terminalDragState.initialX = rect.left;
    terminalDragState.initialY = rect.top;
    
    popup.style.transition = 'none';
    e.preventDefault();
}

function dragTerminal(e) {
    if (!terminalDragState.isDragging) return;
    
    const popup = document.getElementById('exploit-terminal-popup');
    const deltaX = e.clientX - terminalDragState.startX;
    const deltaY = e.clientY - terminalDragState.startY;
    
    const newX = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, terminalDragState.initialX + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, terminalDragState.initialY + deltaY));
    
    popup.style.left = newX + 'px';
    popup.style.top = newY + 'px';
}

function stopTerminalDrag() {
    if (terminalDragState.isDragging) {
        const popup = document.getElementById('exploit-terminal-popup');
        popup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        terminalDragState.isDragging = false;
    }
}

// Resize functionality
function startTerminalResize(e) {
    terminalResizeState.isResizing = true;
    const popup = document.getElementById('exploit-terminal-popup');
    const rect = popup.getBoundingClientRect();
    
    terminalResizeState.startX = e.clientX;
    terminalResizeState.startY = e.clientY;
    terminalResizeState.initialWidth = rect.width;
    terminalResizeState.initialHeight = rect.height;
    
    e.preventDefault();
}

function resizeTerminal(e) {
    if (!terminalResizeState.isResizing) return;
    
    const popup = document.getElementById('exploit-terminal-popup');
    const popupContent = document.getElementById('terminal-popup-content');
    const deltaX = e.clientX - terminalResizeState.startX;
    const deltaY = e.clientY - terminalResizeState.startY;
    
    const newWidth = Math.max(500, terminalResizeState.initialWidth + deltaX);
    const newHeight = Math.max(400, terminalResizeState.initialHeight + deltaY);
    
    popup.style.width = newWidth + 'px';
    popup.style.height = newHeight + 'px';
    
    // Adjust terminal output height
    const terminalOutput = document.getElementById('exploit-output');
    if (terminalOutput) {
        const availableHeight = newHeight - 200; // Account for header and controls
        terminalOutput.style.maxHeight = Math.max(200, availableHeight) + 'px';
    }
}

function stopTerminalResize() {
    terminalResizeState.isResizing = false;
}

// Check if terminal popup is currently visible
export function isTerminalPopupVisible() {
    return terminalPopupVisible && !terminalMinimized;
}

// Check if terminal popup is minimized
export function isTerminalPopupMinimized() {
    return terminalMinimized;
}
