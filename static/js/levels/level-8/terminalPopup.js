import { processCommand, setCurrentContext } from './terminal-popup-window/terminalCommands.js';
import { updateMentorMessage } from './uiUpdates.js';

let terminalPopupVisible = false;
let terminalMinimized = false;
let terminalDragState = { isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 };
let terminalResizeState = { isResizing: false, startX: 0, startY: 0, initialWidth: 0, initialHeight: 0 };
let terminalHistory = [];
let historyIndex = -1;

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

    // Terminal functionality - only Enter key handling
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

    // Set initial position and size for more compact terminal
    if (popup) {
        popup.style.top = '5%';
        popup.style.left = '10%';
        popup.style.width = '900px';
        popup.style.height = '60vh'; // Reduced from 80vh
        popup.style.maxHeight = '600px'; // Reduced from 800px
        popup.style.minHeight = '400px'; // Reduced from 600px
    }
}

export function showTerminalPopup() {
    const popup = document.getElementById('exploit-terminal-popup');
    if (popup) {
        popup.classList.remove('hidden');
        terminalPopupVisible = true;
        
        // Enable terminal input only
        document.getElementById('exploit-command').disabled = false;
        
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
        
        updateMentorMessage("Exploit testing terminal opened. Type 'help' to see available commands and press Enter to execute. Be careful - you're testing against live election infrastructure.");
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
        // Also store in localStorage for persistence
        localStorage.setItem('terminalHistory', JSON.stringify(terminalHistory));
    }
    historyIndex = terminalHistory.length;
    
    // Display command
    output.innerHTML += `<div class="text-cyan-400 mb-1">root@pentest:~# ${escapeHtml(command)}</div>`;
    
    // Process command using the new commands module
    processCommand(command.toLowerCase(), output);
    
    // Clear input and scroll to bottom
    commandInput.value = '';
    output.scrollTop = output.scrollHeight;
}

function navigateHistory(direction) {
    if (terminalHistory.length === 0) return;
    
    const commandInput = document.getElementById('exploit-command');
    
    if (direction === 'up') {
        if (historyIndex > 0) {
            historyIndex--;
            commandInput.value = terminalHistory[historyIndex];
        }
    } else if (direction === 'down') {
        if (historyIndex < terminalHistory.length - 1) {
            historyIndex++;
            commandInput.value = terminalHistory[historyIndex];
        } else {
            historyIndex = terminalHistory.length;
            commandInput.value = '';
        }
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
    
    const newWidth = Math.max(600, terminalResizeState.initialWidth + deltaX); // Reduced min width
    const newHeight = Math.max(350, terminalResizeState.initialHeight + deltaY); // Reduced min height
    
    popup.style.width = newWidth + 'px';
    popup.style.height = newHeight + 'px';
    
    // Recalculate terminal output height when resizing
    setTimeout(() => adjustTerminalHeight(), 10);
}

function stopTerminalResize() {
    terminalResizeState.isResizing = false;
}

// Check if terminal is currently visible
export function isTerminalVisible() {
    return terminalPopupVisible && !terminalMinimized;
}

// Check if terminal is minimized
export function isTerminalMinimized() {
    return terminalMinimized;
}
