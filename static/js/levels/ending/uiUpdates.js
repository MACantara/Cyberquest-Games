export function showResultModal(icon, title, content) {
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-content').innerHTML = content;
    document.getElementById('results-modal').classList.remove('hidden');
}
