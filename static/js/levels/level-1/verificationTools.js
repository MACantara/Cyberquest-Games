import { gameState, updateProgress, getVerificationStepsCompleted } from './gameState.js';
import { updateMentorMessage, updateCredibilityMeter } from './uiUpdates.js';

export function handleVerificationTool(toolType) {
    const story = gameState.currentStory;
    let results = '';
    let mentorMessage = '';

    switch(toolType) {
        case 'headline':
            gameState.verificationSteps.headlines++;
            if (story.isFake) {
                results = `
                    <div class="bg-red-100 border-2 border-red-400 rounded p-3">
                        <h6 class="text-red-800 font-bold font-serif mb-2">⚠️ Headline Analysis: SUSPICIOUS</h6>
                        <ul class="text-red-700 text-sm space-y-1 font-serif">
                            <li>• Contains excessive emotional triggers (🚨, LEAKED)</li>
                            <li>• Uses ALL CAPS for sensationalism</li>
                            <li>• Designed for clicks rather than information</li>
                        </ul>
                    </div>
                `;
                mentorMessage = "Excellent analysis! Those emotional triggers are classic signs of clickbait. Now check the source credibility.";
            } else {
                results = `
                    <div class="bg-green-100 border-2 border-green-400 rounded p-3">
                        <h6 class="text-green-800 font-bold font-serif mb-2">✅ Headline Analysis: LEGITIMATE</h6>
                        <ul class="text-green-700 text-sm space-y-1 font-serif">
                            <li>• Clear, factual language</li>
                            <li>• No emotional manipulation</li>
                            <li>• Professional news format</li>
                        </ul>
                    </div>
                `;
                mentorMessage = "Good work! This headline shows professional journalism standards.";
            }
            break;

        case 'source':
            gameState.verificationSteps.sources++;
            if (story.credibilityScore < 50) {
                results = `
                    <div class="bg-red-100 border-2 border-red-400 rounded p-3">
                        <h6 class="text-red-800 font-bold font-serif mb-2">⚠️ Source Check: UNRELIABLE</h6>
                        <ul class="text-red-700 text-sm space-y-1 font-serif">
                            <li>• No verification badge</li>
                            <li>• Limited posting history</li>
                            <li>• Credibility Score: ${story.credibilityScore}/100</li>
                        </ul>
                    </div>
                `;
                mentorMessage = "Red flag confirmed! Always verify sources. This account has no credentials.";
            } else {
                results = `
                    <div class="bg-green-100 border-2 border-green-400 rounded p-3">
                        <h6 class="text-green-800 font-bold font-serif mb-2">✅ Source Check: VERIFIED</h6>
                        <ul class="text-green-700 text-sm space-y-1 font-serif">
                            <li>• Official verification badge</li>
                            <li>• Government/institutional source</li>
                            <li>• Credibility Score: ${story.credibilityScore}/100</li>
                        </ul>
                    </div>
                `;
                mentorMessage = "Excellent! This is an official, verified source.";
            }
            updateCredibilityMeter(story.credibilityScore);
            break;

        case 'image':
            gameState.verificationSteps.images++;
            if (story.isFake) {
                results = `
                    <div class="bg-red-100 border-2 border-red-400 rounded p-3">
                        <h6 class="text-red-800 font-bold font-serif mb-2">⚠️ Image Verification: SUSPICIOUS</h6>
                        <ul class="text-red-700 text-sm space-y-1 font-serif">
                            <li>• Generic stock photo detected</li>
                            <li>• No metadata linking to actual event</li>
                            <li>• Used in multiple unrelated stories</li>
                        </ul>
                    </div>
                `;
                mentorMessage = "Great detective work! The image is recycled content, not original reporting.";
            } else {
                results = `
                    <div class="bg-green-100 border-2 border-green-400 rounded p-3">
                        <h6 class="text-green-800 font-bold font-serif mb-2">✅ Image Verification: AUTHENTIC</h6>
                        <ul class="text-green-700 text-sm space-y-1 font-serif">
                            <li>• Original image with proper metadata</li>
                            <li>• Consistent with story context</li>
                            <li>• No signs of manipulation detected</li>
                        </ul>
                    </div>
                `;
                mentorMessage = "Good verification! The image supports the story authenticity.";
            }
            break;

        case 'metadata':
            results = `
                <div class="bg-blue-100 border-2 border-blue-400 rounded p-3">
                    <h6 class="text-blue-800 font-bold font-serif mb-2">📊 Metadata Analysis</h6>
                    <ul class="text-blue-700 text-sm space-y-1 font-serif">
                        <li>• Published: ${story.isFake ? '2 hours ago (suspicious timing)' : '4 hours ago'}</li>
                        <li>• Domain age: ${story.isFake ? '2 months (new domain)' : '5 years (established)'}</li>
                        <li>• SSL Certificate: ${story.isFake ? 'Basic (red flag)' : 'Extended validation'}</li>
                    </ul>
                </div>
            `;
            mentorMessage = "Metadata tells a story too. Look at domain age and timing patterns.";
            break;
    }

    // Add results to verification panel
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML += results;
    document.getElementById('verification-results').classList.remove('hidden');
    
    updateMentorMessage(mentorMessage);
    updateProgress();
    
    // Check if enough verification steps completed
    if (getVerificationStepsCompleted() >= 2) {
        enableFinalDecision();
    }
}

export function enableFinalDecision() {
    document.getElementById('mark-fake').disabled = false;
    document.getElementById('mark-real').disabled = false;
    updateMentorMessage("You've gathered enough evidence. Now make your decision: Is this story fake or real?");
}
