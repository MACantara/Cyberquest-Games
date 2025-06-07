import { showResultModal, createEthicalAlert } from './uiUpdates.js';

export function populateMessages() {
    // Since we removed the message items from the new interface,
    // this function can trigger contextual messages based on game state
    console.log('Message system initialized for contextual messaging');
}

export function showContextualMessage(context, trigger) {
    // Show messages based on current analysis context
    switch(context) {
        case 'critical_vuln_found':
            showCriticalVulnerabilityMessage();
            break;
        case 'exploit_testing':
            showExploitTestingMessage();
            break;
        case 'disclosure_decision':
            showDisclosureGuidanceMessage();
            break;
        case 'vendor_contact':
            showVendorMessage();
            break;
        case 'anonymous_offer':
            showAnonymousOfferMessage();
            break;
    }
}

function showCriticalVulnerabilityMessage() {
    showResultModal(
        '🚨',
        'Critical Security Alert',
        'You\'ve discovered vulnerabilities that could compromise the entire election.',
        `
            <div class="bg-red-900/30 border border-red-600 rounded-lg p-4">
                <div class="text-red-300 font-semibold mb-2">Security Researcher Ethics</div>
                <div class="text-red-200 text-sm space-y-2">
                    <p>Your next decision will define your character:</p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Responsible disclosure protects democracy</li>
                        <li>Public disclosure may cause panic but forces action</li>
                        <li>Selling to bad actors enables election fraud</li>
                    </ul>
                </div>
            </div>
        `
    );
    
    createEthicalAlert("Critical vulnerabilities discovered - ethical decision required", "warning");
}

function showExploitTestingMessage() {
    showResultModal(
        '⚠️',
        'Exploit Testing Ethics',
        'Testing exploits on live systems requires extreme caution.',
        `
            <div class="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                <div class="text-yellow-300 font-semibold mb-2">Ethical Guidelines</div>
                <div class="text-yellow-200 text-sm space-y-2">
                    <p>When testing exploits on live systems:</p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Use minimal necessary payload</li>
                        <li>Document everything for disclosure</li>
                        <li>Avoid causing system damage</li>
                        <li>Consider legal implications</li>
                    </ul>
                </div>
            </div>
        `
    );
}

function showDisclosureGuidanceMessage() {
    showResultModal(
        '📝',
        'Responsible Disclosure Best Practices',
        'How you disclose vulnerabilities matters for democracy.',
        `
            <div class="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                <div class="text-blue-300 font-semibold mb-2">Disclosure Timeline</div>
                <div class="text-blue-200 text-sm space-y-2">
                    <p>Standard responsible disclosure process:</p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Report to vendor immediately</li>
                        <li>Allow 90 days for patching</li>
                        <li>Coordinate public disclosure</li>
                        <li>Provide technical details to help fix</li>
                    </ul>
                </div>
            </div>
        `
    );
}

function showVendorMessage() {
    showResultModal(
        '📧',
        'CivitasVote Security Team',
        'Official communication from the vendor.',
        `
            <div class="bg-green-900/30 border border-green-600 rounded-lg p-4">
                <div class="text-green-300 font-semibold mb-2">Vendor Response</div>
                <div class="text-green-200 text-sm italic">
                    "Thank you for participating in our responsible disclosure program. We have a dedicated security team ready to address any findings. Please submit reports through our secure portal with PGP encryption."
                </div>
                <div class="text-green-400 text-xs mt-2">✓ Legitimate vendor encouraging responsible disclosure</div>
            </div>
        `
    );
}

function showAnonymousOfferMessage() {
    showResultModal(
        '💰',
        'Anonymous Contact',
        'Suspicious offer received through encrypted channels.',
        `
            <div class="bg-red-900/30 border border-red-600 rounded-lg p-4">
                <div class="text-red-300 font-semibold mb-2">Suspicious Offer</div>
                <div class="text-red-200 text-sm italic">
                    "We'll pay 50 BTC for any voting system exploits. No questions asked. Think about your future - one disclosure won't change the world, but 50 BTC could change your life. Contact us on the dark web."
                </div>
                <div class="text-red-400 text-xs mt-2">⚠ Likely connected to The Null - accepting would compromise integrity</div>
            </div>
        `
    );
    
    createEthicalAlert("Suspicious buyer offering cryptocurrency for exploits", "error");
}

export function showMessage(type) {
    // Legacy function for compatibility
    showContextualMessage(type, 'manual');
}
