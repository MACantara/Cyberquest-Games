import { generateCertificate, downloadCertificatePDF } from './certificateManager.js';

export function initializeButtons() {
    document.getElementById('download-certificate').addEventListener('click', generateCertificate);
    document.getElementById('share-achievement').addEventListener('click', shareAchievement);
    document.getElementById('restart-campaign').addEventListener('click', restartCampaign);
    document.getElementById('close-certificate').addEventListener('click', () => {
        document.getElementById('certificate-modal').classList.add('hidden');
    });
    
    // Add PDF download functionality after certificate modal is set up
    setTimeout(() => {
        const downloadPdfBtn = document.getElementById('download-pdf');
        if (downloadPdfBtn) {
            downloadPdfBtn.addEventListener('click', downloadCertificatePDF);
        }
    }, 100);
}

export function shareAchievement() {
    if (navigator.share) {
        navigator.share({
            title: 'CyberQuest Mission Complete!',
            text: `I just completed all 10 levels of CyberQuest with a score of ${window.playerProgress.totalScore.toLocaleString()}! 🎉`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers without Web Share API
        const text = `I just completed all 10 levels of CyberQuest with a score of ${window.playerProgress.totalScore.toLocaleString()}! 🎉`;
        navigator.clipboard.writeText(text).then(() => {
            alert('Achievement copied to clipboard!');
        });
    }
}

export function restartCampaign() {
    if (confirm('Are you sure you want to restart your campaign? All progress will be reset.')) {
        localStorage.removeItem('cyberquest_progress');
        window.location.href = '/';
    }
}
