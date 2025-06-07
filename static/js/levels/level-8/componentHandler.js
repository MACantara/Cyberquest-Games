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
    return file;
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
    
    // Update current phase
    const currentPhaseElement = document.getElementById('current-phase');
    if (currentPhaseElement) {
        if (analyzedFiles === 0) {
            currentPhaseElement.textContent = 'Source Analysis';
        } else if (gameState.vulnerabilitiesFound === 0) {
            currentPhaseElement.textContent = 'Vulnerability Discovery';
        } else if (gameState.exploitsRun === 0) {
            currentPhaseElement.textContent = 'Exploit Testing';
        } else if (!gameState.disclosureDecisionMade) {
            currentPhaseElement.textContent = 'Ethical Decision';
        } else {
            currentPhaseElement.textContent = 'Audit Complete';
        }
    }
    
    // Check for audit completion conditions
    if (analyzedFiles >= totalFiles && gameState.vulnerabilitiesFound > 0 && gameState.exploitsRun > 0) {
        showRiskAssessment();
    }
}

function showRiskAssessment() {
    const riskAssessment = document.getElementById('risk-assessment');
    if (riskAssessment) {
        riskAssessment.classList.remove('hidden');
        
        const riskDetails = document.getElementById('risk-details');
        riskDetails.innerHTML = `
            <div class="space-y-3">
                <div class="bg-red-900/30 border border-red-600 rounded-lg p-3">
                    <div class="font-semibold text-red-300 mb-2">Critical Risk Assessment</div>
                    <div class="text-red-200 text-sm space-y-1">
                        <div>• SQL injection allows complete database manipulation</div>
                        <div>• Authentication bypass enables mass voter impersonation</div>
                        <div>• Smart contract flaws permit permanent vote record corruption</div>
                        <div>• Frontend XSS vulnerabilities expose voter privacy</div>
                    </div>
                </div>
                
                <div class="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3">
                    <div class="font-semibold text-yellow-300 mb-2">Democratic Impact</div>
                    <div class="text-yellow-200 text-sm">
                        These vulnerabilities collectively pose an existential threat to election integrity. 
                        Exploitation could undermine democratic processes and public trust in digital voting.
                    </div>
                </div>
                
                <div class="bg-slate-800 border border-slate-600 rounded-lg p-3">
                    <div class="font-semibold text-white mb-2">Recommended Action</div>
                    <div class="text-slate-300 text-sm">
                        Immediate responsible disclosure required. Election deployment must be delayed until critical vulnerabilities are patched.
                    </div>
                </div>
            </div>
        `;
        
        // Enable report generation
        document.getElementById('generate-report').disabled = false;
        document.getElementById('generate-report').addEventListener('click', generateSecurityReport);
    }
}

function generateSecurityReport() {
    updateMentorMessage("Generating comprehensive security report for responsible disclosure...");
    
    const reportBtn = document.getElementById('generate-report');
    reportBtn.disabled = true;
    reportBtn.innerHTML = '<i class="bi bi-hourglass-split mr-1 animate-spin"></i>Generating...';
    
    setTimeout(() => {
        reportBtn.innerHTML = '<i class="bi bi-check mr-1"></i>Report Ready';
        reportBtn.classList.add('bg-green-600');
        
        // Show completion notification
        showResultModal(
            '📋',
            'Security Report Generated',
            'Comprehensive audit report prepared for responsible disclosure.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-green-900/30 border border-green-600 rounded-lg p-3">
                        <div class="text-green-300 font-semibold">✅ Audit Documentation Complete</div>
                        <div class="text-green-200 text-sm mt-1">
                            Professional security report generated with:
                            <ul class="list-disc list-inside mt-2 space-y-1">
                                <li>Executive summary of critical findings</li>
                                <li>Technical vulnerability details</li>
                                <li>Proof-of-concept demonstrations</li>
                                <li>Risk assessment and impact analysis</li>
                                <li>Recommended remediation steps</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        );
        
        // Enable audit completion
        document.getElementById('complete-audit').disabled = false;
        document.getElementById('complete-audit').classList.remove('opacity-50', 'cursor-not-allowed');
        
        gameState.ethicalScore += 10;
        updateGameMetrics();
    }, 3000);
}
