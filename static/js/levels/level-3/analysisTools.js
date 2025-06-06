import { gameState, getMalwareDescription } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export function handleAnalysisTool(toolType) {
    const system = gameState.currentSystem;
    let results = '';
    let mentorMessage = '';

    gameState.analysisSteps[system.id][toolType] = true;

    switch(toolType) {
        case 'scan':
            if (system.status === 'infected') {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">🦠 Full Scan: THREATS DETECTED</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p><strong>Threat Type:</strong> ${system.malwareType.toUpperCase()}</p>
                            <p><strong>Infection Level:</strong> Critical</p>
                            <p><strong>Files Affected:</strong> 3 system files</p>
                            <p><strong>Recommendation:</strong> Immediate containment required</p>
                        </div>
                    </div>
                `;
                mentorMessage = `Confirmed ${system.malwareType} infection on ${system.name}. This type of malware ${getMalwareDescription(system.malwareType)}`;
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Full Scan: SYSTEM CLEAN</h6>
                        <p class="text-green-200 text-sm">No threats detected. System is secure.</p>
                    </div>
                `;
                mentorMessage = "System scan complete - no threats found. This terminal is clean.";
            }
            break;

        case 'processes':
            if (system.status === 'infected') {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">⚠️ Process Analysis: MALICIOUS ACTIVITY</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p>• Unauthorized network connections detected</p>
                            <p>• Suspicious memory allocation patterns</p>
                            <p>• Process injection attempts identified</p>
                            <p>• ${system.malwareType === 'spyware' ? 'Keylogging activity detected' : 'File encryption processes running'}</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Process analysis confirms malicious activity. The malware is actively running and needs immediate termination.";
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Process Analysis: NORMAL ACTIVITY</h6>
                        <p class="text-green-200 text-sm">All processes operating within normal parameters.</p>
                    </div>
                `;
                mentorMessage = "All processes look normal - no signs of malicious activity.";
            }
            break;

        case 'network':
            if (system.status === 'infected') {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">🌐 Network Analysis: SUSPICIOUS TRAFFIC</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p><strong>Outbound Connections:</strong> 15 unknown IPs</p>
                            <p><strong>Data Exfiltration:</strong> 2.3 MB uploaded</p>
                            <p><strong>C&C Communication:</strong> Detected</p>
                            <p><strong>Port Scanning:</strong> Active</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Critical! The system is communicating with command & control servers. Data is being stolen right now!";
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Network Analysis: NORMAL TRAFFIC</h6>
                        <p class="text-green-200 text-sm">Network activity within expected parameters.</p>
                    </div>
                `;
                mentorMessage = "Network traffic looks normal - no suspicious connections detected.";
            }
            break;

        case 'sandbox':
            if (system.status === 'infected') {
                results = `
                    <div class="bg-red-900 border border-red-600 rounded p-3">
                        <h6 class="text-red-300 font-semibold mb-2">🧪 Sandbox Test: MALWARE CONFIRMED</h6>
                        <div class="text-red-200 text-sm space-y-1">
                            <p><strong>Behavior:</strong> File encryption, registry modification</p>
                            <p><strong>Persistence:</strong> Creates startup entries</p>
                            <p><strong>Propagation:</strong> Network scanning enabled</p>
                            <p><strong>Damage Potential:</strong> High</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Sandbox analysis confirms this is highly dangerous malware. It's designed to spread and cause maximum damage.";
            } else {
                results = `
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h6 class="text-green-300 font-semibold mb-2">✅ Sandbox Test: SAFE</h6>
                        <p class="text-green-200 text-sm">No malicious behavior detected in isolated environment.</p>
                    </div>
                `;
                mentorMessage = "Sandbox test complete - all files are safe to execute.";
            }
            break;
    }

    // Add results to analysis panel
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML += results;
    document.getElementById('analysis-results').classList.remove('hidden');
    
    updateMentorMessage(mentorMessage);
    
    // Check if enough analysis completed
    if (Object.keys(gameState.analysisSteps[system.id]).length >= 2) {
        showResponsePanel();
    }
}

export function showResponsePanel() {
    document.getElementById('response-panel').classList.remove('hidden');
    updateMentorMessage("Analysis complete. Now choose your containment strategy. Consider the malware type and system importance.");
}
