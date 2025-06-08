import { gameState, updateGameMetrics, updateInfrastructureVisuals } from './gameState.js';
import { updateCommanderMessage } from './uiUpdates.js';
import { infrastructureNodes } from './infrastructureHandler.js';

let attackInterval;
let missionStartTime;
let attackWaves = [];
let currentWaveIndex = 0;

export function startAttackSimulation() {
    missionStartTime = Date.now();
    generateAttackWaves();
    
    // Update mission timer
    setInterval(updateMissionTimer, 1000);
    
    // Main attack simulation loop
    attackInterval = setInterval(() => {
        processAttackWave();
        degradeInfrastructure();
        updateAttackStatistics();
        generateRandomEvents();
        checkMissionStatus();
    }, 2000);
    
    // Generate initial critical alerts
    setTimeout(() => generateInitialAlerts(), 1000);
    
    updateCommanderMessage("DDoS attack simulation active. Multiple attack vectors detected across all infrastructure nodes. Begin immediate defensive measures!");
}

function generateAttackWaves() {
    attackWaves = [
        {
            name: "Initial Reconnaissance",
            duration: 30000, // 30 seconds
            intensity: 0.3,
            targets: ["emergency", "hospital"],
            description: "Probing attacks testing response capabilities"
        },
        {
            name: "Volumetric Assault",
            duration: 45000, // 45 seconds
            intensity: 0.6,
            targets: ["emergency", "hospital", "power"],
            description: "High-volume traffic flooding primary targets"
        },
        {
            name: "Multi-Vector Campaign",
            duration: 60000, // 60 seconds
            intensity: 0.8,
            targets: ["emergency", "hospital", "power", "transport"],
            description: "Coordinated attack across multiple infrastructure types"
        },
        {
            name: "All-Out Assault",
            duration: 90000, // 90 seconds
            intensity: 1.0,
            targets: ["emergency", "hospital", "power", "transport", "financial", "water"],
            description: "Maximum intensity attack on all city infrastructure"
        },
        {
            name: "Final Surge",
            duration: 120000, // 2 minutes
            intensity: 1.2,
            targets: ["emergency", "hospital", "power"],
            description: "Desperate final attempt focusing on critical systems"
        }
    ];
}

function processAttackWave() {
    const currentTime = Date.now() - missionStartTime;
    let currentWave = attackWaves[0]; // Default to first wave
    
    // Determine current wave based on elapsed time
    let elapsedTime = 0;
    for (let i = 0; i < attackWaves.length; i++) {
        if (currentTime >= elapsedTime && currentTime < elapsedTime + attackWaves[i].duration) {
            currentWave = attackWaves[i];
            currentWaveIndex = i;
            break;
        }
        elapsedTime += attackWaves[i].duration;
    }
    
    // Update attack statistics based on current wave
    gameState.currentAttackIntensity = currentWave.intensity;
    gameState.activeTargets = currentWave.targets;
    
    // Apply wave-specific effects
    currentWave.targets.forEach(nodeId => {
        if (infrastructureNodes[nodeId]) {
            const node = infrastructureNodes[nodeId];
            const attackPatterns = node.attackPatterns;
            
            // Calculate damage based on wave intensity and node vulnerability
            let totalDamage = 0;
            Object.keys(attackPatterns).forEach(attackType => {
                const pattern = attackPatterns[attackType];
                const damage = currentWave.intensity * pattern.intensity * pattern.frequency * 0.02;
                totalDamage += damage;
            });
            
            // Apply damage unless actively mitigated
            if (!gameState.activeMitigations[nodeId] || gameState.activeMitigations[nodeId].length === 0) {
                gameState.infrastructureHealth[nodeId] = Math.max(0, 
                    gameState.infrastructureHealth[nodeId] - totalDamage
                );
            } else {
                // Reduce damage based on active mitigations
                const mitigationEffectiveness = calculateMitigationEffectiveness(nodeId);
                const reducedDamage = totalDamage * (1 - mitigationEffectiveness);
                gameState.infrastructureHealth[nodeId] = Math.max(0,
                    gameState.infrastructureHealth[nodeId] - reducedDamage
                );
            }
        }
    });
    
    // Update attack feed with current wave information
    if (currentWaveIndex !== gameState.lastWaveIndex) {
        addAttackFeedMessage(`🌊 ${currentWave.name} initiated - ${currentWave.description}`);
        updateCommanderMessage(`${currentWave.name} detected! ${currentWave.description}. Focus defenses on priority targets.`);
        gameState.lastWaveIndex = currentWaveIndex;
    }
}

function degradeInfrastructure() {
    // Apply baseline degradation to all nodes under attack
    Object.keys(gameState.infrastructureHealth).forEach(nodeId => {
        if (gameState.activeTargets.includes(nodeId)) {
            const baseDecay = 0.5 * gameState.currentAttackIntensity;
            
            // Apply mitigation reduction
            const mitigationReduction = calculateMitigationEffectiveness(nodeId);
            const actualDecay = baseDecay * (1 - mitigationReduction);
            
            gameState.infrastructureHealth[nodeId] = Math.max(0,
                gameState.infrastructureHealth[nodeId] - actualDecay
            );
        } else {
            // Slow recovery for non-targeted nodes
            gameState.infrastructureHealth[nodeId] = Math.min(100,
                gameState.infrastructureHealth[nodeId] + 0.2
            );
        }
    });
    
    updateInfrastructureVisuals();
}

function calculateMitigationEffectiveness(nodeId) {
    const activeMitigations = gameState.activeMitigations[nodeId] || [];
    let totalEffectiveness = 0;
    
    activeMitigations.forEach(mitigation => {
        const timeElapsed = Date.now() - mitigation.deployedAt;
        const effectiveness = Math.min(mitigation.maxEffectiveness, 
            mitigation.maxEffectiveness * (timeElapsed / mitigation.duration));
        totalEffectiveness += effectiveness;
    });
    
    return Math.min(0.9, totalEffectiveness); // Cap at 90% effectiveness
}

function updateAttackStatistics() {
    // Update real-time statistics
    const baseVolume = 100 + (gameState.currentAttackIntensity * 400);
    gameState.attackVolume = Math.floor(baseVolume + (Math.random() * 50 - 25));
    
    gameState.attackingSources = Math.floor(1000 + (gameState.currentAttackIntensity * 9000));
    
    // Update UI elements
    document.getElementById('attack-volume').textContent = gameState.attackVolume;
    document.getElementById('nodes-under-attack').textContent = gameState.activeTargets.length;
    
    // Calculate overall uptime
    const healthValues = Object.values(gameState.infrastructureHealth);
    const averageHealth = healthValues.reduce((a, b) => a + b, 0) / healthValues.length;
    gameState.uptimePercentage = Math.max(0, averageHealth);
    
    updateGameMetrics();
}

function generateRandomEvents() {
    if (Math.random() < 0.15) { // 15% chance per cycle
        const eventTypes = [
            {
                type: "traffic_spike",
                message: "Massive traffic spike detected from botnet cluster",
                urgency: "high"
            },
            {
                type: "new_vector",
                message: "New attack vector identified - protocol exploitation",
                urgency: "medium"
            },
            {
                type: "amplification",
                message: "DNS amplification attack amplifying traffic 100x",
                urgency: "critical"
            },
            {
                type: "infrastructure_failure",
                message: "Backup systems failing under sustained pressure",
                urgency: "high"
            },
            {
                type: "coordination_detected",
                message: "Attack coordination with previous incidents confirmed",
                urgency: "medium"
            }
        ];
        
        const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        addAlert({
            type: event.urgency,
            message: event.message,
            timestamp: new Date().toLocaleTimeString()
        });
    }
}

export function generateInitialAlerts() {
    const initialAlerts = [
        {
            type: 'critical',
            message: 'Emergency Services: 911 system experiencing 95% packet loss',
            timestamp: new Date().toLocaleTimeString()
        },
        {
            type: 'critical',
            message: 'Hospital Network: Patient management systems failing',
            timestamp: new Date().toLocaleTimeString()
        },
        {
            type: 'high',
            message: 'Power Grid: SCADA systems under protocol attack',
            timestamp: new Date().toLocaleTimeString()
        },
        {
            type: 'high',
            message: 'Attack Source: 50,000+ unique IPs participating in botnet',
            timestamp: new Date().toLocaleTimeString()
        },
        {
            type: 'medium',
            message: 'Transportation: Traffic control experiencing intermittent failures',
            timestamp: new Date().toLocaleTimeString()
        }
    ];
    
    initialAlerts.forEach((alert, index) => {
        setTimeout(() => addAlert(alert), index * 2000);
    });
}

export function addAlert(alert) {
    const alertQueue = document.getElementById('alert-queue');
    if (!alertQueue) return;
    
    const alertDiv = document.createElement('div');
    const alertColors = {
        critical: { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-300' },
        high: { bg: 'bg-orange-900', border: 'border-orange-600', text: 'text-orange-300' },
        medium: { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-300' },
        low: { bg: 'bg-blue-900', border: 'border-blue-600', text: 'text-blue-300' }
    };
    
    const colors = alertColors[alert.type] || alertColors.medium;
    
    alertDiv.className = `alert-item ${colors.bg} border ${colors.border} rounded p-2 cursor-pointer hover:bg-opacity-80 transition-all animate-pulse`;
    alertDiv.innerHTML = `
        <div class="flex justify-between items-start mb-1">
            <span class="text-xs font-bold ${colors.text}">${alert.type.toUpperCase()}</span>
            <span class="text-gray-400 text-xs">${alert.timestamp}</span>
        </div>
        <div class="text-xs text-gray-200">${alert.message}</div>
    `;
    
    // Add click handler to dismiss alert
    alertDiv.addEventListener('click', () => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    });
    
    alertQueue.insertBefore(alertDiv, alertQueue.firstChild);
    
    // Limit to 10 alerts
    while (alertQueue.children.length > 10) {
        alertQueue.removeChild(alertQueue.lastChild);
    }
    
    // Remove pulse animation after 3 seconds
    setTimeout(() => {
        alertDiv.classList.remove('animate-pulse');
    }, 3000);
}

function addAttackFeedMessage(message) {
    const attackFeed = document.getElementById('attack-feed');
    if (!attackFeed) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'text-red-200 text-xs animate-pulse';
    messageDiv.textContent = message;
    
    attackFeed.insertBefore(messageDiv, attackFeed.firstChild);
    
    // Limit to 5 messages
    while (attackFeed.children.length > 5) {
        attackFeed.removeChild(attackFeed.lastChild);
    }
    
    setTimeout(() => {
        messageDiv.classList.remove('animate-pulse');
    }, 2000);
}

function updateMissionTimer() {
    if (!missionStartTime) return;
    
    const elapsed = Date.now() - missionStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    const timerElement = document.getElementById('mission-timer');
    if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    const survivedElement = document.getElementById('time-survived');
    if (survivedElement) {
        survivedElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function checkMissionStatus() {
    const totalWaveTime = attackWaves.reduce((sum, wave) => sum + wave.duration, 0);
    const elapsed = Date.now() - missionStartTime;
    
    // Check win condition: survive all waves with minimum infrastructure health
    if (elapsed >= totalWaveTime) {
        const averageHealth = Object.values(gameState.infrastructureHealth)
            .reduce((a, b) => a + b, 0) / Object.keys(gameState.infrastructureHealth).length;
        
        if (averageHealth >= 30 && gameState.mitigationsDeployed >= 10) {
            setTimeout(() => endMission(true), 2000);
        } else if (averageHealth < 10) {
            setTimeout(() => endMission(false), 1000);
        }
    }
    
    // Check failure condition: critical infrastructure completely down
    const criticalNodes = ['emergency', 'hospital'];
    const criticalFailures = criticalNodes.filter(nodeId => 
        gameState.infrastructureHealth[nodeId] <= 5
    );
    
    if (criticalFailures.length >= 2) {
        setTimeout(() => endMission(false), 1000);
    }
}

export function endMission(success) {
    clearInterval(attackInterval);
    
    if (success) {
        updateCommanderMessage("Outstanding work! You've successfully defended the city against The Null's coordinated attack. Critical infrastructure remains operational thanks to your quick thinking and strategic defense deployment.");
        
        // Enable level completion
        document.getElementById('complete-level').disabled = false;
        document.getElementById('complete-level').classList.remove('disabled:bg-gray-600');
        
        // Show success modal with detailed results
        setTimeout(() => showMissionResults(true), 1000);
    } else {
        updateCommanderMessage("Mission failed. Critical infrastructure has been compromised. The city is in chaos as emergency services are down and hospitals cannot function. We need to regroup and analyze what went wrong.");
        
        setTimeout(() => showMissionResults(false), 1000);
    }
}

function showMissionResults(success) {
    const modal = document.getElementById('results-modal');
    const icon = document.getElementById('result-icon');
    const title = document.getElementById('result-title');
    const message = document.getElementById('result-message');
    const feedback = document.getElementById('result-feedback');
    
    const elapsed = Date.now() - missionStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const avgHealth = Math.round(Object.values(gameState.infrastructureHealth)
        .reduce((a, b) => a + b, 0) / Object.keys(gameState.infrastructureHealth).length);
    
    if (success) {
        icon.textContent = '🏆';
        title.textContent = 'Mission Accomplished!';
        message.textContent = 'You successfully defended the city against The Null\'s coordinated DDoS attack.';
        feedback.innerHTML = `
            <div class="text-left space-y-3">
                <div class="bg-green-900/30 border border-green-600 rounded p-3">
                    <div class="text-green-300 font-bold mb-1">🛡️ Defense Successful</div>
                    <div class="text-green-200 text-sm">Critical infrastructure maintained operational capacity</div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="bg-gray-800 rounded p-2">
                        <div class="text-white font-semibold">Mission Time</div>
                        <div class="text-cyan-400">${minutes}:${seconds.toString().padStart(2, '0')}</div>
                    </div>
                    <div class="bg-gray-800 rounded p-2">
                        <div class="text-white font-semibold">Average Health</div>
                        <div class="text-green-400">${avgHealth}%</div>
                    </div>
                    <div class="bg-gray-800 rounded p-2">
                        <div class="text-white font-semibold">Mitigations</div>
                        <div class="text-blue-400">${gameState.mitigationsDeployed}</div>
                    </div>
                    <div class="bg-gray-800 rounded p-2">
                        <div class="text-white font-semibold">Attacks Blocked</div>
                        <div class="text-purple-400">${gameState.attacksMitigated}</div>
                    </div>
                </div>
                
                <div class="bg-blue-900/30 border border-blue-600 rounded p-3">
                    <div class="text-blue-300 font-bold mb-1">🎖️ Badge Earned</div>
                    <div class="text-blue-200 text-sm">Firewall Frontliner - DDoS Defense Specialist</div>
                </div>
            </div>
        `;
    } else {
        icon.textContent = '💥';
        title.textContent = 'Mission Failed';
        message.textContent = 'Critical infrastructure has been compromised by The Null\'s attack.';
        feedback.innerHTML = `
            <div class="text-left space-y-3">
                <div class="bg-red-900/30 border border-red-600 rounded p-3">
                    <div class="text-red-300 font-bold mb-1">⚠️ Infrastructure Compromised</div>
                    <div class="text-red-200 text-sm">Multiple critical systems have failed under sustained attack</div>
                </div>
                
                <div class="text-sm space-y-1">
                    <div><strong>Survival Time:</strong> ${minutes}:${seconds.toString().padStart(2, '0')}</div>
                    <div><strong>Final Health:</strong> ${avgHealth}%</div>
                    <div><strong>Mitigations Deployed:</strong> ${gameState.mitigationsDeployed}</div>
                </div>
                
                <div class="bg-yellow-900/30 border border-yellow-600 rounded p-3">
                    <div class="text-yellow-300 font-bold mb-1">📚 Lessons Learned</div>
                    <div class="text-yellow-200 text-sm">Focus on critical infrastructure first. Deploy multiple mitigation strategies quickly.</div>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
}

export function stopAttackSimulation() {
    if (attackInterval) {
        clearInterval(attackInterval);
        attackInterval = null;
    }
}
