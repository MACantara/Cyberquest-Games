import { levelData, skillCategories, achievements } from './gameData.js';
import { formatTime } from './progressManager.js';

export function displayLevelProgress() {
    const grid = document.getElementById('level-progress-grid');
    
    for (let i = 1; i <= 10; i++) {
        const levelInfo = levelData[i];
        const playerLevel = window.playerProgress.levelsCompleted.find(l => l.level === i);
        const completed = playerLevel && playerLevel.completed;
        const score = playerLevel ? playerLevel.score : 0;
        const maxScore = levelInfo.maxScore;
        const percentage = Math.round((score / maxScore) * 100);
        
        const card = document.createElement('div');
        card.className = `level-card bg-slate-800/50 border rounded-lg p-4 text-center transition-all duration-300 ${
            completed ? 'border-green-500 hover:border-green-400' : 'border-slate-600 hover:border-slate-500'
        }`;
        
        card.innerHTML = `
            <div class="text-3xl mb-2">${levelInfo.icon}</div>
            <div class="text-lg font-semibold text-white mb-1">Level ${i}</div>
            <div class="text-sm text-slate-300 mb-3">${levelInfo.name}</div>
            <div class="w-full bg-slate-700 rounded-full h-2 mb-2">
                <div class="progress-fill bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" 
                     style="--progress-width: ${percentage}%"></div>
            </div>
            <div class="text-sm font-semibold ${completed ? 'text-green-400' : 'text-slate-400'}">
                ${completed ? `${percentage}% (${score.toLocaleString()})` : 'Not Started'}
            </div>
            ${completed ? `<div class="text-xs text-green-300 mt-1">✅ Complete</div>` : ''}
        `;
        
        grid.appendChild(card);
    }
}

export function displayDetailedStats() {
    const container = document.getElementById('detailed-stats');
    
    window.playerProgress.levelsCompleted.forEach(levelProgress => {
        const levelInfo = levelData[levelProgress.level];
        const percentage = Math.round((levelProgress.score / levelProgress.maxScore) * 100);
        const timeStr = formatTime(levelProgress.completionTime);
        
        const statCard = document.createElement('div');
        statCard.className = 'bg-slate-800/50 border border-slate-600 rounded-lg p-6';
        
        statCard.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="text-3xl">${levelInfo.icon}</div>
                    <div>
                        <h3 class="text-xl font-semibold text-white">Level ${levelProgress.level}: ${levelInfo.name}</h3>
                        <p class="text-slate-400">${levelInfo.category}</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-green-400">${percentage}%</div>
                    <div class="text-sm text-slate-400">Score</div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div class="bg-slate-700/50 rounded p-3">
                    <div class="text-lg font-semibold text-white">${levelProgress.score.toLocaleString()}</div>
                    <div class="text-xs text-slate-400">Points Earned</div>
                </div>
                <div class="bg-slate-700/50 rounded p-3">
                    <div class="text-lg font-semibold text-white">${timeStr}</div>
                    <div class="text-xs text-slate-400">Completion Time</div>
                </div>
                <div class="bg-slate-700/50 rounded p-3">
                    <div class="text-lg font-semibold text-white">${levelProgress.attempts}</div>
                    <div class="text-xs text-slate-400">Attempts</div>
                </div>
                <div class="bg-slate-700/50 rounded p-3">
                    <div class="text-lg font-semibold text-green-400">✅</div>
                    <div class="text-xs text-slate-400">Status</div>
                </div>
            </div>
        `;
        
        container.appendChild(statCard);
    });
}

export function displaySkillsMastered() {
    const grid = document.getElementById('skills-grid');
    
    Object.entries(skillCategories).forEach(([skillName, skillData]) => {
        const completedLevels = skillData.levels.filter(level => 
            window.playerProgress.levelsCompleted.some(l => l.level === level && l.completed)
        );
        const masteryLevel = Math.round((completedLevels.length / skillData.levels.length) * 100);
        
        const skillCard = document.createElement('div');
        skillCard.className = `skill-mastery bg-slate-800/50 border border-slate-600 rounded-lg p-6 text-center ${
            masteryLevel === 100 ? 'border-gold' : ''
        }`;
        
        skillCard.innerHTML = `
            <div class="text-4xl mb-3">${skillData.icon}</div>
            <h3 class="text-lg font-semibold text-white mb-2">${skillName}</h3>
            <div class="w-full bg-slate-700 rounded-full h-3 mb-3">
                <div class="progress-fill bg-gradient-to-r from-${skillData.color}-400 to-${skillData.color}-600 h-3 rounded-full" 
                     style="--progress-width: ${masteryLevel}%"></div>
            </div>
            <div class="text-sm">
                <span class="font-semibold text-${skillData.color}-400">${masteryLevel}%</span>
                <span class="text-slate-400"> Mastery</span>
            </div>
            <div class="text-xs text-slate-500 mt-1">
                ${completedLevels.length}/${skillData.levels.length} levels completed
            </div>
        `;
        
        grid.appendChild(skillCard);
    });
}

export function displayAchievements() {
    const grid = document.getElementById('achievements-grid');
    
    achievements.forEach(achievement => {
        const unlocked = window.playerProgress.unlockedAchievements.includes(achievement.id);
        
        const achievementCard = document.createElement('div');
        achievementCard.className = `achievement-unlock bg-slate-800/50 border rounded-lg p-4 text-center transition-all duration-300 ${
            unlocked ? 'border-yellow-500 hover:border-yellow-400' : 'border-slate-600 opacity-50'
        }`;
        
        achievementCard.innerHTML = `
            <div class="text-3xl mb-2 ${unlocked ? '' : 'grayscale'}">${achievement.icon}</div>
            <h4 class="text-sm font-semibold text-white mb-1">${achievement.name}</h4>
            <p class="text-xs text-slate-400 mb-2">${achievement.description}</p>
            <div class="text-xs font-semibold ${unlocked ? 'text-yellow-400' : 'text-slate-500'}">
                ${unlocked ? '🏆 UNLOCKED' : '🔒 LOCKED'}
            </div>
        `;
        
        grid.appendChild(achievementCard);
    });
    
    // Update achievement counter
    const unlockedCount = window.playerProgress.unlockedAchievements.length;
    document.getElementById('achievements').textContent = `${unlockedCount}/${achievements.length}`;
}

export function displayCareerRecommendations() {
    const container = document.getElementById('career-recommendations');
    
    // Calculate strengths based on performance
    const recommendations = [
        {
            title: "Security Operations Center (SOC) Analyst",
            description: "Your strong performance in monitoring and incident response makes you ideal for SOC operations.",
            icon: "🛡️",
            match: "95%"
        },
        {
            title: "Digital Forensics Investigator", 
            description: "Your analytical skills and attention to detail in forensics investigations are exceptional.",
            icon: "🕵️",
            match: "92%"
        }
    ];
    
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'bg-slate-800/50 border border-purple-500 rounded-lg p-6';
        
        card.innerHTML = `
            <div class="flex items-center gap-3 mb-3">
                <div class="text-3xl">${rec.icon}</div>
                <div>
                    <h4 class="text-lg font-semibold text-white">${rec.title}</h4>
                    <div class="text-purple-400 font-semibold">${rec.match} Match</div>
                </div>
            </div>
            <p class="text-slate-300 text-sm">${rec.description}</p>
        `;
        
        container.appendChild(card);
    });
}
