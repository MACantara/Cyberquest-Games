document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let gameState = {
        certaintyLevel: 0,
        evidenceCollected: 0,
        connectionsMade: 0,
        logsAnalyzed: 0,
        truthScore: 0,
        truthIndicators: 0,
        currentTool: null,
        evidenceBoard: [],
        suspectConfidence: { dr: 25, mc: 15, zk: 10 },
        completedTools: []
    };

    // Evidence and clues data
    const evidenceDatabase = {
        logs: [
            { id: 'ssh_anomaly', type: 'SSH Log', description: 'Unusual late-night access from Dr. Reeves account', timestamp: '2024-03-15 02:47:33', indicator: true },
            { id: 'failed_login', type: 'Auth Log', description: 'Multiple failed login attempts to Marcus Chen account', timestamp: '2024-03-14 23:15:22', indicator: false },
            { id: 'privilege_escalation', type: 'System Log', description: 'Unauthorized root access from guest account', timestamp: '2024-03-15 03:22:18', indicator: true },
            { id: 'data_exfiltration', type: 'Network Log', description: 'Large data transfer to external server', timestamp: '2024-03-15 04:15:45', indicator: true }
        ],
        hashes: [
            { id: 'malware_hash', file: 'system_update.exe', hash: 'a7f5c9e2b4d8f1a3c6e9b2d5f8a1c4e7', status: 'MALICIOUS', indicator: true },
            { id: 'clean_hash', file: 'backup_tool.exe', hash: 'f8a1c4e7b2d5f9a2c5e8b1d4f7a0c3e6', status: 'CLEAN', indicator: false },
            { id: 'modified_hash', file: 'security_patch.exe', hash: 'c4e7b2d5f8a1c9e2b4d8f1a3c6e9b2d5', status: 'MODIFIED', indicator: true }
        ],
        metadata: [
            { id: 'doc_metadata', file: 'project_notes.docx', author: 'A.Reeves', created: '2024-03-10 18:30:00', modified: '2024-03-15 02:45:12', indicator: true },
            { id: 'image_metadata', file: 'academy_layout.jpg', camera: 'Internal Security Cam 7', location: 'Server Room B', timestamp: '2024-03-15 02:50:33', indicator: true },
            { id: 'email_metadata', file: 'encrypted_message.eml', sender: 'masked.sender@darknet.onion', encryption: 'PGP 4096-bit', indicator: true }
        ]
    };

    // Suspect profiles
    const suspects = {
        1: {
            name: 'Dr. Alexis Reeves',
            background: 'Former AI Ethics Professor dismissed for conducting unauthorized experiments on student behavioral data',
            motive: 'Revenge against Academy leadership and exposure of unethical practices',
            evidence: ['ssh_anomaly', 'doc_metadata', 'image_metadata'],
            alibi: 'Claims to have been at home during the incident'
        },
        2: {
            name: 'Marcus Chen',
            background: 'Current Security Administrator with full system access and knowledge of all protocols',
            motive: 'Financial gain through selling Academy security intelligence',
            evidence: ['failed_login', 'privilege_escalation'],
            alibi: 'Was working late shift, has security badge logs'
        },
        3: {
            name: 'Zara Khan',
            background: 'Former Lead Penetration Tester who resigned citing ethical concerns about Academy practices',
            motive: 'Whistleblowing to expose Academy corruption and protect students',
            evidence: ['malware_hash', 'email_metadata'],
            alibi: 'Traveling abroad during the incident with passport stamps'
        }
    };

    // Initialize game
    function initGame() {
        showTutorial();
        updateGameMetrics();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-forensics').classList.remove('hidden');
            updateArgusMessage("Begin with the log viewer, Nova. System access logs will reveal the attacker's digital footprints. Look for anomalies in timing and behavior patterns.");
        }, 2000);
    }

    // Tool selection
    document.querySelectorAll('.tool-item').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            selectTool(toolType);
            
            // Visual feedback
            document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    function selectTool(toolType) {
        gameState.currentTool = toolType;
        displayToolWorkspace(toolType);
        document.getElementById('tutorial-forensics').classList.add('hidden');
        
        if (toolType === 'logs') {
            updateArgusMessage("Analyzing system logs... Look for access patterns that deviate from normal working hours. The timestamp correlation is crucial.");
        }
    }

    function displayToolWorkspace(toolType) {
        document.getElementById('workspace-placeholder').classList.add('hidden');
        document.getElementById('analysis-workspace').classList.remove('hidden');
        
        const toolNames = {
            logs: 'Log Viewer',
            hash: 'Hash Verifier',
            metadata: 'Metadata Extractor',
            timeline: 'Timeline Builder',
            traffic: 'Traffic Visualizer'
        };
        
        document.getElementById('tool-name').textContent = toolNames[toolType];
        
        switch(toolType) {
            case 'logs':
                displayLogAnalysis();
                break;
            case 'hash':
                displayHashAnalysis();
                break;
            case 'metadata':
                displayMetadataAnalysis();
                break;
            case 'timeline':
                displayTimelineAnalysis();
                break;
            case 'traffic':
                displayTrafficAnalysis();
                break;
        }
    }

    function displayLogAnalysis() {
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

    function displayHashAnalysis() {
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

    function displayMetadataAnalysis() {
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

    function displayTimelineAnalysis() {
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

    function displayTrafficAnalysis() {
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

    function setupEvidenceCollection(toolType) {
        document.querySelectorAll(`[data-evidence]`).forEach(item => {
            item.addEventListener('click', function() {
                const evidenceId = this.dataset.evidence;
                collectEvidence(evidenceId, toolType);
                this.classList.add('opacity-50', 'cursor-not-allowed');
                this.style.pointerEvents = 'none';
            });
        });
    }

    function collectEvidence(evidenceId, toolType) {
        const evidence = findEvidenceById(evidenceId);
        if (evidence && !gameState.evidenceBoard.includes(evidenceId)) {
            gameState.evidenceBoard.push(evidenceId);
            gameState.evidenceCollected++;
            
            if (evidence.indicator) {
                gameState.truthIndicators++;
                gameState.truthScore += 10;
            }
            
            addToEvidenceBoard(evidence, toolType);
            updateGameMetrics();
            
            // Update suspect confidence based on evidence
            updateSuspectConfidence(evidenceId);
            
            showResultModal('🔍', 'Evidence Collected', 
                `Added "${evidence.description || evidence.file}" to evidence board.`,
                evidence.indicator ? 
                '<div class="text-green-400">This evidence supports the investigation!</div>' :
                '<div class="text-blue-400">Evidence noted for completeness.</div>'
            );
        }
    }

    function findEvidenceById(evidenceId) {
        for (const category of Object.values(evidenceDatabase)) {
            const evidence = category.find(item => item.id === evidenceId);
            if (evidence) return evidence;
        }
        return null;
    }

    function addToEvidenceBoard(evidence, toolType) {
        const evidenceBoard = document.getElementById('evidence-board');
        
        // Clear placeholder if first evidence
        if (gameState.evidenceCollected === 1) {
            evidenceBoard.innerHTML = '';
        }
        
        const evidenceDiv = document.createElement('div');
        evidenceDiv.className = `evidence-item bg-gray-700 rounded p-2 cursor-pointer hover:bg-gray-600 transition ${evidence.indicator ? 'border-l-4 border-green-400' : ''}`;
        evidenceDiv.innerHTML = `
            <div class="text-white text-xs font-semibold">${evidence.type || toolType.toUpperCase()}</div>
            <div class="text-gray-300 text-xs">${evidence.description || evidence.file}</div>
            ${evidence.indicator ? '<div class="text-green-400 text-xs">⭐ Key evidence</div>' : ''}
        `;
        
        evidenceBoard.appendChild(evidenceDiv);
    }

    function updateSuspectConfidence(evidenceId) {
        // Update confidence based on evidence-suspect correlation
        if (suspects[1].evidence.includes(evidenceId)) {
            gameState.suspectConfidence.dr += 15;
        }
        if (suspects[2].evidence.includes(evidenceId)) {
            gameState.suspectConfidence.mc += 10;
        }
        if (suspects[3].evidence.includes(evidenceId)) {
            gameState.suspectConfidence.zk += 10;
        }
        
        updateConfidenceMeters();
    }

    function updateConfidenceMeters() {
        const suspects = ['dr', 'mc', 'zk'];
        suspects.forEach(suspect => {
            const confidence = Math.min(100, gameState.suspectConfidence[suspect]);
            const element = document.querySelector(`#confidence-${suspect} .bg-${suspect === 'dr' ? 'red' : suspect === 'mc' ? 'blue' : 'green'}-400`);
            const textElement = document.querySelector(`#confidence-${suspect} .text-${suspect === 'dr' ? 'red' : suspect === 'mc' ? 'blue' : 'green'}-400`);
            
            if (element && textElement) {
                element.style.width = confidence + '%';
                textElement.textContent = confidence + '%';
            }
        });
    }

    // Suspect profile interaction
    document.querySelectorAll('.suspect-profile').forEach(profile => {
        profile.addEventListener('click', function() {
            const suspectId = parseInt(this.dataset.suspect);
            showSuspectDetails(suspectId);
        });
    });

    function showSuspectDetails(suspectId) {
        const suspect = suspects[suspectId];
        const confidence = gameState.suspectConfidence[Object.keys(gameState.suspectConfidence)[suspectId - 1]];
        
        showResultModal('👤', suspect.name, 
            `Analysis of ${suspect.name}'s involvement in The Null operation.`,
            `
                <div class="text-left space-y-3">
                    <div class="bg-gray-800 rounded p-3">
                        <p class="text-gray-300 text-sm"><strong>Background:</strong> ${suspect.background}</p>
                    </div>
                    <div class="bg-gray-800 rounded p-3">
                        <p class="text-gray-300 text-sm"><strong>Motive:</strong> ${suspect.motive}</p>
                    </div>
                    <div class="bg-gray-800 rounded p-3">
                        <p class="text-gray-300 text-sm"><strong>Alibi:</strong> ${suspect.alibi}</p>
                    </div>
                    <div class="text-center">
                        <p class="text-cyan-400 text-sm">Current Confidence: ${confidence}%</p>
                    </div>
                </div>
            `
        );
    }

    // Helper functions
    function updateArgusMessage(message) {
        document.getElementById('argus-message').textContent = message;
    }

    function updateGameMetrics() {
        document.getElementById('certainty-level').textContent = Math.min(100, Math.round((gameState.truthIndicators / 8) * 100));
        document.getElementById('evidence-collected').textContent = gameState.evidenceCollected;
        document.getElementById('connections-made').textContent = gameState.connectionsMade;
        document.getElementById('logs-analyzed').textContent = gameState.logsAnalyzed;
        document.getElementById('truth-score').textContent = gameState.truthScore;
        document.getElementById('truth-indicators').textContent = gameState.truthIndicators;
        
        // Update truth progress bar
        const truthProgress = (gameState.truthIndicators / 8) * 100;
        document.getElementById('truth-progress').style.width = truthProgress + '%';
        
        // Check if ready to present case
        if (gameState.truthIndicators >= 6 && gameState.evidenceCollected >= 5) {
            document.getElementById('complete-level').disabled = false;
            updateArgusMessage("Sufficient evidence gathered, Nova. You're ready to present your case. The truth is within reach.");
        }
    }

    function showResultModal(icon, title, message, feedback) {
        document.getElementById('result-icon').textContent = icon;
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-message').textContent = message;
        document.getElementById('result-feedback').innerHTML = feedback;
        document.getElementById('results-modal').classList.remove('hidden');
    }

    function endGame() {
        // Determine the most likely suspect based on evidence
        const maxConfidence = Math.max(...Object.values(gameState.suspectConfidence));
        const likelySuspect = Object.keys(gameState.suspectConfidence).find(key => gameState.suspectConfidence[key] === maxConfidence);
        
        const suspectNames = { dr: 'Dr. Alexis Reeves', mc: 'Marcus Chen', zk: 'Zara Khan' };
        const correctSuspect = 'dr'; // Dr. Reeves is the actual mastermind
        
        if (likelySuspect === correctSuspect && maxConfidence >= 60) {
            showVictoryEnding();
        } else {
            showPartialSuccess();
        }
    }

    function showVictoryEnding() {
        showResultModal(
            '🏆',
            'The Null Unmasked!',
            'You\'ve successfully identified Dr. Alexis Reeves as The Null mastermind.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-purple-900 border border-purple-600 rounded p-3">
                        <p class="text-purple-300 font-semibold">🏆 Final Achievement Unlocked</p>
                        <p class="text-purple-200 text-sm">Cyber Sentinel - Master Analyst</p>
                    </div>
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <p class="text-green-300 font-semibold">💡 THE TRUTH REVEALED</p>
                        <p class="text-green-200 text-sm">Dr. Reeves, motivated by revenge and ideological opposition to Academy practices, orchestrated The Null operation to expose what she viewed as unethical digital surveillance.</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Evidence Collected:</strong> ${gameState.evidenceCollected}</p>
                        <p><strong>Truth Score:</strong> ${gameState.truthScore}</p>
                        <p><strong>Analysis Accuracy:</strong> ${Math.round((gameState.truthIndicators / 8) * 100)}%</p>
                    </div>
                </div>
            `
        );
        
        // Show final cinematic after modal closes
        document.getElementById('continue-btn').onclick = function() {
            document.getElementById('results-modal').classList.add('hidden');
            showFinalCinematic();
        };
    }

    function showPartialSuccess() {
        showResultModal(
            '⚠️',
            'Investigation Incomplete',
            'Your analysis shows promise but lacks sufficient evidence for a definitive conclusion.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-yellow-900 border border-yellow-600 rounded p-3">
                        <p class="text-yellow-300 font-semibold">📊 Partial Success</p>
                        <p class="text-yellow-200 text-sm">More evidence gathering needed for a conclusive case.</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Evidence Collected:</strong> ${gameState.evidenceCollected}</p>
                        <p><strong>Truth Score:</strong> ${gameState.truthScore}</p>
                        <p><strong>Confidence Level:</strong> ${Math.round((gameState.truthIndicators / 8) * 100)}%</p>
                    </div>
                    <p class="text-cyan-400 text-sm mt-3">Continue gathering evidence to improve your case.</p>
                </div>
            `
        );
    }

    function showFinalCinematic() {
        showResultModal(
            '🎯',
            'Mission Complete: The Sentinel Protocol',
            'Your investigation has concluded. The digital frontier is secure.',
            `
                <div class="text-left bg-gradient-to-r from-purple-900 to-indigo-900 rounded p-4">
                    <div class="text-center mb-4">
                        <div class="text-6xl mb-2">🛡️</div>
                        <h3 class="text-xl font-bold text-cyan-300">Cyber Sentinel Certified</h3>
                    </div>
                    
                    <div class="space-y-3 text-sm">
                        <div class="bg-black bg-opacity-30 rounded p-3">
                            <p class="text-purple-300 font-semibold">Commander Vega's Final Assessment:</p>
                            <p class="text-gray-200 italic">"Nova, you didn't just stop a breach. You changed the system. Your leadership and reasoning have shaped the future of the Academy."</p>
                        </div>
                        
                        <div class="bg-black bg-opacity-30 rounded p-3">
                            <p class="text-indigo-300 font-semibold">Legacy Impact:</p>
                            <p class="text-gray-200">A new generation of cadets will learn from holographic recordings of your ethical decisions and analytical methods.</p>
                        </div>
                        
                        <div class="text-center bg-black bg-opacity-50 rounded p-3">
                            <p class="text-cyan-400 font-semibold">"In the shadows of the net, only those with clarity, courage, and conscience prevail."</p>
                            <p class="text-cyan-300 text-xs mt-2">You are that sentinel.</p>
                        </div>
                    </div>
                </div>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/campaign';
        };
    }

    // Event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('close-tool').addEventListener('click', function() {
        document.getElementById('analysis-workspace').classList.add('hidden');
        document.getElementById('workspace-placeholder').classList.remove('hidden');
        gameState.currentTool = null;
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        endGame();
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});