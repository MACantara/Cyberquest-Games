document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let gameState = {
        cleanSystems: 5,
        infectedSystems: 3,
        quarantinedSystems: 0,
        systemsCleaned: 0,
        currentSystem: null,
        spreadTimer: 60,
        analysisSteps: {},
        completedSystems: [],
        malwareTypes: {
            'trojan': 'Performance_Boost.exe',
            'spyware': 'VROptimizer.dll',
            'worm': 'NetworkCrawler.sys'
        }
    };

    // System data
    const systems = {
        1: { id: 1, name: 'Terminal-01', player: 'Alex_VR', status: 'clean', malwareType: null },
        2: { id: 2, name: 'Terminal-02', player: 'CyberNinja', status: 'infected', malwareType: 'trojan' },
        3: { id: 3, name: 'Terminal-03', player: 'Cipher', status: 'suspicious', malwareType: 'spyware' },
        4: { id: 4, name: 'Terminal-04', player: 'Phoenix', status: 'clean', malwareType: null },
        5: { id: 5, name: 'Terminal-05', player: 'AdminUser', status: 'infected', malwareType: 'worm' }
    };

    // Initialize game
    function initGame() {
        startSpreadTimer();
        showTutorial();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-systems').classList.remove('hidden');
            updateMentorMessage("Start with Terminal-02, Nova. It's showing classic trojan symptoms - system lag and unauthorized processes. Click on it to begin analysis.");
        }, 2000);
    }

    // Spread timer
    function startSpreadTimer() {
        const timer = setInterval(() => {
            if (gameState.spreadTimer > 0) {
                gameState.spreadTimer--;
                document.getElementById('spread-timer').textContent = gameState.spreadTimer;
                
                if (gameState.spreadTimer <= 0) {
                    spreadInfection();
                    gameState.spreadTimer = 60; // Reset timer
                }
            }
        }, 1000);
        
        // Store timer reference for cleanup
        gameState.spreadTimerRef = timer;
    }

    function spreadInfection() {
        // Find adjacent clean systems and infect one
        const cleanSystemIds = Object.keys(systems).filter(id => systems[id].status === 'clean');
        if (cleanSystemIds.length > 0) {
            const targetId = cleanSystemIds[Math.floor(Math.random() * cleanSystemIds.length)];
            systems[targetId].status = 'infected';
            systems[targetId].malwareType = 'worm';
            gameState.infectedSystems++;
            gameState.cleanSystems--;
            updateSystemVisuals();
            updateGameStats();
            
            showResultModal('⚠️', 'Infection Spread!', 
                `Terminal-${targetId.padStart(2, '0')} has been infected. Contain the outbreak faster!`,
                '<div class="text-red-400">The malware is evolving and spreading to new systems.</div>'
            );
        }
    }

    // System selection
    document.querySelectorAll('.system-item').forEach(item => {
        item.addEventListener('click', function() {
            const systemId = parseInt(this.dataset.system);
            selectSystem(systemId);
            
            // Visual feedback
            document.querySelectorAll('.system-item').forEach(s => s.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    function selectSystem(systemId) {
        gameState.currentSystem = systems[systemId];
        displaySystemAnalysis(gameState.currentSystem);
        document.getElementById('tutorial-systems').classList.add('hidden');
        
        if (systemId === 2) {
            updateMentorMessage("Good choice! This system is clearly compromised. Use the analysis tools to identify the malware type and find the best containment method.");
        }
    }

    function displaySystemAnalysis(system) {
        document.getElementById('system-placeholder').classList.add('hidden');
        document.getElementById('system-analysis').classList.remove('hidden');
        
        document.getElementById('system-name').textContent = `${system.name} (${system.player})`;
        
        // Update status icon
        const statusIcon = document.getElementById('system-status-icon');
        switch(system.status) {
            case 'clean':
                statusIcon.className = 'w-4 h-4 rounded-full bg-green-400 animate-pulse';
                break;
            case 'infected':
                statusIcon.className = 'w-4 h-4 rounded-full bg-red-400 animate-ping';
                break;
            case 'suspicious':
                statusIcon.className = 'w-4 h-4 rounded-full bg-yellow-400';
                break;
        }
        
        // Populate process list
        populateProcessList(system);
        populateFileList(system);
        
        // Reset analysis state
        gameState.analysisSteps[system.id] = {};
        document.getElementById('analysis-results').classList.add('hidden');
        document.getElementById('response-panel').classList.add('hidden');
        
        // Reset tool states
        document.querySelectorAll('.analysis-tool').forEach(tool => {
            tool.classList.remove('opacity-50');
            tool.disabled = false;
        });
    }

    function populateProcessList(system) {
        const processList = document.getElementById('process-list');
        let processes = [];
        
        if (system.status === 'infected') {
            if (system.malwareType === 'trojan') {
                processes = [
                    { name: 'vr_engine.exe', status: 'normal', pid: '1024' },
                    { name: 'performance_boost.exe', status: 'suspicious', pid: '2456' },
                    { name: 'system32.exe', status: 'malicious', pid: '3789' }
                ];
            } else if (system.malwareType === 'spyware') {
                processes = [
                    { name: 'vr_engine.exe', status: 'normal', pid: '1024' },
                    { name: 'keylogger.dll', status: 'malicious', pid: '2234' },
                    { name: 'vroptimizer.dll', status: 'suspicious', pid: '3456' }
                ];
            }
        } else {
            processes = [
                { name: 'vr_engine.exe', status: 'normal', pid: '1024' },
                { name: 'graphics_driver.dll', status: 'normal', pid: '1256' },
                { name: 'audio_service.exe', status: 'normal', pid: '1789' }
            ];
        }
        
        processList.innerHTML = processes.map(proc => `
            <div class="flex justify-between items-center text-xs p-2 rounded ${
                proc.status === 'malicious' ? 'bg-red-800' : 
                proc.status === 'suspicious' ? 'bg-yellow-800' : 'bg-gray-700'
            }">
                <span class="text-white">${proc.name}</span>
                <span class="text-gray-400">PID: ${proc.pid}</span>
            </div>
        `).join('');
    }

    function populateFileList(system) {
        const fileList = document.getElementById('file-list');
        let files = [];
        
        if (system.status === 'infected') {
            files = [
                { name: 'Performance_Boost.exe', hash: 'a3f5d9c2e1...', threat: 'HIGH' },
                { name: 'temp_cache.tmp', hash: 'b7e2c1a9f3...', threat: 'MEDIUM' }
            ];
        } else if (system.status === 'suspicious') {
            files = [
                { name: 'VROptimizer.dll', hash: 'b7e2c1a9f3...', threat: 'MEDIUM' }
            ];
        }
        
        fileList.innerHTML = files.length > 0 ? files.map(file => `
            <div class="bg-red-800 border border-red-600 rounded p-2">
                <div class="flex justify-between items-start">
                    <div>
                        <h6 class="text-red-300 font-semibold text-xs">${file.name}</h6>
                        <p class="text-red-200 text-xs">Hash: ${file.hash}</p>
                    </div>
                    <span class="text-xs bg-red-600 text-white px-2 py-1 rounded">${file.threat}</span>
                </div>
            </div>
        `).join('') : '<p class="text-gray-400 text-xs">No suspicious files detected</p>';
    }

    // Analysis tools
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentSystem) {
                handleAnalysisTool(toolType);
                this.classList.add('opacity-50');
                this.disabled = true;
            }
        });
    });

    function handleAnalysisTool(toolType) {
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

    function getMalwareDescription(type) {
        switch(type) {
            case 'trojan': return 'disguises itself as legitimate software while stealing data.';
            case 'spyware': return 'monitors user activity and captures sensitive information.';
            case 'worm': return 'replicates itself across network connections.';
            default: return 'performs unauthorized activities.';
        }
    }

    function showResponsePanel() {
        document.getElementById('response-panel').classList.remove('hidden');
        updateMentorMessage("Analysis complete. Now choose your containment strategy. Consider the malware type and system importance.");
    }

    // Response actions
    document.querySelectorAll('.response-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleResponse(action);
        });
    });

    function handleResponse(action) {
        const system = gameState.currentSystem;
        let success = false;
        let title, message, feedback;

        // Determine correct action based on system status and malware type
        if (system.status === 'infected') {
            if (action === 'quarantine' || action === 'clean') {
                success = true;
            }
        } else if (system.status === 'suspicious') {
            if (action === 'quarantine' || action === 'isolate') {
                success = true;
            }
        } else {
            if (action === 'clean') {
                success = true;
            }
        }

        if (success) {
            handleCorrectResponse(system, action);
        } else {
            handleWrongResponse(system, action);
        }

        gameState.completedSystems.push(system.id);
        updateGameStats();
        updateSystemVisuals();

        // Check if level complete
        if (gameState.systemsCleaned >= 3 && gameState.infectedSystems === 0) {
            setTimeout(() => endGame(true), 2000);
        } else {
            setTimeout(() => {
                document.getElementById('system-analysis').classList.add('hidden');
                document.getElementById('system-placeholder').classList.remove('hidden');
                updateMentorMessage("Good work! Continue analyzing and containing the remaining threats.");
            }, 2000);
        }
    }

    function handleCorrectResponse(system, action) {
        if (system.status === 'infected') {
            gameState.infectedSystems--;
            gameState.systemsCleaned++;
        } else if (system.status === 'suspicious') {
            gameState.quarantinedSystems++;
        }
        
        system.status = 'clean';
        system.malwareType = null;
        gameState.cleanSystems++;

        showResultModal('✅', 'Containment Successful!', 
            `${system.name} has been successfully secured.`,
            `<div class="text-green-400">System cleaned and returned to normal operation. Threat eliminated.</div>`
        );
        
        updateMentorMessage("Excellent work! Threat contained successfully. The system is now secure.");
    }

    function handleWrongResponse(system, action) {
        if (action === 'shutdown' && system.status === 'infected') {
            // Emergency shutdown - partial success but system offline
            gameState.infectedSystems--;
            system.status = 'offline';
            showResultModal('⚠️', 'Emergency Shutdown', 
                'System offline but threat contained.',
                '<div class="text-yellow-400">System secured but player disconnected from tournament.</div>'
            );
        } else {
            // Wrong action - spread infection
            spreadInfection();
            showResultModal('❌', 'Containment Failed!', 
                'Incorrect response allowed malware to spread.',
                '<div class="text-red-400">The malware adapted to your response and infected additional systems.</div>'
            );
        }
        
        updateMentorMessage("That wasn't the optimal response. Learn from this and choose more carefully next time.");
    }

    // Helper functions
    function updateMentorMessage(message) {
        document.getElementById('mentor-message').textContent = message;
    }

    function updateGameStats() {
        document.getElementById('clean-systems').textContent = gameState.cleanSystems;
        document.getElementById('infected-systems').textContent = gameState.infectedSystems;
        document.getElementById('quarantined-systems').textContent = gameState.quarantinedSystems;
        document.getElementById('systems-cleaned').textContent = gameState.systemsCleaned;
    }

    function updateSystemVisuals() {
        // Update system items in the left panel
        Object.keys(systems).forEach(id => {
            const systemItem = document.querySelector(`[data-system="${id}"]`);
            const system = systems[id];
            
            // Update visual state based on system status
            systemItem.className = `system-item rounded p-3 cursor-pointer transition ${getSystemStyles(system.status)}`;
        });

        // Update threat map nodes
        Object.keys(systems).forEach(id => {
            const node = document.querySelector(`[data-node="${id}"]`);
            if (node) {
                node.className = `node w-6 h-6 rounded-full ${getNodeStyles(systems[id].status)}`;
            }
        });
    }

    function getSystemStyles(status) {
        switch(status) {
            case 'clean': return 'bg-green-900 border border-green-600 hover:bg-green-800';
            case 'infected': return 'bg-red-900 border border-red-600 hover:bg-red-800 animate-pulse';
            case 'suspicious': return 'bg-yellow-900 border border-yellow-600 hover:bg-yellow-800';
            case 'offline': return 'bg-gray-700 border border-gray-600 opacity-50';
            default: return 'bg-gray-700 border border-gray-600 hover:bg-gray-600';
        }
    }

    function getNodeStyles(status) {
        switch(status) {
            case 'clean': return 'bg-green-400';
            case 'infected': return 'bg-red-500 animate-ping';
            case 'suspicious': return 'bg-yellow-500';
            case 'offline': return 'bg-gray-500';
            default: return 'bg-gray-600';
        }
    }

    function showResultModal(icon, title, message, feedback) {
        document.getElementById('result-icon').textContent = icon;
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-message').textContent = message;
        document.getElementById('result-feedback').innerHTML = feedback;
        document.getElementById('results-modal').classList.remove('hidden');
    }

    function endGame(success) {
        clearInterval(gameState.spreadTimerRef);
        
        if (success) {
            updateMentorMessage("Outstanding work, Nova! You've successfully contained the malware outbreak and saved the tournament. The Academy's systems are secure.");
            document.getElementById('complete-level').disabled = false;
            
            showResultModal(
                '🏆',
                'Outbreak Contained!',
                'You\'ve successfully completed Malware Mayhem and earned the System Sanitizer badge.',
                `
                    <div class="text-left space-y-3">
                        <div class="bg-purple-900 border border-purple-600 rounded p-3">
                            <p class="text-purple-300 font-semibold">🏆 Digital Badge Earned</p>
                            <p class="text-purple-200 text-sm">System Sanitizer - Malware Defense Specialist</p>
                        </div>
                        <div class="text-sm space-y-1">
                            <p><strong>Systems Cleaned:</strong> ${gameState.systemsCleaned}</p>
                            <p><strong>Threats Contained:</strong> ${3 - gameState.infectedSystems}/3</p>
                            <p><strong>Response Time:</strong> Excellent</p>
                        </div>
                    </div>
                `
            );
        }
    }

    // Event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('close-system').addEventListener('click', function() {
        document.getElementById('system-analysis').classList.add('hidden');
        document.getElementById('system-placeholder').classList.remove('hidden');
        gameState.currentSystem = null;
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '🚨',
            'New Security Alert',
            'As the VR arena returns to normal, a critical alert appears...',
            `
                <div class="text-left bg-red-900 border border-red-600 rounded p-3">
                    <p class="text-red-300 font-semibold">🚨 PRIORITY ALERT</p>
                    <p class="text-red-200 text-sm mt-2">"Nova—unauthorized login attempt detected at Academy's Credential Vault. Brute-force protocol in progress."</p>
                    <p class="text-gray-400 text-xs mt-2">Commander Vega</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 4: The Password Heist?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/4';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});