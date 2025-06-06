export const gameState = {
    cleanSystems: 5,
    infectedSystems: 3,
    quarantinedSystems: 0,
    systemsCleaned: 0,
    currentSystem: null,
    spreadTimer: 60,
    analysisSteps: {},
    completedSystems: [],
    malwareTypes: {
        'trojan': 'Performance_Boost.exe',
        'spyware': 'VROptimizer.dll',
        'worm': 'NetworkCrawler.sys'
    },
    spreadTimerRef: null
};

export function updateGameStats() {
    document.getElementById('clean-systems').textContent = gameState.cleanSystems;
    document.getElementById('infected-systems').textContent = gameState.infectedSystems;
    document.getElementById('quarantined-systems').textContent = gameState.quarantinedSystems;
    document.getElementById('systems-cleaned').textContent = gameState.systemsCleaned;
}

export function getMalwareDescription(type) {
    switch(type) {
        case 'trojan': return 'disguises itself as legitimate software while stealing data.';
        case 'spyware': return 'monitors user activity and captures sensitive information.';
        case 'worm': return 'replicates itself across network connections.';
        default: return 'performs unauthorized activities.';
    }
}
