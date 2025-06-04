document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let gameState = {
        uptimePercentage: 100,
        attacksMitigated: 0,
        ipsBlocked: 0,
        trafficFiltered: 0,
        responseTime: 0,
        currentNode: null,
        infrastructureHealth: {
            hospital: 100,
            power: 75,
            emergency: 45,
            transport: 85
        },
        activeAttacks: [],
        alertQueue: []
    };

    // Infrastructure data
    const infrastructureNodes = {
        hospital: {
            id: 'hospital',
            name: 'Medical Centers',
            priority: 1,
            attacks: ['volumetric', 'application'],
            description: 'Patient records and emergency medical services'
        },
        power: {
            id: 'power',
            name: 'Power Grid',
            priority: 2,
            attacks: ['protocol', 'volumetric'],
            description: 'City electrical infrastructure and IoT systems'
        },
        emergency: {
            id: 'emergency',
            name: 'Emergency Services',
            priority: 1,
            attacks: ['application', 'volumetric', 'protocol'],
            description: '911 dispatch and emergency response coordination'
        },
        transport: {
            id: 'transport',
            name: 'Transportation',
            priority: 3,
            attacks: ['protocol'],
            description: 'Traffic control and public transit systems'
        }
    };

    // Initialize game
    function initGame() {
        showTutorial();
        updateGameMetrics();
        generateInitialAlerts();
        startAttackSimulation();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-infrastructure').classList.remove('hidden');
            updateCommanderMessage("Start with Emergency Services - they're taking the heaviest hit. Every second of downtime could cost lives. Click the red node to begin defense.");
        }, 2000);
    }

    // Infrastructure node selection
    document.querySelectorAll('.infrastructure-node').forEach(node => {
        node.addEventListener('click', function() {
            const nodeId = this.dataset.node;
            selectInfrastructureNode(nodeId);
            
            // Visual feedback
            document.querySelectorAll('.infrastructure-node').forEach(n => n.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    function selectInfrastructureNode(nodeId) {
        gameState.currentNode = infrastructureNodes[nodeId];
        displayDefensePanel(gameState.currentNode);
        document.getElementById('tutorial-infrastructure').classList.add('hidden');
        
        if (nodeId === 'emergency') {
            updateCommanderMessage("Emergency Services are critical infrastructure. Deploy firewall rules and load balancing to keep 911 systems operational.");
        }
    }

    function displayDefensePanel(node) {
        document.getElementById('dashboard-placeholder').classList.add('hidden');
        document.getElementById('defense-panel').classList.remove('hidden');
        
        document.getElementById('target-name').textContent = node.name;
        
        // Start traffic monitoring
        startTrafficMonitoring(node);
        
        // Show attack indicators
        displayAttackIndicators(node);
        
        // Reset defense tools
        document.querySelectorAll('.defense-tool').forEach(tool => {
            tool.classList.remove('opacity-50');
            tool.disabled = false;
        });
    }

    function startTrafficMonitoring(node) {
        const trafficMonitor = document.getElementById('traffic-monitor');
        
        // Simulate incoming traffic
        setInterval(() => {
            const suspiciousIPs = ['192.168.1.100', '10.0.0.50', '172.16.1.25', '203.0.113.5'];
            const randomIP = suspiciousIPs[Math.floor(Math.random() * suspiciousIPs.length)];
            const isSuspicious = Math.random() > 0.6;
            
            const trafficEntry = document.createElement('div');
            trafficEntry.className = `flex justify-between text-xs p-1 rounded ${isSuspicious ? 'bg-red-800' : 'bg-gray-700'}`;
            trafficEntry.innerHTML = `
                <span class="text-gray-300">${randomIP}</span>
                <span class="${isSuspicious ? 'text-red-400' : 'text-green-400'}">${isSuspicious ? 'SUSPICIOUS' : 'NORMAL'}</span>
            `;
            
            trafficMonitor.appendChild(trafficEntry);
            
            // Keep only last 10 entries
            while (trafficMonitor.children.length > 10) {
                trafficMonitor.removeChild(trafficMonitor.firstChild);
            }
        }, 1000);
    }

    function displayAttackIndicators(node) {
        const indicators = document.getElementById('attack-indicators');
        indicators.innerHTML = node.attacks.map(attack => {
            const severity = Math.random() > 0.5 ? 'HIGH' : 'MEDIUM';
            const color = severity === 'HIGH' ? 'red' : 'yellow';
            return `
                <div class="bg-${color}-900 border border-${color}-600 rounded p-2">
                    <div class="text-xs font-semibold text-white">${attack.toUpperCase()}</div>
                    <div class="text-xs text-${color}-300">${severity}</div>
                </div>
            `;
        }).join('');
    }

    // Defense tools
    document.querySelectorAll('.defense-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentNode) {
                handleDefenseTool(toolType);
                this.classList.add('opacity-50');
                this.disabled = true;
                
                // Re-enable after 3 seconds
                setTimeout(() => {
                    this.classList.remove('opacity-50');
                    this.disabled = false;
                }, 3000);
            }
        });
    });

    function handleDefenseTool(toolType) {
        const node = gameState.currentNode;
        let effectivenesss = Math.random() * 0.4 + 0.6; // 60-100% effectiveness
        
        switch(toolType) {
            case 'firewall':
                gameState.ipsBlocked += Math.floor(Math.random() * 50) + 20;
                gameState.attacksMitigated++;
                showDefenseResult('Firewall Rules Deployed', `Blocked ${gameState.ipsBlocked} malicious IPs`, 'green');
                updateCommanderMessage("Good work! Firewall rules are filtering malicious traffic. Keep monitoring for new attack vectors.");
                break;
                
            case 'loadbalancer':
                gameState.trafficFiltered += Math.floor(Math.random() * 5) + 2;
                showDefenseResult('Load Balancer Activated', `Distributed traffic across ${Math.floor(Math.random() * 3) + 2} servers`, 'blue');
                updateCommanderMessage("Load balancing is helping distribute the attack traffic. System stability improving.");
                break;
                
            case 'filter':
                gameState.trafficFiltered += Math.floor(Math.random() * 3) + 1;
                gameState.attacksMitigated++;
                showDefenseResult('Traffic Filter Applied', 'Filtering suspicious packet patterns', 'purple');
                updateCommanderMessage("Traffic filtering is reducing noise. Focus on the most critical attack vectors.");
                break;
                
            case 'reroute':
                showDefenseResult('Traffic Rerouted', 'Redirected traffic through clean CDN paths', 'orange');
                updateCommanderMessage("Traffic rerouting successful. Attack impact reduced through alternative pathways.");
                break;
        }
        
        // Improve infrastructure health
        gameState.infrastructureHealth[node.id] = Math.min(100, gameState.infrastructureHealth[node.id] + effectivenesss * 20);
        updateInfrastructureVisuals();
        updateGameMetrics();
    }

    function showDefenseResult(title, message, type) {
        const resultsContent = document.getElementById('results-content');
        const result = document.createElement('div');
        result.className = `bg-${type}-900 border border-${type}-600 rounded p-2 text-sm`;
        result.innerHTML = `
            <div class="font-semibold text-${type}-300">${title}</div>
            <div class="text-${type}-200">${message}</div>
        `;
        
        resultsContent.appendChild(result);
        document.getElementById('defense-results').classList.remove('hidden');
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (result.parentNode) {
                result.parentNode.removeChild(result);
            }
        }, 5000);
    }

    // Command console
    document.getElementById('execute-command').addEventListener('click', function() {
        const command = document.getElementById('command-input').value.trim();
        if (command) {
            executeCommand(command);
            document.getElementById('command-input').value = '';
        }
    });

    function executeCommand(command) {
        if (command.toLowerCase().includes('block') || command.toLowerCase().includes('deny')) {
            gameState.ipsBlocked += 10;
            showDefenseResult('Command Executed', `Firewall rule: ${command}`, 'green');
        } else if (command.toLowerCase().includes('allow') || command.toLowerCase().includes('permit')) {
            showDefenseResult('Command Executed', `Access rule: ${command}`, 'blue');
        } else {
            showDefenseResult('Command Error', 'Invalid syntax. Use: block/allow [IP/range]', 'red');
        }
        updateGameMetrics();
    }

    // Emergency actions
    document.getElementById('emergency-blackhole').addEventListener('click', function() {
        gameState.attacksMitigated += 5;
        gameState.ipsBlocked += 100;
        showResultModal('🕳️', 'Emergency Blackhole Activated', 
            'Redirected all attack traffic to null route.',
            '<div class="text-orange-400">Extreme measure deployed. Attack stopped but some legitimate traffic may be affected.</div>'
        );
        updateCommanderMessage("Blackhole route deployed. Attack traffic neutralized but monitor for collateral impact on legitimate users.");
    });

    document.getElementById('failover-activate').addEventListener('click', function() {
        Object.keys(gameState.infrastructureHealth).forEach(key => {
            gameState.infrastructureHealth[key] = Math.min(100, gameState.infrastructureHealth[key] + 30);
        });
        showResultModal('🔄', 'Failover Systems Activated', 
            'Backup systems brought online across all infrastructure.',
            '<div class="text-blue-400">Redundant systems active. Service continuity maintained during attack.</div>'
        );
        updateCommanderMessage("Failover systems online. We've bought time to implement more targeted defenses.");
        updateInfrastructureVisuals();
    });

    document.getElementById('trace-source').addEventListener('click', function() {
        showResultModal('🔍', 'Attack Source Traced', 
            'Botnet command and control servers identified.',
            '<div class="text-purple-400">C2 servers located at coordinates matching known Null infrastructure. This attack originated from within academy systems.</div>'
        );
        updateCommanderMessage("Nova, this is disturbing. The attack source traces back to our own simulation grid. Someone inside is working with The Null.");
    });

    // Attack simulation
    function startAttackSimulation() {
        setInterval(() => {
            // Degrade infrastructure health over time
            Object.keys(gameState.infrastructureHealth).forEach(key => {
                if (gameState.infrastructureHealth[key] > 0) {
                    gameState.infrastructureHealth[key] = Math.max(0, gameState.infrastructureHealth[key] - Math.random() * 3);
                }
            });
            
            updateInfrastructureVisuals();
            generateRandomAlert();
            
            // Check win condition
            const avgHealth = Object.values(gameState.infrastructureHealth).reduce((a, b) => a + b, 0) / 4;
            if (avgHealth > 80 && gameState.attacksMitigated >= 5) {
                setTimeout(() => endGame(true), 3000);
            }
        }, 2000);
    }

    function generateInitialAlerts() {
        const alerts = [
            { type: 'critical', message: 'Emergency Services: 911 system experiencing 70% packet loss', node: 'emergency' },
            { type: 'high', message: 'Power Grid: Unusual SCADA protocol traffic detected', node: 'power' },
            { type: 'medium', message: 'Transportation: Traffic control system latency spike', node: 'transport' }
        ];
        
        alerts.forEach(alert => addAlert(alert));
    }

    function generateRandomAlert() {
        if (Math.random() > 0.7) {
            const nodes = Object.keys(infrastructureNodes);
            const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
            const alertTypes = [
                'DDoS amplification attack detected',
                'Suspicious bot traffic pattern',
                'Protocol anomaly identified',
                'Bandwidth threshold exceeded'
            ];
            
            addAlert({
                type: 'medium',
                message: `${infrastructureNodes[randomNode].name}: ${alertTypes[Math.floor(Math.random() * alertTypes.length)]}`,
                node: randomNode
            });
        }
    }

    function addAlert(alert) {
        const alertQueue = document.getElementById('alert-queue');
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-item bg-${alert.type === 'critical' ? 'red' : alert.type === 'high' ? 'orange' : 'yellow'}-900 border border-${alert.type === 'critical' ? 'red' : alert.type === 'high' ? 'orange' : 'yellow'}-600 rounded p-2 cursor-pointer`;
        alertDiv.innerHTML = `
            <div class="text-xs font-semibold text-white">${alert.type.toUpperCase()}</div>
            <div class="text-xs text-gray-300">${alert.message}</div>
        `;
        
        alertQueue.appendChild(alertDiv);
        
        // Remove old alerts
        while (alertQueue.children.length > 8) {
            alertQueue.removeChild(alertQueue.firstChild);
        }
    }

    // Helper functions
    function updateCommanderMessage(message) {
        document.getElementById('commander-message').textContent = message;
    }

    function updateGameMetrics() {
        document.getElementById('uptime-percentage').textContent = Math.round(gameState.uptimePercentage);
        document.getElementById('attacks-mitigated').textContent = gameState.attacksMitigated;
        document.getElementById('ips-blocked').textContent = gameState.ipsBlocked;
        document.getElementById('traffic-filtered').textContent = gameState.trafficFiltered;
        document.getElementById('response-time').textContent = Math.floor(Math.random() * 5) + 1;
    }

    function updateInfrastructureVisuals() {
        Object.keys(gameState.infrastructureHealth).forEach(nodeId => {
            const health = gameState.infrastructureHealth[nodeId];
            const uptimeBar = document.getElementById(`${nodeId}-uptime`);
            const statusSpan = document.getElementById(`${nodeId}-status`);
            
            if (uptimeBar) {
                uptimeBar.style.width = health + '%';
                
                if (health > 80) {
                    uptimeBar.className = 'bg-green-400 h-2 rounded-full transition-all';
                    statusSpan.textContent = 'ONLINE';
                    statusSpan.className = 'text-xs bg-green-600 text-white px-2 py-1 rounded';
                } else if (health > 50) {
                    uptimeBar.className = 'bg-yellow-400 h-2 rounded-full transition-all';
                    statusSpan.textContent = 'DEGRADED';
                    statusSpan.className = 'text-xs bg-yellow-600 text-white px-2 py-1 rounded';
                } else {
                    uptimeBar.className = 'bg-red-400 h-2 rounded-full transition-all';
                    statusSpan.textContent = 'CRITICAL';
                    statusSpan.className = 'text-xs bg-red-600 text-white px-2 py-1 rounded';
                }
            }
        });
    }

    function showResultModal(icon, title, message, feedback) {
        document.getElementById('result-icon').textContent = icon;
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-message').textContent = message;
        document.getElementById('result-feedback').innerHTML = feedback;
        document.getElementById('results-modal').classList.remove('hidden');
    }

    function endGame(success) {
        if (success) {
            updateCommanderMessage("Outstanding work, Nova! You've successfully defended critical infrastructure under extreme pressure. But we've discovered something troubling...");
            document.getElementById('complete-level').disabled = false;
            
            const avgHealth = Object.values(gameState.infrastructureHealth).reduce((a, b) => a + b, 0) / 4;
            
            showResultModal(
                '🏆',
                'Infrastructure Secured!',
                'You\'ve successfully completed Operation Blackout and earned the Firewall Frontliner badge.',
                `
                    <div class="text-left space-y-3">
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <p class="text-red-300 font-semibold">🏆 Digital Badge Earned</p>
                            <p class="text-red-200 text-sm">Firewall Frontliner - DDoS Defender</p>
                        </div>
                        <div class="text-sm space-y-1">
                            <p><strong>Infrastructure Health:</strong> ${Math.round(avgHealth)}%</p>
                            <p><strong>Attacks Mitigated:</strong> ${gameState.attacksMitigated}</p>
                            <p><strong>IPs Blocked:</strong> ${gameState.ipsBlocked}</p>
                            <p><strong>Traffic Filtered:</strong> ${gameState.trafficFiltered} GB</p>
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

    document.getElementById('close-defense').addEventListener('click', function() {
        document.getElementById('defense-panel').classList.add('hidden');
        document.getElementById('dashboard-placeholder').classList.remove('hidden');
        gameState.currentNode = null;
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '🕵️',
            'Disturbing Discovery',
            'While cleaning SOC logs, you discover a digital fingerprint...',
            `
                <div class="text-left bg-purple-900 border border-purple-600 rounded p-3">
                    <p class="text-purple-300 font-semibold">🔍 FINAL REVELATION</p>
                    <p class="text-purple-200 text-sm mt-2">"It's not from The Null—but from someone within the InterWorld Cyber Academy. The call is coming from inside the house."</p>
                    <p class="text-gray-400 text-xs mt-2">Commander Vega: "We've traced the origin of this malware strain. You'll be leading the final assault."</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for the Final Level: The Hunt for The Null?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/10';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});