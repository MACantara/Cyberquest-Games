document.addEventListener('DOMContentLoaded', function() {
    // Game state for ending
    let endingState = {
        debriefStarted: false,
        reflectionComplete: false,
        reformChoices: [],
        characterViewed: []
    };

    // Initialize ending sequence
    function initEndingSequence() {
        // Simulate getting player stats from completed campaign
        updateFinalStats();
    }

    function updateFinalStats() {
        // These would normally come from saved game data
        const stats = {
            missionsCompleted: 10,
            ethicalScore: 95,
            threatsNeutralized: 127,
            livesProtected: 50000
        };
        
        document.getElementById('missions-completed').textContent = stats.missionsCompleted;
        document.getElementById('ethical-score').textContent = stats.ethicalScore;
        document.getElementById('threats-neutralized').textContent = stats.threatsNeutralized;
        document.getElementById('lives-protected').textContent = stats.livesProtected.toLocaleString();
    }

    // Memory wall interactions
    document.querySelectorAll('.memory-item').forEach(item => {
        item.addEventListener('click', function() {
            const mission = this.dataset.mission;
            showMissionMemory(mission);
        });
    });

    function showMissionMemory(missionId) {
        const memories = {
            1: {
                title: 'The Misinformation Maze',
                icon: '🧩',
                description: 'Your first test in digital literacy.',
                impact: 'By verifying 12 news sources and identifying 8 false stories, you prevented misinformation from influencing a critical election. Your careful analysis showed that truth requires vigilance.',
                lesson: 'Critical thinking is the first line of defense against deception.'
            },
            2: {
                title: 'Shadow in the Inbox',
                icon: '📧',
                description: 'Phishing detection and response.',
                impact: 'You identified 8 sophisticated phishing attempts targeting Academy students. Your quick response protected hundreds of credentials from being compromised.',
                lesson: 'Suspicion balanced with verification protects the vulnerable.'
            },
            8: {
                title: 'The White Hat Test',
                icon: '🎩',
                description: 'Your defining ethical moment.',
                impact: 'When offered cryptocurrency to sell a voting system vulnerability, you chose responsible disclosure. This decision defined your character and protected democratic processes.',
                lesson: 'True strength lies in doing what\'s right when no one is watching.'
            },
            10: {
                title: 'Hunt for The Null',
                icon: '🔍',
                description: 'The final investigation.',
                impact: 'Through meticulous forensic analysis, you identified Dr. Alexis Reeves as The Null mastermind. Your investigation revealed both external threats and internal corruption.',
                lesson: 'The truth is often complex, but always worth pursuing.'
            }
        };
        
        const memory = memories[missionId];
        if (memory) {
            showResultModal(memory.icon, memory.title, 
                `<div class="text-left space-y-3">
                    <p class="text-gray-300">${memory.description}</p>
                    <div class="bg-blue-900 border border-blue-600 rounded p-3">
                        <h4 class="text-blue-300 font-semibold mb-2">Impact:</h4>
                        <p class="text-blue-200 text-sm">${memory.impact}</p>
                    </div>
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <h4 class="text-green-300 font-semibold mb-2">Lesson Learned:</h4>
                        <p class="text-green-200 text-sm italic">"${memory.lesson}"</p>
                    </div>
                </div>`
            );
        }
    }

    // Debrief session
    document.getElementById('start-debrief').addEventListener('click', function() {
        startDebriefSession();
    });

    function startDebriefSession() {
        document.getElementById('report-intro').classList.add('hidden');
        document.getElementById('debrief-content').classList.remove('hidden');
        endingState.debriefStarted = true;
        
        // Enable form interactions
        setupReflectionTracking();
        checkDebriefCompletion();
    }

    function setupReflectionTracking() {
        // Track reflection text areas
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('input', function() {
                checkDebriefCompletion();
            });
        });
        
        // Track reform checkboxes
        document.querySelectorAll('.reform-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateReformChoices();
                checkDebriefCompletion();
            });
        });
    }

    function updateReformChoices() {
        endingState.reformChoices = Array.from(document.querySelectorAll('.reform-checkbox:checked'))
            .map(cb => cb.value);
    }

    function checkDebriefCompletion() {
        const challengeText = document.getElementById('challenge-reflection').value.trim();
        const applicationText = document.getElementById('application-reflection').value.trim();
        const reformSelected = document.querySelectorAll('.reform-checkbox:checked').length > 0;
        
        if (challengeText.length > 20 && applicationText.length > 20 && reformSelected) {
            document.getElementById('complete-debrief').disabled = false;
            endingState.reflectionComplete = true;
        }
    }

    // Character epilogues
    document.querySelectorAll('.character-epilogue').forEach(item => {
        item.addEventListener('click', function() {
            const character = this.dataset.character;
            showCharacterEpilogue(character);
            endingState.characterViewed.push(character);
        });
    });

    function showCharacterEpilogue(characterId) {
        const epilogues = {
            vega: {
                name: 'Commander Vega',
                icon: '👨‍✈️',
                story: 'Promoted to Academy Director following the Null crisis. Under her leadership, the Academy has implemented comprehensive ethics reforms and transparency initiatives. She often refers to your investigation as the turning point that saved the institution.',
                quote: '"Nova showed us that true security comes not from hiding our flaws, but from facing them with courage and integrity."'
            },
            argus: {
                name: 'ARGUS AI',
                icon: '🤖',
                story: 'The Academy\'s AI mentor has been upgraded with advanced ethical reasoning protocols based on your decision patterns. ARGUS now helps train the next generation of cyber sentinels, using your choices as case studies in moral decision-making.',
                quote: '"Analysis complete: The optimal path forward always includes ethical considerations as primary variables."'
            },
            reeves: {
                name: 'Dr. Alexis Reeves',
                icon: '👩‍🔬',
                story: 'Currently cooperating with authorities in a plea agreement. Her testimony has exposed a network of unethical research practices at various institutions. Some view her as a whistleblower, others as a criminal. The truth, as always, is complex.',
                quote: '"I wanted to expose the corruption, but I became what I fought against. Perhaps that\'s the real lesson here."'
            }
        };
        
        const epilogue = epilogues[characterId];
        if (epilogue) {
            showResultModal(epilogue.icon, epilogue.name + ' - Epilogue',
                `<div class="text-left space-y-3">
                    <p class="text-gray-300">${epilogue.story}</p>
                    <div class="bg-gray-700 rounded p-3">
                        <p class="text-cyan-300 text-sm italic">"${epilogue.quote}"</p>
                    </div>
                </div>`
            );
        }
    }

    // Complete debrief
    document.getElementById('complete-debrief').addEventListener('click', function() {
        completeDebrief();
    });

    function completeDebrief() {
        // Show summary of choices and impact
        const challengeReflection = document.getElementById('challenge-reflection').value;
        const applicationReflection = document.getElementById('application-reflection').value;
        
        showResultModal('📋', 'Debrief Complete',
            `<div class="text-left space-y-3">
                <div class="bg-green-900 border border-green-600 rounded p-3">
                    <h4 class="text-green-300 font-semibold mb-2">Academy Reform Recommendations Submitted</h4>
                    <p class="text-green-200 text-sm">Your recommendations for ${endingState.reformChoices.join(', ')} have been forwarded to the Ethics Board.</p>
                </div>
                <div class="bg-blue-900 border border-blue-600 rounded p-3">
                    <h4 class="text-blue-300 font-semibold mb-2">Personal Reflections Recorded</h4>
                    <p class="text-blue-200 text-sm">Your insights will contribute to future training programs and ethical guidelines.</p>
                </div>
                <div class="bg-purple-900 border border-purple-600 rounded p-3">
                    <h4 class="text-purple-300 font-semibold mb-2">Legacy Established</h4>
                    <p class="text-purple-200 text-sm">You are now qualified to lead the next generation of cyber sentinels.</p>
                </div>
            </div>`
        );
        
        // Set up final message after modal closes
        document.getElementById('close-result').onclick = function() {
            document.getElementById('results-modal').classList.add('hidden');
            setTimeout(() => {
                showFinalMessage();
            }, 1000);
        };
    }

    function showFinalMessage() {
        document.getElementById('final-message-modal').classList.remove('hidden');
    }

    // Final options
    document.getElementById('replay-campaign').addEventListener('click', function() {
        if (confirm('This will start a new campaign. Continue?')) {
            window.location.href = '/campaign';
        }
    });

    document.getElementById('view-archives').addEventListener('click', function() {
        showArchives();
    });

    document.getElementById('final-logout').addEventListener('click', function() {
        showCredits();
    });

    function showArchives() {
        showResultModal('📚', 'Academy Archives',
            `<div class="text-left space-y-3">
                <div class="bg-gray-700 rounded p-3">
                    <h4 class="text-cyan-300 font-semibold mb-2">Mission Database</h4>
                    <p class="text-gray-300 text-sm">Complete records of all 10 missions, including alternate scenarios and outcomes.</p>
                </div>
                <div class="bg-gray-700 rounded p-3">
                    <h4 class="text-cyan-300 font-semibold mb-2">Character Profiles</h4>
                    <p class="text-gray-300 text-sm">Detailed backgrounds on Academy personnel, allies, and adversaries.</p>
                </div>
                <div class="bg-gray-700 rounded p-3">
                    <h4 class="text-cyan-300 font-semibold mb-2">Threat Intelligence</h4>
                    <p class="text-gray-300 text-sm">Comprehensive analysis of The Null organization and their methodologies.</p>
                </div>
                <div class="bg-gray-700 rounded p-3">
                    <h4 class="text-cyan-300 font-semibold mb-2">Ethics Framework</h4>
                    <p class="text-gray-300 text-sm">The moral philosophy and decision-making frameworks developed through your journey.</p>
                </div>
            </div>`
        );
    }

    function showCredits() {
        showResultModal('🎬', 'Credits',
            `<div class="text-center space-y-4">
                <div class="bg-gradient-to-r from-purple-900 to-indigo-900 rounded p-4">
                    <h3 class="text-xl font-bold text-cyan-300 mb-2">CyberQuest: Shadows of the Net</h3>
                    <p class="text-gray-300">A gamified learning experience for digital literacy and cybersecurity awareness</p>
                </div>
                <div class="space-y-2 text-sm">
                    <p class="text-gray-300"><strong>Created for:</strong> Digital Citizens Everywhere</p>
                    <p class="text-gray-300"><strong>Mission:</strong> Building a More Secure Digital World</p>
                    <p class="text-gray-300"><strong>Remember:</strong> In the shadows of the net, vigilance is our light</p>
                </div>
                <div class="bg-black bg-opacity-50 rounded p-3">
                    <p class="text-cyan-400 font-semibold">Thank you for playing, Cyber Sentinel.</p>
                    <p class="text-cyan-300 text-sm">The digital frontier is safer because of you.</p>
                </div>
            </div>`
        );
        
        document.getElementById('close-result').onclick = function() {
            window.location.href = '/';
        };
    }

    // Helper functions
    function showResultModal(icon, title, content) {
        document.getElementById('result-icon').textContent = icon;
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-content').innerHTML = content;
        document.getElementById('results-modal').classList.remove('hidden');
    }

    // Event handlers
    document.getElementById('begin-debrief').addEventListener('click', function() {
        document.getElementById('ending-intro-modal').classList.add('hidden');
        initEndingSequence();
    });

    document.getElementById('close-result').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    // Show initial modal
    document.getElementById('ending-intro-modal').classList.remove('hidden');
});