import { systems } from './systemHandler.js';

export function updateMentorMessage(message) {
    document.getElementById('mentor-message').textContent = message;
}

export function showResultModal(icon, title, message, feedback) {
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-feedback').innerHTML = feedback;
    document.getElementById('results-modal').classList.remove('hidden');
}

export function updateSystemVisuals() {
    // Update system items in the left panel
    Object.keys(systems).forEach(id => {
        const systemItem = document.querySelector(`[data-system="${id}"]`);
        const system = systems[id];
        
        // Update visual state based on system status
        systemItem.className = `system-item rounded p-3 cursor-pointer transition ${getSystemStyles(system.status)}`;
    });

    // Update threat map nodes
    Object.keys(systems).forEach(id => {
        const node = document.querySelector(`[data-node="${id}"]`);
        if (node) {
            node.className = `node w-6 h-6 rounded-full ${getNodeStyles(systems[id].status)}`;
        }
    });
}

export function getSystemStyles(status) {
    switch(status) {
        case 'clean': return 'bg-green-900 border border-green-600 hover:bg-green-800';
        case 'infected': return 'bg-red-900 border border-red-600 hover:bg-red-800 animate-pulse';
        case 'suspicious': return 'bg-yellow-900 border border-yellow-600 hover:bg-yellow-800';
        case 'offline': return 'bg-gray-700 border border-gray-600 opacity-50';
        default: return 'bg-gray-700 border border-gray-600 hover:bg-gray-600';
    }
}

export function getNodeStyles(status) {
    switch(status) {
        case 'clean': return 'bg-green-400';
        case 'infected': return 'bg-red-500 animate-ping';
        case 'suspicious': return 'bg-yellow-500';
        case 'offline': return 'bg-gray-500';
        default: return 'bg-gray-600';
    }
}
