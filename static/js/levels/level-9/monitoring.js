export function startTrafficMonitoring(node) {
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

export function displayAttackIndicators(node) {
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
