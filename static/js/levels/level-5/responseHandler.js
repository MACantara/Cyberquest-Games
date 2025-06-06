import { gameState, updateMetrics } from './gameState.js';
import { updateMentorMessage, showResultModal, updatePostVisual } from './uiUpdates.js';

export function handleResponse(action) {
    const post = gameState.currentPost;
    const isCorrect = action === post.correctAction;
    
    gameState.completedPosts.push(post.id);
    
    if (isCorrect) {
        handleCorrectResponse(post, action);
    } else {
        handleWrongResponse(post, action);
    }
    
    updateMetrics();
    updatePostVisual(post.id, isCorrect);
    
    // Check if level complete
    if (gameState.trustLevel >= 75 && gameState.postsSecured >= 3) {
        setTimeout(() => endGame(true), 2000);
    } else {
        setTimeout(() => {
            document.getElementById('post-analysis').classList.add('hidden');
            document.getElementById('analysis-placeholder').classList.remove('hidden');
            updateMentorMessage("Good progress! Continue analyzing the other posts to fully resolve this social crisis.");
        }, 2000);
    }
}

export function handleCorrectResponse(post, action) {
    gameState.postsSecured++;
    
    switch(action) {
        case 'mediate':
            gameState.trustLevel += 20;
            gameState.viralSpread -= 15;
            showResultModal('🤝', 'Conflict Mediated!', 
                'You successfully facilitated a constructive conversation between Echo and the community.',
                '<div class="text-green-400">Trust restored through open dialogue and mutual understanding. Privacy concerns addressed.</div>'
            );
            break;
        case 'educate':
            gameState.trustLevel += 15;
            gameState.privacyScore += 20;
            showResultModal('📚', 'Education Successful!', 
                'You helped the community learn about digital ethics and responsible sharing.',
                '<div class="text-blue-400">Positive impact on digital literacy. Community better equipped to handle future conflicts.</div>'
            );
            break;
        case 'report':
            gameState.trollAccounts -= 3;
            gameState.viralSpread -= 10;
            showResultModal('🚨', 'Harmful Content Reported!', 
                'Malicious accounts removed and harassment stopped.',
                '<div class="text-orange-400">Platform safety improved. Trolls deterred from future attacks.</div>'
            );
            break;
        case 'counter':
            gameState.trustLevel += 10;
            gameState.viralSpread -= 20;
            showResultModal('🛡️', 'Misinformation Countered!', 
                'False information corrected with factual evidence.',
                '<div class="text-purple-400">Fake content neutralized. Truth prevailed over manipulation.</div>'
            );
            break;
    }
    
    updateMentorMessage("Excellent response! Your ethical approach is helping restore trust and teach valuable digital citizenship lessons.");
}

export function handleWrongResponse(post, action) {
    gameState.trustLevel -= 15;
    gameState.viralSpread += 10;
    
    showResultModal('❌', 'Response Ineffective', 
        'The chosen strategy didn\'t address the root issues effectively.',
        '<div class="text-red-400">Community trust decreased. The crisis continues to spread.</div>'
    );
    
    updateMentorMessage("That approach didn't work well. Consider the specific nature of each situation and choose responses that address root causes.");
}

export function endGame(success) {
    if (success) {
        updateMentorMessage("Outstanding work, Nova! You've successfully navigated this social crisis and taught valuable lessons about digital ethics and privacy.");
        document.getElementById('complete-level').disabled = false;
        
        showResultModal(
            '🏆',
            'Crisis Resolved!',
            'You\'ve successfully completed The Social Web and earned the Digital Diplomat badge.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-blue-900 border border-blue-600 rounded p-3">
                        <p class="text-blue-300 font-semibold">🏆 Digital Badge Earned</p>
                        <p class="text-blue-200 text-sm">Digital Diplomat - Ethical Communicator</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Final Trust Level:</strong> ${Math.round(gameState.trustLevel)}%</p>
                        <p><strong>Posts Secured:</strong> ${gameState.postsSecured}</p>
                        <p><strong>Privacy Improvement:</strong> +${100 - gameState.privacyScore}%</p>
                        <p><strong>Crisis Containment:</strong> ${100 - gameState.viralSpread}% effective</p>
                    </div>
                </div>
            `
        );
    }
}
