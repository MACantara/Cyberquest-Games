export const gameState = {
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

export function updateGameMetrics() {
    document.getElementById('uptime-percentage').textContent = Math.round(gameState.uptimePercentage);
    document.getElementById('attacks-mitigated').textContent = gameState.attacksMitigated;
    document.getElementById('ips-blocked').textContent = gameState.ipsBlocked;
    document.getElementById('traffic-filtered').textContent = gameState.trafficFiltered;
    document.getElementById('response-time').textContent = Math.floor(Math.random() * 5) + 1;
}

export function updateInfrastructureVisuals() {
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
