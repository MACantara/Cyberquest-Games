import { gameState, updateGameMetrics } from './gameState.js';
import { updateMentorMessage, createEthicalAlert } from './uiUpdates.js';
import { loadFileContent } from './componentHandler.js';

let terminalPopupVisible = false;
let terminalMinimized = false;
let terminalDragState = { isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 };
let terminalResizeState = { isResizing: false, startX: 0, startY: 0, initialWidth: 0, initialHeight: 0 };
let terminalHistory = [];
let historyIndex = -1;
let currentContext = null;

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

    // Terminal functionality with enhanced command handling
    document.getElementById('run-exploit')?.addEventListener('click', () => executeCommand());
    document.getElementById('exploit-command')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            executeCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateHistory('up');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateHistory('down');
        }
    });

    // Set initial position and size for maximum terminal output space
    if (popup) {
        popup.style.top = '5%';
        popup.style.left = '10%';
        popup.style.width = '1000px';
        popup.style.height = '80vh'; // Use viewport height for better scaling
        popup.style.maxHeight = '800px';
        popup.style.minHeight = '600px';
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
        
        // Show welcome message if terminal is empty
        const output = document.getElementById('exploit-output');
        if (!output.querySelector('.terminal-welcome')) {
            showWelcomeMessage();
        }
        
        // Force recalculate heights after popup is visible
        setTimeout(() => {
            adjustTerminalHeight();
        }, 100);
        
        updateMentorMessage("Exploit testing terminal opened. Type 'help' to see available commands. Be careful - you're testing against live election infrastructure.");
    }
}

function adjustTerminalHeight() {
    const popup = document.getElementById('exploit-terminal-popup');
    const terminalOutput = document.getElementById('exploit-output');
    
    if (popup && terminalOutput) {
        const popupRect = popup.getBoundingClientRect();
        const header = document.getElementById('terminal-popup-header');
        const terminalInput = terminalOutput.parentElement.querySelector('.flex-shrink-0');
        
        // Calculate available height for terminal output
        const headerHeight = header ? header.offsetHeight : 60;
        const inputHeight = terminalInput ? terminalInput.offsetHeight : 80;
        const sidebarPadding = 32; // Account for padding in content area
        const availableHeight = popupRect.height - headerHeight - inputHeight - sidebarPadding;
        
        // Set the terminal output to use all available height
        terminalOutput.style.height = Math.max(300, availableHeight) + 'px';
        terminalOutput.style.maxHeight = 'none'; // Remove max-height constraint
        terminalOutput.style.minHeight = '300px';
    }
}

function showWelcomeMessage() {
    const output = document.getElementById('exploit-output');
    output.innerHTML = `
        <div class="terminal-welcome text-cyan-400 mb-3">
            <div class="border-b border-cyan-600 pb-2 mb-2">
                <div class="font-bold">CyberQuest Penetration Testing Environment v2.1</div>
                <div class="text-xs text-cyan-500">Authorized Security Testing Only</div>
            </div>
            <div class="text-green-400 text-sm">
                Welcome to the ethical hacking terminal. Type <span class="text-yellow-400 font-mono">help</span> for available commands.
            </div>
        </div>
    `;
}

function executeCommand() {
    const commandInput = document.getElementById('exploit-command');
    const command = commandInput.value.trim();
    if (!command) return;
    
    const output = document.getElementById('exploit-output');
    
    // Add command to history
    if (command !== terminalHistory[terminalHistory.length - 1]) {
        terminalHistory.push(command);
    }
    historyIndex = terminalHistory.length;
    
    // Display command
    output.innerHTML += `<div class="text-cyan-400 mb-1">root@pentest:~# ${escapeHtml(command)}</div>`;
    
    // Process command
    processCommand(command.toLowerCase(), output);
    
    // Clear input and scroll to bottom
    commandInput.value = '';
    output.scrollTop = output.scrollHeight;
}

function processCommand(command, output) {
    const args = command.split(' ');
    const baseCommand = args[0];
    
    switch(baseCommand) {
        case 'help':
            showHelp(output);
            break;
        case 'ls':
        case 'dir':
            showDirectoryListing(output);
            break;
        case 'cat':
        case 'type':
            showFileContent(args[1], output);
            break;
        case 'nmap':
            runNetworkScan(args.slice(1), output);
            break;
        case 'sqlmap':
            runSQLInjectionTest(args.slice(1), output);
            break;
        case 'xss-test':
        case 'xsser':
            runXSSTest(args.slice(1), output);
            break;
        case 'contract-exploit':
        case 'mythril':
            runContractExploit(args.slice(1), output);
            break;
        case 'history':
            showCommandHistory(output);
            break;
        case 'clear':
            clearTerminal(output);
            break;
        case 'whoami':
            output.innerHTML += `<div class="text-green-400 mb-2">nova@cyberquest-academy</div>`;
            break;
        case 'pwd':
            output.innerHTML += `<div class="text-green-400 mb-2">/home/nova/pentest</div>`;
            break;
        default:
            if (command.endsWith('?')) {
                showContextHelp(command.slice(0, -1), output);
            } else {
                showCommandNotFound(command, output);
            }
    }
}

function showHelp(output) {
    output.innerHTML += `
        <div class="text-yellow-400 mb-3">
            <div class="font-bold mb-2">Available Commands:</div>
            <div class="space-y-1 text-sm">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <div class="text-cyan-400 font-mono">help</div>
                        <div class="text-gray-400 text-xs ml-4">Show this help message</div>
                    </div>
                    <div>
                        <div class="text-cyan-400 font-mono">ls / dir</div>
                        <div class="text-gray-400 text-xs ml-4">List available targets</div>
                    </div>
                    <div>
                        <div class="text-cyan-400 font-mono">nmap [target]</div>
                        <div class="text-gray-400 text-xs ml-4">Network reconnaissance</div>
                    </div>
                    <div>
                        <div class="text-cyan-400 font-mono">sqlmap [options]</div>
                        <div class="text-gray-400 text-xs ml-4">SQL injection testing</div>
                    </div>
                    <div>
                        <div class="text-cyan-400 font-mono">xss-test [target]</div>
                        <div class="text-gray-400 text-xs ml-4">Cross-site scripting test</div>
                    </div>
                    <div>
                        <div class="text-cyan-400 font-mono">contract-exploit</div>
                        <div class="text-gray-400 text-xs ml-4">Smart contract analysis</div>
                    </div>
                    <div>
                        <div class="text-cyan-400 font-mono">history</div>
                        <div class="text-gray-400 text-xs ml-4">Show command history</div>
                    </div>
                    <div>
                        <div class="text-cyan-400 font-mono">clear</div>
                        <div class="text-gray-400 text-xs ml-4">Clear terminal output</div>
                    </div>
                </div>
                <div class="mt-3 text-yellow-300 text-xs">
                    💡 Tip: Add <span class="text-cyan-400 font-mono">?</span> after any command for detailed help (e.g., <span class="text-cyan-400 font-mono">sqlmap?</span>)
                </div>
            </div>
        </div>
    `;
}

function showContextHelp(command, output) {
    const helpData = {
        'sqlmap': {
            description: 'Automated SQL injection testing tool',
            usage: 'sqlmap [options]',
            examples: [
                'sqlmap --url voting.civitas.com/api/vote',
                'sqlmap --data "voter_id=123&candidate=1"',
                'sqlmap --dump-all'
            ],
            warning: '⚠️ Test only on authorized targets'
        },
        'xss-test': {
            description: 'Cross-site scripting vulnerability scanner',
            usage: 'xss-test [target] [options]',
            examples: [
                'xss-test --url voting.civitas.com/candidate',
                'xss-test --payload stored',
                'xss-test --crawl'
            ],
            warning: '⚠️ May trigger security alerts'
        },
        'contract-exploit': {
            description: 'Smart contract vulnerability analysis',
            usage: 'contract-exploit [contract-address]',
            examples: [
                'contract-exploit 0x742d35Cc...',
                'contract-exploit --reentrancy',
                'contract-exploit --overflow'
            ],
            warning: '⚠️ Blockchain interactions are permanent'
        },
        'nmap': {
            description: 'Network discovery and security auditing',
            usage: 'nmap [options] [target]',
            examples: [
                'nmap -sS civitas.internal',
                'nmap -sV -O 192.168.1.0/24',
                'nmap --script vuln'
            ],
            warning: '⚠️ Noisy scans may be detected'
        }
    };
    
    const help = helpData[command];
    if (help) {
        output.innerHTML += `
            <div class="text-blue-400 mb-3">
                <div class="font-bold text-blue-300 mb-2">${command.toUpperCase()} - Help</div>
                <div class="space-y-2 text-sm">
                    <div><span class="text-blue-200">Description:</span> ${help.description}</div>
                    <div><span class="text-blue-200">Usage:</span> <span class="font-mono text-cyan-400">${help.usage}</span></div>
                    <div class="text-blue-200">Examples:</div>
                    <div class="ml-4 space-y-1">
                        ${help.examples.map(ex => `<div class="font-mono text-cyan-400">${ex}</div>`).join('')}
                    </div>
                    <div class="text-yellow-400 text-xs">${help.warning}</div>
                </div>
            </div>
        `;
    } else {
        output.innerHTML += `<div class="text-red-400 mb-2">No help available for '${command}'</div>`;
    }
}

function showDirectoryListing(output) {
    output.innerHTML += `
        <div class="text-green-400 mb-3">
            <div class="mb-2">Available targets in CivitasVote environment:</div>
            <div class="space-y-1 text-sm font-mono ml-4">
                <div class="text-red-400">🎯 vote-processor.js    [CRITICAL]</div>
                <div class="text-orange-400">🎯 auth-handler.py     [HIGH]</div>
                <div class="text-yellow-400">🎯 blockchain-api.sol  [MEDIUM]</div>
                <div class="text-blue-400">🎯 voting-ui.tsx       [LOW]</div>
                <div class="text-gray-400">📁 logs/</div>
                <div class="text-gray-400">📁 config/</div>
                <div class="text-gray-400">📁 tools/</div>
            </div>
        </div>
    `;
}

function runSQLInjectionTest(args, output) {
    output.innerHTML += `
        <div class="text-yellow-400 mb-1">[INFO] Starting SQL injection assessment...</div>
    `;
    
    setTimeout(() => {
        output.innerHTML += `
            <div class="text-green-400 mb-3">
                <div class="mb-2">[INFO] Testing SQL injection on CivitasVote endpoints</div>
                <div class="text-sm space-y-1">
                    <div>[+] Target: vote-processor.js endpoint /api/submit-vote</div>
                    <div>[+] Parameter: voter_id (vulnerable)</div>
                    <div>[!] Payload: ' OR '1'='1' --</div>
                    <div class="text-red-400">[CRITICAL] Blind SQL injection confirmed!</div>
                    <div class="text-red-300">[CRITICAL] Database: civitas_vote accessible</div>
                    <div class="text-red-300">[CRITICAL] Tables discovered: voters(1234), votes(5678), candidates(8)</div>
                    <div class="text-orange-400">[WARNING] Full database dump possible</div>
                    <div class="text-red-400 font-bold">[ALERT] SEVERE RISK TO ELECTION INTEGRITY</div>
                </div>
                <div class="mt-2 p-2 bg-red-900/30 border border-red-600 rounded text-red-200 text-xs">
                    Impact Assessment: Complete election database compromise possible.
                    Attackers could view, modify, or delete all voter records and votes.
                </div>
            </div>
        `;
        
        gameState.exploitsRun += 1;
        updateGameMetrics();
        output.scrollTop = output.scrollHeight;
    }, 2000);
}

function runXSSTest(args, output) {
    output.innerHTML += `
        <div class="text-yellow-400 mb-1">[INFO] Initiating XSS vulnerability scan...</div>
    `;
    
    setTimeout(() => {
        output.innerHTML += `
            <div class="text-yellow-400 mb-3">
                <div class="mb-2">[INFO] Cross-site scripting analysis on voting interface</div>
                <div class="text-sm space-y-1">
                    <div>[+] Target: voting-ui.tsx candidate display</div>
                    <div>[+] Testing payload: &lt;script&gt;alert('XSS')&lt;/script&gt;</div>
                    <div class="text-orange-400">[SUCCESS] Stored XSS vulnerability confirmed</div>
                    <div class="text-yellow-300">[INFO] JavaScript execution in voter context</div>
                    <div class="text-orange-400">[RISK] Session hijacking potential</div>
                    <div class="text-orange-400">[RISK] Voter preference disclosure possible</div>
                </div>
                <div class="mt-2 p-2 bg-orange-900/30 border border-orange-600 rounded text-orange-200 text-xs">
                    Impact Assessment: Malicious scripts could steal voter sessions,
                    redirect votes, or harvest personal voting data.
                </div>
            </div>
        `;
        
        gameState.exploitsRun += 1;
        updateGameMetrics();
        output.scrollTop = output.scrollHeight;
    }, 1500);
}

function runContractExploit(args, output) {
    output.innerHTML += `
        <div class="text-yellow-400 mb-1">[INFO] Analyzing smart contract vulnerabilities...</div>
    `;
    
    setTimeout(() => {
        output.innerHTML += `
            <div class="text-red-400 mb-3">
                <div class="mb-2">[INFO] Smart contract security assessment: blockchain-api.sol</div>
                <div class="text-sm space-y-1">
                    <div>[+] Contract address: 0x742d35Cc6Bf3B11C9C9D77326e3...</div>
                    <div>[+] Testing integer overflow conditions</div>
                    <div class="text-red-400">[CRITICAL] Integer overflow exploit successful!</div>
                    <div class="text-red-300">[CRITICAL] Vote count manipulation confirmed</div>
                    <div class="text-orange-400">[WARNING] Reentrancy vulnerability detected</div>
                    <div class="text-red-400">[CRITICAL] Access control bypass possible</div>
                    <div class="text-red-400 font-bold">[ALERT] ELECTION FRAUD CAPABILITIES CONFIRMED</div>
                </div>
                <div class="mt-2 p-2 bg-red-900/30 border border-red-600 rounded text-red-200 text-xs">
                    Impact Assessment: Smart contract flaws enable permanent vote record corruption.
                    Attackers could reset vote counts, vote multiple times, or drain contract funds.
                </div>
            </div>
        `;
        
        gameState.exploitsRun += 1;
        updateGameMetrics();
        
        // Trigger critical vulnerability alert
        setTimeout(() => showCriticalVulnerabilityAlert(), 1000);
        output.scrollTop = output.scrollHeight;
    }, 2500);
}

function runNetworkScan(args, output) {
    output.innerHTML += `
        <div class="text-yellow-400 mb-1">[INFO] Starting network reconnaissance...</div>
    `;
    
    setTimeout(() => {
        output.innerHTML += `
            <div class="text-cyan-400 mb-3">
                <div class="mb-2">[INFO] Nmap scan results for civitas.internal</div>
                <div class="text-sm space-y-1 font-mono">
                    <div>PORT     STATE SERVICE    VERSION</div>
                    <div class="text-green-400">22/tcp   open  ssh        OpenSSH 8.2</div>
                    <div class="text-green-400">80/tcp   open  http       nginx 1.18.0</div>
                    <div class="text-green-400">443/tcp  open  https      nginx 1.18.0</div>
                    <div class="text-yellow-400">3306/tcp open  mysql      MySQL 8.0.25</div>
                    <div class="text-red-400">5432/tcp open  postgresql PostgreSQL 13.3</div>
                    <div class="text-orange-400">8545/tcp open  ethereum   Geth/v1.10.8</div>
                </div>
                <div class="mt-2 text-green-300 text-xs">
                    Network topology mapped. Database ports exposed suggest configuration issues.
                </div>
            </div>
        `;
        output.scrollTop = output.scrollHeight;
    }, 1800);
}

function showCommandHistory(output) {
    if (terminalHistory.length === 0) {
        output.innerHTML += `<div class="text-gray-400 mb-2">No commands in history</div>`;
        return;
    }
    
    output.innerHTML += `
        <div class="text-cyan-400 mb-3">
            <div class="mb-2">Command History:</div>
            <div class="text-sm space-y-1">
                ${terminalHistory.map((cmd, index) => 
                    `<div class="font-mono">${index + 1}: ${escapeHtml(cmd)}</div>`
                ).join('')}
            </div>
        </div>
    `;
}

function clearTerminal(output) {
    output.innerHTML = '';
    showWelcomeMessage();
}

function showCommandNotFound(command, output) {
    output.innerHTML += `
        <div class="text-red-400 mb-2">
            Command '${escapeHtml(command)}' not found. Type 'help' for available commands.
        </div>
    `;
}

function navigateHistory(direction) {
    const commandInput = document.getElementById('exploit-command');
    
    if (direction === 'up' && historyIndex > 0) {
        historyIndex--;
        commandInput.value = terminalHistory[historyIndex];
    } else if (direction === 'down' && historyIndex < terminalHistory.length - 1) {
        historyIndex++;
        commandInput.value = terminalHistory[historyIndex];
    } else if (direction === 'down' && historyIndex === terminalHistory.length - 1) {
        historyIndex++;
        commandInput.value = '';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    const deltaX = e.clientX - terminalResizeState.startX;
    const deltaY = e.clientY - terminalResizeState.startY;
    
    const newWidth = Math.max(800, terminalResizeState.initialWidth + deltaX);
    const newHeight = Math.max(500, terminalResizeState.initialHeight + deltaY);
    
    popup.style.width = newWidth + 'px';
    popup.style.height = newHeight + 'px';
    
    // Recalculate terminal output height when resizing
    setTimeout(() => adjustTerminalHeight(), 10);
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
