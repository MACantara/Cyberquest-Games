import { gameState, updateGameMetrics, updateInfrastructureVisuals } from './gameState.js';
import { updateCommanderMessage } from './uiUpdates.js';

export function handleDefenseTool(toolType) {
    const node = gameState.currentNode;
    let effectiveness = Math.random() * 0.4 + 0.6; // 60-100% effectiveness
    
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
    gameState.infrastructureHealth[node.id] = Math.min(100, gameState.infrastructureHealth[node.id] + effectiveness * 20);
    updateInfrastructureVisuals();
    updateGameMetrics();
}

export function showDefenseResult(title, message, type) {
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

export function executeCommand(command) {
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
