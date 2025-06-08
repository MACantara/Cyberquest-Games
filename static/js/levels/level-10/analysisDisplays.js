import { evidenceDatabase, suspects } from './dataLoader.js';
import { gameState, updateGameMetrics, updateConfidenceMeters } from './gameState.js';
import { setupEvidenceCollection } from './evidenceHandler.js';
import { updateArgusMessage } from './uiUpdates.js';

export function displayLogAnalysis() {
    const content = document.getElementById('analysis-content');
    const title = document.getElementById('analysis-title');
    
    title.textContent = 'System Access Logs Analysis';
    
    content.innerHTML = `
        <div class="space-y-3">
            <div class="bg-blue-900/30 border border-blue-500 rounded p-3 mb-4">
                <div class="text-blue-300 font-semibold mb-2">📋 Log Analysis Overview</div>
                <div class="text-blue-200 text-sm">
                    Analyzing SSH access logs, authentication records, and system events for suspicious patterns.
                    Click on entries to collect evidence for your investigation.
                </div>
            </div>
            
            ${evidenceDatabase.logs.map(log => `
                <div class="log-entry bg-gray-700 rounded p-4 cursor-pointer hover:bg-gray-600 transition ${log.indicator ? 'border-l-4 border-red-400 bg-red-900/20' : ''}" 
                     data-evidence="${log.id}">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-white font-semibold">${log.type}</span>
                        <span class="text-gray-400 text-xs font-mono">${log.timestamp}</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-2">${log.description}</p>
                    <div class="text-gray-400 text-xs">${log.details}</div>
                    ${log.indicator ? '<div class="text-red-400 text-xs mt-2 font-semibold">⚠️ Suspicious Activity Detected</div>' : ''}
                    ${log.suspectLink ? `<div class="text-yellow-400 text-xs mt-1">🎯 Links to: ${suspects[log.suspectLink].name}</div>` : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    // Show action buttons
    document.getElementById('collect-evidence').classList.remove('hidden');
    document.getElementById('analyze-deeper').classList.remove('hidden');
    
    setupEvidenceCollection('logs');
    updateArgusMessage("Log analysis reveals multiple security incidents. The timing patterns suggest coordinated insider activity. Look for correlations between different log entries.");
}

export function displayHashAnalysis() {
    const content = document.getElementById('analysis-content');
    const title = document.getElementById('analysis-title');
    
    title.textContent = 'File Hash Verification';
    
    content.innerHTML = `
        <div class="space-y-3">
            <div class="bg-green-900/30 border border-green-500 rounded p-3 mb-4">
                <div class="text-green-300 font-semibold mb-2">🔒 Hash Verification Process</div>
                <div class="text-green-200 text-sm">
                    Comparing file hashes against known good values to detect tampering, malware, or unauthorized modifications.
                    MD5 and SHA256 checksums provide integrity verification.
                </div>
            </div>
            
            ${evidenceDatabase.hashes.map(hash => `
                <div class="hash-entry bg-gray-700 rounded p-4 cursor-pointer hover:bg-gray-600 transition ${hash.indicator ? 'border-l-4 border-red-400 bg-red-900/20' : ''}" 
                     data-evidence="${hash.id}">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-white font-semibold">${hash.file}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-xs px-2 py-1 rounded ${
                                hash.status === 'MALICIOUS' ? 'bg-red-600 text-white' : 
                                hash.status === 'MODIFIED' ? 'bg-yellow-600 text-white' : 
                                'bg-green-600 text-white'
                            }">${hash.status}</span>
                        </div>
                    </div>
                    <div class="text-gray-300 text-sm mb-2">${hash.description}</div>
                    <div class="bg-black/30 rounded p-2 mb-2">
                        <div class="text-gray-400 text-xs font-mono break-all">Hash: ${hash.hash}</div>
                        ${hash.originalHash ? `<div class="text-gray-500 text-xs font-mono break-all">Expected: ${hash.originalHash}</div>` : ''}
                    </div>
                    ${hash.details ? `<div class="text-gray-400 text-xs">${hash.details}</div>` : ''}
                    ${hash.indicator ? '<div class="text-red-400 text-xs mt-2 font-semibold">⚠️ File Integrity Compromised</div>' : ''}
                    ${hash.suspectLink ? `<div class="text-yellow-400 text-xs mt-1">🎯 Links to: ${suspects[hash.suspectLink].name}</div>` : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('collect-evidence').classList.remove('hidden');
    document.getElementById('analyze-deeper').classList.remove('hidden');
    
    setupEvidenceCollection('hash');
    updateArgusMessage("Hash verification reveals file tampering. The modified research data and malicious tools indicate a sophisticated insider threat with advanced technical knowledge.");
}

export function displayMetadataAnalysis() {
    const content = document.getElementById('analysis-content');
    const title = document.getElementById('analysis-title');
    
    title.textContent = 'File Metadata Extraction';
    
    content.innerHTML = `
        <div class="space-y-3">
            <div class="bg-purple-900/30 border border-purple-500 rounded p-3 mb-4">
                <div class="text-purple-300 font-semibold mb-2">📄 Metadata Analysis</div>
                <div class="text-purple-200 text-sm">
                    Extracting hidden metadata from files including EXIF data, author information, creation timestamps, 
                    and modification history to build a timeline of activities.
                </div>
            </div>
            
            ${evidenceDatabase.metadata.map(meta => `
                <div class="metadata-entry bg-gray-700 rounded p-4 cursor-pointer hover:bg-gray-600 transition ${meta.indicator ? 'border-l-4 border-red-400 bg-red-900/20' : ''}" 
                     data-evidence="${meta.id}">
                    <div class="flex justify-between items-start mb-3">
                        <span class="text-white font-semibold">${meta.file}</span>
                        <span class="text-xs px-2 py-1 bg-purple-600 text-white rounded">${meta.type}</span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 text-xs mb-3">
                        ${meta.author ? `
                            <div class="bg-black/30 rounded p-2">
                                <span class="text-gray-400">Author:</span> 
                                <span class="text-white font-semibold">${meta.author}</span>
                            </div>
                        ` : ''}
                        ${meta.created ? `
                            <div class="bg-black/30 rounded p-2">
                                <span class="text-gray-400">Created:</span> 
                                <span class="text-white">${meta.created}</span>
                            </div>
                        ` : ''}
                        ${meta.modified ? `
                            <div class="bg-black/30 rounded p-2">
                                <span class="text-gray-400">Modified:</span> 
                                <span class="text-white">${meta.modified}</span>
                            </div>
                        ` : ''}
                        ${meta.camera ? `
                            <div class="bg-black/30 rounded p-2">
                                <span class="text-gray-400">Camera:</span> 
                                <span class="text-white">${meta.camera}</span>
                            </div>
                        ` : ''}
                        ${meta.location ? `
                            <div class="bg-black/30 rounded p-2 col-span-2">
                                <span class="text-gray-400">Location:</span> 
                                <span class="text-white">${meta.location}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="text-gray-300 text-sm">${meta.description}</div>
                    ${meta.details ? `<div class="text-gray-400 text-xs mt-2">${meta.details}</div>` : ''}
                    ${meta.indicator ? '<div class="text-red-400 text-xs mt-2 font-semibold">⚠️ Suspicious Metadata Pattern</div>' : ''}
                    ${meta.suspectLink ? `<div class="text-yellow-400 text-xs mt-1">🎯 Links to: ${suspects[meta.suspectLink].name}</div>` : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('collect-evidence').classList.remove('hidden');
    document.getElementById('analyze-deeper').classList.remove('hidden');
    
    setupEvidenceCollection('metadata');
    updateArgusMessage("Metadata analysis reveals concerning patterns. Document modifications after submission dates and unauthorized server room access suggest premeditated insider activity.");
}

export function displayTimelineAnalysis() {
    const content = document.getElementById('analysis-content');
    const title = document.getElementById('analysis-title');
    
    title.textContent = 'Timeline Reconstruction';
    
    content.innerHTML = `
        <div class="space-y-4">
            <div class="bg-orange-900/30 border border-orange-500 rounded p-3 mb-4">
                <div class="text-orange-300 font-semibold mb-2">⏱️ Chronological Analysis</div>
                <div class="text-orange-200 text-sm">
                    Reconstructing the sequence of events leading to and during the security breach. 
                    Timeline analysis helps identify patterns and coordination between activities.
                </div>
            </div>
            
            ${evidenceDatabase.timeline.map(timeline => `
                <div class="timeline-section bg-gray-700 rounded p-4 cursor-pointer hover:bg-gray-600 transition border-l-4 border-orange-400" 
                     data-evidence="${timeline.id}">
                    <h5 class="text-white font-semibold mb-3">${timeline.title}</h5>
                    <p class="text-gray-300 text-sm mb-4">${timeline.description}</p>
                    
                    <div class="space-y-3">
                        ${timeline.events.map((event, index) => `
                            <div class="timeline-event flex items-start gap-3 p-3 rounded ${
                                event.significance.includes('breach') || event.significance.includes('exfiltration') ? 
                                'bg-red-900/30 border border-red-600' : 
                                event.significance.includes('motive') || event.significance.includes('preparation') ?
                                'bg-yellow-900/30 border border-yellow-600' :
                                'bg-gray-600/30 border border-gray-500'
                            }">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    event.significance.includes('breach') || event.significance.includes('exfiltration') ? 
                                    'bg-red-500 text-white' : 
                                    event.significance.includes('motive') || event.significance.includes('preparation') ?
                                    'bg-yellow-500 text-black' :
                                    'bg-blue-500 text-white'
                                }">
                                    ${index + 1}
                                </div>
                                <div class="flex-1">
                                    <div class="text-white text-sm font-semibold">${event.time}</div>
                                    <div class="text-gray-300 text-sm">${event.event}</div>
                                    <div class="text-gray-400 text-xs mt-1 italic">${event.significance}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="text-orange-400 text-xs mt-3 font-semibold">📊 Critical Evidence Pattern</div>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('collect-evidence').classList.remove('hidden');
    document.getElementById('analyze-deeper').classList.remove('hidden');
    
    // Automatically collect timeline evidence as it's highly significant
    gameState.evidenceCollected += 2;
    gameState.truthIndicators += 3;
    gameState.timelineAnalyzed = true;
    
    updateGameMetrics();
    updateArgusMessage("Timeline reconstruction reveals a sophisticated, coordinated attack. The sequence strongly suggests insider knowledge and premeditation. Dr. Reeves' dismissal appears to be the triggering event.");
}

export function displayTrafficAnalysis() {
    const content = document.getElementById('analysis-content');
    const title = document.getElementById('analysis-title');
    
    title.textContent = 'Network Traffic Analysis';
    
    content.innerHTML = `
        <div class="space-y-4">
            <div class="bg-teal-900/30 border border-teal-500 rounded p-3 mb-4">
                <div class="text-teal-300 font-semibold mb-2">🌐 Network Flow Analysis</div>
                <div class="text-teal-200 text-sm">
                    Analyzing network connections, data flows, and communication patterns to identify 
                    unauthorized transfers and external command & control channels.
                </div>
            </div>
            
            ${evidenceDatabase.traffic.map(traffic => `
                <div class="traffic-analysis bg-gray-700 rounded p-4 border-l-4 border-teal-400">
                    <div class="text-white font-semibold mb-3">${traffic.type}</div>
                    <div class="text-gray-300 text-sm mb-4">${traffic.description}</div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-black/30 rounded p-3">
                            <div class="text-gray-400 text-xs mb-1">Source IP</div>
                            <div class="text-white font-mono text-sm">${traffic.sourceIP}</div>
                            <div class="text-gray-400 text-xs mt-1">Dr. Reeves' Workstation</div>
                        </div>
                        <div class="bg-black/30 rounded p-3">
                            <div class="text-gray-400 text-xs mb-1">Destination IP</div>
                            <div class="text-white font-mono text-sm">${traffic.destinationIP}</div>
                            <div class="text-gray-400 text-xs mt-1">Tor Exit Node</div>
                        </div>
                        <div class="bg-black/30 rounded p-3">
                            <div class="text-gray-400 text-xs mb-1">Protocol</div>
                            <div class="text-white font-semibold">${traffic.protocol}</div>
                        </div>
                        <div class="bg-black/30 rounded p-3">
                            <div class="text-gray-400 text-xs mb-1">Data Volume</div>
                            <div class="text-red-400 font-semibold">${traffic.volume}</div>
                        </div>
                    </div>
                    
                    <div class="bg-red-900/30 border border-red-600 rounded p-3">
                        <div class="text-red-300 font-semibold mb-2">🚨 Anomaly Detection</div>
                        <div class="text-red-200 text-sm">${traffic.details}</div>
                        <div class="text-red-400 text-xs mt-2 font-semibold">⚠️ Unauthorized Data Exfiltration Confirmed</div>
                    </div>
                    
                    ${traffic.suspectLink ? `<div class="text-yellow-400 text-xs mt-3">🎯 Direct link to: ${suspects[traffic.suspectLink].name}</div>` : ''}
                </div>
            `).join('')}
            
            <div class="bg-gray-800 border border-gray-600 rounded p-4">
                <div class="text-white font-semibold mb-2">📊 Traffic Pattern Analysis</div>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Peak Transfer Time:</span>
                        <span class="text-white">02:47 - 04:43 (Off-hours)</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Encryption Level:</span>
                        <span class="text-yellow-400">Military-grade (Suspicious)</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Routing Method:</span>
                        <span class="text-red-400">Tor Network (Anonymization)</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Operational Security:</span>
                        <span class="text-red-400">Advanced (Professional level)</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Traffic analysis is definitive evidence
    gameState.evidenceCollected += 1;
    gameState.truthIndicators += 2;
    gameState.suspectConfidence.dr += 25; // Strong link to Dr. Reeves
    gameState.trafficAnalyzed = true;
    
    updateGameMetrics();
    updateConfidenceMeters();
    updateArgusMessage("Network analysis provides definitive proof. Dr. Reeves' workstation was the source of the data exfiltration. The use of Tor routing indicates sophisticated operational security knowledge.");
}

// Helper function to enable evidence collection buttons based on analysis type
export function enableEvidenceActions(analysisType) {
    const collectBtn = document.getElementById('collect-evidence');
    const analyzeBtn = document.getElementById('analyze-deeper');
    
    if (collectBtn) {
        collectBtn.onclick = () => {
            // Collect all visible evidence of this type
            document.querySelectorAll(`[data-evidence]`).forEach(item => {
                if (!item.classList.contains('opacity-50')) {
                    item.click();
                }
            });
        };
    }
    
    if (analyzeBtn) {
        analyzeBtn.onclick = () => {
            showDeepAnalysis(analysisType);
        };
    }
}

function showDeepAnalysis(analysisType) {
    const analysisResults = {
        logs: "Deep log analysis reveals consistent patterns pointing to Dr. Reeves as the primary actor. The timing, access patterns, and privilege escalation sequence indicates intimate system knowledge.",
        hash: "File integrity analysis confirms tampering of research data. The modification signatures match Dr. Reeves' known research interests and access patterns.",
        metadata: "Metadata correlation confirms Dr. Reeves' involvement through document authorship, file access timestamps, and location data matching his known access privileges.",
        timeline: "Timeline correlation analysis shows Dr. Reeves had motive (dismissal), means (system knowledge), and opportunity (retained access) for the breach.",
        traffic: "Network flow analysis provides definitive proof of data exfiltration from Dr. Reeves' workstation to external Tor endpoints."
    };
    
    updateArgusMessage(analysisResults[analysisType] || "Deep analysis complete. Evidence patterns are becoming clear.");
}
