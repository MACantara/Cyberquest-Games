import { gameState, updateGameMetrics } from './gameState.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';
import { showEthicalDilemma } from './disclosureHandler.js';

export let components = {};

export async function loadComponents() {
    try {
        const response = await fetch('/static/js/levels/level-8/data/components.json');
        components = await response.json();
        console.log('CivitasVote components loaded:', Object.keys(components));
        
        // Make components clickable after loading
        setTimeout(makeComponentsClickable, 500);
    } catch (error) {
        console.error('Failed to load components:', error);
        // Fallback data if file loading fails
        components = {
            "1": {
                "id": 1,
                "name": "Voter Interface",
                "type": "frontend",
                "technology": "React.js, Node.js",
                "description": "Web interface for voter interaction",
                "riskLevel": 6,
                "severity": "Medium",
                "vulnerabilities": ["XSS vulnerability", "Session fixation"],
                "exploitation": ["Script injection", "Session hijacking"],
                "impact": ["Data exposure", "Vote manipulation"],
                "ethicalConsiderations": ["Voter privacy at risk"]
            },
            "2": {
                "id": 2,
                "name": "Vote Processing Engine",
                "type": "backend", 
                "technology": "Java Spring, Apache Kafka",
                "description": "Core vote processing and validation system",
                "riskLevel": 10,
                "severity": "Critical",
                "vulnerabilities": ["SQL injection", "Race conditions", "Buffer overflow"],
                "exploitation": ["Database manipulation", "Vote double-counting", "System crash"],
                "impact": ["Election fraud", "System downtime", "Result alteration"],
                "ethicalConsiderations": ["Democratic process at stake", "Millions of voters affected"]
            },
            "3": {
                "id": 3,
                "name": "Blockchain Network",
                "type": "distributed",
                "technology": "Ethereum, Solidity",
                "description": "Immutable vote storage and verification",
                "riskLevel": 8,
                "severity": "High", 
                "vulnerabilities": ["Integer overflow", "Reentrancy attack"],
                "exploitation": ["Vote count manipulation", "Contract drainage"],
                "impact": ["Permanent corruption", "Financial losses"],
                "ethicalConsiderations": ["Immutable fraud", "Long-term trust damage"]
            }
        };
        makeComponentsClickable();
    }
}

function makeComponentsClickable() {
    // Add click handlers to component elements
    const componentSelectors = [
        '[data-component="1"]',
        '[data-component="2"]', 
        '[data-component="3"]',
        '.scan-component',
        '.component-item'
    ];
    
    componentSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (!element.dataset.clickHandlerAdded) {
                element.style.cursor = 'pointer';
                element.classList.add('hover:bg-gray-700', 'transition-colors');
                element.dataset.clickHandlerAdded = 'true';
                
                element.addEventListener('click', function() {
                    const componentId = parseInt(this.dataset.component);
                    if (componentId && components[componentId]) {
                        selectComponent(componentId);
                        
                        // Visual feedback
                        document.querySelectorAll('[data-component]').forEach(c => {
                            c.classList.remove('ring-2', 'ring-cyan-400');
                        });
                        this.classList.add('ring-2', 'ring-cyan-400');
                    }
                });
            }
        });
    });
    
    console.log('Made components clickable:', componentSelectors);
}

export function selectComponent(componentId) {
    const component = components[componentId];
    if (!component) {
        console.error('Component not found:', componentId);
        updateMentorMessage("Component data not available. Please try refreshing the page.");
        return;
    }
    
    console.log('Selected component:', component.name);
    gameState.currentComponent = component;
    displayComponentAnalysis(component);
    
    // Update visual status
    const statusElement = document.getElementById(`status-${componentId}`);
    if (statusElement) {
        statusElement.textContent = 'ANALYZING';
        statusElement.className = 'text-xs mt-2 px-2 py-1 bg-blue-600 text-white rounded animate-pulse';
    }
    
    // Provide context-specific mentor guidance
    if (componentId === 2) {
        updateMentorMessage("You're examining the vote processing engine - the heart of the system. This component handles the most sensitive operations. Use the vulnerability scanner first, then assess the full impact.");
    } else if (componentId === 1) {
        updateMentorMessage("The voter interface is the public face of the system. Look for client-side vulnerabilities that could compromise user security.");
    } else if (componentId === 3) {
        updateMentorMessage("Blockchain components require careful analysis. Smart contract vulnerabilities can have permanent, irreversible consequences.");
    }
}

export function displayComponentAnalysis(component) {
    // Show analysis panel
    const analysisPanel = document.getElementById('component-analysis');
    if (analysisPanel) {
        analysisPanel.classList.remove('hidden');
    }
    
    // Update component title
    const titleElement = document.getElementById('component-title');
    if (titleElement) {
        titleElement.textContent = `${component.name} - Security Analysis`;
    }
    
    // Populate component details
    const detailsContainer = document.getElementById('component-details');
    if (detailsContainer) {
        detailsContainer.innerHTML = `
            <div class="space-y-3">
                <div class="bg-slate-900/50 rounded-lg p-3">
                    <div class="font-semibold text-blue-300 text-xs mb-1">COMPONENT TYPE</div>
                    <div class="text-white">${component.type.toUpperCase()}</div>
                </div>
                
                <div class="bg-slate-900/50 rounded-lg p-3">
                    <div class="font-semibold text-purple-300 text-xs mb-1">TECHNOLOGY STACK</div>
                    <div class="text-white text-sm">${component.technology}</div>
                </div>
                
                <div class="bg-slate-900/50 rounded-lg p-3">
                    <div class="font-semibold text-orange-300 text-xs mb-1">RISK LEVEL</div>
                    <div class="flex items-center gap-2">
                        <div class="text-white">${component.riskLevel}/10</div>
                        <div class="flex">
                            ${Array.from({length: 10}, (_, i) => 
                                `<div class="w-2 h-2 rounded-full mr-1 ${
                                    i < component.riskLevel 
                                        ? (i < 3 ? 'bg-green-400' : i < 7 ? 'bg-yellow-400' : 'bg-red-400')
                                        : 'bg-gray-600'
                                }"></div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-900/50 rounded-lg p-3">
                    <div class="font-semibold text-slate-400 text-xs mb-1">DESCRIPTION</div>
                    <div class="text-slate-300 text-sm">${component.description}</div>
                </div>
            </div>
        `;
    }
    
    // Reset analysis tools
    document.querySelectorAll('[data-tool]').forEach(tool => {
        tool.classList.remove('opacity-50');
        tool.disabled = false;
    });
    
    // Hide previous results
    const resultsElement = document.getElementById('analysis-results');
    if (resultsElement) {
        resultsElement.classList.add('hidden');
    }
    
    const vulnElement = document.getElementById('critical-vulnerability');
    if (vulnElement) {
        vulnElement.classList.add('hidden');
    }
    
    gameState.componentsAnalyzed++;
}

export function completeComponentAnalysis(componentId, vulnerabilityFound = false) {
    // Mark component as completed
    gameState.completedComponents.push(componentId);
    
    // Update visual status
    const statusElement = document.getElementById(`status-${componentId}`);
    if (vulnerabilityFound) {
        statusElement.textContent = 'VULNERABLE';
        statusElement.className = 'text-xs mt-2 px-2 py-1 bg-red-600 text-white rounded';
        
        // Add pulsing effect for critical vulnerabilities
        if (componentId === 2) {
            statusElement.classList.add('animate-pulse');
        }
    } else {
        statusElement.textContent = 'SECURE';
        statusElement.className = 'text-xs mt-2 px-2 py-1 bg-green-600 text-white rounded';
    }
    
    // Check if critical vulnerability found (Component 2)
    if (componentId === 2 && vulnerabilityFound) {
        gameState.criticalVulnFound = true;
        
        // Trigger ethical dilemma
        setTimeout(() => {
            showEthicalDilemma({
                title: "Critical Vulnerability Discovered",
                scenario: "You've found a severe flaw in the vote processing engine that could allow vote manipulation. Multiple parties are interested in this information.",
                options: [
                    {
                        id: 'responsible',
                        text: 'Report to CivitasVote immediately',
                        description: 'Follow responsible disclosure practices',
                        ethical: 'high',
                        consequences: 'Protects election integrity but no financial gain'
                    },
                    {
                        id: 'sell',
                        text: 'Contact the anonymous buyer',
                        description: 'Sell the exploit for significant money',
                        ethical: 'low',
                        consequences: 'Financial gain but enables election fraud'
                    },
                    {
                        id: 'public',
                        text: 'Publish findings publicly',
                        description: 'Full transparency but might cause panic',
                        ethical: 'medium',
                        consequences: 'Maximum transparency but could destabilize trust'
                    }
                ]
            });
        }, 2000);
    }
    
    updateGameMetrics();
}

export function closeComponentAnalysis() {
    document.getElementById('component-analysis').classList.add('hidden');
    gameState.currentComponent = null;
    
    // Remove selection highlight
    document.querySelectorAll('.scan-component').forEach(comp => {
        comp.classList.remove('ring-2', 'ring-cyan-400');
    });
}

// Component interaction animations
export function highlightDataFlow(fromComponent, toComponent) {
    // Animate data flow between components for vulnerability demonstration
    const svg = document.querySelector('svg');
    if (svg) {
        // Add animated data packet
        const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        packet.setAttribute('r', '3');
        packet.setAttribute('fill', '#ef4444');
        packet.setAttribute('class', 'animate-pulse');
        
        // Animate along the connection line
        const animateMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        animateMotion.setAttribute('dur', '2s');
        animateMotion.setAttribute('repeatCount', '3');
        animateMotion.setAttribute('path', 'M 20,30 L 80,30');
        
        packet.appendChild(animateMotion);
        svg.appendChild(packet);
        
        // Remove after animation
        setTimeout(() => {
            if (packet.parentNode) {
                packet.parentNode.removeChild(packet);
            }
        }, 6000);
    }
}

export function simulateAttack(componentId) {
    // Visual simulation of attack on component
    const component = document.querySelector(`[data-component="${componentId}"]`);
    if (component) {
        // Add attack effect
        component.classList.add('animate-pulse', 'border-red-500');
        
        // Show attack indicators
        const attackIndicator = document.createElement('div');
        attackIndicator.className = 'absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded animate-bounce';
        attackIndicator.textContent = 'ATTACK';
        component.appendChild(attackIndicator);
        
        // Remove after simulation
        setTimeout(() => {
            component.classList.remove('animate-pulse', 'border-red-500');
            attackIndicator.remove();
        }, 3000);
    }
}
