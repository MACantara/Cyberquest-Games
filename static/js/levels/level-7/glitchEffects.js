import { gameState } from './gameState.js';

let glitchInterval;
let ghostEffectInterval;
let adaptiveEffects = [];

export function startGlitchEffects() {
    // Start continuous glitch effects that intensify with AI confidence
    glitchInterval = setInterval(() => {
        triggerRandomGlitch();
        updateAdaptiveEffects();
    }, 3000 + Math.random() * 2000); // Random intervals between 3-5 seconds
    
    // Start ghost effect simulation
    startGhostEffects();
    
    // Initialize screen corruption
    initializeScreenCorruption();
}

export function stopGlitchEffects() {
    if (glitchInterval) {
        clearInterval(glitchInterval);
        glitchInterval = null;
    }
    
    if (ghostEffectInterval) {
        clearInterval(ghostEffectInterval);
        ghostEffectInterval = null;
    }
    
    // Clear all adaptive effects
    adaptiveEffects.forEach(effect => {
        if (effect.element && effect.element.parentNode) {
            effect.element.parentNode.removeChild(effect.element);
        }
    });
    adaptiveEffects = [];
    
    // Reset all visual corruption
    resetVisualEffects();
}

function triggerRandomGlitch() {
    const glitchTypes = [
        'headerFlicker',
        'textDistortion', 
        'colorShift',
        'screenTear',
        'dataCorruption',
        'ghostUI'
    ];
    
    // Choose intensity based on AI confidence
    const intensity = Math.floor(gameState.aiConfidence / 20); // 0-4 scale
    const numEffects = Math.min(intensity + 1, 3);
    
    // Trigger multiple effects simultaneously when AI confidence is high
    for (let i = 0; i < numEffects; i++) {
        const effectType = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
        executeGlitchEffect(effectType);
    }
}

function executeGlitchEffect(type) {
    switch(type) {
        case 'headerFlicker':
            flickerHeader();
            break;
        case 'textDistortion':
            distortText();
            break;
        case 'colorShift':
            shiftColors();
            break;
        case 'screenTear':
            createScreenTear();
            break;
        case 'dataCorruption':
            corruptData();
            break;
        case 'ghostUI':
            showGhostInterface();
            break;
    }
}

function flickerHeader() {
    const header = document.getElementById('header-glitch');
    if (header) {
        header.style.opacity = '0.7';
        
        // Flash sequence
        const flashes = [0.7, 0, 0.5, 0, 0.9, 0, 0.3, 0];
        let flashIndex = 0;
        
        const flashInterval = setInterval(() => {
            header.style.opacity = flashes[flashIndex];
            flashIndex++;
            
            if (flashIndex >= flashes.length) {
                clearInterval(flashInterval);
                header.style.opacity = '0';
            }
        }, 100);
    }
}

function distortText() {
    // Randomly corrupt text elements
    const textElements = document.querySelectorAll('p, span, div:not(.glitch-protected)');
    const targets = Array.from(textElements).slice(0, 3); // Limit to 3 elements
    
    targets.forEach(element => {
        if (element.textContent.length > 3) {
            const originalText = element.textContent;
            const corruptedText = corruptString(originalText);
            
            element.textContent = corruptedText;
            element.classList.add('glitch-text');
            
            // Restore after delay
            setTimeout(() => {
                element.textContent = originalText;
                element.classList.remove('glitch-text');
            }, 1000 + Math.random() * 2000);
        }
    });
}

function corruptString(text) {
    const glitchChars = '█▓▒░▄▀■□▪▫◦∆∇◊○●◘◙☻☺♠♣♥♦';
    let corrupted = text.split('');
    
    // Corrupt random characters
    const corruptionLevel = Math.min(0.3, gameState.aiConfidence / 200);
    for (let i = 0; i < corrupted.length; i++) {
        if (Math.random() < corruptionLevel) {
            corrupted[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
    }
    
    return corrupted.join('');
}

function shiftColors() {
    const colorTargets = document.querySelectorAll('.bg-blue-900, .bg-red-900, .text-blue-300, .text-red-300');
    
    colorTargets.forEach(element => {
        element.style.filter = `hue-rotate(${Math.random() * 360}deg) saturate(${0.5 + Math.random()}`;
        
        setTimeout(() => {
            element.style.filter = '';
        }, 500 + Math.random() * 1500);
    });
}

function createScreenTear() {
    const tear = document.createElement('div');
    tear.className = 'screen-tear';
    tear.style.cssText = `
        position: fixed;
        top: ${Math.random() * window.innerHeight}px;
        left: 0;
        right: 0;
        height: ${5 + Math.random() * 10}px;
        background: linear-gradient(90deg, 
            rgba(255,0,0,0.8) 0%, 
            rgba(0,255,0,0.8) 33%, 
            rgba(0,0,255,0.8) 66%, 
            rgba(255,0,255,0.8) 100%);
        z-index: 1000;
        animation: tear-glitch 0.1s infinite;
        pointer-events: none;
    `;
    
    document.body.appendChild(tear);
    
    setTimeout(() => {
        if (tear.parentNode) {
            tear.parentNode.removeChild(tear);
        }
    }, 200 + Math.random() * 300);
}

function corruptData() {
    // Corrupt displayed metrics temporarily
    const metrics = ['ai-confidence', 'predictability-score', 'patterns-broken'];
    
    metrics.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const originalText = element.textContent;
            const corruptedValue = Math.floor(Math.random() * 100) + '%';
            
            element.textContent = corruptedValue;
            element.style.color = '#ff0080';
            element.style.textShadow = '0 0 10px #ff0080';
            
            setTimeout(() => {
                element.textContent = originalText;
                element.style.color = '';
                element.style.textShadow = '';
            }, 800 + Math.random() * 1200);
        }
    });
}

function showGhostInterface() {
    // Create ghost overlay showing failed attempts
    const ghost = document.createElement('div');
    ghost.className = 'ghost-interface';
    ghost.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(100, 0, 100, 0.1);
        border: 2px solid rgba(255, 0, 255, 0.3);
        border-radius: 10px;
        padding: 20px;
        z-index: 999;
        opacity: 0.6;
        animation: ghost-fade 2s ease-in-out;
        pointer-events: none;
        font-family: monospace;
        color: #ff00ff;
        text-shadow: 0 0 10px #ff00ff;
    `;
    
    const ghostTexts = [
        '👻 GHOST ECHO: You chose "Block sender" - AI spawned 50 new domains',
        '👻 ALTERNATE TIMELINE: Lockdown failed - 12 sleeper accounts activated', 
        '👻 PARALLEL YOU: Followed NIST protocol - 72h delay let AI establish persistence',
        '👻 QUANTUM SHADOW: Previous pattern detected - countermeasures already deployed'
    ];
    
    ghost.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 14px; margin-bottom: 10px;">PREDICTIVE GHOST SIMULATION</div>
            <div style="font-size: 12px;">${ghostTexts[Math.floor(Math.random() * ghostTexts.length)]}</div>
        </div>
    `;
    
    document.body.appendChild(ghost);
    
    setTimeout(() => {
        if (ghost.parentNode) {
            ghost.parentNode.removeChild(ghost);
        }
    }, 3000);
}

function startGhostEffects() {
    ghostEffectInterval = setInterval(() => {
        if (gameState.predictabilityScore > 50) {
            showGhostPrediction();
        }
    }, 8000 + Math.random() * 5000);
}

function showGhostPrediction() {
    const ghostContainer = document.getElementById('ghost-predictions');
    if (ghostContainer) {
        const predictions = [
            'Analyzing behavioral quantum state...',
            'Simulating decision tree alternatives...',
            'Ghost patterns: 73% match with previous responses',
            'Parallel timeline: Defense failed in 2.3 seconds',
            'Predictive echo: Same choice leads to system compromise',
            'Alternative self: Chose differently, AI adapted anyway'
        ];
        
        const prediction = predictions[Math.floor(Math.random() * predictions.length)];
        ghostContainer.innerHTML = `<span class="animate-pulse">👻 ${prediction}</span>`;
        
        // Clear after a few seconds
        setTimeout(() => {
            ghostContainer.innerHTML = 'Quantum probability scanner active...';
        }, 4000);
    }
}

function updateAdaptiveEffects() {
    // Update AI learning feed with realistic adaptation messages
    const feedElement = document.getElementById('ai-learning-feed');
    if (feedElement) {
        const learningMessages = [
            `📊 Pattern confidence: ${gameState.predictabilityScore}%`,
            `🧠 Neural pathway #${Math.floor(Math.random() * 1000)} strengthened`,
            `⚡ Countermeasure ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 100)} deployed`,
            `🎯 Response time prediction: ${2.1 + Math.random() * 2}s`,
            `🔄 Behavioral model updated: v${1.0 + gameState.adaptationCycles * 0.1}`,
            `📈 Learning rate: ${Math.floor(Math.random() * 30) + 70}% efficiency`,
            `🚨 Pattern deviation detected: ${Math.floor(Math.random() * 15)}%`,
            `🎭 Deploying psychological pressure tactics...`
        ];
        
        const newMessage = document.createElement('div');
        newMessage.textContent = learningMessages[Math.floor(Math.random() * learningMessages.length)];
        newMessage.className = 'opacity-0 transition-opacity duration-500';
        
        feedElement.insertBefore(newMessage, feedElement.firstChild);
        
        // Fade in
        setTimeout(() => {
            newMessage.classList.remove('opacity-0');
        }, 100);
        
        // Remove old messages
        while (feedElement.children.length > 8) {
            feedElement.removeChild(feedElement.lastChild);
        }
    }
}

function initializeScreenCorruption() {
    // Add CSS for glitch effects
    if (!document.querySelector('#glitch-styles')) {
        const style = document.createElement('style');
        style.id = 'glitch-styles';
        style.textContent = `
            @keyframes tear-glitch {
                0% { transform: translateX(0px); }
                20% { transform: translateX(-5px); }
                40% { transform: translateX(5px); }
                60% { transform: translateX(-3px); }
                80% { transform: translateX(3px); }
                100% { transform: translateX(0px); }
            }
            
            @keyframes ghost-fade {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.05); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            }
            
            .glitch-text {
                animation: text-glitch 0.5s infinite;
                color: #ff0080 !important;
                text-shadow: 2px 0 #00ff00, -2px 0 #ff0000;
            }
            
            @keyframes text-glitch {
                0% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
                100% { transform: translate(0); }
            }
            
            .screen-tear {
                animation: tear-glitch 0.1s infinite;
            }
        `;
        document.head.appendChild(style);
    }
}

function resetVisualEffects() {
    // Reset all visual corruption
    document.querySelectorAll('.glitch-text').forEach(el => {
        el.classList.remove('glitch-text');
    });
    
    document.querySelectorAll('*').forEach(el => {
        el.style.filter = '';
        el.style.color = '';
        el.style.textShadow = '';
    });
    
    // Remove any remaining glitch elements
    document.querySelectorAll('.screen-tear, .ghost-interface').forEach(el => {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
}

export function triggerPatternBreakEffect() {
    // Special effect when player breaks a pattern
    const breakEffect = document.createElement('div');
    breakEffect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #00ff00;
        font-size: 24px;
        font-weight: bold;
        text-shadow: 0 0 20px #00ff00;
        z-index: 1001;
        animation: pattern-break 2s ease-out;
        pointer-events: none;
    `;
    breakEffect.textContent = '🔀 PATTERN DISRUPTED!';
    
    document.body.appendChild(breakEffect);
    
    // Add the animation
    if (!document.querySelector('#pattern-break-style')) {
        const style = document.createElement('style');
        style.id = 'pattern-break-style';
        style.textContent = `
            @keyframes pattern-break {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        if (breakEffect.parentNode) {
            breakEffect.parentNode.removeChild(breakEffect);
        }
    }, 2000);
}

export function intensifyGlitchEffects() {
    // Increase glitch intensity when AI confidence is high
    if (gameState.aiConfidence > 80) {
        // More frequent and intense effects
        const intensiveInterval = setInterval(() => {
            triggerRandomGlitch();
            triggerRandomGlitch(); // Double the effects
        }, 1000);
        
        setTimeout(() => {
            clearInterval(intensiveInterval);
        }, 5000);
    }
}
