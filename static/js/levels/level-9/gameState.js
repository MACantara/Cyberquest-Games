export const gameState = {
    // Mission timing
    missionStartTime: null,
    
    // Infrastructure health (0-100 for each node)
    infrastructureHealth: {
        hospital: 30,
        power: 45,
        emergency: 15,
        transport: 75,
        financial: 85,
        water: 90
    },
    
    // Attack simulation state
    currentAttackIntensity: 0.3,
    attackVolume: 0,
    attackingSources: 0,
    activeTargets: [],
    lastWaveIndex: -1,
    
    // Defense metrics
    mitigationsDeployed: 0,
    attacksMitigated: 0,
    ipsBlocked: 0,
    trafficFiltered: 0,
    responseTime: 0,
    uptimePercentage: 100,
    
    // Active defenses
    activeMitigations: {}, // nodeId -> array of active mitigations
    
    // UI state
    currentNode: null,
    selectedNodeHistory: [],
    
    // Mission objectives tracking
    nodesDefended: 0,
    criticalUptime: true,
    responseSpeed: 0,
    
    // Performance scoring
    defenseScore: 0,
    missionCompleted: false
};

export function updateGameMetrics() {
    // Update real-time statistics display
    const elements = {
        'uptime-percentage': Math.round(gameState.uptimePercentage),
        'attacks-mitigated': gameState.attacksMitigated,
        'ips-blocked': gameState.ipsBlocked,
        'traffic-filtered': gameState.trafficFiltered,
        'response-time': calculateAverageResponseTime(),
        'mitigations-deployed': gameState.mitigationsDeployed,
        'attack-volume': `${gameState.attackVolume} Gbps`,
        'nodes-under-attack': gameState.activeTargets.length,
        'defense-score': calculateDefenseScore()
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Update progress indicators
    updateProgressMeters();
    updateDefenseReadiness();
}

export function updateInfrastructureVisuals() {
    Object.keys(gameState.infrastructureHealth).forEach(nodeId => {
        const health = gameState.infrastructureHealth[nodeId];
        
        // Update SVG node visual states
        updateSVGNodeVisual(nodeId, health);
        
        // Update sidebar status if this node is selected
        if (gameState.currentNode && gameState.currentNode.id === nodeId) {
            updateSelectedNodeStatus(nodeId, health);
        }
    });
    
    // Update overall network health
    updateOverallNetworkHealth();
}

function updateSVGNodeVisual(nodeId, health) {
    const nodeElement = document.getElementById(`${nodeId}-node`);
    if (!nodeElement) return;
    
    const circle = nodeElement.querySelector('.node-circle');
    const healthBar = nodeElement.querySelector('.health-bar');
    
    if (circle) {
        // Update circle color and animation based on health
        if (health > 70) {
            circle.setAttribute('fill', '#16a34a'); // Green
            circle.setAttribute('stroke', '#86efac');
            circle.classList.remove('animate-pulse');
        } else if (health > 40) {
            circle.setAttribute('fill', '#ea580c'); // Orange
            circle.setAttribute('stroke', '#fed7aa');
            circle.classList.add('animate-pulse');
        } else {
            circle.setAttribute('fill', '#dc2626'); // Red
            circle.setAttribute('stroke', '#fca5a5');
            circle.classList.add('animate-pulse');
        }
    }
    
    if (healthBar) {
        const healthWidth = Math.max(5, (health / 100) * 60); // Minimum 5px width
        healthBar.setAttribute('width', healthWidth);
        
        // Update health bar color
        if (health > 70) {
            healthBar.setAttribute('fill', '#16a34a');
        } else if (health > 40) {
            healthBar.setAttribute('fill', '#ea580c');
        } else {
            healthBar.setAttribute('fill', '#dc2626');
        }
    }
    
    // Update attack indicators for active targets
    const attackIndicator = nodeElement.querySelector('.attack-indicator');
    if (attackIndicator) {
        if (gameState.activeTargets.includes(nodeId)) {
            attackIndicator.style.display = 'block';
        } else {
            attackIndicator.style.display = 'none';
        }
    }
}

function updateSelectedNodeStatus(nodeId, health) {
    // Update node details panel
    const elements = {
        'node-traffic': `${Math.floor(gameState.attackVolume * (1 + Math.random() * 0.5))} Gbps`,
        'attack-type': determineAttackType(nodeId),
        'source-ips': `${Math.floor(gameState.attackingSources * 0.1 + Math.random() * 1000)}`,
        'service-health': getHealthStatus(health)
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

function determineAttackType(nodeId) {
    const attackTypes = {
        hospital: ['Application Layer', 'Database Flooding', 'API Abuse'],
        power: ['Protocol Exploitation', 'SCADA Targeting', 'IoT Amplification'],
        emergency: ['Volumetric', 'Call System Overload', 'Database Injection'],
        transport: ['Control System Abuse', 'IoT Botnet', 'Protocol Flooding'],
        financial: ['Transaction Flooding', 'API Rate Abuse', 'Authentication Bypass'],
        water: ['Industrial Control', 'Sensor Network Attack', 'Protocol Manipulation']
    };
    
    const types = attackTypes[nodeId] || ['Mixed Vector'];
    return types[Math.floor(Math.random() * types.length)];
}

function getHealthStatus(health) {
    if (health > 80) return 'Operational';
    if (health > 60) return 'Degraded';
    if (health > 30) return 'Critical';
    return 'Failing';
}

function calculateAverageResponseTime() {
    const baseTime = 1.5;
    const loadFactor = (100 - gameState.uptimePercentage) / 100;
    const mitigationFactor = Math.max(0.1, 1 - (gameState.mitigationsDeployed * 0.05));
    
    return (baseTime + (loadFactor * 3) * mitigationFactor).toFixed(1);
}

function calculateDefenseScore() {
    const healthScore = Object.values(gameState.infrastructureHealth)
        .reduce((sum, health) => sum + health, 0) / Object.keys(gameState.infrastructureHealth).length;
    
    const mitigationScore = Math.min(100, gameState.mitigationsDeployed * 10);
    const speedScore = Math.max(0, 100 - (gameState.responseTime * 10));
    
    return Math.round((healthScore * 0.5) + (mitigationScore * 0.3) + (speedScore * 0.2));
}

function updateProgressMeters() {
    // Update overall health meter
    const healthValues = Object.values(gameState.infrastructureHealth);
    const avgHealth = healthValues.reduce((a, b) => a + b, 0) / healthValues.length;
    
    const overallHealthMeter = document.getElementById('overall-health');
    if (overallHealthMeter) {
        overallHealthMeter.style.width = `${Math.max(5, avgHealth)}%`;
        
        if (avgHealth > 70) {
            overallHealthMeter.className = 'bg-green-400 h-2 rounded-full transition-all';
        } else if (avgHealth > 40) {
            overallHealthMeter.className = 'bg-yellow-400 h-2 rounded-full transition-all';
        } else {
            overallHealthMeter.className = 'bg-red-400 h-2 rounded-full transition-all';
        }
    }
    
    // Update nodes defended counter
    const nodesInGoodHealth = healthValues.filter(health => health > 50).length;
    const nodesDefendedElement = document.getElementById('nodes-defended');
    if (nodesDefendedElement) {
        nodesDefendedElement.textContent = `${nodesInGoodHealth}/${healthValues.length}`;
    }
}

function updateDefenseReadiness() {
    const readinessMeter = document.getElementById('defense-readiness');
    if (!readinessMeter) return;
    
    // Calculate readiness based on active mitigations and response capability
    const totalActiveMitigations = Object.values(gameState.activeMitigations)
        .reduce((sum, mitigations) => sum + mitigations.length, 0);
    
    const maxMitigations = Object.keys(gameState.infrastructureHealth).length * 3; // 3 per node max
    const mitigationReadiness = Math.min(100, (totalActiveMitigations / maxMitigations) * 100);
    
    const responseReadiness = Math.max(0, 100 - (gameState.responseTime * 20));
    const overallReadiness = (mitigationReadiness * 0.7) + (responseReadiness * 0.3);
    
    readinessMeter.style.width = `${overallReadiness}%`;
    
    if (overallReadiness > 80) {
        readinessMeter.className = 'bg-green-400 h-2 rounded-full transition-all';
    } else if (overallReadiness > 50) {
        readinessMeter.className = 'bg-blue-400 h-2 rounded-full transition-all';
    } else {
        readinessMeter.className = 'bg-orange-400 h-2 rounded-full transition-all';
    }
}

function updateOverallNetworkHealth() {
    const avgHealth = Object.values(gameState.infrastructureHealth)
        .reduce((sum, health) => sum + health, 0) / Object.keys(gameState.infrastructureHealth).length;
    
    gameState.uptimePercentage = Math.max(0, avgHealth);
    
    // Update uptime percentage in header
    const uptimeElement = document.getElementById('uptime-percentage');
    if (uptimeElement) {
        uptimeElement.textContent = Math.round(gameState.uptimePercentage);
        
        // Color coding for uptime status
        if (gameState.uptimePercentage > 80) {
            uptimeElement.className = 'text-lg font-semibold text-green-400';
        } else if (gameState.uptimePercentage > 50) {
            uptimeElement.className = 'text-lg font-semibold text-yellow-400';
        } else {
            uptimeElement.className = 'text-lg font-semibold text-red-400 animate-pulse';
        }
    }
}

export function selectNode(nodeId) {
    const nodeData = {
        id: nodeId,
        name: getNodeDisplayName(nodeId),
        health: gameState.infrastructureHealth[nodeId],
        isUnderAttack: gameState.activeTargets.includes(nodeId)
    };
    
    gameState.currentNode = nodeData;
    gameState.selectedNodeHistory.push({
        nodeId: nodeId,
        timestamp: Date.now(),
        health: nodeData.health
    });
    
    // Update node selection UI
    updateNodeSelectionUI(nodeData);
    
    // Track response time
    gameState.responseTime = Date.now();
}

function getNodeDisplayName(nodeId) {
    const names = {
        hospital: 'Medical Centers',
        power: 'Power Grid',
        emergency: 'Emergency Services',
        transport: 'Transportation',
        financial: 'Banking Systems',
        water: 'Water Treatment'
    };
    return names[nodeId] || nodeId;
}

function updateNodeSelectionUI(nodeData) {
    // Show node details panel
    document.getElementById('no-selection').classList.add('hidden');
    document.getElementById('node-details').classList.remove('hidden');
    
    // Update node info
    document.getElementById('node-name').textContent = nodeData.name;
    document.getElementById('node-icon').textContent = getNodeIcon(nodeData.id);
    
    const statusElement = document.getElementById('node-status');
    if (nodeData.isUnderAttack) {
        statusElement.textContent = '🚨 UNDER ATTACK';
        statusElement.className = 'text-red-400 text-sm font-bold animate-pulse';
    } else if (nodeData.health < 50) {
        statusElement.textContent = '⚠️ DEGRADED';
        statusElement.className = 'text-yellow-400 text-sm font-bold';
    } else {
        statusElement.textContent = '✅ STABLE';
        statusElement.className = 'text-green-400 text-sm';
    }
}

function getNodeIcon(nodeId) {
    const icons = {
        hospital: '🏥',
        power: '⚡',
        emergency: '🚨',
        transport: '🚊',
        financial: '🏦',
        water: '💧'
    };
    return icons[nodeId] || '🏢';
}

// Reset game state for new mission
export function resetGameState() {
    Object.assign(gameState, {
        missionStartTime: null,
        infrastructureHealth: {
            hospital: 30,
            power: 45,
            emergency: 15,
            transport: 75,
            financial: 85,
            water: 90
        },
        currentAttackIntensity: 0.3,
        attackVolume: 0,
        attackingSources: 0,
        activeTargets: [],
        lastWaveIndex: -1,
        mitigationsDeployed: 0,
        attacksMitigated: 0,
        ipsBlocked: 0,
        trafficFiltered: 0,
        responseTime: 0,
        uptimePercentage: 100,
        activeMitigations: {},
        currentNode: null,
        selectedNodeHistory: [],
        nodesDefended: 0,
        criticalUptime: true,
        responseSpeed: 0,
        defenseScore: 0,
        missionCompleted: false
    });
}
