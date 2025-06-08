import { gameState, updateGameMetrics, updateInfrastructureVisuals } from './gameState.js';
import { updateCommanderMessage } from './uiUpdates.js';
import { infrastructureNodes } from './infrastructureHandler.js';

const mitigationStrategies = {
    'rate-limit': {
        name: 'Rate Limiting',
        effectiveness: 0.4,
        duration: 30000, // 30 seconds
        cooldown: 5000,  // 5 seconds
        description: 'Throttles incoming requests to manageable levels',
        cost: 5,
        compatibleAttacks: ['volumetric', 'application'],
        icon: 'bi-speedometer2'
    },
    'geo-block': {
        name: 'Geographic Blocking',
        effectiveness: 0.6,
        duration: 45000, // 45 seconds
        cooldown: 8000,  // 8 seconds
        description: 'Blocks traffic from attack source countries',
        cost: 8,
        compatibleAttacks: ['volumetric', 'protocol'],
        icon: 'bi-globe'
    },
    'captcha': {
        name: 'CAPTCHA Challenge',
        effectiveness: 0.7,
        duration: 60000, // 60 seconds
        cooldown: 12000, // 12 seconds
        description: 'Filters automated bot traffic',
        cost: 12,
        compatibleAttacks: ['application', 'volumetric'],
        icon: 'bi-shield-check'
    },
    'cdn-redirect': {
        name: 'CDN Traffic Redirect',
        effectiveness: 0.8,
        duration: 90000, // 90 seconds
        cooldown: 15000, // 15 seconds
        description: 'Routes traffic through clean CDN infrastructure',
        cost: 15,
        compatibleAttacks: ['volumetric', 'application', 'protocol'],
        icon: 'bi-arrow-repeat'
    },
    'blackhole': {
        name: 'Emergency Blackhole',
        effectiveness: 0.95,
        duration: 20000, // 20 seconds
        cooldown: 3000,  // 3 seconds
        description: 'Drops all traffic (emergency measure)',
        cost: 3,
        compatibleAttacks: ['volumetric', 'application', 'protocol', 'iot'],
        icon: 'bi-ban',
        sideEffects: 'Blocks legitimate traffic'
    }
};

let activeCooldowns = {};

export function deployMitigation(nodeId, mitigationType) {
    const node = infrastructureNodes[nodeId];
    const strategy = mitigationStrategies[mitigationType];
    
    if (!node || !strategy) {
        console.error('Invalid node or mitigation type:', nodeId, mitigationType);
        return false;
    }
    
    // Check cooldown
    const cooldownKey = `${nodeId}-${mitigationType}`;
    if (activeCooldowns[cooldownKey] && Date.now() < activeCooldowns[cooldownKey]) {
        const remainingTime = Math.ceil((activeCooldowns[cooldownKey] - Date.now()) / 1000);
        showMitigationResult(nodeId, `${strategy.name} on cooldown for ${remainingTime}s`, 'warning');
        return false;
    }
    
    // Calculate effectiveness based on attack compatibility
    let actualEffectiveness = strategy.effectiveness;
    const nodeAttacks = Object.keys(node.attackPatterns);
    const compatibleAttacks = strategy.compatibleAttacks.filter(attack => nodeAttacks.includes(attack));
    
    if (compatibleAttacks.length === 0) {
        actualEffectiveness *= 0.3; // Reduced effectiveness for incompatible attacks
    } else {
        actualEffectiveness *= (compatibleAttacks.length / nodeAttacks.length);
    }
    
    // Deploy mitigation
    const mitigation = {
        type: mitigationType,
        nodeId: nodeId,
        effectiveness: actualEffectiveness,
        maxEffectiveness: actualEffectiveness,
        deployedAt: Date.now(),
        duration: strategy.duration,
        expiresAt: Date.now() + strategy.duration
    };
    
    // Add to active mitigations
    if (!gameState.activeMitigations[nodeId]) {
        gameState.activeMitigations[nodeId] = [];
    }
    gameState.activeMitigations[nodeId].push(mitigation);
    
    // Set cooldown
    activeCooldowns[cooldownKey] = Date.now() + strategy.cooldown;
    
    // Update statistics
    gameState.mitigationsDeployed++;
    gameState.attacksMitigated++;
    
    // Immediate health boost based on effectiveness
    const healthBoost = actualEffectiveness * 15; // Up to 15 health boost
    gameState.infrastructureHealth[nodeId] = Math.min(100, 
        gameState.infrastructureHealth[nodeId] + healthBoost);
    
    // Show result
    showMitigationResult(nodeId, 
        `${strategy.name} deployed with ${Math.round(actualEffectiveness * 100)}% effectiveness`,
        'success');
    
    // Schedule cleanup
    setTimeout(() => {
        removeMitigation(nodeId, mitigation);
    }, strategy.duration);
    
    // Update UI
    updateActiveMitigationsList(nodeId);
    updateGameMetrics();
    
    // Provide tactical feedback
    provideTacticalFeedback(nodeId, mitigationType, actualEffectiveness);
    
    return true;
}

function removeMitigation(nodeId, mitigation) {
    if (gameState.activeMitigations[nodeId]) {
        const index = gameState.activeMitigations[nodeId].findIndex(m => 
            m.deployedAt === mitigation.deployedAt && m.type === mitigation.type);
        
        if (index !== -1) {
            gameState.activeMitigations[nodeId].splice(index, 1);
            updateActiveMitigationsList(nodeId);
            
            showMitigationResult(nodeId, 
                `${mitigationStrategies[mitigation.type].name} expired`, 
                'info');
        }
    }
}

function updateActiveMitigationsList(nodeId) {
    const activeList = document.getElementById('active-list');
    if (!activeList || gameState.currentNode?.id !== nodeId) return;
    
    const activeMitigations = gameState.activeMitigations[nodeId] || [];
    
    if (activeMitigations.length === 0) {
        activeList.innerHTML = '<div class="text-gray-500 text-xs">No active defenses</div>';
        return;
    }
    
    activeList.innerHTML = activeMitigations.map(mitigation => {
        const strategy = mitigationStrategies[mitigation.type];
        const remaining = Math.max(0, mitigation.expiresAt - Date.now());
        const remainingSeconds = Math.ceil(remaining / 1000);
        
        return `
            <div class="bg-green-800/30 border border-green-600 rounded p-2 text-xs">
                <div class="flex items-center justify-between">
                    <span class="text-green-300">${strategy.name}</span>
                    <span class="text-green-400">${remainingSeconds}s</span>
                </div>
                <div class="text-green-200 text-xs">
                    ${Math.round(mitigation.effectiveness * 100)}% effective
                </div>
            </div>
        `;
    }).join('');
}

function showMitigationResult(nodeId, message, type) {
    const colors = {
        success: { bg: 'bg-green-900', border: 'border-green-600', text: 'text-green-300' },
        warning: { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-300' },
        error: { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-300' },
        info: { bg: 'bg-blue-900', border: 'border-blue-600', text: 'text-blue-300' }
    };
    
    const color = colors[type] || colors.info;
    
    // Create floating notification
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 ${color.bg} border ${color.border} rounded p-3 z-50 animate-slide-in max-w-sm`;
    notification.innerHTML = `
        <div class="${color.text} text-sm font-semibold">${infrastructureNodes[nodeId]?.name || nodeId}</div>
        <div class="text-gray-200 text-xs mt-1">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function provideTacticalFeedback(nodeId, mitigationType, effectiveness) {
    const node = infrastructureNodes[nodeId];
    const strategy = mitigationStrategies[mitigationType];
    
    let feedback = `${strategy.name} deployed on ${node.name}. `;
    
    if (effectiveness > 0.7) {
        feedback += "Excellent choice! This mitigation is highly effective against the current attack patterns.";
    } else if (effectiveness > 0.4) {
        feedback += "Good deployment. This mitigation provides moderate protection.";
    } else {
        feedback += "Suboptimal choice. Consider alternative mitigations better suited to this attack type.";
    }
    
    // Add strategic suggestions
    const nodeAttacks = Object.keys(node.attackPatterns);
    const incompatibleAttacks = nodeAttacks.filter(attack => 
        !strategy.compatibleAttacks.includes(attack));
    
    if (incompatibleAttacks.length > 0) {
        feedback += ` Note: This mitigation is less effective against ${incompatibleAttacks.join(', ')} attacks affecting this node.`;
    }
    
    updateCommanderMessage(feedback);
}

export function executeCustomCommand(command, nodeId) {
    if (!command || !nodeId) return false;
    
    const cmd = command.toLowerCase().trim();
    
    // Parse common firewall/security commands
    if (cmd.includes('block') || cmd.includes('deny')) {
        return executeBlockCommand(cmd, nodeId);
    } else if (cmd.includes('allow') || cmd.includes('permit')) {
        return executeAllowCommand(cmd, nodeId);
    } else if (cmd.includes('limit') || cmd.includes('throttle')) {
        return executeLimitCommand(cmd, nodeId);
    } else if (cmd.includes('redirect') || cmd.includes('reroute')) {
        return executeRedirectCommand(cmd, nodeId);
    } else {
        showMitigationResult(nodeId, 
            `Unrecognized command: ${command}. Try: block, allow, limit, redirect`, 
            'error');
        return false;
    }
}

function executeBlockCommand(cmd, nodeId) {
    // Simulate IP/subnet blocking
    const ipMatch = cmd.match(/(\d+\.\d+\.\d+\.\d+)/);
    const subnetMatch = cmd.match(/(\d+\.\d+\.\d+\.\d+\/\d+)/);
    
    if (ipMatch || subnetMatch) {
        const target = subnetMatch ? subnetMatch[1] : ipMatch[1];
        gameState.ipsBlocked += subnetMatch ? 256 : 1;
        
        showMitigationResult(nodeId, 
            `Blocked ${target} - ${subnetMatch ? '256 IPs' : '1 IP'} added to blacklist`, 
            'success');
        
        // Small health improvement
        gameState.infrastructureHealth[nodeId] = Math.min(100,
            gameState.infrastructureHealth[nodeId] + 2);
        
        updateGameMetrics();
        return true;
    } else {
        showMitigationResult(nodeId, 
            'Block command requires IP address (e.g., "block 192.168.1.1")', 
            'error');
        return false;
    }
}

function executeAllowCommand(cmd, nodeId) {
    showMitigationResult(nodeId, 
        'Allow rule configured - legitimate traffic prioritized', 
        'success');
    return true;
}

function executeLimitCommand(cmd, nodeId) {
    const rateMatch = cmd.match(/(\d+)/);
    if (rateMatch) {
        const rate = rateMatch[1];
        showMitigationResult(nodeId, 
            `Rate limiting set to ${rate} requests/second`, 
            'success');
        
        // Temporary rate limiting effect
        setTimeout(() => {
            deployMitigation(nodeId, 'rate-limit');
        }, 1000);
        
        return true;
    } else {
        showMitigationResult(nodeId, 
            'Limit command requires rate (e.g., "limit 100")', 
            'error');
        return false;
    }
}

function executeRedirectCommand(cmd, nodeId) {
    showMitigationResult(nodeId, 
        'Traffic redirect configured - routing through backup infrastructure', 
        'success');
    
    // Apply redirect effect
    setTimeout(() => {
        deployMitigation(nodeId, 'cdn-redirect');
    }, 2000);
    
    return true;
}

// Initialize mitigation action buttons
export function initializeMitigationButtons() {
    document.querySelectorAll('.mitigation-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const currentNode = gameState.currentNode;
            
            if (!currentNode) {
                updateCommanderMessage("Select an infrastructure node first before deploying mitigations.");
                return;
            }
            
            if (deployMitigation(currentNode.id, action)) {
                // Visual feedback
                this.style.opacity = '0.6';
                this.disabled = true;
                
                const cooldown = mitigationStrategies[action].cooldown;
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.disabled = false;
                }, cooldown);
            }
        });
    });
}

// Initialize command input
export function initializeCommandInput() {
    const commandInput = document.getElementById('command-input');
    const executeBtn = document.getElementById('execute-command');
    
    if (commandInput && executeBtn) {
        const executeCommand = () => {
            const command = commandInput.value.trim();
            if (!command) return;
            
            const currentNode = gameState.currentNode;
            if (!currentNode) {
                updateCommanderMessage("Select an infrastructure node first.");
                return;
            }
            
            executeCustomCommand(command, currentNode.id);
            commandInput.value = '';
        };
        
        executeBtn.addEventListener('click', executeCommand);
        commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeCommand();
            }
        });
    }
}
