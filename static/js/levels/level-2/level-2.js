document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let gameState = {
        securityScore: 100,
        threatLevel: 0,
        cadetsAffected: 0,
        emailsAnalyzed: 0,
        currentEmail: null,
        phishingCount: 0,
        blocksCount: 0,
        analysisSteps: {},
        completedEmails: []
    };

    // Email data
    const emails = {
        1: {
            id: 1,
            subject: "URGENT: Tactical Briefing Required",
            from: "vega@interw0r1d.net",
            time: "2 minutes ago",
            body: `Nova,

This is Commander Vega. I need you to download and review the attached tactical briefing IMMEDIATELY. This is a PRIORITY 1 mission briefing that cannot wait.

The file contains critical information about a security breach we've discovered. Download it now and report back within the hour.

DO NOT share this with other cadets until you've reviewed it first.

-Commander Vega
Strategic Operations Division`,
            isPhishing: true,
            hasAttachment: true,
            redFlags: [
                "Domain misspelling: interw0r1d.net vs interworld.academy",
                "Excessive urgency and ALL CAPS",
                "Suspicious attachment request",
                "Unusual secrecy instructions",
                "No official signature block"
            ],
            correctAction: "report"
        },
        2: {
            id: 2,
            subject: "Weekly Training Schedule",
            from: "admin@interworld.academy",
            time: "1 hour ago", 
            body: `Dear Cadet Nova,

Your training schedule for next week has been updated. Please review the attached calendar and confirm your availability for the new simulation exercises.

Training Schedule:
- Monday: Network Security Fundamentals
- Tuesday: Incident Response Drills
- Wednesday: Free Study Period
- Thursday: Advanced Cryptography
- Friday: Team Assessment

Please confirm receipt.

Best regards,
Academy Administration
InterWorld Cyber Academy`,
            isPhishing: false,
            hasAttachment: false,
            correctAction: "ignore"
        },
        3: {
            id: 3,
            subject: "Account Verificaton Needed",
            from: "security@inter-world.org",
            time: "30 minutes ago",
            body: `Dear User,

Your academy account requires immediate verification due to unusual login activity detected from an unknown location.

Click the link below to verify your account immediately:
https://secure-academy-login.suspicious-site.com/verify

Failure to verify within 24 hours will result in account suspension.

Security Team
InterWorld Academy`,
            isPhishing: true,
            hasLinks: true,
            redFlags: [
                "Typo in subject: 'Verificaton' instead of 'Verification'",
                "Suspicious domain: inter-world.org vs interworld.academy",
                "Malicious link to external site",
                "Threatens account suspension",
                "Generic 'Dear User' greeting"
            ],
            correctAction: "report"
        },
        4: {
            id: 4,
            subject: "Confused about urgent message?",
            from: "c.vega@interworld.academy",
            time: "Just now",
            body: `Nova,

I just received a report that someone has been sending messages claiming to be me. I want to be very clear: I did NOT send any urgent briefing or request for you to download any files.

If you received such a message, please report it to our security team immediately. This appears to be a phishing attempt targeting our cadets.

Please be extra vigilant and verify any urgent communications through our official channels.

Commander Sarah Vega
Strategic Operations Division
InterWorld Cyber Academy
Official Contact: +1-555-ACADEMY`,
            isPhishing: false,
            hasAttachment: false,
            correctAction: "escalate"
        }
    };

    // Initialize game
    function initGame() {
        showTutorial();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-inbox').classList.remove('hidden');
            updateMentorMessage("Start with the red urgent message from 'Commander Vega.' Something about it should immediately raise red flags.");
        }, 2000);
    }

    // Email selection
    document.querySelectorAll('.email-item').forEach(item => {
        item.addEventListener('click', function() {
            const emailId = parseInt(this.dataset.email);
            selectEmail(emailId);
            
            // Visual feedback
            document.querySelectorAll('.email-item').forEach(e => e.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    function selectEmail(emailId) {
        gameState.currentEmail = emails[emailId];
        displayEmail(gameState.currentEmail);
        document.getElementById('tutorial-inbox').classList.add('hidden');
        
        if (emailId === 1) {
            updateMentorMessage("Good choice. Look at the sender address carefully. Do you notice anything suspicious about 'interw0r1d.net'? Use the analysis tools to investigate.");
        }
    }

    function displayEmail(email) {
        document.getElementById('email-placeholder').classList.add('hidden');
        document.getElementById('email-content').classList.remove('hidden');
        
        document.getElementById('email-subject').textContent = email.subject;
        document.getElementById('email-from').textContent = email.from;
        document.getElementById('email-time').textContent = email.time;
        document.getElementById('email-body').textContent = email.body;
        
        // Show attachments if present
        if (email.hasAttachment) {
            document.getElementById('email-attachments').classList.remove('hidden');
        } else {
            document.getElementById('email-attachments').classList.add('hidden');
        }
        
        // Show links if present
        if (email.hasLinks) {
            document.getElementById('email-links').classList.remove('hidden');
            document.getElementById('link-content').innerHTML = `
                <div class="bg-red-800 rounded p-2 mb-2">
                    <a href="#" class="text-red-300 text-sm hover:underline" onclick="return false;">
                        https://secure-academy-login.suspicious-site.com/verify
                    </a>
                    <p class="text-red-200 text-xs mt-1">⚠️ Suspicious external domain</p>
                </div>
            `;
        } else {
            document.getElementById('email-links').classList.add('hidden');
        }
        
        // Reset analysis state
        gameState.analysisSteps[email.id] = {};
        document.getElementById('analysis-results').classList.add('hidden');
        document.getElementById('response-panel').classList.add('hidden');
        
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
            if (gameState.currentEmail) {
                handleAnalysisTool(toolType);
                this.classList.add('opacity-50');
                this.disabled = true;
            }
        });
    });

    function handleAnalysisTool(toolType) {
        const email = gameState.currentEmail;
        let results = '';
        let mentorMessage = '';

        gameState.analysisSteps[email.id][toolType] = true;

        switch(toolType) {
            case 'headers':
                if (email.isPhishing) {
                    results = `
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">⚠️ Header Analysis: SUSPICIOUS</h6>
                            <div class="text-red-200 text-sm space-y-1">
                                <p><strong>Return-Path:</strong> bounce@suspicious-server.com</p>
                                <p><strong>Received:</strong> from unknown-relay.net</p>
                                <p><strong>SPF:</strong> FAIL (domain mismatch)</p>
                                <p><strong>DKIM:</strong> FAIL (invalid signature)</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Excellent! The email headers reveal this message failed authentication. The routing path shows it didn't come from our servers.";
                    updateSenderInfo("🔴 FAILED AUTHENTICATION");
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Header Analysis: LEGITIMATE</h6>
                            <div class="text-green-200 text-sm space-y-1">
                                <p><strong>Return-Path:</strong> admin@interworld.academy</p>
                                <p><strong>Received:</strong> from mail.interworld.academy</p>
                                <p><strong>SPF:</strong> PASS</p>
                                <p><strong>DKIM:</strong> PASS</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Good analysis! The headers confirm this email is legitimate and properly authenticated.";
                    updateSenderInfo("✅ AUTHENTICATED");
                }
                break;

            case 'sender':
                if (email.isPhishing) {
                    results = `
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">⚠️ Sender Verification: FAILED</h6>
                            <div class="text-red-200 text-sm space-y-1">
                                <p><strong>Domain:</strong> interw0r1d.net (SUSPICIOUS)</p>
                                <p><strong>Legitimate Domain:</strong> interworld.academy</p>
                                <p><strong>Registration:</strong> 2 days ago (RED FLAG)</p>
                                <p><strong>Registrar:</strong> Anonymous proxy service</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Perfect catch! The domain uses a zero instead of 'o' - a classic typosquatting attack. Real Academy emails come from interworld.academy.";
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Sender Verification: VERIFIED</h6>
                            <div class="text-green-200 text-sm space-y-1">
                                <p><strong>Domain:</strong> interworld.academy ✓</p>
                                <p><strong>Certificate:</strong> Valid organization certificate</p>
                                <p><strong>Reputation:</strong> Trusted sender</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Excellent verification! This sender is legitimate and from our official domain.";
                }
                break;

            case 'links':
                if (email.hasLinks) {
                    results = `
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">⚠️ Link Analysis: MALICIOUS</h6>
                            <div class="text-red-200 text-sm space-y-1">
                                <p><strong>Destination:</strong> suspicious-site.com</p>
                                <p><strong>Purpose:</strong> Credential harvesting</p>
                                <p><strong>Threat Level:</strong> HIGH</p>
                                <p><strong>Action:</strong> DO NOT CLICK</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Dangerous! That link leads to a fake login page designed to steal credentials. Never click suspicious links.";
                    updateLinkInfo("🔴 MALICIOUS LINK DETECTED");
                } else {
                    results = `
                        <div class="bg-gray-700 border border-gray-600 rounded p-3">
                            <h6 class="text-gray-300 font-semibold mb-2">ℹ️ Link Analysis: NO LINKS</h6>
                            <p class="text-gray-400 text-sm">No external links detected in this email.</p>
                        </div>
                    `;
                    mentorMessage = "No links found in this email - that's actually a good sign for legitimacy.";
                    updateLinkInfo("No links detected");
                }
                break;

            case 'content':
                if (email.isPhishing) {
                    results = `
                        <div class="bg-red-900 border border-red-600 rounded p-3">
                            <h6 class="text-red-300 font-semibold mb-2">⚠️ Content Analysis: SUSPICIOUS</h6>
                            <div class="text-red-200 text-sm space-y-1">
                                <p>• Excessive urgency ("IMMEDIATELY", "PRIORITY 1")</p>
                                <p>• Unusual secrecy requests</p>
                                <p>• Generic signature</p>
                                <p>• Pressure tactics</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Great analysis! Phishing emails often use urgency and fear to bypass critical thinking. Real commanders don't demand immediate file downloads.";
                } else {
                    results = `
                        <div class="bg-green-900 border border-green-600 rounded p-3">
                            <h6 class="text-green-300 font-semibold mb-2">✅ Content Analysis: LEGITIMATE</h6>
                            <div class="text-green-200 text-sm space-y-1">
                                <p>• Professional tone and language</p>
                                <p>• Proper contact information</p>
                                <p>• Reasonable requests</p>
                                <p>• Official formatting</p>
                            </div>
                        </div>
                    `;
                    mentorMessage = "Good analysis! This content follows proper professional communication standards.";
                }
                break;
        }

        // Add results to analysis panel
        const resultsContent = document.getElementById('results-content');
        resultsContent.innerHTML += results;
        document.getElementById('analysis-results').classList.remove('hidden');
        
        updateMentorMessage(mentorMessage);
        
        // Check if enough analysis completed
        if (Object.keys(gameState.analysisSteps[email.id]).length >= 2) {
            showResponsePanel();
        }
    }

    function showResponsePanel() {
        document.getElementById('response-panel').classList.remove('hidden');
        updateMentorMessage("You've gathered enough evidence. Now choose your response action. Think carefully about the appropriate escalation level.");
    }

    // Response actions
    document.querySelectorAll('.response-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleResponse(action);
        });
    });

    function handleResponse(action) {
        const email = gameState.currentEmail;
        const isCorrect = action === email.correctAction;
        
        gameState.emailsAnalyzed++;
        gameState.completedEmails.push(email.id);
        
        if (isCorrect) {
            handleCorrectResponse(email, action);
        } else {
            handleWrongResponse(email, action);
        }
        
        updateGameStats();
        
        // Check if level complete
        if (gameState.emailsAnalyzed >= 3) {
            setTimeout(() => endGame(true), 2000);
        } else {
            setTimeout(() => {
                document.getElementById('email-content').classList.add('hidden');
                document.getElementById('email-placeholder').classList.remove('hidden');
                updateMentorMessage("Good work! Now analyze another email. The real Commander Vega's message might provide important context.");
            }, 2000);
        }
    }

    function handleCorrectResponse(email, action) {
        gameState.securityScore += 25;
        gameState.blocksCount++;
        
        if (email.isPhishing) {
            gameState.phishingCount++;
        }
        
        let title, message, feedback;
        
        switch(action) {
            case 'report':
                title = "Threat Contained!";
                message = "You correctly identified and reported the phishing attempt.";
                feedback = `
                    <div class="space-y-2">
                        <p class="text-green-400 font-semibold">✅ Correct Action: Report Phishing</p>
                        <p class="text-sm text-gray-300">Evidence you found:</p>
                        <ul class="text-sm text-gray-400 space-y-1">
                            ${email.redFlags.map(flag => `<li>• ${flag}</li>`).join('')}
                        </ul>
                        <p class="text-cyan-400 text-sm mt-3">+25 Security Points • Threat Blocked</p>
                    </div>
                `;
                break;
            case 'escalate':
                title = "Proper Escalation!";
                message = "You correctly escalated this to the security team.";
                feedback = `
                    <div class="space-y-2">
                        <p class="text-green-400 font-semibold">✅ Correct Action: Security Escalation</p>
                        <p class="text-sm text-gray-300">This legitimate concern was properly escalated to investigate the impersonation attack.</p>
                        <p class="text-cyan-400 text-sm mt-3">+25 Security Points</p>
                    </div>
                `;
                break;
        }
        
        showResultModal('✅', title, message, feedback);
        updateMentorMessage("Excellent decision, Nova. Your quick action prevented a security breach.");
    }

    function handleWrongResponse(email, action) {
        gameState.securityScore -= 20;
        gameState.threatLevel += 30;
        gameState.cadetsAffected += Math.floor(Math.random() * 5) + 1;
        
        let title, message, feedback;
        
        if (action === 'open' && email.isPhishing) {
            title = "Security Breach!";
            message = "You fell for the phishing attack. Malware is spreading!";
            feedback = `
                <div class="space-y-2">
                    <p class="text-red-400 font-semibold">❌ Dangerous Action: Followed Malicious Instructions</p>
                    <p class="text-sm text-gray-300">What you missed:</p>
                    <ul class="text-sm text-gray-400 space-y-1">
                        ${email.redFlags.map(flag => `<li>• ${flag}</li>`).join('')}
                    </ul>
                    <p class="text-red-400 text-sm mt-3">-20 Security Points • ${gameState.cadetsAffected} Cadets Affected</p>
                </div>
            `;
        } else {
            title = "Incorrect Response";
            message = "Your response wasn't appropriate for this situation.";
            feedback = `
                <div class="space-y-2">
                    <p class="text-red-400 font-semibold">❌ Incorrect Action</p>
                    <p class="text-sm text-gray-300">The correct action was: ${email.correctAction}</p>
                    <p class="text-red-400 text-sm mt-3">-20 Security Points</p>
                </div>
            `;
        }
        
        showResultModal('❌', title, message, feedback);
        updateMentorMessage("That wasn't the best choice, Nova. Learn from this mistake and be more careful with the next email.");
    }

    // Helper functions
    function updateMentorMessage(message) {
        document.getElementById('mentor-message').textContent = message;
    }

    function updateSenderInfo(info) {
        document.getElementById('sender-info').textContent = info;
    }

    function updateLinkInfo(info) {
        document.getElementById('link-info').textContent = info;
    }

    function updateGameStats() {
        document.getElementById('security-score').textContent = gameState.securityScore;
        document.getElementById('threat-level').textContent = gameState.threatLevel;
        document.getElementById('cadets-affected').textContent = gameState.cadetsAffected;
        document.getElementById('emails-analyzed').textContent = gameState.emailsAnalyzed;
        document.getElementById('phishing-count').textContent = gameState.phishingCount;
        document.getElementById('blocks-count').textContent = gameState.blocksCount;
        
        // Update threat meter
        const threatBar = document.getElementById('threat-bar');
        const threatDisplay = document.getElementById('threat-display');
        const threatStatus = document.getElementById('threat-status');
        
        threatBar.style.width = gameState.threatLevel + '%';
        
        if (gameState.threatLevel >= 75) {
            threatBar.className = 'bg-red-500 h-4 rounded transition-all duration-500';
            threatDisplay.textContent = '🔴';
            threatStatus.textContent = 'Critical Threat';
            threatStatus.className = 'text-sm text-red-400';
        } else if (gameState.threatLevel >= 40) {
            threatBar.className = 'bg-yellow-500 h-4 rounded transition-all duration-500';
            threatDisplay.textContent = '🟡';
            threatStatus.textContent = 'Elevated Risk';
            threatStatus.className = 'text-sm text-yellow-400';
        } else {
            threatBar.className = 'bg-green-400 h-4 rounded transition-all duration-500';
            threatDisplay.textContent = '🟢';
            threatStatus.textContent = 'System Secure';
            threatStatus.className = 'text-sm text-green-400';
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
            updateMentorMessage("Outstanding work, Nova! You've successfully identified the phishing threat and protected the Academy. Your email security skills are impressive.");
            document.getElementById('complete-level').disabled = false;
            
            showResultModal(
                '🏆',
                'Mission Complete!',
                'You\'ve successfully completed Shadow in the Inbox and earned the Phish Fighter badge.',
                `
                    <div class="text-left space-y-3">
                        <div class="bg-blue-900 border border-blue-600 rounded p-3">
                            <p class="text-blue-300 font-semibold">🏆 Digital Badge Earned</p>
                            <p class="text-blue-200 text-sm">Phish Fighter - Inbox Defender</p>
                        </div>
                        <div class="text-sm space-y-1">
                            <p><strong>Final Security Score:</strong> ${gameState.securityScore}/100</p>
                            <p><strong>Threat Level:</strong> ${gameState.threatLevel}% (${gameState.threatLevel < 30 ? 'Well Contained' : 'Needs Improvement'})</p>
                            <p><strong>Phishing Blocked:</strong> ${gameState.phishingCount}</p>
                            <p><strong>Cadets Protected:</strong> ${Math.max(0, 10 - gameState.cadetsAffected)}</p>
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

    document.getElementById('close-email').addEventListener('click', function() {
        document.getElementById('email-content').classList.add('hidden');
        document.getElementById('email-placeholder').classList.remove('hidden');
        gameState.currentEmail = null;
    });

    document.getElementById('download-attachment').addEventListener('click', function() {
        if (gameState.currentEmail && gameState.currentEmail.isPhishing) {
            handleResponse('open');
        }
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '🚨',
            'Incoming Alert',
            'As you file your security report, a new emergency alert appears...',
            `
                <div class="text-left bg-red-900 border border-red-600 rounded p-3">
                    <p class="text-red-300 font-semibold">🚨 EMERGENCY ALERT</p>
                    <p class="text-red-200 text-sm mt-2">"Nova—come quickly. Malware has been detected in the Academy's VR Gaming Arena. Tournament players are reporting system crashes."</p>
                    <p class="text-gray-400 text-xs mt-2">Source: Academy Emergency Response</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 3: Malware Mayhem?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/3';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});