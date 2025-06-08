export function displaySourceCode(file) {
    const codeContent = document.getElementById('code-content');
    const lines = file.sourceCode.split('\n');
    
    // Apply syntax highlighting to the entire code block first
    const highlightedCode = applyHighlightJs(file.sourceCode, file.name, file.type);
    const highlightedLines = highlightedCode.split('\n');
    
    codeContent.innerHTML = lines.map((line, index) => {
        const lineNum = index + 1;
        // Only show vulnerability indicators if vulnerabilities have been revealed
        const isVulnerable = file.vulnerabilitiesRevealed && 
                           file.vulnerabilities.some(v => v.line === lineNum);
        
        // Use highlighted line if available, otherwise escape the original
        const displayContent = highlightedLines[index] || escapeHtml(line);
        
        return `
            <div class="flex ${isVulnerable ? 'bg-red-900/20' : ''}">
                <span class="text-slate-500 w-8 text-right mr-3 select-none flex-shrink-0">${lineNum}</span>
                <span class="whitespace-pre flex-1">${displayContent}</span>
                ${isVulnerable ? '<span class="ml-2 text-red-400 text-xs flex-shrink-0">⚠</span>' : ''}
            </div>
        `;
    }).join('');
}

function applyHighlightJs(sourceCode, fileName, fileType) {
    if (!window.hljs) {
        return escapeHtml(sourceCode);
    }
    
    // Create a temporary element for highlighting
    const tempElement = document.createElement('code');
    tempElement.textContent = sourceCode;
    
    // Set language class based on file type
    const language = getLanguageClass(fileName, fileType);
    tempElement.className = language;
    
    try {
        // Apply highlight.js
        hljs.highlightElement(tempElement);
        return tempElement.innerHTML;
    } catch (error) {
        console.warn('Highlight.js error:', error);
        return escapeHtml(sourceCode);
    }
}

function getLanguageClass(fileName, fileType) {
    if (fileName.endsWith('.js') || fileType === 'backend') {
        return 'language-javascript';
    } else if (fileName.endsWith('.py') || fileType === 'authentication') {
        return 'language-python';
    } else if (fileName.endsWith('.sol') || fileType === 'smart contract') {
        return 'language-solidity';
    } else if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx') || fileType === 'frontend') {
        return 'language-typescript';
    }
    return 'language-javascript'; // default fallback
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
            
            /* Basic code viewer styling with highlight.js dark theme */
            #code-content {
                background: #0d1117;
                border-radius: 8px;
                color: #c9d1d9;
            }
            
            /* Enhance highlight.js colors for better contrast in our dark theme */
            #code-content .hljs-keyword {
                color: #ff7b72 !important;
                font-weight: 600;
            }
            
            #code-content .hljs-string {
                color: #a5d6ff !important;
            }
            
            #code-content .hljs-comment {
                color: #8b949e !important;
                font-style: italic;
            }
            
            #code-content .hljs-function .hljs-title {
                color: #d2a8ff !important;
            }
            
            #code-content .hljs-variable {
                color: #ffa657 !important;
            }
            
            #code-content .hljs-number {
                color: #79c0ff !important;
            }
            
            #code-content .hljs-built_in {
                color: #ffa657 !important;
            }
            
            #code-content .hljs-type {
                color: #ffa657 !important;
            }
            
            #code-content .hljs-literal {
                color: #79c0ff !important;
            }
            
            #code-content .hljs-operator {
                color: #ff7b72 !important;
            }
            
            #code-content .hljs-punctuation {
                color: #c9d1d9 !important;
            }
            
            /* Python-specific highlighting */
            #code-content .hljs-decorator {
                color: #79c0ff !important;
            }
            
            #code-content .hljs-meta {
                color: #79c0ff !important;
            }
            
            /* Solidity-specific highlighting */
            #code-content .hljs-title.class_ {
                color: #f97316 !important;
                font-weight: 600;
            }
            
            #code-content .hljs-attr {
                color: #fbbf24 !important;
            }
            
            /* Solidity keywords and modifiers */
            #code-content .hljs-keyword {
                color: #ff7b72 !important;
                font-weight: 600;
            }
            
            /* Solidity function modifiers and visibility */
            #code-content .hljs-built_in {
                color: #79c0ff !important;
            }
            
            /* Solidity pragma and version */
            #code-content .hljs-meta {
                color: #a5d6ff !important;
                font-style: italic;
            }
            
            /* Solidity data types */
            #code-content .hljs-type {
                color: #ffa657 !important;
                font-weight: 500;
            }
            
            /* SPDX license identifier */
            #code-content .hljs-comment:first-child {
                color: #7dd3fc !important;
                font-weight: 500;
            }
            
            /* Fallback for unhighlighted content */
            #code-content span:not([class*="hljs-"]) {
                color: #c9d1d9;
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
