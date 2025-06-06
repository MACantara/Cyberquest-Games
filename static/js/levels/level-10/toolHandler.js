import { gameState } from './gameState.js';
import { updateArgusMessage } from './uiUpdates.js';
import { displayLogAnalysis, displayHashAnalysis, displayMetadataAnalysis, displayTimelineAnalysis, displayTrafficAnalysis } from './analysisDisplays.js';

export function selectTool(toolType) {
    gameState.currentTool = toolType;
    displayToolWorkspace(toolType);
    document.getElementById('tutorial-forensics').classList.add('hidden');
    
    if (toolType === 'logs') {
        updateArgusMessage("Analyzing system logs... Look for access patterns that deviate from normal working hours. The timestamp correlation is crucial.");
    }
}

export function displayToolWorkspace(toolType) {
    document.getElementById('workspace-placeholder').classList.add('hidden');
    document.getElementById('analysis-workspace').classList.remove('hidden');
    
    const toolNames = {
        logs: 'Log Viewer',
        hash: 'Hash Verifier',
        metadata: 'Metadata Extractor',
        timeline: 'Timeline Builder',
        traffic: 'Traffic Visualizer'
    };
    
    document.getElementById('tool-name').textContent = toolNames[toolType];
    
    switch(toolType) {
        case 'logs':
            displayLogAnalysis();
            break;
        case 'hash':
            displayHashAnalysis();
            break;
        case 'metadata':
            displayMetadataAnalysis();
            break;
        case 'timeline':
            displayTimelineAnalysis();
            break;
        case 'traffic':
            displayTrafficAnalysis();
            break;
    }
}

export function closeToolWorkspace() {
    document.getElementById('analysis-workspace').classList.add('hidden');
    document.getElementById('workspace-placeholder').classList.remove('hidden');
    gameState.currentTool = null;
}
