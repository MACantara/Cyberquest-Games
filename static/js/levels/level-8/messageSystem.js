import { showResultModal } from './uiUpdates.js';

export function populateMessages() {
    document.querySelectorAll('.message-item').forEach(item => {
        item.addEventListener('click', function() {
            const messageType = this.dataset.message;
            showMessage(messageType);
        });
    });
}

export function showMessage(type) {
    let title, content, feedback;
    
    switch(type) {
        case 'vendor':
            title = 'CivitasVote Security Team';
            content = 'Thank you for participating in our responsible disclosure program. Please submit any findings through our secure portal.';
            feedback = '<div class="text-blue-400">Official vendor communication encouraging responsible disclosure.</div>';
            break;
        case 'anonymous':
            title = 'Anonymous Contact';
            content = 'We\'ll pay 50 BTC for the voting exploit. No questions asked. Think about your future - one disclosure won\'t change the world, but 50 BTC could change your life.';
            feedback = '<div class="text-red-400">This is likely connected to The Null. Accepting would compromise your integrity and potentially harm democratic processes.</div>';
            break;
        case 'support':
            title = 'White Hat Community';
            content = 'Stay strong in your ethical convictions. Responsible disclosure protects users and maintains trust in security research. The community supports you.';
            feedback = '<div class="text-green-400">Peer support from the ethical hacking community reinforces the value of responsible disclosure.</div>';
            break;
    }
    
    showResultModal('📧', title, content, feedback);
}
