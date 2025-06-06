import { gameState, updateInfrastructureVisuals } from './gameState.js';
import { infrastructureNodes } from './infrastructureHandler.js';

export function startAttackSimulation() {
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

export function generateInitialAlerts() {
    const alerts = [
        { type: 'critical', message: 'Emergency Services: 911 system experiencing 70% packet loss', node: 'emergency' },
        { type: 'high', message: 'Power Grid: Unusual SCADA protocol traffic detected', node: 'power' },
        { type: 'medium', message: 'Transportation: Traffic control system latency spike', node: 'transport' }
    ];
    
    alerts.forEach(alert => addAlert(alert));
}

export function generateRandomAlert() {
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

export function addAlert(alert) {
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

export function endGame(success) {
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
