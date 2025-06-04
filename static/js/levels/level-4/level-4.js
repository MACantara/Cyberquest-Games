document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let gameState = {
        vaultSecurity: 45,
        securedAccounts: 0,
        breachedAccounts: 0,
        mfaEnabled: 0,
        attackIntensity: 75,
        currentAccount: null,
        completedAccounts: [],
        loginAttempts: 0
    };

    // Account data
    const accounts = {
        1: {
            id: 1,
            email: 'alex.wilson@alumni',
            password: 'Summer2020!',
            strength: 'weak',
            adminPrivileges: false,
            mfaEnabled: false,
            vulnerabilities: ['Common seasonal pattern', 'Year in password', 'Single special character'],
            correctAction: 'force-reset'
        },
        2: {
            id: 2,
            email: 'maria.chen@alumni',
            password: 'MyDog2019#',
            strength: 'moderate',
            adminPrivileges: false,
            mfaEnabled: false,
            vulnerabilities: ['Personal information', 'Predictable pattern'],
            correctAction: 'enable-mfa'
        },
        3: {
            id: 3,
            email: 'j.torres@alumni',
            password: 'C0mpl3x!Phrase#2025',
            strength: 'strong',
            adminPrivileges: false,
            mfaEnabled: true,
            vulnerabilities: [],
            correctAction: 'verify-safe'
        },
        4: {
            id: 4,
            email: 'admin.legacy@alumni',
            password: 'password123',
            strength: 'critical',
            adminPrivileges: true,
            mfaEnabled: false,
            vulnerabilities: ['Default password', 'No complexity', 'Admin privileges at risk'],
            correctAction: 'lockdown'
        }
    };

    // Initialize game
    function initGame() {
        startAttackSimulation();
        showTutorial();
        startLoginFeed();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-audit').classList.remove('hidden');
            updateMentorMessage("Start with the admin.legacy account - it's the most critical vulnerability. Admin accounts with weak passwords are The Null's primary targets.");
        }, 2000);
    }

    // Attack simulation
    function startAttackSimulation() {
        setInterval(() => {
            gameState.loginAttempts++;
            updateAttackStats();
            
            // Simulate natural intensity fluctuation
            gameState.attackIntensity += (Math.random() - 0.5) * 10;
            gameState.attackIntensity = Math.max(0, Math.min(100, gameState.attackIntensity));
            
            document.getElementById('intensity-bar').style.width = gameState.attackIntensity + '%';
            document.getElementById('attempts-per-sec').textContent = 
                Math.floor(gameState.attackIntensity * 20) + ' attempts/sec';
            
        }, 2000);
    }

    function startLoginFeed() {
        const loginFeed = document.getElementById('login-feed');
        const attemptTypes = [
            { type: 'failed', text: 'Failed login: admin.legacy@alumni', class: 'text-red-400' },
            { type: 'failed', text: 'Failed login: alex.wilson@alumni', class: 'text-red-400' },
            { type: 'blocked', text: 'MFA blocked: j.torres@alumni', class: 'text-green-400' },
            { type: 'suspicious', text: 'Suspicious IP: 185.220.101.45', class: 'text-yellow-400' }
        ];

        setInterval(() => {
            const attempt = attemptTypes[Math.floor(Math.random() * attemptTypes.length)];
            const timestamp = new Date().toLocaleTimeString();
            
            const logEntry = document.createElement('div');
            logEntry.className = 'flex justify-between text-xs p-2 bg-gray-800 rounded';
            logEntry.innerHTML = `
                <span class="${attempt.class}">${attempt.text}</span>
                <span class="text-gray-500">${timestamp}</span>
            `;
            
            loginFeed.insertBefore(logEntry, loginFeed.firstChild);
            
            // Keep only last 10 entries
            while (loginFeed.children.length > 10) {
                loginFeed.removeChild(loginFeed.lastChild);
            }
        }, 3000);
    }

    // Account selection
    document.querySelectorAll('.account-item').forEach(item => {
        item.addEventListener('click', function() {
            const accountId = parseInt(this.dataset.account);
            selectAccount(accountId);
            
            // Visual feedback
            document.querySelectorAll('.account-item').forEach(a => a.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    function selectAccount(accountId) {
        gameState.currentAccount = accounts[accountId];
        displayAccountDetails(gameState.currentAccount);
        document.getElementById('tutorial-audit').classList.add('hidden');
        
        if (accountId === 4) {
            updateMentorMessage("Critical alert! This admin account has the weakest possible password and full system privileges. This is The Null's primary target - lock it down immediately!");
        }
    }

    function displayAccountDetails(account) {
        document.getElementById('account-details').classList.remove('hidden');
        
        const strengthColors = {
            'critical': 'text-red-400',
            'weak': 'text-red-400',
            'moderate': 'text-yellow-400',
            'strong': 'text-green-400'
        };

        const adminBadge = account.adminPrivileges ? 
            '<span class="bg-red-600 text-white px-2 py-1 rounded text-xs ml-2">ADMIN</span>' : '';
        
        const mfaBadge = account.mfaEnabled ? 
            '<span class="bg-green-600 text-white px-2 py-1 rounded text-xs ml-2">MFA</span>' : 
            '<span class="bg-gray-600 text-white px-2 py-1 rounded text-xs ml-2">NO MFA</span>';

        document.getElementById('account-info').innerHTML = `
            <div class="space-y-3">
                <div>
                    <h5 class="text-white font-semibold">${account.email}${adminBadge}${mfaBadge}</h5>
                    <p class="text-gray-400 text-sm">Password: ${account.password}</p>
                </div>
                <div>
                    <p class="text-sm">
                        <span class="text-gray-400">Strength:</span>
                        <span class="${strengthColors[account.strength]} font-semibold ml-2">${account.strength.toUpperCase()}</span>
                    </p>
                </div>
                ${account.vulnerabilities.length > 0 ? `
                <div>
                    <p class="text-red-300 font-semibold text-sm mb-1">Vulnerabilities:</p>
                    <ul class="text-red-200 text-xs space-y-1">
                        ${account.vulnerabilities.map(vuln => `<li>• ${vuln}</li>`).join('')}
                    </ul>
                </div>
                ` : '<p class="text-green-400 text-sm">No vulnerabilities detected</p>'}
            </div>
        `;
    }

    // Security actions
    document.querySelectorAll('.security-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            if (gameState.currentAccount) {
                handleSecurityAction(action);
            }
        });
    });

    function handleSecurityAction(action) {
        const account = gameState.currentAccount;
        const isCorrect = action === account.correctAction;
        
        if (isCorrect) {
            handleCorrectAction(account, action);
        } else {
            handleWrongAction(account, action);
        }
        
        gameState.completedAccounts.push(account.id);
        updateGameStats();
        updateAccountVisual(account.id, isCorrect);
        
        // Check if level complete
        if (gameState.vaultSecurity >= 90 && gameState.securedAccounts >= 3) {
            setTimeout(() => endGame(true), 2000);
        } else {
            setTimeout(() => {
                document.getElementById('account-details').classList.add('hidden');
                updateMentorMessage("Good work! Continue securing the remaining accounts. Each vulnerability you patch makes The Null's job harder.");
            }, 2000);
        }
    }

    function handleCorrectAction(account, action) {
        gameState.securedAccounts++;
        
        switch(action) {
            case 'enable-mfa':
                gameState.mfaEnabled++;
                gameState.vaultSecurity += 15;
                account.mfaEnabled = true;
                showResultModal('🛡️', 'MFA Enabled!', 
                    `Multi-factor authentication activated for ${account.email}.`,
                    '<div class="text-green-400">Account security significantly improved. Brute-force attacks will now fail.</div>'
                );
                break;
            case 'force-reset':
                gameState.vaultSecurity += 20;
                showResultModal('🔄', 'Password Reset!', 
                    `Forced password reset initiated for ${account.email}.`,
                    '<div class="text-green-400">User will be required to create a strong password on next login.</div>'
                );
                break;
            case 'lockdown':
                gameState.vaultSecurity += 25;
                gameState.attackIntensity -= 20;
                showResultModal('🔒', 'Account Locked!', 
                    `Emergency lockdown applied to ${account.email}.`,
                    '<div class="text-green-400">Critical admin account secured. Attack intensity reduced.</div>'
                );
                break;
            case 'verify-safe':
                gameState.vaultSecurity += 10;
                showResultModal('✅', 'Account Verified!', 
                    `${account.email} confirmed as secure.`,
                    '<div class="text-green-400">Strong password and MFA confirmed. No action needed.</div>'
                );
                break;
        }
        
        updateMentorMessage("Excellent security decision! The vault is more secure now.");
    }

    function handleWrongAction(account, action) {
        gameState.breachedAccounts++;
        gameState.vaultSecurity -= 10;
        gameState.attackIntensity += 15;
        
        showResultModal('❌', 'Security Breach!', 
            `Incorrect action allowed The Null to exploit ${account.email}.`,
            `<div class="text-red-400">The wrong security measure failed to protect this account. Attack intensity increased.</div>`
        );
        
        updateMentorMessage("That wasn't the right approach. The Null exploited the vulnerability while you were implementing the wrong security measure.");
    }

    // Helper functions
    function updateMentorMessage(message) {
        document.getElementById('mentor-message').textContent = message;
    }

    function updateGameStats() {
        document.getElementById('vault-security').textContent = Math.max(0, gameState.vaultSecurity);
        document.getElementById('secured-accounts').textContent = gameState.securedAccounts;
        document.getElementById('breached-accounts').textContent = gameState.breachedAccounts;
        document.getElementById('mfa-enabled').textContent = gameState.mfaEnabled;
        document.getElementById('attack-intensity').textContent = Math.max(0, gameState.attackIntensity);
    }

    function updateAttackStats() {
        // Simulate ongoing attacks
        if (Math.random() < 0.3) {
            const weakAccounts = Object.values(accounts).filter(acc => 
                acc.strength === 'weak' || acc.strength === 'critical'
            );
            if (weakAccounts.length > 0 && !gameState.completedAccounts.includes(4)) {
                gameState.attackIntensity += 5;
            }
        }
    }

    function updateAccountVisual(accountId, secured) {
        const accountItem = document.querySelector(`[data-account="${accountId}"]`);
        if (secured) {
            accountItem.className = 'account-item bg-green-900 border border-green-600 rounded p-3 opacity-75';
            accountItem.querySelector('.text-red-400, .text-yellow-400').className = 'bi bi-shield-check text-green-400 text-lg flex-shrink-0 mt-1';
        } else {
            accountItem.classList.add('animate-pulse');
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
            updateMentorMessage("Outstanding work, Nova! You've successfully defended the Alumni Vault and prevented The Null from accessing sensitive records.");
            document.getElementById('complete-level').disabled = false;
            
            showResultModal(
                '🏆',
                'Vault Secured!',
                'You\'ve successfully completed The Password Heist and earned the Credential Guardian badge.',
                `
                    <div class="text-left space-y-3">
                        <div class="bg-orange-900 border border-orange-600 rounded p-3">
                            <p class="text-orange-300 font-semibold">🏆 Digital Badge Earned</p>
                            <p class="text-orange-200 text-sm">Credential Guardian - Level 4 Cleared</p>
                        </div>
                        <div class="text-sm space-y-1">
                            <p><strong>Final Vault Security:</strong> ${gameState.vaultSecurity}%</p>
                            <p><strong>Accounts Secured:</strong> ${gameState.securedAccounts}</p>
                            <p><strong>MFA Deployments:</strong> ${gameState.mfaEnabled}</p>
                            <p><strong>Attack Intensity:</strong> Reduced to ${gameState.attackIntensity}%</p>
                        </div>
                    </div>
                `
            );
        }
    }

    // Emergency actions
    document.getElementById('vault-lockdown').addEventListener('click', function() {
        gameState.vaultSecurity = 100;
        gameState.attackIntensity = 0;
        showResultModal('🔒', 'Emergency Lockdown', 
            'All vault access suspended. The Null has been blocked.',
            '<div class="text-blue-400">Emergency protocol activated. All accounts temporarily inaccessible.</div>'
        );
        updateGameStats();
    });

    document.getElementById('mass-reset').addEventListener('click', function() {
        gameState.vaultSecurity += 30;
        showResultModal('🔄', 'Mass Reset Initiated', 
            'All alumni passwords reset. Users will be prompted to create new credentials.',
            '<div class="text-yellow-400">Disruptive but effective. All weak passwords eliminated.</div>'
        );
        updateGameStats();
    });

    document.getElementById('deploy-mfa').addEventListener('click', function() {
        gameState.mfaEnabled = 4;
        gameState.vaultSecurity += 40;
        gameState.attackIntensity -= 30;
        showResultModal('🛡️', 'MFA Deployed', 
            'Multi-factor authentication enabled for all accounts.',
            '<div class="text-green-400">Excellent decision! Brute-force attacks are now ineffective.</div>'
        );
        updateGameStats();
    });

    // Event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('close-details').addEventListener('click', function() {
        document.getElementById('account-details').classList.add('hidden');
        gameState.currentAccount = null;
    });

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '📱',
            'New Crisis Alert',
            'As the vault security stabilizes, a new crisis emerges...',
            `
                <div class="text-left bg-yellow-900 border border-yellow-600 rounded p-3">
                    <p class="text-yellow-300 font-semibold">📱 SOCIAL MEDIA CRISIS</p>
                    <p class="text-yellow-200 text-sm mt-2">"A cadet's private DMs were leaked and manipulated for clout. Rumors spread faster than truth online."</p>
                    <p class="text-gray-400 text-xs mt-2">Commander Vega: "We saved the vault, Nova—but we might've lost something more fragile: trust."</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 5: The Social Web?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/5';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});