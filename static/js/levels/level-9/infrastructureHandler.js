import { gameState, selectNode, updateInfrastructureVisuals } from './gameState.js';
import { startTrafficMonitoring, displayAttackIndicators } from './monitoring.js';
import { updateCommanderMessage } from './uiUpdates.js';

export let infrastructureNodes = {};

export async function loadInfrastructureData() {
    try {
        const response = await fetch('/static/js/levels/level-9/data/infrastructure.json');
        infrastructureNodes = await response.json();
        
        console.log('Infrastructure nodes loaded:', Object.keys(infrastructureNodes));
        initializeNodeInteractions();
        return true;
    } catch (error) {
        console.error('Failed to load infrastructure data:', error);
        // Fallback infrastructure data
        infrastructureNodes = {
            hospital: {
                id: "hospital",
                name: "Medical Centers",
                priority: 1,
                baseHealth: 100,
                currentHealth: 30,
                attacks: ["volumetric", "application"],
                description: "Patient records and emergency medical services",
                icon: "🏥",
                attackPatterns: {
                    volumetric: { intensity: 85, frequency: 0.8 },
                    application: { intensity: 60, frequency: 0.6 }
                }
            },
            power: {
                id: "power", 
                name: "Power Grid",
                priority: 2,
                baseHealth: 100,
                currentHealth: 45,
                attacks: ["protocol", "volumetric"],
                description: "City electrical infrastructure",
                icon: "⚡",
                attackPatterns: {
                    protocol: { intensity: 90, frequency: 0.9 },
                    volumetric: { intensity: 70, frequency: 0.5 }
                }
            },
            emergency: {
                id: "emergency",
                name: "Emergency Services", 
                priority: 1,
                baseHealth: 100,
                currentHealth: 15,
                attacks: ["application", "volumetric", "protocol"],
                description: "911 dispatch and emergency response",
                icon: "🚨",
                attackPatterns: {
                    application: { intensity: 95, frequency: 0.95 },
                    volumetric: { intensity: 80, frequency: 0.8 },
                    protocol: { intensity: 55, frequency: 0.4 }
                }
            }
        };
        initializeNodeInteractions();
        return false;
    }
}

function initializeNodeInteractions() {
    // Add click handlers to SVG infrastructure nodes
    document.querySelectorAll('.infrastructure-node').forEach(nodeElement => {
        nodeElement.addEventListener('click', function() {
            const nodeId = this.dataset.node;
            if (infrastructureNodes[nodeId]) {
                handleNodeSelection(nodeId);
            }
        });
        
        // Add hover effects
        nodeElement.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        nodeElement.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Initialize close defense panel handler
    const closeDefenseBtn = document.getElementById('close-defense');
    if (closeDefenseBtn) {
        closeDefenseBtn.addEventListener('click', () => {
            closeNodeSelection();
        });
    }
    
    updateCommanderMessage("Infrastructure nodes loaded. Click on any node (🏥 Hospital, ⚡ Power, 🚨 Emergency, etc.) to begin defense operations.");
}

function handleNodeSelection(nodeId) {
    const node = infrastructureNodes[nodeId];
    if (!node) return;
    
    // Update game state
    selectNode(nodeId);
    
    // Update UI to show node details
    showNodeDetails(node);
    
    // Start monitoring for this node
    startTrafficMonitoring(node);
    displayAttackIndicators(node);
    
    // Visual feedback on map
    highlightSelectedNode(nodeId);
    
    updateCommanderMessage(`${node.name} selected. Analyzing attack patterns and deploying monitoring systems. Choose appropriate mitigations to defend this critical infrastructure.`);
}

function showNodeDetails(node) {
    // Show the defense panel
    document.getElementById('no-selection').classList.add('hidden');
    document.getElementById('node-details').classList.remove('hidden');
    
    // Update node information
    document.getElementById('node-icon').textContent = node.icon;
    document.getElementById('node-name').textContent = node.name;
    
    // Update node status based on current health
    const statusElement = document.getElementById('node-status');
    const health = gameState.infrastructureHealth[node.id];
    
    if (gameState.activeTargets.includes(node.id)) {
        statusElement.textContent = '🚨 UNDER ATTACK';
        statusElement.className = 'text-red-400 text-sm font-bold animate-pulse';
    } else if (health < 30) {
        statusElement.textContent = '💥 CRITICAL FAILURE';
        statusElement.className = 'text-red-500 text-sm font-bold';
    } else if (health < 50) {
        statusElement.textContent = '⚠️ DEGRADED SERVICE';
        statusElement.className = 'text-yellow-400 text-sm font-bold';
    } else if (health < 80) {
        statusElement.textContent = '⚡ UNDER STRESS';
        statusElement.className = 'text-orange-400 text-sm';
    } else {
        statusElement.textContent = '✅ OPERATIONAL';
        statusElement.className = 'text-green-400 text-sm';
    }
    
    // Update attack analysis data
    updateNodeAttackData(node);
}

function updateNodeAttackData(node) {
    // Update real-time attack statistics
    const baseTraffic = 50;
    const attackMultiplier = gameState.activeTargets.includes(node.id) ? 
        gameState.currentAttackIntensity * 10 : 1;
    
    const currentTraffic = Math.floor(baseTraffic * attackMultiplier + (Math.random() * 20));
    
    document.getElementById('node-traffic').textContent = `${currentTraffic} Gbps`;
    
    // Determine primary attack type
    const attackTypes = {
        hospital: ['Application Layer DDoS', 'Database Flooding', 'API Rate Abuse'],
        power: ['SCADA Protocol Attack', 'IoT Botnet Flood', 'Industrial Control Exploit'],
        emergency: ['Call System Overload', 'Volumetric Attack', 'Service Exhaustion'],
        transport: ['Traffic Control Hack', 'IoT Sensor Flood', 'Route Manipulation'],
        financial: ['Payment System DDoS', 'Transaction Flooding', 'ATM Network Attack'],
        water: ['SCADA Intrusion', 'Sensor Network Jam', 'Chemical Control Hack']
    };
    
    const nodeAttackTypes = attackTypes[node.id] || ['Mixed Vector Attack'];
    const currentAttackType = nodeAttackTypes[Math.floor(Math.random() * nodeAttackTypes.length)];
    
    document.getElementById('attack-type').textContent = currentAttackType;
    
    // Calculate attacking sources
    const baseSources = 1000;
    const sources = Math.floor(baseSources * attackMultiplier + (Math.random() * 500));
    
    document.getElementById('source-ips').textContent = sources.toLocaleString();
    
    // Update service health status
    const health = gameState.infrastructureHealth[node.id];
    let healthStatus = 'Operational';
    
    if (health < 20) {
        healthStatus = 'Critical Failure';
    } else if (health < 40) {
        healthStatus = 'Severe Degradation';
    } else if (health < 60) {
        healthStatus = 'Moderate Issues';
    } else if (health < 80) {
        healthStatus = 'Minor Problems';
    }
    
    document.getElementById('service-health').textContent = healthStatus;
}

function highlightSelectedNode(nodeId) {
    // Remove previous highlights
    document.querySelectorAll('.infrastructure-node').forEach(node => {
        const circle = node.querySelector('.node-circle');
        if (circle) {
            circle.style.filter = 'none';
            circle.style.transform = 'none';
        }
    });
    
    // Highlight selected node
    const selectedNode = document.getElementById(`${nodeId}-node`);
    if (selectedNode) {
        const circle = selectedNode.querySelector('.node-circle');
        if (circle) {
            circle.style.filter = 'drop-shadow(0 0 10px currentColor)';
            circle.style.transform = 'scale(1.1)';
        }
    }
}

function closeNodeSelection() {
    // Hide node details panel
    document.getElementById('node-details').classList.add('hidden');
    document.getElementById('no-selection').classList.remove('hidden');
    
    // Clear game state
    gameState.currentNode = null;
    
    // Remove node highlights
    document.querySelectorAll('.infrastructure-node').forEach(node => {
        const circle = node.querySelector('.node-circle');
        if (circle) {
            circle.style.filter = 'none';
            circle.style.transform = 'none';
        }
    });
    
    updateCommanderMessage("Node deselected. Choose another infrastructure target to continue defense operations.");
}

export function getNodeDisplayData(nodeId) {
    const node = infrastructureNodes[nodeId];
    if (!node) return null;
    
    return {
        ...node,
        currentHealth: gameState.infrastructureHealth[nodeId],
        isUnderAttack: gameState.activeTargets.includes(nodeId),
        activeMitigations: gameState.activeMitigations[nodeId] || []
    };
}

export function updateNodeStatus(nodeId) {
    if (gameState.currentNode && gameState.currentNode.id === nodeId) {
        const node = infrastructureNodes[nodeId];
        if (node) {
            updateNodeAttackData(node);
        }
    }
}

// Auto-update node data periodically
setInterval(() => {
    if (gameState.currentNode) {
        updateNodeStatus(gameState.currentNode.id);
    }
}, 3000);
