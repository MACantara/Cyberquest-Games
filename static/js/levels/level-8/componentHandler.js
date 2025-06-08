import { gameState, updateGameMetrics } from './gameState.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

export let fileData = {};

export async function loadComponents() {
    try {
        const response = await fetch('/static/js/levels/level-8/data/components.json');
        fileData = await response.json();
        console.log('CivitasVote files loaded:', Object.keys(fileData));
        
        initializeFileTree();
    } catch (error) {
        console.error('Failed to load file data:', error);
        // Fallback data
        fileData = {
            "vote-processor": {
                "name": "vote-processor.js",
                "severity": "Critical",
                "riskLevel": 10,
                "sourceCode": "// Fallback code...",
                "vulnerabilities": []
            }
        };
        initializeFileTree();
    }
}

function initializeFileTree() {
    // Update file tree with risk indicators
    Object.keys(fileData).forEach(fileId => {
        const file = fileData[fileId];
        const fileElement = document.querySelector(`[data-file="${fileId}"]`);
        if (fileElement) {
            // Add risk-based styling
            const riskClass = file.riskLevel > 8 ? 'text-red-400' : 
                             file.riskLevel > 6 ? 'text-orange-400' : 
                             file.riskLevel > 4 ? 'text-yellow-400' : 'text-blue-400';
            
            const icon = fileElement.querySelector('i');
            if (icon) {
                icon.className = `bi bi-file-earmark-code ${riskClass} mr-2`;
            }
        }
    });
    
    updateMentorMessage("Welcome to the CivitasVote security audit. Start by selecting a source code file to analyze. The color coding indicates risk levels - red files contain the most critical vulnerabilities.");
}

export function loadFileContent(fileId) {
    const file = fileData[fileId];
    if (!file) {
        console.error('File not found:', fileId);
        return null;
    }
    // Return a copy with vulnerabilities hidden until scan is performed
    return {
        ...file,
        vulnerabilitiesRevealed: false
    };
}

// Add function to reveal vulnerabilities after scan
export function revealFileVulnerabilities(fileId) {
    const file = fileData[fileId];
    if (file) {
        return {
            ...file,
            vulnerabilitiesRevealed: true
        };
    }
    return null;
}

export function updateProgress() {
    const totalFiles = Object.keys(fileData).length;
    const analyzedFiles = gameState.filesAnalyzed;
    const progressPercentage = (analyzedFiles / totalFiles) * 100;
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
        
        if (progressPercentage >= 100) {
            progressBar.className = 'bg-green-600 h-2 rounded-full transition-all duration-1000';
        } else if (progressPercentage >= 50) {
            progressBar.className = 'bg-blue-600 h-2 rounded-full transition-all duration-300';
        }
    }
    
    // Update file count
    const filesAnalyzedElement = document.getElementById('files-analyzed');
    if (filesAnalyzedElement) {
        filesAnalyzedElement.textContent = `${analyzedFiles}/${totalFiles}`;
    }
    
    // Update vulnerability count
    const vulnCountElement = document.getElementById('vuln-count');
    if (vulnCountElement) {
        vulnCountElement.textContent = `${gameState.vulnerabilitiesFound} found`;
    }
    
    // Update exploit count
    const exploitCountElement = document.getElementById('exploit-count');
    if (exploitCountElement) {
        exploitCountElement.textContent = gameState.exploitsRun.toString();
    }
    
    // Check for audit completion conditions - simplified without risk assessment
    if (analyzedFiles >= totalFiles && gameState.vulnerabilitiesFound > 0 && gameState.exploitsRun > 0) {
        // Enable report generation directly
        enableReportGeneration();
    }
}

function enableReportGeneration() {
    updateMentorMessage("All files analyzed and vulnerabilities confirmed. You can now generate a comprehensive security report for disclosure.");
    
    // Show completion notification without risk assessment panel
    showResultModal(
        '📋',
        'Analysis Complete',
        'Security audit findings ready for reporting.',
        `
            <div class="text-left space-y-3">
                <div class="bg-green-900/30 border border-green-600 rounded-lg p-3">
                    <div class="text-green-300 font-semibold">✅ Comprehensive Analysis Complete</div>
                    <div class="text-green-200 text-sm mt-1">
                        All critical components have been analyzed and vulnerabilities documented.
                    </div>
                </div>
                
                <div class="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3">
                    <div class="font-semibold text-yellow-300 mb-2">Critical Findings Summary</div>
                    <div class="text-yellow-200 text-sm space-y-1">
                        <div>• SQL injection allows complete database manipulation</div>
                        <div>• Authentication bypass enables mass voter impersonation</div>
                        <div>• Smart contract flaws permit permanent vote record corruption</div>
                        <div>• Frontend XSS vulnerabilities expose voter privacy</div>
                    </div>
                </div>
                
                <div class="bg-slate-800 border border-slate-600 rounded-lg p-3">
                    <div class="font-semibold text-white mb-2">Next Steps</div>
                    <div class="text-slate-300 text-sm">
                        Make your ethical disclosure decision to complete the audit.
                    </div>
                </div>
            </div>
        `
    );
    
    // Mark report as generated for completion conditions
    gameState.reportGenerated = true;
    updateGameMetrics();
}
