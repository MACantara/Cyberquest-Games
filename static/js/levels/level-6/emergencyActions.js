import { showResultModal } from './uiUpdates.js';

export function handleEmergencyFreeze() {
    showResultModal('🔒', 'Emergency Freeze Activated', 
        'All transactions temporarily suspended for security review.',
        '<div class="text-blue-400">Proactive security measure. All funds protected.</div>'
    );
}
