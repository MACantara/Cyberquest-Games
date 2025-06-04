document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let gameState = {
        startupFunds: 500000,
        verifiedInvestors: 0,
        scamsDetected: 0,
        contractsAnalyzed: 0,
        trustRating: 85,
        currentInvestor: null,
        analysisSteps: {},
        completedInvestors: []
    };

    // Investor data
    const investors = {
        1: {
            id: 1,
            name: 'Venture Dynamics',
            email: 'alex@venturedynamics.com',
            offer: '$2M Series A funding for 15% equity. Standard terms, professional presentation.',
            type: 'legitimate',
            domainFlags: [],
            contractIssues: [],
            correctAction: 'accept'
        },
        2: {
            id: 2,
            name: 'Mercurial Capital',
            email: 'admin@mercurial-capit4l.co',
            offer: '$10M instant crypto transfer! No paperwork needed. Click here to claim your funds immediately!',
            type: 'scam',
            domainFlags: ['Typosquatting: capit4l vs capital', 'Suspicious TLD: .co instead of .com', 'No HTTPS certificate'],
            contractIssues: ['Automatic wallet access clause', 'No legal jurisdiction specified', 'Irreversible transaction terms'],
            correctAction: 'reject'
        },
        3: {
            id: 3,
            name: 'TechSeed Partners',
            email: 'investment@techseed.ai',
            offer: '$5M conditional funding based on user acquisition metrics. 6-month evaluation period.',
            type: 'moderate_risk',
            domainFlags: ['New domain registration', 'Limited online presence'],
            contractIssues: ['Aggressive clawback clauses'],
            correctAction: 'negotiate'
        },
        4: {
            id: 4,
            name: 'Angel Group Elite',
            email: 'noreply@angel-group-elite.net',
            offer: 'Pre-approved $50M mega round! You\'ve been specially selected. Limited time offer!',
            type: 'scam',
            domainFlags: ['No-reply email address', 'Generic TLD', 'No business registration found'],
            contractIssues: ['Pre-payment required', 'No investor verification', 'Fake testimonials'],
            correctAction: 'reject'
        }
    };

    // Initialize game
    function initGame() {
        showTutorial();
        updateFinancialMetrics();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-inbox').classList.remove('hidden');
            updateMentorMessage("Start with Mercurial Capital - that urgent offer is a classic scam. The domain has typos and the offer is unrealistically generous. Trust your instincts.");
        }, 2000);
    }

    // Update financial metrics
    function updateFinancialMetrics() {
        document.getElementById('startup-funds').textContent = '$' + (gameState.startupFunds / 1000) + 'K';
        document.getElementById('verified-investors').textContent = gameState.verifiedInvestors;
        document.getElementById('scams-detected').textContent = gameState.scamsDetected;
        document.getElementById('contracts-analyzed').textContent = gameState.contractsAnalyzed;
        document.getElementById('trust-rating').textContent = gameState.trustRating;
        
        // Update risk bars
        const financialRisk = Math.max(0, 100 - gameState.trustRating);
        const reputationRisk = Math.max(0, gameState.scamsDetected * 10);
        
        document.getElementById('financial-risk').style.width = financialRisk + '%';
        document.getElementById('reputation-risk').style.width = reputationRisk + '%';
    }

    // Investor selection
    document.querySelectorAll('.investor-item').forEach(item => {
        item.addEventListener('click', function() {
            const investorId = parseInt(this.dataset.investor);
            selectInvestor(investorId);
            
            // Visual feedback
            document.querySelectorAll('.investor-item').forEach(i => i.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    function selectInvestor(investorId) {
        gameState.currentInvestor = investors[investorId];
        displayInvestmentAnalysis(gameState.currentInvestor);
        document.getElementById('tutorial-inbox').classList.add('hidden');
        
        if (investorId === 2) {
            updateMentorMessage("Red flags everywhere! The domain has a '4' instead of 'a', it's using .co instead of .com, and the offer is impossibly generous. This is definitely a scam.");
        }
    }

    function displayInvestmentAnalysis(investor) {
        document.getElementById('analyzer-placeholder').classList.add('hidden');
        document.getElementById('investment-analysis').classList.remove('hidden');
        
        document.getElementById('investor-name').textContent = investor.name;
        document.getElementById('email-content').textContent = investor.offer;
        
        // Populate domain analysis
        const domainAnalysis = document.getElementById('domain-analysis');
        domainAnalysis.innerHTML = `
            <div class="flex justify-between text-xs">
                <span class="text-gray-400">Email Domain:</span>
                <span class="text-white">${investor.email.split('@')[1]}</span>
            </div>
            <div class="flex justify-between text-xs">
                <span class="text-gray-400">Security Status:</span>
                <span class="${investor.type === 'legitimate' ? 'text-green-400' : 'text-red-400'}">
                    ${investor.type === 'legitimate' ? 'Verified' : 'Suspicious'}
                </span>
            </div>
        `;
        
        // Populate contract terms
        const contractTerms = document.getElementById('contract-terms');
        if (investor.contractIssues.length > 0) {
            contractTerms.innerHTML = investor.contractIssues.map(issue => `
                <div class="flex items-center gap-2 text-xs">
                    <i class="bi bi-exclamation-triangle text-red-400"></i>
                    <span class="text-red-300">${issue}</span>
                </div>
            `).join('');
        } else {
            contractTerms.innerHTML = '<div class="text-green-400 text-xs">Standard terms detected</div>';
        }
        
        // Reset analysis state
        gameState.analysisSteps[investor.id] = {};
        document.getElementById('analysis-results').classList.add('hidden');
        document.getElementById('decision-panel').classList.add('hidden');
        
        // Reset tool states
        document.querySelectorAll('.analysis-tool').forEach(tool => {
            tool.classList.remove('opacity-50');
            tool.disabled = false;
        });
    }

    // Analysis tools
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentInvestor) {
                handleAnalysisTool(toolType);
                this.classList.add('opacity-50');
                this.disabled = true;
            }
        });
    });

    function handleAnalysisTool(toolType) {
        const investor = gameState.currentInvestor;
        let results = '';
        let mentorMessage = '';

        gameState.analysisSteps[investor.id][toolType] = true;

        switch(toolType) {
            case 'domain':
                if (investor.type === 'scam') {
                    results = `
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">🚨 Domain Analysis: SUSPICIOUS</h6>
                            <div class="text-red-200 text-sm space-y-1">
                                ${investor.domainFlags.map(flag => `<p>• ${flag}</p>`).join('')}
                                <p><strong>Recommendation:</strong> Do not trust this domain</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Domain analysis confirms this is a scam. Multiple red flags including typosquatting and suspicious TLD usage.";
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Domain Analysis: VERIFIED</h6>
                            <div class="text-green-200 text-sm space-y-1">
                                <p>• Valid SSL certificate</p>
                                <p>• Established domain registration</p>
                                <p>• Professional email infrastructure</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Domain checks out - this appears to be a legitimate business email.";
                }
                break;

            case 'headers':
                if (investor.type === 'scam') {
                    results = `
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">📧 Email Headers: FORGED</h6>
                            <div class="text-red-200 text-sm space-y-1">
                                <p><strong>SPF:</strong> FAIL - sender not authorized</p>
                                <p><strong>DKIM:</strong> FAIL - invalid signature</p>
                                <p><strong>Routing:</strong> Multiple suspicious relays</p>
                                <p><strong>Origin:</strong> Unknown/masked server</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Email headers show clear signs of forgery. This email did not come from the claimed sender.";
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Email Headers: AUTHENTIC</h6>
                            <div class="text-green-200 text-sm space-y-1">
                                <p><strong>SPF:</strong> PASS - authorized sender</p>
                                <p><strong>DKIM:</strong> PASS - valid signature</p>
                                <p><strong>Routing:</strong> Direct from company servers</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Email headers are properly authenticated - this is a legitimate communication.";
                }
                break;

            case 'contract':
                gameState.contractsAnalyzed++;
                if (investor.contractIssues.length > 0) {
                    results = `
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">📋 Contract Analysis: HIGH RISK</h6>
                            <div class="text-red-200 text-sm space-y-1">
                                ${investor.contractIssues.map(issue => `<p>• ${issue}</p>`).join('')}
                                <p><strong>Risk Level:</strong> Extremely High</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Contract analysis reveals multiple dangerous clauses. This agreement would give the 'investor' complete control over your funds.";
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Contract Analysis: STANDARD TERMS</h6>
                            <div class="text-green-200 text-sm space-y-1">
                                <p>• Standard equity exchange terms</p>
                                <p>• Reasonable investor protections</p>
                                <p>• Clear exit clauses</p>
                                <p>• Professional legal structure</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Contract terms are standard and reasonable for this type of investment.";
                }
                break;

            case 'reputation':
                if (investor.type === 'scam') {
                    results = `
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">🔍 Reputation Check: NOT FOUND</h6>
                            <div class="text-red-200 text-sm space-y-1">
                                <p>• No business registration found</p>
                                <p>• No professional LinkedIn profiles</p>
                                <p>• No previous investment history</p>
                                <p>• Multiple scam reports online</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Reputation check reveals this 'investor' doesn't exist. No legitimate business records or professional profiles found.";
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Reputation Check: ESTABLISHED</h6>
                            <div class="text-green-200 text-sm space-y-1">
                                <p>• Verified business registration</p>
                                <p>• Professional team profiles</p>
                                <p>• Successful investment history</p>
                                <p>• Positive industry reputation</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Reputation check confirms this is an established, legitimate investment firm with a strong track record.";
                }
                break;
        }

        // Add results to analysis panel
        const resultsContent = document.getElementById('results-content');
        resultsContent.innerHTML += results;
        document.getElementById('analysis-results').classList.remove('hidden');
        
        updateMentorMessage(mentorMessage);
        
        // Check if enough analysis completed
        if (Object.keys(gameState.analysisSteps[investor.id]).length >= 2) {
            showDecisionPanel();
        }
    }

    function showDecisionPanel() {
        document.getElementById('decision-panel').classList.remove('hidden');
        updateMentorMessage("Analysis complete. Now make your investment decision based on the evidence you've gathered.");
    }

    // Decision actions
    document.querySelectorAll('.decision-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleDecision(action);
        });
    });

    function handleDecision(action) {
        const investor = gameState.currentInvestor;
        const isCorrect = action === investor.correctAction;
        
        gameState.completedInvestors.push(investor.id);
        
        if (isCorrect) {
            handleCorrectDecision(investor, action);
        } else {
            handleWrongDecision(investor, action);
        }
        
        updateFinancialMetrics();
        updateInvestorVisual(investor.id, isCorrect);
        
        // Check if level complete
        if (gameState.scamsDetected >= 2 && gameState.verifiedInvestors >= 1) {
            setTimeout(() => endGame(true), 2000);
        } else {
            setTimeout(() => {
                document.getElementById('investment-analysis').classList.add('hidden');
                document.getElementById('analyzer-placeholder').classList.remove('hidden');
                updateMentorMessage("Good decision! Continue analyzing the remaining investors to secure your startup's future.");
            }, 2000);
        }
    }

    function handleCorrectDecision(investor, action) {
        switch(action) {
            case 'accept':
                gameState.verifiedInvestors++;
                gameState.startupFunds += 2000000;
                gameState.trustRating += 10;
                showResultModal('✅', 'Investment Secured!', 
                    `Successfully partnered with ${investor.name}. Funds added to your account.`,
                    '<div class="text-green-400">+$2M added to startup funds. Legitimate partnership established.</div>'
                );
                break;
            case 'reject':
                gameState.scamsDetected++;
                gameState.trustRating += 15;
                showResultModal('🛡️', 'Scam Blocked!', 
                    `You successfully identified and rejected a fraudulent investment offer.`,
                    '<div class="text-red-400">Scam prevented! Your funds and data remain secure.</div>'
                );
                break;
            case 'negotiate':
                gameState.verifiedInvestors++;
                gameState.trustRating += 5;
                showResultModal('🤝', 'Terms Negotiated!', 
                    `Smart negotiation secured better terms and verified the investor's legitimacy.`,
                    '<div class="text-blue-400">Professional handling of moderate-risk situation.</div>'
                );
                break;
        }
        
        updateMentorMessage("Excellent decision-making! Your thorough analysis led to the right choice.");
    }

    function handleWrongDecision(investor, action) {
        if (action === 'accept' && investor.type === 'scam') {
            gameState.startupFunds -= 500000;
            gameState.trustRating -= 25;
            showResultModal('💸', 'Funds Stolen!', 
                'You fell for the scam. Your startup funds have been drained.',
                '<div class="text-red-400">-$500K lost to fraudulent transfer. Reputation damaged.</div>'
            );
        } else {
            gameState.trustRating -= 10;
            showResultModal('❌', 'Poor Decision', 
                'Your response wasn\'t optimal for this situation.',
                '<div class="text-yellow-400">Missed opportunity or unnecessary risk taken.</div>'
            );
        }
        
        updateMentorMessage("That wasn't the best choice. Review the analysis results more carefully before making decisions.");
    }

    // Helper functions
    function updateMentorMessage(message) {
        document.getElementById('mentor-message').textContent = message;
    }

    function updateInvestorVisual(investorId, success) {
        const investorItem = document.querySelector(`[data-investor="${investorId}"]`);
        if (success) {
            investorItem.classList.remove('animate-pulse');
            investorItem.classList.add('opacity-75');
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
            updateMentorMessage("Outstanding work, Nova! You've successfully navigated the digital investment landscape and protected your startup from financial predators.");
            document.getElementById('complete-level').disabled = false;
            
            showResultModal(
                '🏆',
                'Startup Secured!',
                'You\'ve successfully completed Digital Gold Rush and earned the Ledger Defender badge.',
                `
                    <div class="text-left space-y-3">
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <p class="text-green-300 font-semibold">🏆 Digital Badge Earned</p>
                            <p class="text-green-200 text-sm">Ledger Defender - Scam Proofed</p>
                        </div>
                        <div class="text-sm space-y-1">
                            <p><strong>Final Funds:</strong> $${(gameState.startupFunds / 1000)}K</p>
                            <p><strong>Verified Investors:</strong> ${gameState.verifiedInvestors}</p>
                            <p><strong>Scams Detected:</strong> ${gameState.scamsDetected}</p>
                            <p><strong>Trust Rating:</strong> ${gameState.trustRating}%</p>
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
        document.getElementById('investment-analysis').classList.add('hidden');
        document.getElementById('analyzer-placeholder').classList.remove('hidden');
        gameState.currentInvestor = null;
    });

    // Quick actions
    document.getElementById('emergency-freeze').addEventListener('click', function() {
        showResultModal('🔒', 'Emergency Freeze Activated', 
            'All transactions temporarily suspended for security review.',
            '<div class="text-blue-400">Proactive security measure. All funds protected.</div>'
        );
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '🤖',
            'Disturbing Discovery',
            'While scanning WireTrace logs, you notice something troubling...',
            `
                <div class="text-left bg-purple-900 border border-purple-600 rounded p-3">
                    <p class="text-purple-300 font-semibold">🤖 AI BEHAVIOR ALERT</p>
                    <p class="text-purple-200 text-sm mt-2">"A rogue AI is mimicking user behavior—your behavior. Every scam you stop... it evolves."</p>
                    <p class="text-gray-400 text-xs mt-2">Argus: "It's learning from you. Null's building an adaptive weapon."</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 7: The Adaptive Adversary?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/7';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});