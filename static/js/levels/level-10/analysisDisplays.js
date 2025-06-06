import { evidenceDatabase } from './dataLoader.js';
import { gameState, updateGameMetrics, updateConfidenceMeters } from './gameState.js';
import { setupEvidenceCollection } from './evidenceHandler.js';
import { updateArgusMessage } from './uiUpdates.js';

export function displayLogAnalysis() {
    const content = document.getElementById('analysis-content');
    content.innerHTML = `
        <div class="space-y-3">
            <h5 class="text-cyan-300 font-semibold">System Access Logs</h5>
            ${evidenceDatabase.logs.map(log => `
                <div class="log-entry bg-gray-700 rounded p-3 cursor-pointer hover:bg-gray-600 transition ${log.indicator ? 'border-l-4 border-red-400' : ''}" 
                     data-evidence="${log.id}">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-white font-semibold">${log.type}</span>
                        <span class="text-gray-400 text-xs">${log.timestamp}</span>
                    </div>
                    <p class="text-gray-300 text-sm">${log.description}</p>
                    ${log.indicator ? '<div class="text-red-400 text-xs mt-1">⚠️ Anomaly detected</div>' : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    setupEvidenceCollection('logs');
}

export function displayHashAnalysis() {
    const content = document.getElementById('analysis-content');
    content.innerHTML = `
        <div class="space-y-3">
            <h5 class="text-cyan-300 font-semibold">File Hash Verification</h5>
            ${evidenceDatabase.hashes.map(hash => `
                <div class="hash-entry bg-gray-700 rounded p-3 cursor-pointer hover:bg-gray-600 transition ${hash.indicator ? 'border-l-4 border-red-400' : ''}" 
                     data-evidence="${hash.id}">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-white font-semibold">${hash.file}</span>
                        <span class="text-${hash.status === 'MALICIOUS' ? 'red' : hash.status === 'MODIFIED' ? 'yellow' : 'green'}-400 text-xs">${hash.status}</span>
                    </div>
                    <p class="text-gray-400 text-xs font-mono">${hash.hash}</p>
                    ${hash.indicator ? '<div class="text-red-400 text-xs mt-1">⚠️ Threat detected</div>' : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    setupEvidenceCollection('hash');
}

export function displayMetadataAnalysis() {
    const content = document.getElementById('analysis-content');
    content.innerHTML = `
        <div class="space-y-3">
            <h5 class="text-cyan-300 font-semibold">File Metadata Analysis</h5>
            ${evidenceDatabase.metadata.map(meta => `
                <div class="metadata-entry bg-gray-700 rounded p-3 cursor-pointer hover:bg-gray-600 transition ${meta.indicator ? 'border-l-4 border-red-400' : ''}" 
                     data-evidence="${meta.id}">
                    <div class="text-white font-semibold mb-2">${meta.file}</div>
                    <div class="space-y-1 text-xs">
                        ${meta.author ? `<div><span class="text-gray-400">Author:</span> <span class="text-white">${meta.author}</span></div>` : ''}
                        ${meta.created ? `<div><span class="text-gray-400">Created:</span> <span class="text-white">${meta.created}</span></div>` : ''}
                        ${meta.modified ? `<div><span class="text-gray-400">Modified:</span> <span class="text-white">${meta.modified}</span></div>` : ''}
                        ${meta.camera ? `<div><span class="text-gray-400">Camera:</span> <span class="text-white">${meta.camera}</span></div>` : ''}
                        ${meta.location ? `<div><span class="text-gray-400">Location:</span> <span class="text-white">${meta.location}</span></div>` : ''}
                        ${meta.sender ? `<div><span class="text-gray-400">Sender:</span> <span class="text-white">${meta.sender}</span></div>` : ''}
                    </div>
                    ${meta.indicator ? '<div class="text-red-400 text-xs mt-1">⚠️ Suspicious metadata</div>' : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    setupEvidenceCollection('metadata');
}

export function displayTimelineAnalysis() {
    const content = document.getElementById('analysis-content');
    content.innerHTML = `
        <div class="space-y-3">
            <h5 class="text-cyan-300 font-semibold">Timeline Reconstruction</h5>
            <div class="bg-gray-700 rounded p-3">
                <div class="space-y-2">
                    <div class="timeline-event flex items-center gap-3 p-2 rounded bg-gray-600">
                        <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                        <div class="flex-1">
                            <div class="text-white text-sm">23:15:22 - Multiple failed login attempts</div>
                            <div class="text-gray-400 text-xs">Target: Marcus Chen account</div>
                        </div>
                    </div>
                    <div class="timeline-event flex items-center gap-3 p-2 rounded bg-red-900">
                        <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div class="flex-1">
                            <div class="text-white text-sm">02:47:33 - Unusual late-night access</div>
                            <div class="text-red-300 text-xs">Dr. Reeves account - Outside normal hours</div>
                        </div>
                    </div>
                    <div class="timeline-event flex items-center gap-3 p-2 rounded bg-red-900">
                        <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div class="flex-1">
                            <div class="text-white text-sm">03:22:18 - Privilege escalation</div>
                            <div class="text-red-300 text-xs">Unauthorized root access obtained</div>
                        </div>
                    </div>
                    <div class="timeline-event flex items-center gap-3 p-2 rounded bg-red-900">
                        <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div class="flex-1">
                            <div class="text-white text-sm">04:15:45 - Data exfiltration</div>
                            <div class="text-red-300 text-xs">Large file transfer to external server</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    gameState.logsAnalyzed++;
    gameState.truthIndicators += 2;
    updateGameMetrics();
    updateArgusMessage("Timeline clearly shows a coordinated attack. The late-night access pattern points to someone familiar with Academy schedules.");
}

export function displayTrafficAnalysis() {
    const content = document.getElementById('analysis-content');
    content.innerHTML = `
        <div class="space-y-3">
            <h5 class="text-cyan-300 font-semibold">Network Traffic Analysis</h5>
            <div class="bg-gray-700 rounded p-3">
                <div class="space-y-3">
                    <div class="traffic-flow bg-gray-600 rounded p-2">
                        <div class="text-white text-sm font-semibold">Internal → External Transfer</div>
                        <div class="text-gray-300 text-xs">Source: 192.168.1.15 (Dr. Reeves' workstation)</div>
                        <div class="text-gray-300 text-xs">Destination: 185.220.101.45 (Tor exit node)</div>
                        <div class="text-red-400 text-xs">Volume: 2.3 GB encrypted data</div>
                    </div>
                    <div class="traffic-flow bg-gray-600 rounded p-2">
                        <div class="text-white text-sm font-semibold">Command & Control</div>
                        <div class="text-gray-300 text-xs">Encrypted channels to known Null infrastructure</div>
                        <div class="text-yellow-400 text-xs">Matches patterns from previous levels</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    gameState.truthIndicators += 1;
    gameState.suspectConfidence.dr += 20;
    updateGameMetrics();
    updateConfidenceMeters();
    updateArgusMessage("Network analysis confirms Dr. Reeves' workstation as the source. The Tor routing suggests sophisticated operational security.");
}
