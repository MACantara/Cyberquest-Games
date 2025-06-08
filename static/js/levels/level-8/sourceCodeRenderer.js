export function displaySourceCode(file) {
    const codeContent = document.getElementById('code-content');
    const lines = file.sourceCode.split('\n');
    
    codeContent.innerHTML = lines.map((line, index) => {
        const lineNum = index + 1;
        // Only show vulnerability indicators if vulnerabilities have been revealed
        const isVulnerable = file.vulnerabilitiesRevealed && 
                           file.vulnerabilities.some(v => v.line === lineNum);
        
        // Apply syntax highlighting based on file type
        const highlightedLine = applySyntaxHighlighting(line, file.type, file.name);
        
        return `
            <div class="flex ${isVulnerable ? 'bg-red-900/20' : ''}">
                <span class="text-slate-500 w-8 text-right mr-3 select-none flex-shrink-0">${lineNum}</span>
                <span class="whitespace-pre flex-1">${highlightedLine}</span>
                ${isVulnerable ? '<span class="ml-2 text-red-400 text-xs flex-shrink-0">⚠</span>' : ''}
            </div>
        `;
    }).join('');
}

function applySyntaxHighlighting(line, fileType, fileName) {
    // Escape HTML first
    const escaped = escapeHtml(line);
    
    // Preserve leading whitespace
    const leadingSpaces = line.match(/^(\s*)/)[1];
    const trimmedLine = line.trim();
    const preservedSpaces = leadingSpaces.replace(/\s/g, '&nbsp;');
    
    if (!trimmedLine) {
        return preservedSpaces;
    }
    
    let highlighted = '';
    
    // Apply highlighting based on file type
    if (fileName.endsWith('.js') || fileType === 'backend') {
        highlighted = highlightJavaScript(trimmedLine);
    } else if (fileName.endsWith('.py') || fileType === 'authentication') {
        highlighted = highlightPython(trimmedLine);
    } else if (fileName.endsWith('.sol') || fileType === 'smart contract') {
        highlighted = highlightSolidity(trimmedLine);
    } else if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx') || fileType === 'frontend') {
        highlighted = highlightTypeScript(trimmedLine);
    } else {
        highlighted = `<span class="text-green-400">${escapeHtml(trimmedLine)}</span>`;
    }
    
    return preservedSpaces + highlighted;
}

function highlightJavaScript(line) {
    const jsKeywords = ['const', 'let', 'var', 'function', 'async', 'await', 'if', 'else', 'for', 'while', 'return', 'require', 'module', 'exports', 'import', 'export'];
    const jsTypes = ['String', 'Number', 'Boolean', 'Object', 'Array', 'null', 'undefined'];
    
    let highlighted = escapeHtml(line);
    
    // Comments
    highlighted = highlighted.replace(/(\/\/.*$)/, '<span class="text-gray-400 italic">$1</span>');
    highlighted = highlighted.replace(/(\/\*.*?\*\/)/g, '<span class="text-gray-400 italic">$1</span>');
    
    // Strings
    highlighted = highlighted.replace(/('[^']*')/g, '<span class="text-green-300">$1</span>');
    highlighted = highlighted.replace(/("[^"]*")/g, '<span class="text-green-300">$1</span>');
    highlighted = highlighted.replace(/(`[^`]*`)/g, '<span class="text-green-300">$1</span>');
    
    // Keywords
    jsKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-blue-400 font-semibold">$1</span>');
    });
    
    // Types
    jsTypes.forEach(type => {
        const regex = new RegExp(`\\b(${type})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-purple-400">$1</span>');
    });
    
    // Functions
    highlighted = highlighted.replace(/(\w+)(\s*\()/g, '<span class="text-yellow-400">$1</span>$2');
    
    // Numbers
    highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>');
    
    return highlighted;
}

function highlightPython(line) {
    const pyKeywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'import', 'from', 'return', 'yield', 'lambda', 'with', 'as', 'pass', 'break', 'continue'];
    const pyBuiltins = ['print', 'len', 'str', 'int', 'float', 'list', 'dict', 'tuple', 'set', 'True', 'False', 'None'];
    
    let highlighted = escapeHtml(line);
    
    // Comments
    highlighted = highlighted.replace(/(#.*$)/, '<span class="text-gray-400 italic">$1</span>');
    
    // Strings
    highlighted = highlighted.replace(/('[^']*')/g, '<span class="text-green-300">$1</span>');
    highlighted = highlighted.replace(/("[^"]*")/g, '<span class="text-green-300">$1</span>');
    
    // Decorators
    highlighted = highlighted.replace(/(@\w+)/g, '<span class="text-cyan-400">$1</span>');
    
    // Keywords
    pyKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-blue-400 font-semibold">$1</span>');
    });
    
    // Built-ins
    pyBuiltins.forEach(builtin => {
        const regex = new RegExp(`\\b(${builtin})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-purple-400">$1</span>');
    });
    
    // Functions
    highlighted = highlighted.replace(/(\w+)(\s*\()/g, '<span class="text-yellow-400">$1</span>$2');
    
    return highlighted;
}

function highlightSolidity(line) {
    const solKeywords = ['contract', 'function', 'modifier', 'event', 'struct', 'enum', 'mapping', 'if', 'else', 'for', 'while', 'return', 'require', 'pragma', 'solidity', 'external', 'internal', 'public', 'private', 'view', 'pure', 'payable'];
    const solTypes = ['uint256', 'uint', 'int', 'address', 'bool', 'string', 'bytes', 'bytes32'];
    
    let highlighted = escapeHtml(line);
    
    // Comments
    highlighted = highlighted.replace(/(\/\/.*$)/, '<span class="text-gray-400 italic">$1</span>');
    highlighted = highlighted.replace(/(\/\*.*?\*\/)/g, '<span class="text-gray-400 italic">$1</span>');
    
    // Strings
    highlighted = highlighted.replace(/("[^"]*")/g, '<span class="text-green-300">$1</span>');
    
    // SPDX License
    highlighted = highlighted.replace(/(SPDX-License-Identifier:.*$)/, '<span class="text-cyan-400">$1</span>');
    
    // Keywords
    solKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-blue-400 font-semibold">$1</span>');
    });
    
    // Types
    solTypes.forEach(type => {
        const regex = new RegExp(`\\b(${type})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-purple-400">$1</span>');
    });
    
    // Functions and variables
    highlighted = highlighted.replace(/(\w+)(\s*\()/g, '<span class="text-yellow-400">$1</span>$2');
    
    // Numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
    
    return highlighted;
}

function highlightTypeScript(line) {
    const tsKeywords = ['import', 'export', 'const', 'let', 'var', 'function', 'async', 'await', 'if', 'else', 'for', 'while', 'return', 'interface', 'type', 'class', 'extends', 'implements'];
    const tsTypes = ['string', 'number', 'boolean', 'object', 'array', 'null', 'undefined', 'React', 'FC'];
    const reactKeywords = ['useState', 'useEffect', 'useCallback', 'useMemo'];
    
    let highlighted = escapeHtml(line);
    
    // Comments
    highlighted = highlighted.replace(/(\/\/.*$)/, '<span class="text-gray-400 italic">$1</span>');
    highlighted = highlighted.replace(/(\/\*.*?\*\/)/g, '<span class="text-gray-400 italic">$1</span>');
    
    // Strings
    highlighted = highlighted.replace(/('[^']*')/g, '<span class="text-green-300">$1</span>');
    highlighted = highlighted.replace(/("[^"]*")/g, '<span class="text-green-300">$1</span>');
    highlighted = highlighted.replace(/(`[^`]*`)/g, '<span class="text-green-300">$1</span>');
    
    // JSX tags
    highlighted = highlighted.replace(/(<\/?\w+[^>]*>)/g, '<span class="text-red-400">$1</span>');
    
    // Keywords
    tsKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-blue-400 font-semibold">$1</span>');
    });
    
    // Types
    tsTypes.forEach(type => {
        const regex = new RegExp(`\\b(${type})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-purple-400">$1</span>');
    });
    
    // React hooks
    reactKeywords.forEach(hook => {
        const regex = new RegExp(`\\b(${hook})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-cyan-400">$1</span>');
    });
    
    // Functions
    highlighted = highlighted.replace(/(\w+)(\s*\()/g, '<span class="text-yellow-400">$1</span>$2');
    
    return highlighted;
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
            
            /* Enhanced syntax highlighting colors */
            #code-content {
                background: #0f172a;
                border-radius: 8px;
            }
            
            /* Syntax highlighting improvements */
            #code-content .flex:hover {
                background: rgba(30, 41, 59, 0.3);
            }
            
            /* Better color contrast for syntax elements */
            #code-content .text-blue-400 {
                color: #60a5fa !important;
                font-weight: 600;
            }
            
            #code-content .text-purple-400 {
                color: #c084fc !important;
            }
            
            #code-content .text-yellow-400 {
                color: #facc15 !important;
            }
            
            #code-content .text-green-300 {
                color: #86efac !important;
            }
            
            #code-content .text-orange-400 {
                color: #fb923c !important;
            }
            
            #code-content .text-cyan-400 {
                color: #22d3ee !important;
            }
            
            #code-content .text-red-400 {
                color: #f87171 !important;
            }
            
            #code-content .text-gray-400 {
                color: #9ca3af !important;
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
