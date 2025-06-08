export function displaySourceCode(file) {
    const codeContent = document.getElementById('code-content');
    const lines = file.sourceCode.split('\n');
    
    codeContent.innerHTML = lines.map((line, index) => {
        const lineNum = index + 1;
        // Only show vulnerability indicators if vulnerabilities have been revealed
        const isVulnerable = file.vulnerabilitiesRevealed && 
                           file.vulnerabilities.some(v => v.line === lineNum);
        
        // Apply highlighting to individual line instead of entire code block
        const highlightedLine = applyHighlightJsToLine(line, file.name, file.type);
        
        return `
            <div class="flex ${isVulnerable ? 'bg-red-900/20' : ''}">
                <span class="text-slate-500 w-8 text-right mr-3 select-none flex-shrink-0">${lineNum}</span>
                <span class="whitespace-pre flex-1">${highlightedLine}</span>
                ${isVulnerable ? '<span class="ml-2 text-red-400 text-xs flex-shrink-0">⚠</span>' : ''}
            </div>
        `;
    }).join('');
}

function applyHighlightJsToLine(line, fileName, fileType) {
    if (!window.hljs || !line.trim()) {
        // For empty lines, preserve spacing
        const leadingSpaces = line.match(/^(\s*)/)[1];
        const preservedSpaces = leadingSpaces.replace(/\s/g, '&nbsp;');
        const trimmedLine = line.trim();
        return preservedSpaces + escapeHtml(trimmedLine);
    }
    
    // Create a temporary element for highlighting individual line
    const tempElement = document.createElement('code');
    tempElement.textContent = line;
    
    // Set language class based on file type
    const language = getLanguageClass(fileName, fileType);
    tempElement.className = language;
    
    try {
        // For Solidity files, try direct highlighting first, then fallback
        if (language === 'language-solidity') {
            try {
                // Try to use solidity language if available
                if (hljs.getLanguage('solidity')) {
                    const result = hljs.highlight(line, { language: 'solidity' });
                    return result.value;
                } else {
                    // Fallback to JavaScript highlighting for Solidity
                    const result = hljs.highlight(line, { language: 'javascript' });
                    return result.value;
                }
            } catch (solidityError) {
                console.warn('Solidity highlighting failed, using JavaScript fallback:', solidityError);
                const result = hljs.highlight(line, { language: 'javascript' });
                return result.value;
            }
        } else {
            // Apply highlight.js to individual line
            hljs.highlightElement(tempElement);
            return tempElement.innerHTML;
        }
    } catch (error) {
        console.warn('Highlight.js error:', error);
        // Fallback to manual formatting
        const leadingSpaces = line.match(/^(\s*)/)[1];
        const preservedSpaces = leadingSpaces.replace(/\s/g, '&nbsp;');
        const trimmedLine = line.trim();
        return preservedSpaces + escapeHtml(trimmedLine);
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
            
            /* TypeScript/React-specific highlighting - treat JSX as TypeScript */
            #code-content .hljs-tag {
                color: #ff7b72 !important;
                font-weight: 600;
            }
            
            #code-content .hljs-name {
                color: #fbbf24 !important;
                font-weight: 600;
            }
            
            #code-content .hljs-attribute {
                color: #79c0ff !important;
            }
            
            /* JSX/TSX component names */
            #code-content .hljs-title.class_ {
                color: #fbbf24 !important;
                font-weight: 600;
            }
            
            /* JSX attributes and props */
            #code-content .hljs-attr {
                color: #79c0ff !important;
            }
            
            /* React hooks and TypeScript interfaces */
            #code-content .hljs-built_in {
                color: #79c0ff !important;
                font-weight: 500;
            }
            
            /* TypeScript types and interfaces */
            #code-content .hljs-type {
                color: #ffa657 !important;
                font-weight: 500;
            }
            
            /* Generic types */
            #code-content .hljs-params {
                color: #c9d1d9 !important;
            }
            
            /* JSX expression brackets - ensure no extra line breaks */
            #code-content .hljs-subst {
                color: #ff7b72 !important;
                display: inline !important;
            }
            
            /* Template literals in JSX - prevent line wrapping */
            #code-content .hljs-template-tag {
                color: #ff7b72 !important;
                display: inline !important;
            }
            
            #code-content .hljs-template-variable {
                color: #ffa657 !important;
                display: inline !important;
            }
            
            /* Prevent extra line breaks in highlighted code */
            #code-content .hljs-tag,
            #code-content .hljs-name,
            #code-content .hljs-attribute {
                display: inline !important;
                white-space: nowrap !important;
            }
            
            /* Fix JSX element line breaks */
            #code-content .whitespace-pre {
                white-space: pre !important;
                line-height: 1.5 !important;
            }
            
            /* Force Solidity syntax highlighting - higher specificity */
            #code-content .language-solidity .hljs-keyword,
            #code-content[data-language="solidity"] .hljs-keyword {
                color: #ff7b72 !important;
                font-weight: 600 !important;
            }
            
            #code-content .language-solidity .hljs-type,
            #code-content[data-language="solidity"] .hljs-type {
                color: #79c0ff !important;
                font-weight: 500 !important;
            }
            
            #code-content .language-solidity .hljs-built_in,
            #code-content[data-language="solidity"] .hljs-built_in {
                color: #ffa657 !important;
                font-weight: 500 !important;
            }
            
            #code-content .language-solidity .hljs-title,
            #code-content[data-language="solidity"] .hljs-title {
                color: #d2a8ff !important;
                font-weight: 600 !important;
            }
            
            #code-content .language-solidity .hljs-title.class_,
            #code-content[data-language="solidity"] .hljs-title.class_ {
                color: #fbbf24 !important;
                font-weight: 700 !important;
            }
            
            #code-content .language-solidity .hljs-string,
            #code-content[data-language="solidity"] .hljs-string {
                color: #a5d6ff !important;
            }
            
            #code-content .language-solidity .hljs-comment,
            #code-content[data-language="solidity"] .hljs-comment {
                color: #8b949e !important;
                font-style: italic !important;
            }
            
            #code-content .language-solidity .hljs-number,
            #code-content[data-language="solidity"] .hljs-number {
                color: #79c0ff !important;
            }
            
            #code-content .language-solidity .hljs-literal,
            #code-content[data-language="solidity"] .hljs-literal {
                color: #79c0ff !important;
            }
            
            #code-content .language-solidity .hljs-meta,
            #code-content[data-language="solidity"] .hljs-meta {
                color: #a5d6ff !important;
                font-style: italic !important;
                font-weight: 500 !important;
            }
            
            #code-content .language-solidity .hljs-attr,
            #code-content[data-language="solidity"] .hljs-attr {
                color: #fbbf24 !important;
            }
            
            /* SPDX license identifier - special treatment for Solidity */
            #code-content .language-solidity .hljs-comment:first-of-type,
            #code-content[data-language="solidity"] .hljs-comment:first-of-type {
                color: #7dd3fc !important;
                font-weight: 600 !important;
            }
            
            /* Override any conflicting styles */
            #code-content .whitespace-pre span {
                color: inherit !important;
            }
            
            /* Ensure Solidity keywords are properly highlighted */
            #code-content .language-solidity span:contains('contract'),
            #code-content .language-solidity span:contains('function'),
            #code-content .language-solidity span:contains('mapping'),
            #code-content .language-solidity span:contains('require'),
            #code-content .language-solidity span:contains('external'),
            #code-content .language-solidity span:contains('payable'),
            #code-content .language-solidity span:contains('modifier') {
                color: #ff7b72 !important;
                font-weight: 600 !important;
            }
            
            /* Enhanced Solidity syntax highlighting with JavaScript fallback */
            #code-content .language-solidity .hljs-keyword,
            #code-content[data-language="solidity"] .hljs-keyword {
                color: #ff7b72 !important;
                font-weight: 600 !important;
            }
            
            /* Solidity-specific keywords that JavaScript highlighting might miss */
            #code-content .language-solidity span:contains('pragma'),
            #code-content .language-solidity span:contains('solidity'),
            #code-content .language-solidity span:contains('contract'),
            #code-content .language-solidity span:contains('mapping'),
            #code-content .language-solidity span:contains('require'),
            #code-content .language-solidity span:contains('external'),
            #code-content .language-solidity span:contains('payable'),
            #code-content .language-solidity span:contains('modifier'),
            #code-content .language-solidity span:contains('uint256'),
            #codeContent .language-solidity span:contains('address') {
                color: #ff7b72 !important;
                font-weight: 600 !important;
            }
            
            /* SPDX license comments */
            #code-content .language-solidity .hljs-comment:first-line,
            #code-content .language-solidity span:contains('SPDX-License-Identifier') {
                color: #7dd3fc !important;
                font-weight: 600 !important;
            }
            
            /* Solidity address and uint types */
            #code-content .language-solidity span:contains('msg.sender'),
            #code-content .language-solidity span:contains('msg.value'),
            #code-content .language-solidity span:contains('block.timestamp') {
                color: #ffa657 !important;
                font-weight: 500 !important;
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
            
            /* TypeScript/React-specific highlighting - treat JSX as TypeScript */
            #code-content .hljs-tag {
                color: #ff7b72 !important;
                font-weight: 600;
            }
            
            #code-content .hljs-name {
                color: #fbbf24 !important;
                font-weight: 600;
            }
            
            #code-content .hljs-attribute {
                color: #79c0ff !important;
            }
            
            /* JSX/TSX component names */
            #code-content .hljs-title.class_ {
                color: #fbbf24 !important;
                font-weight: 600;
            }
            
            /* JSX attributes and props */
            #code-content .hljs-attr {
                color: #79c0ff !important;
            }
            
            /* React hooks and TypeScript interfaces */
            #code-content .hljs-built_in {
                color: #79c0ff !important;
                font-weight: 500;
            }
            
            /* TypeScript types and interfaces */
            #code-content .hljs-type {
                color: #ffa657 !important;
                font-weight: 500;
            }
            
            /* Generic types */
            #code-content .hljs-params {
                color: #c9d1d9 !important;
            }
            
            /* JSX expression brackets - ensure no extra line breaks */
            #code-content .hljs-subst {
                color: #ff7b72 !important;
                display: inline !important;
            }
            
            /* Template literals in JSX - prevent line wrapping */
            #code-content .hljs-template-tag {
                color: #ff7b72 !important;
                display: inline !important;
            }
            
            #code-content .hljs-template-variable {
                color: #ffa657 !important;
                display: inline !important;
            }
            
            /* Prevent extra line breaks in highlighted code */
            #code-content .hljs-tag,
            #code-content .hljs-name,
            #code-content .hljs-attribute {
                display: inline !important;
                white-space: nowrap !important;
            }
            
            /* Fix JSX element line breaks */
            #code-content .whitespace-pre {
                white-space: pre !important;
                line-height: 1.5 !important;
            }
            
            /* Force Solidity syntax highlighting - higher specificity */
            #code-content .language-solidity .hljs-keyword,
            #code-content[data-language="solidity"] .hljs-keyword {
                color: #ff7b72 !important;
                font-weight: 600 !important;
            }
            
            #code-content .language-solidity .hljs-type,
            #code-content[data-language="solidity"] .hljs-type {
                color: #79c0ff !important;
                font-weight: 500 !important;
            }
            
            #code-content .language-solidity .hljs-built_in,
            #code-content[data-language="solidity"] .hljs-built_in {
                color: #ffa657 !important;
                font-weight: 500 !important;
            }
            
            #code-content .language-solidity .hljs-title,
            #code-content[data-language="solidity"] .hljs-title {
                color: #d2a8ff !important;
                font-weight: 600 !important;
            }
            
            #code-content .language-solidity .hljs-title.class_,
            #code-content[data-language="solidity"] .hljs-title.class_ {
                color: #fbbf24 !important;
                font-weight: 700 !important;
            }
            
            #code-content .language-solidity .hljs-string,
            #code-content[data-language="solidity"] .hljs-string {
                color: #a5d6ff !important;
            }
            
            #code-content .language-solidity .hljs-comment,
            #code-content[data-language="solidity"] .hljs-comment {
                color: #8b949e !important;
                font-style: italic !important;
            }
            
            #code-content .language-solidity .hljs-number,
            #code-content[data-language="solidity"] .hljs-number {
                color: #79c0ff !important;
            }
            
            #code-content .language-solidity .hljs-literal,
            #code-content[data-language="solidity"] .hljs-literal {
                color: #79c0ff !important;
            }
            
            #code-content .language-solidity .hljs-meta,
            #code-content[data-language="solidity"] .hljs-meta {
                color: #a5d6ff !important;
                font-style: italic !important;
                font-weight: 500 !important;
            }
            
            #code-content .language-solidity .hljs-attr,
            #code-content[data-language="solidity"] .hljs-attr {
                color: #fbbf24 !important;
            }
            
            /* SPDX license identifier - special treatment for Solidity */
            #code-content .language-solidity .hljs-comment:first-of-type,
            #code-content[data-language="solidity"] .hljs-comment:first-of-type {
                color: #7dd3fc !important;
                font-weight: 600 !important;
            }
            
            /* Override any conflicting styles */
            #code-content .whitespace-pre span {
                color: inherit !important;
            }
            
            /* Ensure Solidity keywords are properly highlighted */
            #code-content .language-solidity span:contains('contract'),
            #code-content .language-solidity span:contains('function'),
            #code-content .language-solidity span:contains('mapping'),
            #code-content .language-solidity span:contains('require'),
            #code-content .language-solidity span:contains('external'),
            #code-content .language-solidity span:contains('payable'),
            #code-content .language-solidity span:contains('modifier') {
                color: #ff7b72 !important;
                font-weight: 600 !important;
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
