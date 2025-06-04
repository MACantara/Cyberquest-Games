document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let gameState = {
        credibilityScore: 100,
        viralImpact: 0,
        storiesAnalyzed: 0,
        currentStory: null,
        verificationSteps: {
            headlines: 0,
            sources: 0,
            images: 0
        },
        completedStories: [],
        timeRemaining: 300 // 5 minutes
    };

    // Story data
    const stories = {
        1: {
            id: 1,
            headline: "🚨 BREAKING: Senator Williams' PRIVATE Files LEAKED by Anonymous Hackers!",
            source: "@CyberNewsNow",
            isFake: true,
            credibilityScore: 15,
            redFlags: [
                "Excessive emotional language (🚨, PRIVATE, LEAKED)",
                "Unverified source with no badge",
                "Sensational headline designed for clicks",
                "No official confirmation or sources cited"
            ],
            correctAnswer: "fake"
        },
        2: {
            id: 2,
            headline: "Election Security Measures Enhanced for Upcoming Digital Vote",
            source: "@OfficialGovNews",
            isFake: false,
            credibilityScore: 95,
            redFlags: [],
            correctAnswer: "real"
        },
        3: {
            id: 3,
            headline: "SHOCKING: You Won't Believe What Hackers Found in Williams' Computer!",
            source: "@ViralNewsHub",
            isFake: true,
            credibilityScore: 10,
            redFlags: [
                "Classic clickbait structure ('You Won't Believe')",
                "Vague, sensational claims",
                "Suspicious domain name",
                "Designed to generate shares, not inform"
            ],
            correctAnswer: "fake"
        }
    };

    // Initialize game
    function initGame() {
        startTimer();
        showTutorial();
    }

    // Timer function
    function startTimer() {
        const timer = setInterval(() => {
            gameState.timeRemaining--;
            updateTimerDisplay();
            
            if (gameState.timeRemaining <= 0) {
                clearInterval(timer);
                endGame(false, "Time's up! The misinformation spread unchecked.");
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(gameState.timeRemaining / 60);
        const seconds = gameState.timeRemaining % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-inbox').classList.remove('hidden');
            updateMentorMessage("Let's start with the first story. Click on the BREAKING news about Senator Williams to analyze it.");
        }, 2000);
    }

    // Story selection
    document.querySelectorAll('.story-item').forEach(item => {
        item.addEventListener('click', function() {
            const storyId = parseInt(this.dataset.story);
            selectStory(storyId);
            
            // Visual feedback
            document.querySelectorAll('.story-item').forEach(s => s.classList.remove('border-cyan-400'));
            this.classList.add('border-cyan-400');
        });
    });

    function selectStory(storyId) {
        gameState.currentStory = stories[storyId];
        displayStoryInWorkspace(gameState.currentStory);
        document.getElementById('tutorial-inbox').classList.add('hidden');
        
        if (storyId === 1) {
            updateMentorMessage("Good choice, Nova. This story has several red flags. Use the verification tools to analyze the headline, source, and any images. Start with the headline analyzer.");
        }
    }

    function displayStoryInWorkspace(story) {
        const workspace = document.getElementById('workspace');
        const analysisPanel = document.getElementById('analysis-panel');
        
        workspace.innerHTML = `
            <div class="text-center p-4">
                <h4 class="text-white font-semibold mb-2">${story.headline}</h4>
                <p class="text-gray-400 text-sm">Source: ${story.source}</p>
                <div class="mt-3 flex items-center justify-center gap-4 text-sm">
                    <span class="text-gray-500">Click verification tools below to analyze</span>
                </div>
            </div>
        `;
        
        analysisPanel.classList.remove('hidden');
        document.getElementById('story-details').innerHTML = `
            <div class="bg-gray-600 rounded p-3">
                <h5 class="font-medium text-white mb-2">${story.headline}</h5>
                <p class="text-gray-400 text-sm">Source: ${story.source}</p>
            </div>
        `;
    }

    // Verification tools
    document.querySelectorAll('.verification-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentStory) {
                handleVerificationTool(toolType);
                this.classList.add('opacity-75');
                this.disabled = true;
            }
        });
    });

    function handleVerificationTool(toolType) {
        const story = gameState.currentStory;
        let results = '';
        let mentorMessage = '';

        switch(toolType) {
            case 'headline':
                gameState.verificationSteps.headlines++;
                if (story.isFake) {
                    results = `
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">⚠️ Headline Analysis: SUSPICIOUS</h6>
                            <ul class="text-red-200 text-sm space-y-1">
                                <li>• Contains excessive emotional triggers (🚨, LEAKED)</li>
                                <li>• Uses ALL CAPS for sensationalism</li>
                                <li>• Designed for clicks rather than information</li>
                            </ul>
                        </div>
                    `;
                    mentorMessage = "Excellent analysis! Those emotional triggers are classic signs of clickbait. Now check the source credibility.";
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Headline Analysis: LEGITIMATE</h6>
                            <ul class="text-green-200 text-sm space-y-1">
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
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">⚠️ Source Check: UNRELIABLE</h6>
                            <ul class="text-red-200 text-sm space-y-1">
                                <li>• No verification badge</li>
                                <li>• Limited posting history</li>
                                <li>• Credibility Score: ${story.credibilityScore}/100</li>
                            </ul>
                        </div>
                    `;
                    mentorMessage = "Red flag confirmed! Always verify sources. This account has no credentials.";
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Source Check: VERIFIED</h6>
                            <ul class="text-green-200 text-sm space-y-1">
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
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">⚠️ Image Verification: SUSPICIOUS</h6>
                            <ul class="text-red-200 text-sm space-y-1">
                                <li>• Generic stock photo detected</li>
                                <li>• No metadata linking to actual event</li>
                                <li>• Used in multiple unrelated stories</li>
                            </ul>
                        </div>
                    `;
                    mentorMessage = "Great detective work! The image is recycled content, not original reporting.";
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Image Verification: AUTHENTIC</h6>
                            <ul class="text-green-200 text-sm space-y-1">
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
                    <div class="bg-blue-900 border border-blue-600 rounded p-3">
                        <h6 class="text-blue-300 font-semibold mb-2">📊 Metadata Analysis</h6>
                        <ul class="text-blue-200 text-sm space-y-1">
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

    function getVerificationStepsCompleted() {
        return gameState.verificationSteps.headlines + gameState.verificationSteps.sources + gameState.verificationSteps.images;
    }

    function enableFinalDecision() {
        document.getElementById('mark-fake').disabled = false;
        document.getElementById('mark-real').disabled = false;
        updateMentorMessage("You've gathered enough evidence. Now make your decision: Is this story fake or real?");
    }

    // Final decision buttons
    document.getElementById('mark-fake').addEventListener('click', () => makeDecision('fake'));
    document.getElementById('mark-real').addEventListener('click', () => makeDecision('real'));

    function makeDecision(decision) {
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

    function handleCorrectAnswer(story) {
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

    function handleWrongAnswer(story) {
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

    // Helper functions
    function updateMentorMessage(message) {
        document.getElementById('mentor-message').textContent = message;
    }

    function updateCredibilityMeter(score) {
        const meter = document.getElementById('credibility-meter');
        const text = document.getElementById('credibility-text');
        
        meter.style.width = score + '%';
        
        if (score >= 80) {
            meter.className = 'bg-green-400 h-3 rounded transition-all duration-500';
            text.textContent = 'Highly credible source';
        } else if (score >= 50) {
            meter.className = 'bg-yellow-400 h-3 rounded transition-all duration-500';
            text.textContent = 'Moderately credible';
        } else {
            meter.className = 'bg-red-400 h-3 rounded transition-all duration-500';
            text.textContent = 'Low credibility - suspicious';
        }
    }

    function updateProgress() {
        document.getElementById('headlines-count').textContent = gameState.verificationSteps.headlines;
        document.getElementById('sources-count').textContent = gameState.verificationSteps.sources;
        document.getElementById('images-count').textContent = gameState.verificationSteps.images;
        
        const totalSteps = gameState.verificationSteps.headlines + gameState.verificationSteps.sources + gameState.verificationSteps.images;
        const progressPercent = (totalSteps / 9) * 100; // 3 stories × 3 steps each
        document.getElementById('progress-bar').style.width = progressPercent + '%';
    }

    function updateGameStats() {
        document.getElementById('credibility-score').textContent = gameState.credibilityScore;
        document.getElementById('viral-impact').textContent = gameState.viralImpact;
        document.getElementById('stories-analyzed').textContent = gameState.storiesAnalyzed;
        
        // Update viral meter
        const viralMeter = document.getElementById('viral-meter');
        const viralText = document.getElementById('viral-text');
        viralMeter.style.width = gameState.viralImpact + '%';
        
        if (gameState.viralImpact >= 75) {
            viralText.textContent = 'Critical - widespread misinformation';
        } else if (gameState.viralImpact >= 50) {
            viralText.textContent = 'High risk - spreading rapidly';
        } else if (gameState.viralImpact >= 25) {
            viralText.textContent = 'Moderate risk - contained';
        } else {
            viralText.textContent = 'Low risk - well controlled';
        }
    }

    function showResultModal(icon, title, message, feedback) {
        document.getElementById('result-icon').textContent = icon;
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-message').textContent = message;
        document.getElementById('result-feedback').innerHTML = feedback;
        document.getElementById('results-modal').classList.remove('hidden');
    }

    function resetWorkspace() {
        document.getElementById('workspace').innerHTML = `
            <i class="bi bi-arrow-down-circle text-4xl text-gray-500 mb-4"></i>
            <p class="text-gray-400 text-center">
                <strong>Select your next story to analyze</strong><br>
                <span class="text-sm">Keep up the good work, Nova!</span>
            </p>
        `;
        document.getElementById('analysis-panel').classList.add('hidden');
        gameState.currentStory = null;
        
        // Reset verification tools
        document.querySelectorAll('.verification-tool').forEach(tool => {
            tool.classList.remove('opacity-75');
            tool.disabled = false;
        });
    }

    function endGame(success, message = null) {
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

    // Modal event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('clear-workspace').addEventListener('click', resetWorkspace);

    document.getElementById('complete-level').addEventListener('click', function() {
        // Show transition cutscene
        showResultModal(
            '📧',
            'Incoming Message',
            'As you finish scrubbing the false story, you receive a new email...',
            `
                <div class="text-left bg-gray-700 rounded p-3">
                    <p class="text-red-400 font-semibold">🚨 URGENT MESSAGE</p>
                    <p class="text-gray-300 text-sm mt-2">"Commander X wants immediate action—check your inbox now."</p>
                    <p class="text-gray-500 text-xs mt-2">Sender: Unknown</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 2: Shadow in the Inbox?</p>
            `
        );
        
        // Override continue button to go to next level
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/2';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});