import { gameState } from './gameState.js';
import { addAlert } from './attackSimulation.js';

let monitoringIntervals = {};

export function startTrafficMonitoring(node) {
    // Clear any existing monitoring for this node
    if (monitoringIntervals[node.id]) {
        clearInterval(monitoringIntervals[node.id]);
    }
    
    const trafficMonitor = document.getElementById('traffic-monitor');
    if (!trafficMonitor) return;
    
    // Clear previous content
    trafficMonitor.innerHTML = '';
    
    // Start real-time traffic monitoring
    monitoringIntervals[node.id] = setInterval(() => {
        generateTrafficEntry(node, trafficMonitor);
    }, 1500);
    
    // Generate initial traffic data
    for (let i = 0; i < 5; i++) {
        setTimeout(() => generateTrafficEntry(node, trafficMonitor), i * 300);
    }
}

function generateTrafficEntry(node, container) {
    if (!container) return;
    
    const isUnderAttack = gameState.activeTargets.includes(node.id);
    const attackIntensity = gameState.currentAttackIntensity || 0.3;
    
    // Generate realistic IP addresses
    const suspiciousIPs = [
        '185.220.101.45', '203.0.113.15', '198.51.100.22', '192.0.2.88',
        '172.16.254.1', '10.0.0.100', '192.168.1.200', '203.0.113.5',
        '185.220.102.67', '198.51.100.89', '203.0.113.199', '192.0.2.156'
    ];
    
    const legitimateIPs = [
        '192.168.1.10', '192.168.1.15', '10.0.0.5', '172.16.1.20',
        '192.168.2.30', '10.0.1.8', '172.16.2.45', '192.168.3.12'
    ];
    
    // Determine if this traffic entry should be suspicious
    let isSuspicious = false;
    let sourceIP = '';
    let trafficType = 'NORMAL';
    let protocol = 'HTTPS';
    
    if (isUnderAttack) {
        // Higher chance of suspicious traffic when under attack
        isSuspicious = Math.random() < (0.7 + attackIntensity * 0.2);
        
        if (isSuspicious) {
            sourceIP = suspiciousIPs[Math.floor(Math.random() * suspiciousIPs.length)];
            const attackTypes = ['VOLUMETRIC', 'BOTNET', 'AMPLIFICATION', 'SYN FLOOD', 'HTTP FLOOD'];
            trafficType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
            protocol = Math.random() > 0.5 ? 'TCP' : 'UDP';
        } else {
            sourceIP = legitimateIPs[Math.floor(Math.random() * legitimateIPs.length)];
        }
    } else {
        // Normal traffic with occasional suspicious activity
        isSuspicious = Math.random() < 0.15;
        sourceIP = isSuspicious ? 
            suspiciousIPs[Math.floor(Math.random() * suspiciousIPs.length)] :
            legitimateIPs[Math.floor(Math.random() * legitimateIPs.length)];
        
        if (isSuspicious) {
            trafficType = 'PROBE';
        }
    }
    
    // Calculate traffic volume
    const baseVolume = isSuspicious ? Math.floor(Math.random() * 5000) + 1000 : Math.floor(Math.random() * 100) + 10;
    const volume = Math.floor(baseVolume * (1 + attackIntensity));
    
    // Create traffic entry
    const trafficEntry = document.createElement('div');
    trafficEntry.className = `flex justify-between items-center text-xs p-2 rounded mb-1 ${
        isSuspicious ? 'bg-red-800/30 border border-red-600' : 'bg-gray-700/30'
    }`;
    
    trafficEntry.innerHTML = `
        <div class="flex-1">
            <div class="flex items-center gap-2">
                <span class="font-mono text-gray-300">${sourceIP}</span>
                <span class="text-xs px-1 rounded ${isSuspicious ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}">${protocol}</span>
            </div>
            <div class="text-xs text-gray-400 mt-1">${volume.toLocaleString()} req/s</div>
        </div>
        <div class="text-right">
            <div class="${isSuspicious ? 'text-red-400' : 'text-green-400'} font-semibold">${trafficType}</div>
            <div class="text-xs text-gray-400">${new Date().toLocaleTimeString()}</div>
        </div>
    `;
    
    // Add click handler for detailed analysis
    trafficEntry.addEventListener('click', () => {
        showTrafficDetails(sourceIP, trafficType, volume, isSuspicious, protocol);
    });
    
    container.insertBefore(trafficEntry, container.firstChild);
    
    // Keep only the last 8 entries
    while (container.children.length > 8) {
        container.removeChild(container.lastChild);
    }
    
    // Generate alerts for suspicious traffic
    if (isSuspicious && Math.random() < 0.3) {
        generateTrafficAlert(sourceIP, trafficType, volume, node.name);
    }
}

function showTrafficDetails(ip, type, volume, isSuspicious, protocol) {
    if (!isSuspicious) return;
    
    // Show detailed traffic analysis
    addAlert({
        type: 'high',
        message: `Detailed analysis: ${ip} - ${volume.toLocaleString()} ${protocol} requests detected as ${type}`,
        timestamp: new Date().toLocaleTimeString()
    });
}

function generateTrafficAlert(ip, type, volume, nodeName) {
    const alertMessages = {
        'VOLUMETRIC': `High-volume attack detected from ${ip} targeting ${nodeName}`,
        'BOTNET': `Botnet activity identified: ${ip} part of coordinated attack on ${nodeName}`,
        'AMPLIFICATION': `DNS amplification attack from ${ip} affecting ${nodeName}`,
        'SYN FLOOD': `SYN flood attack detected from ${ip} against ${nodeName}`,
        'HTTP FLOOD': `HTTP flood attack targeting ${nodeName} web services from ${ip}`,
        'PROBE': `Reconnaissance activity detected from ${ip} probing ${nodeName}`
    };
    
    addAlert({
        type: type === 'PROBE' ? 'medium' : 'high',
        message: alertMessages[type] || `Suspicious activity from ${ip} targeting ${nodeName}`,
        timestamp: new Date().toLocaleTimeString()
    });
}

export function displayAttackIndicators(node) {
    const indicators = document.getElementById('attack-indicators');
    if (!indicators) return;
    
    const isUnderAttack = gameState.activeTargets.includes(node.id);
    
    if (!isUnderAttack) {
        indicators.innerHTML = '<div class="text-gray-500 text-xs text-center py-4">No active threats detected</div>';
        return;
    }
    
    // Generate attack indicators based on node's attack patterns
    const attackPatterns = node.attackPatterns || {};
    const indicators_html = Object.entries(attackPatterns).map(([attackType, pattern]) => {
        const intensity = pattern.intensity || 50;
        const frequency = pattern.frequency || 0.5;
        
        // Calculate current threat level
        const currentIntensity = Math.floor(intensity * gameState.currentAttackIntensity);
        const threatLevel = currentIntensity > 70 ? 'CRITICAL' : 
                           currentIntensity > 40 ? 'HIGH' : 'MEDIUM';
        
        const colors = {
            'CRITICAL': { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-300' },
            'HIGH': { bg: 'bg-orange-900', border: 'border-orange-600', text: 'text-orange-300' },
            'MEDIUM': { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-300' }
        };
        
        const color = colors[threatLevel];
        
        return `
            <div class="${color.bg} border ${color.border} rounded p-2 cursor-pointer hover:opacity-80" 
                 data-attack-type="${attackType}">
                <div class="text-xs font-semibold text-white">${attackType.toUpperCase()}</div>
                <div class="text-xs ${color.text}">${threatLevel}</div>
                <div class="text-xs text-gray-400 mt-1">${currentIntensity}% intensity</div>
            </div>
        `;
    }).join('');
    
    indicators.innerHTML = indicators_html;
    
    // Add click handlers for detailed attack analysis
    indicators.querySelectorAll('[data-attack-type]').forEach(indicator => {
        indicator.addEventListener('click', function() {
            const attackType = this.dataset.attackType;
            showAttackAnalysis(attackType, node);
        });
    });
}

function showAttackAnalysis(attackType, node) {
    const analysisData = {
        'volumetric': {
            description: 'High-volume traffic designed to overwhelm bandwidth and processing capacity',
            mitigation: 'Deploy rate limiting and geo-blocking to reduce traffic volume',
            sources: 'Global botnet with 10,000+ compromised devices'
        },
        'application': {
            description: 'Targeted attacks against specific application vulnerabilities and APIs',
            mitigation: 'Use CAPTCHA challenges and application-layer filtering',
            sources: 'Sophisticated attack tools targeting known vulnerabilities'
        },
        'protocol': {
            description: 'Exploitation of network protocol weaknesses and implementation flaws',
            mitigation: 'Implement protocol validation and traffic shaping',
            sources: 'Advanced persistent threat actors with protocol expertise'
        },
        'iot': {
            description: 'Compromised IoT devices launching coordinated attacks',
            mitigation: 'Deploy device authentication and network segmentation',
            sources: 'Mirai-style botnet with compromised smart devices'
        }
    };
    
    const analysis = analysisData[attackType] || {
        description: 'Mixed attack vector combining multiple techniques',
        mitigation: 'Deploy comprehensive defense strategy',
        sources: 'Multiple attack sources and methods'
    };
    
    addAlert({
        type: 'critical',
        message: `${attackType.toUpperCase()} Analysis: ${analysis.description}. Recommended: ${analysis.mitigation}`,
        timestamp: new Date().toLocaleTimeString()
    });
}

export function stopTrafficMonitoring(nodeId) {
    if (monitoringIntervals[nodeId]) {
        clearInterval(monitoringIntervals[nodeId]);
        delete monitoringIntervals[nodeId];
    }
}

export function stopAllMonitoring() {
    Object.values(monitoringIntervals).forEach(interval => {
        clearInterval(interval);
    });
    monitoringIntervals = {};
}

// Update monitoring displays based on game state changes
export function updateMonitoringDisplays() {
    // Update attack volume visualization
    const attackVolumeElement = document.getElementById('attack-volume');
    if (attackVolumeElement) {
        const volume = Math.floor(gameState.attackVolume || 0);
        attackVolumeElement.textContent = volume;
        
        // Update volume bar visual indicator
        const volumeBar = document.querySelector('#attack-volume').parentElement.querySelector('.bg-red-400');
        if (volumeBar) {
            const percentage = Math.min(100, volume / 5); // Scale to 500 Gbps max
            volumeBar.style.width = `${percentage}%`;
        }
    }
    
    // Update response efficiency
    const efficiencyElement = document.getElementById('response-efficiency');
    if (efficiencyElement) {
        const totalMitigations = gameState.mitigationsDeployed || 0;
        const efficiency = Math.min(100, 60 + (totalMitigations * 5));
        
        const efficiencyBar = efficiencyElement.parentElement.querySelector('.bg-green-400');
        if (efficiencyBar) {
            efficiencyBar.style.width = `${efficiency}%`;
        }
    }
}

// Initialize monitoring displays
setInterval(updateMonitoringDisplays, 2000);
