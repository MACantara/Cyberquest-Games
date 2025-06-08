export function displaySourceCode(file) {
    const codeContent = document.getElementById('code-content');
    const lines = file.sourceCode.split('\n');
    
    codeContent.innerHTML = lines.map((line, index) => {
        const lineNum = index + 1;
        // Only show vulnerability indicators if vulnerabilities have been revealed
        const isVulnerable = file.vulnerabilitiesRevealed && 
                           file.vulnerabilities.some(v => v.line === lineNum);
        
        // Apply basic formatting without syntax highlighting
        const formattedLine = formatCodeLine(line);
        
        return `
            <div class="flex ${isVulnerable ? 'bg-red-900/20' : ''}">
                <span class="text-slate-500 w-8 text-right mr-3 select-none flex-shrink-0">${lineNum}</span>
                <span class="whitespace-pre flex-1 text-green-400">${formattedLine}</span>
                ${isVulnerable ? '<span class="ml-2 text-red-400 text-xs flex-shrink-0">⚠</span>' : ''}
            </div>
        `;
    }).join('');
}

function formatCodeLine(line) {
    // Preserve leading whitespace and escape HTML
    const leadingSpaces = line.match(/^(\s*)/)[1];
    const preservedSpaces = leadingSpaces.replace(/\s/g, '&nbsp;');
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
        return preservedSpaces;
    }
    
    // Just escape HTML and preserve formatting
    const escaped = escapeHtml(trimmedLine);
    return preservedSpaces + escaped;
}

export function highlightCodeVulnerability(lineNumber, vulnerabilityType) {
    // Highlight specific lines in code viewer
    const codeLines = document.querySelectorAll('#code-content .flex');
    if (codeLines[lineNumber - 1]) {
        const line = codeLines[lineNumber - 1];
        line.classList.add('bg-red-900/40', 'border-l-4', 'border-red-500', 'animate-pulse');
        
        // Add vulnerability indicator that respects layout
        const indicator = document.createElement('span');
        indicator.className = 'ml-2 text-red-400 text-xs font-bold flex-shrink-0';
        indicator.textContent = `← ${vulnerabilityType}`;
        line.appendChild(indicator);
        
        // Remove animation after 3 seconds
        setTimeout(() => {
            line.classList.remove('animate-pulse');
        }, 3000);
    }
}

export function initializeCodeFormattingStyles() {
    // Add CSS for proper code formatting if not already present
    if (!document.querySelector('#code-formatting-styles')) {
        const style = document.createElement('style');
        style.id = 'code-formatting-styles';
        style.textContent = `
            #code-content .flex {
                font-family: 'Fira Code', 'Monaco', 'Cascadia Code', 'Ubuntu Mono', monospace;
                font-size: 12px;
                line-height: 1.5;
                white-space: pre;
            }
            
            #code-content .whitespace-pre {
                white-space: pre;
                font-family: inherit;
            }
            
            /* Basic code viewer styling */
            #code-content {
                background: #0f172a;
                border-radius: 8px;
            }
            
            /* Hover effects */
            #code-content .flex:hover {
                background: rgba(30, 41, 59, 0.3);
            }
            
            /* Ensure proper spacing for indented code */
            #code-content {
                tab-size: 4;
                -moz-tab-size: 4;
            }
            
            /* Better scrolling for code viewer */
            #code-content {
                overflow-x: auto;
                scrollbar-width: thin;
                scrollbar-color: #475569 #334155;
            }
            
            #code-content::-webkit-scrollbar {
                height: 8px;
            }
            
            #code-content::-webkit-scrollbar-track {
                background: #334155;
                border-radius: 4px;
            }
            
            #code-content::-webkit-scrollbar-thumb {
                background: #475569;
                border-radius: 4px;
            }
            
            #code-content::-webkit-scrollbar-thumb:hover {
                background: #64748b;
            }
            
            /* Vulnerability highlighting enhancement */
            #code-content .bg-red-900\/20 {
                background: rgba(127, 29, 29, 0.3) !important;
                border-left: 3px solid #ef4444;
                padding-left: 8px;
                margin-left: -8px;
            }
            
            /* Line number styling */
            #code-content .text-slate-500 {
                color: #64748b !important;
                user-select: none;
                border-right: 1px solid #334155;
                padding-right: 8px;
                margin-right: 12px;
            }
            
            /* Code folding visual hint */
            #code-content .flex {
                position: relative;
            }
            
            #code-content .flex:hover::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 2px;
                background: #3b82f6;
                opacity: 0.6;
            }
        `;
        document.head.appendChild(style);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
