import { gameState, incrementAnalysisCounter, updateGameMetrics } from './gameState.js';
import { displayLogAnalysis, displayHashAnalysis, displayMetadataAnalysis, displayTimelineAnalysis, displayTrafficAnalysis } from './analysisDisplays.js';
import { updateArgusMessage, createNotification } from './uiUpdates.js';

let activeToolType = null;
let toolCooldowns = {};

export function initializeForensicsTools() {
    // Add click handlers to all forensics tool buttons
    document.querySelectorAll('.forensic-tool').forEach(button => {
        button.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            activateForensicsTool(toolType);
        });
    });
    
    // Evidence collection button
    const collectBtn = document.getElementById('collect-evidence');
    if (collectBtn) {
        collectBtn.addEventListener('click', () => {
            collectAllVisibleEvidence();
        });
    }
    
    // Deep analysis button
    const analyzeBtn = document.getElementById('analyze-deeper');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            performDeepAnalysis();
        });
    }
    
    console.log('Forensics tools initialized');
}

export function activateForensicsTool(toolType) {
    // Check if tool is on cooldown
    if (isToolOnCooldown(toolType)) {
        const remainingTime = Math.ceil((toolCooldowns[toolType] - Date.now()) / 1000);
        createNotification(`${getToolName(toolType)} on cooldown for ${remainingTime}s`, 'warning');
        return;
    }
    
    // Update active tool state
    activeToolType = toolType;
    
    // Update tool button states
    updateToolButtonStates(toolType);
    
    // Increment analysis counter and add cooldown
    incrementAnalysisCounter(toolType);
    setToolCooldown(toolType);
    
    // Display appropriate analysis based on tool type
    switch (toolType) {
        case 'logs':
            displayLogAnalysis();
            updateArgusMessage("Log analysis initiated. Examining SSH access logs, authentication records, and system events. Look for patterns indicating insider activity or privilege escalation.");
            break;
        case 'hash':
            displayHashAnalysis();
            updateArgusMessage("Hash verification in progress. Comparing file checksums against known good values to detect tampering or malicious modifications.");
            break;
        case 'metadata':
            displayMetadataAnalysis();
            updateArgusMessage("Metadata extraction active. Analyzing file headers, EXIF data, and modification timestamps to build a comprehensive timeline of activities.");
            break;
        case 'timeline':
            displayTimelineAnalysis();
            updateArgusMessage("Timeline reconstruction engaged. Correlating events across multiple data sources to identify the sequence of the security breach.");
            break;
        case 'traffic':
            displayTrafficAnalysis();
            updateArgusMessage("Network traffic analysis running. Examining data flows and connection patterns to identify unauthorized transfers and command channels.");
            break;
        default:
            console.error('Unknown tool type:', toolType);
            createNotification('Unknown forensics tool', 'error');
            return;
    }
    
    // Show evidence collection controls
    showEvidenceControls();
    
    // Provide tool-specific guidance
    provideToolGuidance(toolType);
    
    // Update game metrics
    updateGameMetrics();
    
    console.log(`Activated forensics tool: ${toolType}`);
}

function updateToolButtonStates(activeToolType) {
    // Remove active state from all tools
    document.querySelectorAll('.forensic-tool').forEach(btn => {
        btn.classList.remove('opacity-75', 'ring-2', 'ring-cyan-400', 'bg-cyan-900/30');
        btn.classList.add('hover:opacity-80');
    });
    
    // Add active state to current tool
    const activeButton = document.querySelector(`[data-tool="${activeToolType}"]`);
    if (activeButton) {
        activeButton.classList.add('opacity-75', 'ring-2', 'ring-cyan-400', 'bg-cyan-900/30');
        activeButton.classList.remove('hover:opacity-80');
    }
}

function showEvidenceControls() {
    const collectBtn = document.getElementById('collect-evidence');
    const analyzeBtn = document.getElementById('analyze-deeper');
    
    if (collectBtn) {
        collectBtn.classList.remove('hidden');
        collectBtn.disabled = false;
    }
    
    if (analyzeBtn) {
        analyzeBtn.classList.remove('hidden');
        analyzeBtn.disabled = false;
    }
}

function provideToolGuidance(toolType) {
    const guidance = {
        logs: "Focus on timestamp patterns, user access sequences, and privilege escalation events. Look for after-hours activity and unusual login locations.",
        hash: "Check for modified critical files, especially research data and system executables. Compare hash values against baseline signatures.",
        metadata: "Examine file creation dates, author information, and location data. Look for documents modified after their supposed creation dates.",
        timeline: "Correlate events across different evidence types. Look for causal relationships and patterns that suggest coordinated activity.",
        traffic: "Analyze data flow volumes, destination IPs, and encryption patterns. Look for large transfers to external networks, especially through anonymization services."
    };
    
    setTimeout(() => {
        updateArgusMessage(guidance[toolType] || "Continue your forensics analysis and collect evidence to build your case.");
    }, 3000);
}

function setToolCooldown(toolType) {
    const cooldownTimes = {
        logs: 5000,      // 5 seconds
        hash: 7000,      // 7 seconds
        metadata: 6000,  // 6 seconds
        timeline: 10000, // 10 seconds
        traffic: 8000    // 8 seconds
    };
    
    const cooldownTime = cooldownTimes[toolType] || 5000;
    toolCooldowns[toolType] = Date.now() + cooldownTime;
    
    // Update button to show cooldown
    const button = document.querySelector(`[data-tool="${toolType}"]`);
    if (button) {
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
        
        // Start cooldown countdown
        const originalText = button.querySelector('.tool-name')?.textContent || button.textContent;
        let remainingTime = Math.ceil(cooldownTime / 1000);
        
        const cooldownInterval = setInterval(() => {
            if (button.querySelector('.tool-name')) {
                button.querySelector('.tool-name').textContent = `${originalText} (${remainingTime}s)`;
            } else {
                button.textContent = `${originalText} (${remainingTime}s)`;
            }
            
            remainingTime--;
            
            if (remainingTime <= 0) {
                clearInterval(cooldownInterval);
                button.disabled = false;
                button.classList.remove('opacity-50', 'cursor-not-allowed');
                
                if (button.querySelector('.tool-name')) {
                    button.querySelector('.tool-name').textContent = originalText;
                } else {
                    button.textContent = originalText;
                }
            }
        }, 1000);
    }
}

function isToolOnCooldown(toolType) {
    return toolCooldowns[toolType] && Date.now() < toolCooldowns[toolType];
}

function getToolName(toolType) {
    const toolNames = {
        logs: 'Log Analysis',
        hash: 'Hash Verification',
        metadata: 'Metadata Extraction',
        timeline: 'Timeline Reconstruction',
        traffic: 'Traffic Analysis'
    };
    return toolNames[toolType] || 'Forensics Tool';
}

function collectAllVisibleEvidence() {
    const evidenceElements = document.querySelectorAll('[data-evidence]:not(.opacity-50)');
    let collected = 0;
    
    evidenceElements.forEach(element => {
        const evidenceId = element.dataset.evidence;
        if (!gameState.evidenceBoard.includes(evidenceId)) {
            element.click();
            collected++;
        }
    });
    
    if (collected > 0) {
        createNotification(`Collected ${collected} pieces of evidence`, 'success');
        updateArgusMessage(`Evidence collection sweep complete. ${collected} new pieces of evidence added to your case file. Review confidence levels and continue analysis.`);
    } else {
        createNotification('All visible evidence already collected', 'info');
        updateArgusMessage("All available evidence from this analysis has been collected. Try using different forensics tools to uncover additional evidence.");
    }
}

function performDeepAnalysis() {
    if (!activeToolType) {
        createNotification('Select a forensics tool first', 'warning');
        return;
    }
    
    // Add small delay to simulate processing
    const analyzeBtn = document.getElementById('analyze-deeper');
    if (analyzeBtn) {
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="bi bi-hourglass-split mr-1"></i> Analyzing...';
        
        setTimeout(() => {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="bi bi-cpu mr-1"></i> Deep Analysis';
        }, 2000);
    }
    
    const deepAnalysisResults = {
        logs: {
            message: "Deep log correlation reveals sophisticated attack patterns. Multiple privilege escalation attempts followed by data access during off-hours. The attack signature matches advanced persistent threat methodologies.",
            insights: [
                "SSH session duration anomalies detected",
                "Privilege escalation followed by immediate data access",
                "Attack timing suggests intimate knowledge of security protocols",
                "Source IP traces to Dr. Reeves' registered workstation"
            ]
        },
        hash: {
            message: "Cryptographic analysis confirms systematic file tampering. Modified files show consistent timestamp patterns and digital signatures pointing to a single actor with administrative access.",
            insights: [
                "Research data archives show unauthorized modifications",
                "File integrity compromised using administrative tools",
                "Modification timestamps cluster around Dr. Reeves' access windows",
                "Digital signatures match known administrative user certificates"
            ]
        },
        metadata: {
            message: "Metadata correlation reveals premeditated activity. Document creation patterns and location data provide strong attribution evidence linking to a specific user profile.",
            insights: [
                "Document authorship metadata directly attributes to Dr. Reeves",
                "File access patterns match his historical usage behaviors",
                "Location data confirms access from his known workstations",
                "Timestamp analysis reveals deliberate operational security practices"
            ]
        },
        timeline: {
            message: "Timeline reconstruction establishes clear motive, means, and opportunity. The sequence of events strongly suggests insider knowledge and long-term planning following a triggering incident.",
            insights: [
                "Dr. Reeves' dismissal serves as the operational catalyst",
                "Extended planning phase demonstrates sophisticated approach",
                "Attack execution timing minimizes detection probability",
                "Operational security measures indicate professional expertise"
            ]
        },
        traffic: {
            message: "Network forensics provides definitive attribution. Traffic analysis reveals direct data exfiltration from Dr. Reeves' workstation to external command and control infrastructure.",
            insights: [
                "Source attribution to Dr. Reeves' registered IP address",
                "Advanced anonymization techniques using Tor network",
                "Data volume and timing consistent with research archive theft",
                "Encryption patterns match sophisticated threat actor methodologies"
            ]
        }
    };
    
    const result = deepAnalysisResults[activeToolType];
    if (result) {
        updateArgusMessage(result.message);
        
        // Show detailed analysis modal
        showDeepAnalysisModal(getToolName(activeToolType), result);
        
        // Boost evidence scores for deep analysis
        gameState.truthScore += 15;
        updateGameMetrics();
        
        createNotification('Deep analysis complete - additional insights revealed', 'success');
    } else {
        updateArgusMessage("Deep analysis protocols require an active forensics tool. Select a tool first, then perform deep analysis for enhanced insights.");
    }
}

function showDeepAnalysisModal(toolName, result) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-60';
    modal.innerHTML = `
        <div class="bg-slate-800 rounded-lg p-6 max-w-2xl mx-4 border border-slate-600">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-white">Deep Analysis: ${toolName}</h3>
                <button class="text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div class="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                    <div class="text-blue-300 font-semibold mb-2">Analysis Summary</div>
                    <div class="text-blue-200 text-sm">${result.message}</div>
                </div>
                
                <div class="bg-gray-700 rounded-lg p-4">
                    <div class="text-white font-semibold mb-3">Key Insights</div>
                    <div class="space-y-2">
                        ${result.insights.map(insight => `
                            <div class="flex items-start gap-2 text-sm">
                                <i class="bi bi-arrow-right text-cyan-400 mt-0.5 flex-shrink-0"></i>
                                <span class="text-gray-300">${insight}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="bg-green-900/30 border border-green-600 rounded-lg p-3">
                    <div class="text-green-300 text-sm font-semibold">
                        <i class="bi bi-check-circle mr-1"></i>
                        Analysis confidence increased by 15 points
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove after 10 seconds or on click outside
    setTimeout(() => {
        if (modal.parentElement) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    }, 10000);
}

export function getActiveToolType() {
    return activeToolType;
}

export function resetToolStates() {
    activeToolType = null;
    toolCooldowns = {};
    
    // Reset all tool button states
    document.querySelectorAll('.forensic-tool').forEach(btn => {
        btn.classList.remove('opacity-75', 'ring-2', 'ring-cyan-400', 'bg-cyan-900/30');
        btn.classList.add('hover:opacity-80');
        btn.disabled = false;
    });
    
    // Hide evidence controls
    const collectBtn = document.getElementById('collect-evidence');
    const analyzeBtn = document.getElementById('analyze-deeper');
    
    if (collectBtn) collectBtn.classList.add('hidden');
    if (analyzeBtn) analyzeBtn.classList.add('hidden');
}

export function enableToolShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only activate shortcuts if no input field is focused
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }
        
        const shortcuts = {
            '1': 'logs',
            '2': 'hash', 
            '3': 'metadata',
            '4': 'timeline',
            '5': 'traffic'
        };
        
        if (shortcuts[e.key] && !isToolOnCooldown(shortcuts[e.key])) {
            e.preventDefault();
            activateForensicsTool(shortcuts[e.key]);
            createNotification(`Activated ${getToolName(shortcuts[e.key])} via keyboard shortcut`, 'info', 2000);
        }
    });
}

// Tool effectiveness tracking
export function getToolEffectiveness(toolType) {
    const effectiveness = {
        logs: 0.85,      // High effectiveness for insider threats
        hash: 0.75,      // Good for detecting tampering
        metadata: 0.80,  // Excellent for attribution
        timeline: 0.90,  // Critical for understanding sequence
        traffic: 0.95    // Definitive for data exfiltration proof
    };
    
    return effectiveness[toolType] || 0.5;
}

export function getToolUsageStatistics() {
    const stats = {
        totalToolsUsed: Object.values(gameState.toolsUsed).filter(used => used).length,
        mostEffectiveTool: 'traffic',
        analysisDepth: gameState.truthScore,
        evidenceQuality: gameState.truthIndicators / Math.max(1, gameState.evidenceCollected),
        investigationCompleteness: Math.min(100, (gameState.evidenceCollected / 15) * 100)
    };
    
    return stats;
}
