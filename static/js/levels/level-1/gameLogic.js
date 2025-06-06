import { gameState, updateGameStats } from './gameState.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';
import { resetWorkspace } from './storyHandler.js';

export function makeDecision(decision) {
    const story = gameState.currentStory;
    const isCorrect = decision === story.correctAnswer;
    
    gameState.storiesAnalyzed++;
    gameState.completedStories.push(story.id);
    
    if (isCorrect) {
        handleCorrectAnswer(story);
    } else {
        handleWrongAnswer(story);
    }
    
    updateGameStats();
    
    // Check if level complete
    if (gameState.storiesAnalyzed >= 3 || gameState.completedStories.length >= 2) {
        setTimeout(() => endGame(true), 2000);
    } else {
        setTimeout(() => resetWorkspace(), 2000);
    }
}

export function handleCorrectAnswer(story) {
    gameState.credibilityScore += 20;
    gameState.viralImpact = Math.max(0, gameState.viralImpact - 15);
    
    showResultModal(
        '✅',
        'Excellent Analysis!',
        'You correctly identified this story. Truth needs guardians like you.',
        `
            <div class="text-left space-y-2">
                <p class="text-green-400 font-semibold">✅ Correct Decision</p>
                <p class="text-sm text-gray-300">Key evidence you found:</p>
                <ul class="text-sm text-gray-400 space-y-1">
                    ${story.redFlags.map(flag => `<li>• ${flag}</li>`).join('')}
                </ul>
                <p class="text-cyan-400 text-sm mt-3">+20 Credibility Points</p>
            </div>
        `
    );
    
    updateMentorMessage("Verified. Good catch, Nova. Truth needs guardians like you.");
}

export function handleWrongAnswer(story) {
    gameState.credibilityScore -= 15;
    gameState.viralImpact += 25;
    
    showResultModal(
        '❌',
        'Misinformation Spread!',
        'The story went viral before you could stop it. Learn from this mistake.',
        `
            <div class="text-left space-y-2">
                <p class="text-red-400 font-semibold">❌ Incorrect Decision</p>
                <p class="text-sm text-gray-300">What you missed:</p>
                <ul class="text-sm text-gray-400 space-y-1">
                    ${story.redFlags.map(flag => `<li>• ${flag}</li>`).join('')}
                </ul>
                <p class="text-red-400 text-sm mt-3">-15 Credibility Points, +25% Viral Impact</p>
            </div>
        `
    );
    
    updateMentorMessage("Misinformation spreads faster than caution. Cross-check next time, Nova.");
}

export function endGame(success, message = null) {
    if (success) {
        updateMentorMessage("Outstanding work, Nova! You've successfully contained the misinformation threat. The Academy is proud of your media literacy skills.");
        document.getElementById('complete-level').disabled = false;
        
        // Show completion modal
        showResultModal(
            '🏆',
            'Mission Complete!',
            'You\'ve successfully completed the Misinformation Maze and earned the Fact Hunter badge.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-yellow-900 border border-yellow-600 rounded p-3">
                        <p class="text-yellow-300 font-semibold">🏆 Digital Badge Earned</p>
                        <p class="text-yellow-200 text-sm">Fact Hunter - Level 1 Cleared</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Final Score:</strong> ${gameState.credibilityScore}/100</p>
                        <p><strong>Viral Impact:</strong> ${gameState.viralImpact}% (${gameState.viralImpact < 30 ? 'Contained' : 'Needs improvement'})</p>
                        <p><strong>Stories Analyzed:</strong> ${gameState.storiesAnalyzed}/3</p>
                    </div>
                </div>
            `
        );
    } else {
        updateMentorMessage(message || "Time's up! The misinformation campaign succeeded. Review your analysis and try again.");
    }
}
