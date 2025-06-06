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
    
    // Check if crisis is resolved
    if (gameState.trustLevel >= 75 && gameState.viralSpread <= 25 && gameState.postsSecured >= 3) {
        setTimeout(() => endGame(true), 2000);
    } else if (gameState.trustLevel <= 10 || gameState.viralSpread >= 95) {
        setTimeout(() => endGame(false), 2000);
    } else {
        setTimeout(() => {
            // Reset for next post
            document.getElementById('post-analysis').classList.add('hidden');
            document.getElementById('analysis-placeholder').classList.remove('hidden');
            gameState.currentPost = null;
            
            // Reset tool states
            document.querySelectorAll('.action-tool').forEach(tool => {
                tool.classList.remove('opacity-50');
                tool.disabled = false;
                tool.innerHTML = tool.innerHTML.replace('<i class="bi bi-check mr-2"></i>', '');
            });
            
            updateMentorMessage("Good response! Now address another post. Each situation requires different moderation approaches.");
        }, 2000);
    }
}

export function handleCorrectResponse(post, action) {
    gameState.postsSecured++;
    gameState.ethicalActionsCount++;
    
    switch(action) {
        case 'mediate':
            gameState.trustLevel += 25;
            gameState.viralSpread -= 20;
            gameState.supportiveInteractions += 3;
            
            showResultModal('🤝', 'Dialogue Facilitated!', 
                'You successfully opened communication channels between affected parties.',
                `
                    <div class="space-y-3">
                        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p class="text-green-800 font-semibold">✅ Mediation Successful</p>
                            <p class="text-green-700 text-sm mt-1">Your intervention helped Echo understand the impact of their actions.</p>
                        </div>
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p class="text-blue-800 text-sm font-medium">Positive Outcomes:</p>
                            <ul class="text-blue-700 text-sm space-y-1 mt-2">
                                <li class="flex items-start gap-2"><i class="bi bi-check text-blue-600 mt-1"></i>Echo apologized publicly and removed the post</li>
                                <li class="flex items-start gap-2"><i class="bi bi-check text-blue-600 mt-1"></i>Alex received community support</li>
                                <li class="flex items-start gap-2"><i class="bi bi-check text-blue-600 mt-1"></i>Educational discussion about digital consent</li>
                            </ul>
                        </div>
                        <div class="text-center">
                            <span class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">+25 Trust, -20 Viral Spread</span>
                        </div>
                    </div>
                `
            );
            break;
            
        case 'educate':
            gameState.trustLevel += 15;
            gameState.privacyScore += 20;
            gameState.viralSpread -= 10;
            
            showResultModal('📚', 'Educational Response!', 
                'You provided valuable digital ethics education to the community.',
                `
                    <div class="space-y-3">
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p class="text-blue-800 font-semibold">✅ Education Deployed</p>
                            <p class="text-blue-700 text-sm mt-1">Your response helped community members understand privacy rights and digital empathy.</p>
                        </div>
                        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p class="text-green-800 text-sm font-medium">Learning Outcomes:</p>
                            <ul class="text-green-700 text-sm space-y-1 mt-2">
                                <li class="flex items-start gap-2"><i class="bi bi-book text-green-600 mt-1"></i>Privacy consent awareness increased</li>
                                <li class="flex items-start gap-2"><i class="bi bi-book text-green-600 mt-1"></i>Digital empathy skills improved</li>
                                <li class="flex items-start gap-2"><i class="bi bi-book text-green-600 mt-1"></i>Ethical social media behavior promoted</li>
                            </ul>
                        </div>
                        <div class="text-center">
                            <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">+15 Trust, +20 Privacy Score</span>
                        </div>
                    </div>
                `
            );
            break;
            
        case 'report':
            gameState.trollAccounts -= 3;
            gameState.viralSpread -= 30;
            gameState.trustLevel += 10;
            
            showResultModal('🚨', 'Threat Reported!', 
                'Criminal content successfully escalated to authorities.',
                `
                    <div class="space-y-3">
                        <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p class="text-red-800 font-semibold">✅ Report Filed</p>
                            <p class="text-red-700 text-sm mt-1">Blackmail content removed and account suspended. Law enforcement notified.</p>
                        </div>
                        <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p class="text-orange-800 text-sm font-medium">Actions Taken:</p>
                            <ul class="text-orange-700 text-sm space-y-1 mt-2">
                                <li class="flex items-start gap-2"><i class="bi bi-shield text-orange-600 mt-1"></i>Harmful content immediately removed</li>
                                <li class="flex items-start gap-2"><i class="bi bi-shield text-orange-600 mt-1"></i>Account permanently banned</li>
                                <li class="flex items-start gap-2"><i class="bi bi-shield text-orange-600 mt-1"></i>Incident reported to authorities</li>
                            </ul>
                        </div>
                        <div class="text-center">
                            <span class="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">Criminal Threat Neutralized</span>
                        </div>
                    </div>
                `
            );
            break;
            
        case 'counter':
            gameState.misinformationCounter++;
            gameState.viralSpread -= 25;
            gameState.trustLevel += 20;
            
            showResultModal('🛡️', 'Misinformation Countered!', 
                'You successfully provided factual information to combat fake content.',
                `
                    <div class="space-y-3">
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <p class="text-purple-800 font-semibold">✅ Counter-Narrative Deployed</p>
                            <p class="text-purple-700 text-sm mt-1">Fake content flagged and fact-checked. Community educated about AI-generated media.</p>
                        </div>
                        <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                            <p class="text-cyan-800 text-sm font-medium">Impact:</p>
                            <ul class="text-cyan-700 text-sm space-y-1 mt-2">
                                <li class="flex items-start gap-2"><i class="bi bi-search text-cyan-600 mt-1"></i>Fake content engagement dropped 85%</li>
                                <li class="flex items-start gap-2"><i class="bi bi-search text-cyan-600 mt-1"></i>AI detection tools shared with community</li>
                                <li class="flex items-start gap-2"><i class="bi bi-search text-cyan-600 mt-1"></i>Media literacy awareness increased</li>
                            </ul>
                        </div>
                        <div class="text-center">
                            <span class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">+20 Trust, -25 Viral Spread</span>
                        </div>
                    </div>
                `
            );
            break;
    }
    
    updateMentorMessage("Excellent ethical choice! Your response addressed the root issue while supporting those affected. This is how healthy digital communities are built.");
}

export function handleWrongResponse(post, action) {
    gameState.trustLevel -= 20;
    gameState.viralSpread += 15;
    
    let title, message, feedback;
    
    // Provide specific feedback based on the mismatch
    if (action === 'report' && post.type === 'privacy_violation') {
        title = "Overcorrection";
        message = "Reporting alone doesn't address the underlying relationship damage.";
        feedback = `
            <div class="space-y-2">
                <p class="text-orange-700 font-semibold">⚠️ Missed Opportunity</p>
                <p class="text-sm text-gray-700">While reporting privacy violations is important, this situation needed mediation to repair the relationship damage and educate about consent.</p>
                <ul class="text-sm text-gray-600 space-y-1 mt-2">
                    <li>• Trust between friends remains broken</li>
                    <li>• No learning opportunity about digital ethics</li>
                    <li>• Community divided rather than united</li>
                </ul>
                <p class="text-orange-600 text-sm mt-3">-20 Trust, +15% Viral Spread</p>
            </div>
        `;
    } else if (action === 'mediate' && post.type === 'blackmail_threat') {
        title = "Dangerous Approach";
        message = "Criminal threats require immediate reporting, not negotiation.";
        feedback = `
            <div class="space-y-2">
                <p class="text-red-700 font-semibold">❌ Safety Risk</p>
                <p class="text-sm text-gray-700">Attempting to mediate with criminals can escalate threats and endanger victims. Blackmail is illegal and requires law enforcement.</p>
                <ul class="text-sm text-gray-600 space-y-1 mt-2">
                    <li>• Criminal behavior went unpunished</li>
                    <li>• Victim remains at risk</li>
                    <li>• Sets dangerous precedent</li>
                </ul>
                <p class="text-red-600 text-sm mt-3">-20 Trust, +15% Viral Spread</p>
            </div>
        `;
    } else {
        title = "Strategy Mismatch";
        message = "The response didn't match the specific needs of this situation.";
        feedback = `
            <div class="space-y-2">
                <p class="text-yellow-700 font-semibold">⚠️ Ineffective Response</p>
                <p class="text-sm text-gray-700">Each social media crisis requires a tailored approach. Consider the specific type of content and harm involved.</p>
                <p class="text-yellow-600 text-sm mt-3">-20 Trust, +15% Viral Spread</p>
            </div>
        `;
    }
    
    showResultModal('❌', title, message, feedback);
    updateMentorMessage("That approach wasn't ideal for this specific situation. Each type of crisis requires different moderation strategies. Learn from this and adapt your approach.");
}

export function endGame(success) {
    if (success) {
        updateMentorMessage("Outstanding work, Nova! You've successfully navigated this complex social crisis. Your ethical moderation protected victims, educated the community, and restored healthy digital relationships.");
        document.getElementById('complete-level').disabled = false;
        
        showResultModal(
            '🏆',
            'Crisis Management Complete!',
            'You\'ve successfully resolved the social media crisis and earned the Digital Mediator badge.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <p class="text-green-300 font-semibold">🏆 Digital Badge Earned</p>
                        <p class="text-green-200 text-sm">Digital Mediator - Social Crisis Resolution Specialist</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Final Trust Level:</strong> ${gameState.trustLevel}%</p>
                        <p><strong>Viral Containment:</strong> ${100 - gameState.viralSpread}%</p>
                        <p><strong>Privacy Protection:</strong> ${gameState.privacyScore}%</p>
                        <p><strong>Posts Resolved:</strong> ${gameState.postsSecured}/5</p>
                        <p><strong>Ethical Actions:</strong> ${gameState.ethicalActionsCount}</p>
                    </div>
                </div>
            `
        );
    } else {
        updateMentorMessage("The crisis spiraled out of control. Social media requires careful, thoughtful moderation that balances free expression with protection from harm.");
        
        showResultModal(
            '💔',
            'Crisis Escalated',
            'The social media crisis caused lasting damage to community trust.',
            `
                <div class="text-red-400 space-y-2">
                    <p class="font-bold">⚠️ CRISIS RESOLUTION FAILED</p>
                    <p class="text-sm">Relationships damaged, trust broken, harmful content spread unchecked.</p>
                    <p class="text-red-300 text-sm mt-3">Review your moderation strategies and try again.</p>
                </div>
            `
        );
    }
}
