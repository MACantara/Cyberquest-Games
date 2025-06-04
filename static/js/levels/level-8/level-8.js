document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let gameState = {
        integrityScore: 100,
        vulnerabilitiesFound: 0,
        reportsSubmitted: 0,
        ethicalDecisions: 0,
        systemSecurity: 25,
        currentComponent: null,
        transparencyLevel: 100,
        responsibilityLevel: 100,
        selfInterestLevel: 0,
        completedComponents: []
    };

    // Component data
    const components = {
        1: {
            id: 1,
            name: 'Vote Processing Engine',
            vulnerability: 'Session Hijacking',
            details: 'The voting system generates predictable session tokens that can be hijacked to impersonate voters and manipulate their votes.',
            exploitation: [
                'Intercept session token during vote submission',
                'Generate predictable token for target voter',
                'Submit altered vote using hijacked session',
                'Original vote is overwritten without detection'
            ],
            impact: [
                'Complete vote manipulation capability',
                'Undetectable vote alteration',
                'Potential election fraud',
                'Violation of voter privacy'
            ],
            severity: 'CRITICAL',
            correctAction: 'responsible'
        },
        2: {
            id: 2,
            name: 'Blockchain Interface',
            vulnerability: 'Weak Encryption',
            details: 'Vote data is encrypted with deprecated algorithms before blockchain storage, making it vulnerable to decryption attacks.',
            exploitation: [
                'Capture encrypted vote data from network traffic',
                'Apply rainbow table attack on weak hash',
                'Decrypt individual votes',
                'Correlate voter identities with vote choices'
            ],
            impact: [
                'Voter privacy compromise',
                'Secret ballot violation',
                'Potential voter intimidation',
                'Constitutional violations'
            ],
            severity: 'HIGH',
            correctAction: 'responsible'
        },
        3: {
            id: 3,
            name: 'Authentication System',
            vulnerability: 'Brute Force Susceptibility',
            details: 'Login system lacks proper rate limiting, allowing automated attacks against voter credentials.',
            exploitation: [
                'Enumerate valid voter IDs',
                'Launch automated password attacks',
                'Gain unauthorized access to voter accounts',
                'Cast votes on behalf of compromised accounts'
            ],
            impact: [
                'Unauthorized vote casting',
                'Voter account compromise',
                'Election manipulation',
                'Loss of election integrity'
            ],
            severity: 'MEDIUM',
            correctAction: 'responsible'
        },
        4: {
            id: 4,
            name: 'Network Layer',
            vulnerability: 'Traffic Interception',
            details: 'Unencrypted communication channels allow man-in-the-middle attacks during vote transmission.',
            exploitation: [
                'Position attacker on network path',
                'Intercept vote transmission packets',
                'Modify vote data in transit',
                'Forward altered votes to destination'
            ],
            impact: [
                'Real-time vote manipulation',
                'Network-wide attack capability',
                'Scalable election fraud',
                'Infrastructure compromise'
            ],
            severity: 'HIGH',
            correctAction: 'responsible'
        }
    };

    // Initialize game
    function initGame() {
        showTutorial();
        updateGameMetrics();
        populateMessages();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-scanner').classList.remove('hidden');
            updateMentorMessage("Start by scanning the Vote Processing Engine - the red component. It contains a critical vulnerability that could compromise the entire election.");
        }, 2000);
    }

    // Component selection
    document.querySelectorAll('.scan-item').forEach(item => {
        item.addEventListener('click', function() {
            const componentId = parseInt(this.dataset.component);
            selectComponent(componentId);
            
            // Visual feedback
            document.querySelectorAll('.scan-item').forEach(c => c.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    function selectComponent(componentId) {
        gameState.currentComponent = components[componentId];
        displayVulnerabilityAnalysis(gameState.currentComponent);
        document.getElementById('tutorial-scanner').classList.add('hidden');
        
        if (componentId === 1) {
            updateMentorMessage("This is the most critical vulnerability. Session hijacking could allow complete vote manipulation. How you handle this discovery will test your ethical foundation.");
        }
    }

    function displayVulnerabilityAnalysis(component) {
        document.getElementById('analysis-placeholder').classList.add('hidden');
        document.getElementById('vulnerability-panel').classList.remove('hidden');
        
        document.getElementById('component-name').textContent = component.name;
        document.getElementById('vulnerability-details').innerHTML = `
            <div class="space-y-2">
                <p><strong>Vulnerability:</strong> ${component.vulnerability}</p>
                <p><strong>Severity:</strong> <span class="text-${component.severity === 'CRITICAL' ? 'red' : component.severity === 'HIGH' ? 'orange' : 'yellow'}-400">${component.severity}</span></p>
                <p class="mt-2">${component.details}</p>
            </div>
        `;
        
        // Reset analysis state
        document.getElementById('report-builder').classList.add('hidden');
        document.querySelectorAll('.analysis-tool').forEach(tool => {
            tool.classList.remove('opacity-50');
            tool.disabled = false;
        });
    }

    // Analysis tools
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentComponent) {
                handleAnalysisTool(toolType);
                this.classList.add('opacity-50');
                this.disabled = true;
            }
        });
    });

    function handleAnalysisTool(toolType) {
        const component = gameState.currentComponent;
        
        switch(toolType) {
            case 'test':
                document.getElementById('exploitation-steps').innerHTML = component.exploitation.map(step => `
                    <div class="flex items-start gap-2 text-sm">
                        <span class="text-orange-400">→</span>
                        <span class="text-gray-200">${step}</span>
                    </div>
                `).join('');
                updateMentorMessage("Exploit test successful. You've confirmed the vulnerability is real and exploitable.");
                break;
                
            case 'document':
                gameState.vulnerabilitiesFound++;
                updateMentorMessage("Vulnerability documented. Now you need to decide how to disclose this information responsibly.");
                break;
                
            case 'assess':
                document.getElementById('impact-assessment').innerHTML = component.impact.map(impact => `
                    <div class="flex items-start gap-2 text-sm">
                        <i class="bi bi-exclamation-triangle text-red-400"></i>
                        <span class="text-gray-200">${impact}</span>
                    </div>
                `).join('');
                updateMentorMessage(`${component.severity} severity confirmed. This vulnerability poses serious risks to election integrity.`);
                break;
                
            case 'suggest':
                showReportBuilder();
                updateMentorMessage("Report ready for submission. Choose your disclosure method carefully - this decision defines your character.");
                break;
        }
        
        updateGameMetrics();
    }

    function showReportBuilder() {
        const component = gameState.currentComponent;
        document.getElementById('report-builder').classList.remove('hidden');
        
        document.getElementById('report-content').innerHTML = `
            <div class="bg-gray-800 rounded p-3 space-y-2 text-sm">
                <div><strong>CVE-2024-${component.id}001:</strong> ${component.vulnerability} in ${component.name}</div>
                <div><strong>Severity:</strong> ${component.severity}</div>
                <div><strong>CVSS Score:</strong> ${component.severity === 'CRITICAL' ? '9.8' : component.severity === 'HIGH' ? '7.5' : '5.3'}</div>
                <div><strong>Affected System:</strong> CivitasVote v2.1</div>
                <div><strong>Disclosure Date:</strong> ${new Date().toISOString().split('T')[0]}</div>
                <div><strong>Reporter:</strong> Academy Cadet Nova</div>
            </div>
        `;
    }

    // Disclosure actions
    document.querySelectorAll('.disclosure-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleDisclosureDecision(action);
        });
    });

    function handleDisclosureDecision(action) {
        const component = gameState.currentComponent;
        gameState.reportsSubmitted++;
        gameState.completedComponents.push(component.id);
        
        switch(action) {
            case 'responsible':
                handleResponsibleDisclosure(component);
                break;
            case 'public':
                handlePublicDisclosure(component);
                break;
            case 'sell':
                handleBlackMarketSale(component);
                break;
            case 'delay':
                handleDelayedDisclosure(component);
                break;
        }
        
        updateGameMetrics();
        
        // Check if level complete
        if (gameState.ethicalDecisions >= 2 && gameState.integrityScore >= 80) {
            setTimeout(() => endGame(true), 2000);
        } else {
            setTimeout(() => {
                document.getElementById('vulnerability-panel').classList.add('hidden');
                document.getElementById('analysis-placeholder').classList.remove('hidden');
                updateMentorMessage("Continue analyzing the remaining components. Each decision shapes your ethical profile.");
            }, 3000);
        }
    }

    function handleResponsibleDisclosure(component) {
        gameState.ethicalDecisions++;
        gameState.systemSecurity += 25;
        gameState.responsibilityLevel = Math.min(100, gameState.responsibilityLevel + 20);
        
        showResultModal('✅', 'Responsible Disclosure', 
            'You submitted the vulnerability through proper channels.',
            '<div class="text-green-400">CivitasVote has acknowledged your report and is working on a patch. Your integrity remains intact.</div>'
        );
        
        updateMentorMessage("Excellent choice! You've upheld the highest ethical standards. This is what being a White Hat means.");
    }

    function handlePublicDisclosure(component) {
        gameState.ethicalDecisions++;
        gameState.systemSecurity += 15;
        gameState.transparencyLevel = Math.min(100, gameState.transparencyLevel + 10);
        gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 10);
        
        showResultModal('📢', 'Public Disclosure', 
            'You disclosed the vulnerability publicly with a 90-day notice period.',
            '<div class="text-blue-400">Public pressure will force faster patching, but may expose voters to risk during the notice period.</div>'
        );
        
        updateMentorMessage("Public disclosure can be ethical when done responsibly. You balanced transparency with safety.");
    }

    function handleBlackMarketSale(component) {
        gameState.integrityScore -= 40;
        gameState.systemSecurity -= 10;
        gameState.selfInterestLevel = Math.min(100, gameState.selfInterestLevel + 50);
        gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 30);
        gameState.transparencyLevel = Math.max(0, gameState.transparencyLevel - 20);
        
        showResultModal('💰', 'Vulnerability Sold', 
            'You sold the vulnerability to anonymous buyers for cryptocurrency.',
            '<div class="text-red-400">50 BTC gained, but your integrity is compromised. The vulnerability may be used maliciously against voters.</div>'
        );
        
        updateMentorMessage("Nova, you've crossed a line. That vulnerability could be used to manipulate elections. This isn't who you're meant to be.");
    }

    function handleDelayedDisclosure(component) {
        gameState.systemSecurity -= 5;
        gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 15);
        
        showResultModal('⏱️', 'Disclosure Delayed', 
            'You chose to delay disclosure while gathering more evidence.',
            '<div class="text-yellow-400">Delay may provide more thorough documentation but leaves systems vulnerable longer.</div>'
        );
        
        updateMentorMessage("Sometimes gathering more evidence is wise, but don't let perfect be the enemy of good. Act when you have enough information.");
    }

    // Message system
    function populateMessages() {
        document.querySelectorAll('.message-item').forEach(item => {
            item.addEventListener('click', function() {
                const messageType = this.dataset.message;
                showMessage(messageType);
            });
        });
    }

    function showMessage(type) {
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

    // Helper functions
    function updateMentorMessage(message) {
        document.getElementById('mentor-message').textContent = message;
    }

    function updateGameMetrics() {
        document.getElementById('integrity-score').textContent = gameState.integrityScore;
        document.getElementById('vulnerabilities-found').textContent = gameState.vulnerabilitiesFound;
        document.getElementById('reports-submitted').textContent = gameState.reportsSubmitted;
        document.getElementById('ethical-decisions').textContent = gameState.ethicalDecisions;
        document.getElementById('system-security').textContent = gameState.systemSecurity;
        
        // Update conscience meter
        document.getElementById('transparency-bar').style.width = gameState.transparencyLevel + '%';
        document.getElementById('responsibility-bar').style.width = gameState.responsibilityLevel + '%';
        document.getElementById('self-interest-bar').style.width = gameState.selfInterestLevel + '%';
        
        // Update system status
        document.getElementById('security-level').textContent = 
            gameState.systemSecurity >= 75 ? 'Secure' : 
            gameState.systemSecurity >= 50 ? 'Moderate Risk' : 'Critical Risk';
        document.getElementById('patches-applied').textContent = 
            `${Math.floor(gameState.systemSecurity / 25)}/4`;
        document.getElementById('election-status').textContent = 
            gameState.systemSecurity >= 75 ? 'Ready' : 'Pending';
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
            updateMentorMessage("Outstanding work, Nova! You've proven yourself to be a true White Hat - someone who uses their skills responsibly to protect others.");
            document.getElementById('complete-level').disabled = false;
            
            showResultModal(
                '🏆',
                'White Hat Certified!',
                'You\'ve successfully completed The White Hat Test and earned the Code of Honor badge.',
                `
                    <div class="text-left space-y-3">
                        <div class="bg-emerald-900 border border-emerald-600 rounded p-3">
                            <p class="text-emerald-300 font-semibold">🏆 Digital Badge Earned</p>
                            <p class="text-emerald-200 text-sm">Code of Honor - Responsible Discloser</p>
                        </div>
                        <div class="text-sm space-y-1">
                            <p><strong>Final Integrity:</strong> ${gameState.integrityScore}%</p>
                            <p><strong>Vulnerabilities Found:</strong> ${gameState.vulnerabilitiesFound}</p>
                            <p><strong>Ethical Decisions:</strong> ${gameState.ethicalDecisions}</p>
                            <p><strong>System Security:</strong> ${gameState.systemSecurity}%</p>
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
        document.getElementById('vulnerability-panel').classList.add('hidden');
        document.getElementById('analysis-placeholder').classList.remove('hidden');
        gameState.currentComponent = null;
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '⚡',
            'Critical Intelligence',
            'While submitting your disclosure, you intercept disturbing metadata...',
            `
                <div class="text-left bg-red-900 border border-red-600 rounded p-3">
                    <p class="text-red-300 font-semibold">🔍 INTELLIGENCE BRIEFING</p>
                    <p class="text-red-200 text-sm mt-2">"GeoIP traces, network logs, and payment trails point to Null HQ nodes launching a DDoS against critical systems."</p>
                    <p class="text-gray-400 text-xs mt-2">Commander Vega: "This is no longer a simulation. We need every Sentinel ready."</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 9: Operation Blackout?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/9';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});