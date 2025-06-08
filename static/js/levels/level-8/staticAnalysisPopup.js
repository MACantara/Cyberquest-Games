let analysisPopupVisible = false;
let analysisPopupMinimized = false;
let analysisDragState = { isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 };
let analysisResizeState = { isResizing: false, startX: 0, startY: 0, initialWidth: 0, initialHeight: 0 };

export function initializeStaticAnalysisPopup() {
    const popup = document.getElementById('static-analysis-popup');
    const header = document.getElementById('analysis-popup-header');
    const minimizeBtn = document.getElementById('minimize-analysis-popup');
    const closeBtn = document.getElementById('close-analysis-popup');
    const resizeHandle = document.getElementById('analysis-resize-handle');
    const minimizedIndicator = document.getElementById('analysis-minimized-indicator');

    // Close popup
    closeBtn?.addEventListener('click', () => {
        closeStaticAnalysisPopup();
    });

    // Minimize popup
    minimizeBtn?.addEventListener('click', () => {
        minimizeStaticAnalysisPopup();
    });

    // Restore from minimized state
    minimizedIndicator?.addEventListener('click', () => {
        restoreStaticAnalysisPopup();
    });

    // Drag functionality
    header?.addEventListener('mousedown', startAnalysisDrag);
    document.addEventListener('mousemove', dragAnalysis);
    document.addEventListener('mouseup', stopAnalysisDrag);

    // Resize functionality
    resizeHandle?.addEventListener('mousedown', startAnalysisResize);
    document.addEventListener('mousemove', resizeAnalysis);
    document.addEventListener('mouseup', stopAnalysisResize);

    // Set initial position
    if (popup) {
        popup.style.top = '15%';
        popup.style.left = '10%';
        popup.style.width = '450px';
        popup.style.height = '350px';
    }
}

export function showStaticAnalysisPopup(file) {
    const popup = document.getElementById('static-analysis-popup');
    if (popup) {
        // Update content based on file analysis state
        updateAnalysisDisplay(file);
        
        popup.classList.remove('hidden');
        analysisPopupVisible = true;
        
        // Add entrance animation
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        popup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'scale(1)';
        }, 10);
    }
}

export function closeStaticAnalysisPopup() {
    const popup = document.getElementById('static-analysis-popup');
    const minimizedIndicator = document.getElementById('analysis-minimized-indicator');
    
    if (popup) {
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            popup.classList.add('hidden');
            analysisPopupVisible = false;
            analysisPopupMinimized = false;
        }, 300);
    }
    
    if (minimizedIndicator) {
        minimizedIndicator.classList.add('hidden');
    }
}

export function minimizeStaticAnalysisPopup() {
    const popup = document.getElementById('static-analysis-popup');
    const minimizedIndicator = document.getElementById('analysis-minimized-indicator');
    
    if (popup && minimizedIndicator) {
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            popup.classList.add('hidden');
            minimizedIndicator.classList.remove('hidden');
            analysisPopupMinimized = true;
        }, 300);
    }
}

export function restoreStaticAnalysisPopup() {
    const popup = document.getElementById('static-analysis-popup');
    const minimizedIndicator = document.getElementById('analysis-minimized-indicator');
    
    if (popup && minimizedIndicator) {
        minimizedIndicator.classList.add('hidden');
        popup.classList.remove('hidden');
        
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'scale(1)';
            analysisPopupMinimized = false;
        }, 10);
    }
}

function updateAnalysisDisplay(file) {
    const analysisContent = document.getElementById('analysis-results-content');
    
    // Check if file has been analyzed before
    const isFirstAnalysis = !file.hasBeenAnalyzed;
    
    if (isFirstAnalysis) {
        // First time analyzing this file
        analysisContent.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center gap-2 mb-4">
                    <i class="bi bi-search text-blue-400"></i>
                    <span class="font-semibold text-white text-sm">Initial Static Analysis - ${file.name}</span>
                </div>
                
                <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                    <div class="text-sm space-y-2">
                        <div class="flex justify-between">
                            <span class="text-slate-400">File Type:</span>
                            <span class="text-white text-xs">${file.type}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Technology:</span>
                            <span class="text-white text-xs">${file.technology}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Size:</span>
                            <span class="text-white text-xs">${file.sourceCode ? file.sourceCode.split('\n').length : 'N/A'} lines</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Initial Risk Assessment:</span>
                            <span class="text-yellow-400 text-xs">Scanning...</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-blue-900/30 border border-blue-600 rounded-lg p-3">
                    <div class="text-blue-300 text-sm">
                        <span class="font-semibold">Preliminary Scan:</span> 
                        <span class="text-xs">Basic structure analysis complete. Ready for deep vulnerability scan.</span>
                    </div>
                </div>
                
                <div class="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3">
                    <div class="text-yellow-300 text-sm">
                        <span class="font-semibold">Surface-Level Concerns:</span>
                        <div class="text-yellow-200 text-xs mt-1 space-y-1">
                            <div>• Code complexity indicates potential issues</div>
                            <div>• Multiple external dependencies detected</div>
                            <div>• Security-sensitive operations identified</div>
                            <div>• Input validation patterns require review</div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-cyan-900/30 border border-cyan-600 rounded-lg p-3">
                    <div class="text-cyan-300 text-sm">
                        <span class="font-semibold">Next Step:</span>
                        <span class="text-cyan-200 text-xs">Run "Find Vulns" to perform deep security analysis.</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Re-analyzing previously scanned file
        analysisContent.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center gap-2 mb-4">
                    <i class="bi bi-search text-blue-400"></i>
                    <span class="font-semibold text-white text-sm">Re-Analysis Results - ${file.name}</span>
                </div>
                
                <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                    <div class="text-sm space-y-2">
                        <div class="flex justify-between">
                            <span class="text-slate-400">File Type:</span>
                            <span class="text-white text-xs">${file.type}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Technology:</span>
                            <span class="text-white text-xs">${file.technology}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Confirmed Risk Level:</span>
                            <span class="text-${file.riskLevel > 7 ? 'red' : file.riskLevel > 5 ? 'yellow' : 'green'}-400 text-xs">${file.riskLevel}/10</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Vulnerability Count:</span>
                            <span class="text-red-400 text-xs">${file.vulnerabilities ? file.vulnerabilities.length : 0} identified</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Code Quality:</span>
                            <span class="text-red-400 text-xs">Poor - Multiple security issues confirmed</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-900/30 border border-green-600 rounded-lg p-3">
                    <div class="text-green-300 text-sm">
                        <span class="font-semibold">Analysis Status:</span> 
                        <span class="text-xs">Complete - All vulnerabilities documented.</span>
                    </div>
                </div>
                
                <div class="bg-red-900/30 border border-red-600 rounded-lg p-3">
                    <div class="text-red-300 text-sm">
                        <span class="font-semibold">Critical Findings Summary:</span>
                        <div class="text-red-200 text-xs mt-1 space-y-1">
                            ${file.vulnerabilities ? file.vulnerabilities.map(vuln => 
                                `<div>• ${vuln.type} (${vuln.severity})</div>`
                            ).join('') : '<div>• No vulnerabilities in cache</div>'}
                        </div>
                    </div>
                </div>
                
                <div class="bg-purple-900/30 border border-purple-600 rounded-lg p-3">
                    <div class="text-purple-300 text-sm">
                        <span class="font-semibold">Recommendation:</span>
                        <span class="text-purple-200 text-xs">File already fully analyzed. Check vulnerability popup for detailed findings.</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// Drag functionality
function startAnalysisDrag(e) {
    if (e.target.closest('#minimize-analysis-popup') || e.target.closest('#close-analysis-popup')) return;
    
    analysisDragState.isDragging = true;
    const popup = document.getElementById('static-analysis-popup');
    const rect = popup.getBoundingClientRect();
    
    analysisDragState.startX = e.clientX;
    analysisDragState.startY = e.clientY;
    analysisDragState.initialX = rect.left;
    analysisDragState.initialY = rect.top;
    
    popup.style.transition = 'none';
    e.preventDefault();
}

function dragAnalysis(e) {
    if (!analysisDragState.isDragging) return;
    
    const popup = document.getElementById('static-analysis-popup');
    const deltaX = e.clientX - analysisDragState.startX;
    const deltaY = e.clientY - analysisDragState.startY;
    
    const newX = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, analysisDragState.initialX + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, analysisDragState.initialY + deltaY));
    
    popup.style.left = newX + 'px';
    popup.style.top = newY + 'px';
    popup.style.right = 'auto';
}

function stopAnalysisDrag() {
    if (analysisDragState.isDragging) {
        const popup = document.getElementById('static-analysis-popup');
        popup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        analysisDragState.isDragging = false;
    }
}

// Resize functionality
function startAnalysisResize(e) {
    analysisResizeState.isResizing = true;
    const popup = document.getElementById('static-analysis-popup');
    const rect = popup.getBoundingClientRect();
    
    analysisResizeState.startX = e.clientX;
    analysisResizeState.startY = e.clientY;
    analysisResizeState.initialWidth = rect.width;
    analysisResizeState.initialHeight = rect.height;
    
    e.preventDefault();
}

function resizeAnalysis(e) {
    if (!analysisResizeState.isResizing) return;
    
    const popup = document.getElementById('static-analysis-popup');
    const popupContent = document.getElementById('analysis-popup-content');
    const deltaX = e.clientX - analysisResizeState.startX;
    const deltaY = e.clientY - analysisResizeState.startY;
    
    const newWidth = Math.max(350, analysisResizeState.initialWidth + deltaX);
    const newHeight = Math.max(250, analysisResizeState.initialHeight + deltaY);
    
    popup.style.width = newWidth + 'px';
    popup.style.height = newHeight + 'px';
    
    // Calculate new content height (popup height minus header and padding)
    const header = document.getElementById('analysis-popup-header');
    const headerHeight = header ? header.offsetHeight : 40;
    const padding = 32; // Account for padding on popup content
    const newContentHeight = Math.max(180, newHeight - headerHeight - padding);
    
    if (popupContent) {
        popupContent.style.maxHeight = newContentHeight + 'px';
        popupContent.style.height = 'auto';
    }
}

function stopAnalysisResize() {
    analysisResizeState.isResizing = false;
}

// Check if popup is currently visible
export function isAnalysisPopupVisible() {
    return analysisPopupVisible && !analysisPopupMinimized;
}

// Check if popup is minimized
export function isAnalysisPopupMinimized() {
    return analysisPopupMinimized;
}
