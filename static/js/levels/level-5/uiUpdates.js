export function updateMentorMessage(message) {
    document.getElementById('mentor-message').textContent = message;
}

export function showResultModal(icon, title, message, feedback) {
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-feedback').innerHTML = feedback;
    document.getElementById('results-modal').classList.remove('hidden');
}

export function updatePostVisual(postId, resolved) {
    const postItem = document.querySelector(`[data-post="${postId}"]`);
    if (resolved) {
        postItem.classList.remove('animate-pulse');
        postItem.classList.add('opacity-75');
        // Add success indicator
        const successIcon = document.createElement('div');
        successIcon.className = 'absolute top-2 right-2 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center';
        successIcon.innerHTML = '<i class="bi bi-check text-white text-xs"></i>';
        postItem.style.position = 'relative';
        postItem.appendChild(successIcon);
    }
}
