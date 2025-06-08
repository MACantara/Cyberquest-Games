import { loadPlayerProgress, animateCounters } from './progressManager.js';
import { displayLevelProgress, displayDetailedStats, displaySkillsMastered, displayAchievements, displayCareerRecommendations } from './uiDisplays.js';
import { initializeButtons } from './userActions.js';

// Initialize the ending page
document.addEventListener('DOMContentLoaded', function() {
    loadPlayerProgress();
    displayLevelProgress();
    displayDetailedStats();
    displaySkillsMastered();
    displayAchievements();
    displayCareerRecommendations();
    initializeButtons();
    animateCounters();
});
