import { gameState } from './gameState.js';
import { updateCommanderMessage } from './uiUpdates.js';
import { startTrafficMonitoring, displayAttackIndicators } from './monitoring.js';

export let infrastructureNodes = {};

export async function loadInfrastructure() {
    try {
        const response = await fetch('/static/js/levels/level-9/data/infrastructure.json');
        infrastructureNodes = await response.json();
    } catch (error) {
        console.error('Failed to load infrastructure:', error);
    }
}

export function selectInfrastructureNode(nodeId) {
    gameState.currentNode = infrastructureNodes[nodeId];
    displayDefensePanel(gameState.currentNode);
    document.getElementById('tutorial-infrastructure').classList.add('hidden');
    
    if (nodeId === 'emergency') {
        updateCommanderMessage("Emergency Services are critical infrastructure. Deploy firewall rules and load balancing to keep 911 systems operational.");
    }
}

export function displayDefensePanel(node) {
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

export function closeDefensePanel() {
    document.getElementById('defense-panel').classList.add('hidden');
    document.getElementById('dashboard-placeholder').classList.remove('hidden');
    gameState.currentNode = null;
}
