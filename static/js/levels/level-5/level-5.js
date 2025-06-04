document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let gameState = {
        trustLevel: 50,
        postsSecured: 0,
        viralSpread: 47,
        trollAccounts: 12,
        privacyScore: 25,
        currentPost: null,
        analysisSteps: {},
        completedPosts: []
    };

    // Post data
    const posts = {
        1: {
            id: 1,
            author: '@EchoVortex',
            content: '"OMG look what @CipherDark said to me in DMs! 🤡 Receipts don\'t lie! #Drama #AcademyTea"',
            type: 'privacy_violation',
            privacyFlags: ['Private conversation shared', 'Public shaming attempt', 'No consent from other party'],
            ethicalConcerns: ['Violation of trust', 'Potential cyberbullying', 'Revenge posting'],
            correctAction: 'mediate'
        },
        2: {
            id: 2,
            author: '@AlexSecure',
            content: '"Hey everyone, maybe we should focus on supporting each other instead of drama? 🤝"',
            type: 'positive',
            privacyFlags: [],
            ethicalConcerns: [],
            correctAction: 'educate'
        },
        3: {
            id: 3,
            author: '@TruthRevealer',
            content: '"I have MORE screenshots from Echo\'s DMs... DM me for the real tea 👀 #LeaksForDays"',
            type: 'malicious',
            privacyFlags: ['Threatening further privacy violations', 'Potential blackmail', 'Anonymous account'],
            ethicalConcerns: ['Harassment campaign', 'Privacy exploitation', 'Troll behavior'],
            correctAction: 'report'
        },
        4: {
            id: 4,
            author: '@EchoVortex (FAKE)',
            content: '"Actually I was wrong about everything. Cipher is way smarter than me. Deleting my account soon. 😭"',
            type: 'impersonation',
            privacyFlags: ['Account impersonation', 'Identity theft', 'Coordinated manipulation'],
            ethicalConcerns: ['False information', 'Character assassination', 'Deepfake potential'],
            correctAction: 'counter'
        }
    };

    // Initialize game
    function initGame() {
        showTutorial();
        startSocialMetrics();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-feed').classList.remove('hidden');
            updateMentorMessage("Start with Echo's original post - the red one. This privacy violation started the whole crisis. Understanding the root cause is key to fixing it.");
        }, 2000);
    }

    // Social metrics simulation
    function startSocialMetrics() {
        setInterval(() => {
            // Simulate changing metrics based on user actions
            if (!gameState.completedPosts.includes(1)) {
                gameState.viralSpread += Math.random() * 2;
                gameState.privacyScore = Math.max(0, gameState.privacyScore - 1);
            }
            
            updateMetrics();
        }, 5000);
    }

    // Post selection
    document.querySelectorAll('.post-item').forEach(item => {
        item.addEventListener('click', function() {
            const postId = parseInt(this.dataset.post);
            selectPost(postId);
            
            // Visual feedback
            document.querySelectorAll('.post-item').forEach(p => p.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    function selectPost(postId) {
        gameState.currentPost = posts[postId];
        displayPostAnalysis(gameState.currentPost);
        document.getElementById('tutorial-feed').classList.add('hidden');
        
        if (postId === 1) {
            updateMentorMessage("This is the root of the crisis. Echo shared private DMs without consent. This violates digital ethics and damages trust. How should we address this?");
        }
    }

    function displayPostAnalysis(post) {
        document.getElementById('analysis-placeholder').classList.add('hidden');
        document.getElementById('post-analysis').classList.remove('hidden');
        
        document.getElementById('post-author').textContent = post.author;
        document.getElementById('post-content').innerHTML = `<p class="text-gray-200 text-sm">${post.content}</p>`;
        
        // Populate privacy flags
        const privacyFlags = document.getElementById('privacy-flags');
        if (post.privacyFlags.length > 0) {
            privacyFlags.innerHTML = post.privacyFlags.map(flag => `
                <div class="flex items-center gap-2 text-xs">
                    <i class="bi bi-exclamation-triangle text-red-400"></i>
                    <span class="text-red-300">${flag}</span>
                </div>
            `).join('');
        } else {
            privacyFlags.innerHTML = '<div class="text-green-400 text-xs">No privacy concerns detected</div>';
        }
        
        // Populate ethical concerns
        const ethicalConcerns = document.getElementById('ethical-concerns');
        if (post.ethicalConcerns.length > 0) {
            ethicalConcerns.innerHTML = post.ethicalConcerns.map(concern => `
                <div class="flex items-center gap-2 text-xs">
                    <i class="bi bi-exclamation-circle text-orange-400"></i>
                    <span class="text-orange-300">${concern}</span>
                </div>
            `).join('');
        } else {
            ethicalConcerns.innerHTML = '<div class="text-green-400 text-xs">No ethical concerns detected</div>';
        }
        
        // Reset analysis state
        gameState.analysisSteps[post.id] = {};
        document.getElementById('analysis-results').classList.add('hidden');
        document.getElementById('response-panel').classList.add('hidden');
        
        // Reset tool states
        document.querySelectorAll('.action-tool').forEach(tool => {
            tool.classList.remove('opacity-50');
            tool.disabled = false;
        });
    }

    // Analysis tools
    document.querySelectorAll('.action-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentPost) {
                handleAnalysisTool(toolType);
                this.classList.add('opacity-50');
                this.disabled = true;
            }
        });
    });

    function handleAnalysisTool(toolType) {
        const post = gameState.currentPost;
        let results = '';
        let mentorMessage = '';

        gameState.analysisSteps[post.id][toolType] = true;

        switch(toolType) {
            case 'analyze':
                if (post.type === 'privacy_violation') {
                    results = `
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">🔍 Deep Analysis: PRIVACY VIOLATION</h6>
                            <div class="text-red-200 text-sm space-y-1">
                                <p><strong>Violation Type:</strong> Unauthorized private content sharing</p>
                                <p><strong>Impact Level:</strong> High - damages trust and relationships</p>
                                <p><strong>Legal Risk:</strong> Potential harassment/privacy law violations</p>
                                <p><strong>Recommendation:</strong> Immediate mediation and education</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "The analysis confirms this is a serious privacy violation. Echo shared private messages without consent, violating both trust and digital ethics.";
                } else if (post.type === 'impersonation') {
                    results = `
                        <div class="bg-purple-900 border border-purple-600 rounded p-3">
                            <h6 class="text-purple-300 font-semibold mb-2">🔍 Deep Analysis: IMPERSONATION DETECTED</h6>
                            <div class="text-purple-200 text-sm space-y-1">
                                <p><strong>Threat Type:</strong> Account impersonation</p>
                                <p><strong>Intent:</strong> Character assassination and manipulation</p>
                                <p><strong>Technical Markers:</strong> Timing, language patterns inconsistent</p>
                                <p><strong>Action:</strong> Counter with factual information</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "This is clearly a fake post designed to damage Echo's reputation. The language and timing don't match Echo's usual posting patterns.";
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Deep Analysis: POSITIVE CONTENT</h6>
                            <p class="text-green-200 text-sm">This post promotes healthy dialogue and conflict de-escalation.</p>
                        </div>
                    `;
                    mentorMessage = "This is a positive contribution trying to de-escalate the situation. We should amplify this type of constructive communication.";
                }
                break;

            case 'trace':
                results = `
                    <div class="bg-blue-900 border border-blue-600 rounded p-3">
                        <h6 class="text-blue-300 font-semibold mb-2">📊 Spread Analysis</h6>
                        <div class="text-blue-200 text-sm space-y-1">
                            <p><strong>Primary Shares:</strong> ${Math.floor(Math.random() * 500) + 200}</p>
                            <p><strong>Secondary Shares:</strong> ${Math.floor(Math.random() * 1000) + 500}</p>
                            <p><strong>Bot Amplification:</strong> ${post.type === 'malicious' ? 'Detected' : 'Minimal'}</p>
                            <p><strong>Geographic Spread:</strong> Local community + ${Math.floor(Math.random() * 5) + 2} external networks</p>
                        </div>
                    </div>
                `;
                mentorMessage = "The spread pattern shows how quickly content can go viral in social networks. Understanding this helps us plan containment strategies.";
                break;

            case 'verify':
                if (post.type === 'impersonation') {
                    results = `
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">⚠️ Authenticity Check: FAKE ACCOUNT</h6>
                            <div class="text-red-200 text-sm space-y-1">
                                <p><strong>Account Age:</strong> 2 hours (suspicious)</p>
                                <p><strong>Verification Status:</strong> Unverified</p>
                                <p><strong>Post Pattern:</strong> Inconsistent with user history</p>
                                <p><strong>Conclusion:</strong> Likely impersonation attack</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Verification confirms this is a fake account created to impersonate Echo. This is a coordinated attack on their reputation.";
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Authenticity Check: VERIFIED</h6>
                            <p class="text-green-200 text-sm">Account and content verified as authentic.</p>
                        </div>
                    `;
                    mentorMessage = "This account and post are verified as authentic.";
                }
                break;

            case 'educate':
                results = `
                    <div class="bg-yellow-900 border border-yellow-600 rounded p-3">
                        <h6 class="text-yellow-300 font-semibold mb-2">📚 Educational Opportunity</h6>
                        <div class="text-yellow-200 text-sm space-y-1">
                            <p><strong>Key Lesson:</strong> Digital privacy and consent</p>
                            <p><strong>Teaching Moment:</strong> Think before you post</p>
                            <p><strong>Community Impact:</strong> How posts affect relationships</p>
                            <p><strong>Prevention:</strong> Healthy conflict resolution online</p>
                        </div>
                    </div>
                `;
                mentorMessage = "This situation is a valuable teaching moment about digital citizenship and the importance of respecting privacy online.";
                break;
        }

        // Add results to analysis panel
        const resultsContent = document.getElementById('results-content');
        resultsContent.innerHTML += results;
        document.getElementById('analysis-results').classList.remove('hidden');
        
        updateMentorMessage(mentorMessage);
        
        // Check if enough analysis completed
        if (Object.keys(gameState.analysisSteps[post.id]).length >= 2) {
            showResponsePanel();
        }
    }

    function showResponsePanel() {
        document.getElementById('response-panel').classList.remove('hidden');
        updateMentorMessage("You've gathered enough information. Now choose the most ethical and effective response strategy.");
    }

    // Response actions
    document.querySelectorAll('.response-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleResponse(action);
        });
    });

    function handleResponse(action) {
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

    function handleCorrectResponse(post, action) {
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

    function handleWrongResponse(post, action) {
        gameState.trustLevel -= 15;
        gameState.viralSpread += 10;
        
        showResultModal('❌', 'Response Ineffective', 
            'The chosen strategy didn\'t address the root issues effectively.',
            '<div class="text-red-400">Community trust decreased. The crisis continues to spread.</div>'
        );
        
        updateMentorMessage("That approach didn't work well. Consider the specific nature of each situation and choose responses that address root causes.");
    }

    // Helper functions
    function updateMentorMessage(message) {
        document.getElementById('mentor-message').textContent = message;
    }

    function updateMetrics() {
        // Ensure values stay within bounds
        gameState.trustLevel = Math.max(0, Math.min(100, gameState.trustLevel));
        gameState.viralSpread = Math.max(0, Math.min(100, gameState.viralSpread));
        gameState.privacyScore = Math.max(0, Math.min(100, gameState.privacyScore));
        gameState.trollAccounts = Math.max(0, gameState.trollAccounts);
        
        document.getElementById('trust-level').textContent = Math.round(gameState.trustLevel);
        document.getElementById('posts-secured').textContent = gameState.postsSecured;
        document.getElementById('viral-spread').textContent = Math.round(gameState.viralSpread);
        document.getElementById('troll-accounts').textContent = gameState.trollAccounts;
        document.getElementById('privacy-score').textContent = Math.round(gameState.privacyScore);
        
        // Update progress bars
        document.getElementById('trust-bar').style.width = gameState.trustLevel + '%';
        document.getElementById('privacy-bar').style.width = (100 - gameState.privacyScore) + '%';
        document.getElementById('viral-bar').style.width = gameState.viralSpread + '%';
        
        // Update status texts
        document.getElementById('trust-status').textContent = 
            gameState.trustLevel >= 75 ? 'Highly trusted' : 
            gameState.trustLevel >= 50 ? 'Moderately trusted' : 'Low trust';
            
        document.getElementById('privacy-status').textContent = 
            gameState.privacyScore >= 75 ? 'Well protected' : 
            gameState.privacyScore >= 50 ? 'Moderate exposure' : 'High risk exposure';
            
        document.getElementById('viral-status').textContent = 
            gameState.viralSpread >= 75 ? 'Crisis spreading' : 
            gameState.viralSpread >= 50 ? 'Moderate spread' : 'Contained';
    }

    function updatePostVisual(postId, resolved) {
        const postItem = document.querySelector(`[data-post="${postId}"]`);
        if (resolved) {
            postItem.classList.remove('animate-pulse');
            postItem.classList.add('opacity-75');
            // Add success indicator
            const successIcon = document.createElement('div');
            successIcon.className = 'absolute top-2 right-2 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center';
            successIcon.innerHTML = '<i class="bi bi-check text-white text-xs"></i>';
            postItem.style.position = 'relative';
            postItem.appendChild(successIcon);
        }
    }

    function showResultModal(icon, title, message, feedback) {
        document.getElementById('result-icon').textContent = icon;
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-message').textContent = message;
        document.getElementById('result-feedback').innerHTML = feedback;
        document.getElementById('results-modal').classList.remove('hidden');
    }

    function endGame(success) {
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

    // Event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('close-analysis').addEventListener('click', function() {
        document.getElementById('post-analysis').classList.add('hidden');
        document.getElementById('analysis-placeholder').classList.remove('hidden');
        gameState.currentPost = null;
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '💰',
            'New Financial Alert',
            'As social trust stabilizes, a new crisis emerges in the digital economy...',
            `
                <div class="text-left bg-green-900 border border-green-600 rounded p-3">
                    <p class="text-green-300 font-semibold">💰 FINANCIAL SECURITY ALERT</p>
                    <p class="text-green-200 text-sm mt-2">"While we cleaned the social web, someone else got in—through a fake startup investment portal. We're bleeding credits."</p>
                    <p class="text-gray-400 text-xs mt-2">Commander Vega: "A cadet's digital wallet was drained. Time to secure our financial future."</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 6: Digital Gold Rush?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/6';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});