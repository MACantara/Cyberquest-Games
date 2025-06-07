import { gameState } from './gameState.js';

let glitchInterval = null;
let corruptionLevel = 0;
let glitchContainer = null;

export function startGlitchEffects() {
    // Create a dedicated glitch overlay container
    createGlitchContainer();
    
    // Start subtle glitch effects
    glitchInterval = setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every 2 seconds
            triggerRandomGlitch();
        }
    }, 2000);
    
    console.log('Glitch effects started');
}

export function stopGlitchEffects() {
    if (glitchInterval) {
        clearInterval(glitchInterval);
        glitchInterval = null;
    }
    
    // Remove all glitch effects
    if (glitchContainer) {
        glitchContainer.remove();
        glitchContainer = null;
    }
    
    // Reset any applied filters
    document.body.style.filter = '';
    document.body.style.animation = '';
    
    console.log('Glitch effects stopped');
}

function createGlitchContainer() {
    // Remove existing container if it exists
    if (glitchContainer) {
        glitchContainer.remove();
    }
    
    // Create overlay container for glitch effects
    glitchContainer = document.createElement('div');
    glitchContainer.id = 'glitch-overlay';
    glitchContainer.className = 'fixed inset-0 pointer-events-none z-30';
    glitchContainer.style.mixBlendMode = 'screen';
    
    document.body.appendChild(glitchContainer);
}

function triggerRandomGlitch() {
    const glitchTypes = [
        'screenStatic',
        'colorShift',
        'scanLines',
        'dataCorruption',
        'pixelDistortion'
    ];
    
    const randomGlitch = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
    
    switch(randomGlitch) {
        case 'screenStatic':
            createScreenStatic();
            break;
        case 'colorShift':
            createColorShift();
            break;
        case 'scanLines':
            createScanLines();
            break;
        case 'dataCorruption':
            createDataCorruption();
            break;
        case 'pixelDistortion':
            createPixelDistortion();
            break;
    }
}

function createScreenStatic() {
    const staticElement = document.createElement('div');
    staticElement.className = 'absolute inset-0 opacity-20';
    staticElement.style.background = `
        repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.1) 2px,
            rgba(255,255,255,0.1) 4px
        ),
        repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.05) 2px,
            rgba(255,255,255,0.05) 4px
        )
    `;
    staticElement.style.animation = 'static-flicker 0.1s infinite';
    
    glitchContainer.appendChild(staticElement);
    
    setTimeout(() => {
        staticElement.remove();
    }, 200);
}

function createColorShift() {
    // Apply temporary color filter to body
    const originalFilter = document.body.style.filter;
    
    document.body.style.filter = `hue-rotate(${Math.random() * 180}deg) saturate(${150 + Math.random() * 100}%)`;
    
    setTimeout(() => {
        document.body.style.filter = originalFilter;
    }, 150);
}

function createScanLines() {
    const scanLines = document.createElement('div');
    scanLines.className = 'absolute inset-0 opacity-30';
    scanLines.style.background = `
        repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,255,255,0.1) 2px,
            rgba(0,255,255,0.1) 4px
        )
    `;
    scanLines.style.animation = 'scan-move 2s linear infinite';
    
    glitchContainer.appendChild(scanLines);
    
    setTimeout(() => {
        scanLines.remove();
    }, 1000);
}

function createDataCorruption() {
    // Create text corruption overlay
    const corruption = document.createElement('div');
    corruption.className = 'absolute top-1/4 left-1/4 w-1/2 h-1/2 overflow-hidden';
    
    const corruptText = [
        '01001000 01100101 01101100 01110000',
        '░▒▓█ SYSTEM COMPROMISED █▓▒░',
        'NULL_ENTITY.EXE EXECUTING...',
        '█▓▒░ BEHAVIORAL PATTERNS ANALYZED ░▒▓█',
        'ERROR: REALITY.DLL NOT FOUND'
    ];
    
    corruption.innerHTML = `
        <div class="text-red-400 font-mono text-sm animate-pulse">
            ${corruptText[Math.floor(Math.random() * corruptText.length)]}
        </div>
    `;
    
    glitchContainer.appendChild(corruption);
    
    setTimeout(() => {
        corruption.remove();
    }, 800);
}

function createPixelDistortion() {
    // Create a small distortion effect
    const distortion = document.createElement('div');
    distortion.className = 'absolute opacity-40';
    distortion.style.left = Math.random() * 80 + '%';
    distortion.style.top = Math.random() * 80 + '%';
    distortion.style.width = '100px';
    distortion.style.height = '100px';
    distortion.style.background = `
        radial-gradient(
            circle,
            rgba(255,0,255,0.3) 0%,
            rgba(0,255,255,0.2) 50%,
            transparent 100%
        )
    `;
    distortion.style.animation = 'distort-pulse 0.5s ease-out';
    
    glitchContainer.appendChild(distortion);
    
    setTimeout(() => {
        distortion.remove();
    }, 500);
}

export function triggerPatternBreakEffect() {
    // Special glitch effect when player breaks a pattern
    intensifyGlitchEffects();
    
    const breakEffect = document.createElement('div');
    breakEffect.className = 'absolute inset-0';
    breakEffect.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-20 animate-pulse"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div class="text-4xl animate-spin">⚡</div>
        </div>
    `;
    
    glitchContainer.appendChild(breakEffect);
    
    setTimeout(() => {
        breakEffect.remove();
    }, 2000);
}

export function intensifyGlitchEffects() {
    corruptionLevel = Math.min(corruptionLevel + 1, 5);
    
    // More frequent glitches
    if (glitchInterval) {
        clearInterval(glitchInterval);
    }
    
    const frequency = Math.max(500, 2000 - (corruptionLevel * 300));
    glitchInterval = setInterval(() => {
        if (Math.random() < 0.5 + (corruptionLevel * 0.1)) {
            triggerRandomGlitch();
        }
    }, frequency);
}

export function createAILearningVisualization() {
    if (!glitchContainer) return;
    
    const learning = document.createElement('div');
    learning.className = 'absolute top-10 right-10 bg-red-900 border border-red-500 rounded p-3 animate-pulse';
    learning.innerHTML = `
        <div class="text-red-300 font-mono text-xs">
            <div class="mb-1">🤖 AI LEARNING ACTIVE</div>
            <div class="text-red-400">Analyzing patterns...</div>
            <div class="w-20 bg-red-800 h-1 rounded mt-2">
                <div class="bg-red-400 h-1 rounded animate-pulse" style="width: ${Math.random() * 100}%"></div>
            </div>
        </div>
    `;
    
    glitchContainer.appendChild(learning);
    
    setTimeout(() => {
        learning.remove();
    }, 3000);
}

// Add CSS animations if not already present
if (!document.querySelector('#glitch-animations')) {
    const style = document.createElement('style');
    style.id = 'glitch-animations';
    style.textContent = `
        @keyframes static-flicker {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
        }
        
        @keyframes scan-move {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
        }
        
        @keyframes distort-pulse {
            0% { transform: scale(1) rotate(0deg); opacity: 0.4; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0.8) rotate(360deg); opacity: 0; }
        }
        
        @keyframes glitch-text {
            0%, 100% { 
                text-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 15px #ff0000;
                transform: translateX(0);
            }
            25% { 
                text-shadow: -2px 0 #ff0000, 2px 0 #00ffff;
                transform: translateX(-2px);
            }
            50% { 
                text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
                transform: translateX(2px);
            }
            75% { 
                text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff;
                transform: translateX(-1px);
            }
        }
        
        .glitch-text {
            animation: glitch-text 0.3s infinite;
        }
    `;
    document.head.appendChild(style);
}
