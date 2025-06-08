export function generateCertificate() {
    const modal = document.getElementById('certificate-modal');
    const content = document.getElementById('certificate-content');
    
    content.innerHTML = `
        <div class="border-8 border-blue-600 p-8 text-center bg-gradient-to-br from-blue-50 to-white">
            <div class="mb-6">
                <h1 class="text-4xl font-bold text-blue-800 mb-2">CERTIFICATE OF COMPLETION</h1>
                <div class="text-xl text-blue-600">CyberQuest Elite Training Program</div>
            </div>
            
            <div class="my-8">
                <div class="text-lg text-gray-700 mb-4">This certifies that</div>
                <div class="text-3xl font-bold text-blue-800 mb-4">Agent Nova</div>
                <div class="text-lg text-gray-700 mb-6">has successfully completed all 10 levels of the CyberQuest cybersecurity training program</div>
            </div>
            
            <div class="grid grid-cols-3 gap-6 mb-8 text-sm">
                <div>
                    <div class="font-semibold text-gray-800">Total Score</div>
                    <div class="text-blue-600">${window.playerProgress.totalScore.toLocaleString()}</div>
                </div>
                <div>
                    <div class="font-semibold text-gray-800">Completion Date</div>
                    <div class="text-blue-600">${new Date().toLocaleDateString()}</div>
                </div>
                <div>
                    <div class="font-semibold text-gray-800">Training Hours</div>
                    <div class="text-blue-600">${Math.round(window.playerProgress.totalTime / 3600)}h</div>
                </div>
            </div>
            
            <div class="flex justify-between items-end">
                <div class="text-left">
                    <div class="border-t border-gray-400 w-48 mb-2"></div>
                    <div class="text-sm text-gray-600">Commander Sarah Vega</div>
                    <div class="text-xs text-gray-500">CyberQuest Academy Director</div>
                </div>
                <div class="text-blue-600 font-bold text-2xl">🏆</div>
                <div class="text-right">
                    <div class="border-t border-gray-400 w-48 mb-2"></div>
                    <div class="text-sm text-gray-600">Date Awarded</div>
                    <div class="text-xs text-gray-500">${new Date().toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

export function downloadCertificatePDF() {
    // Create a simple PDF download functionality
    // For a full implementation, you would use a library like jsPDF
    const certificateContent = document.getElementById('certificate-content');
    
    // Simple fallback - open print dialog
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>CyberQuest Certificate</title>');
    printWindow.document.write('<style>body{font-family: Arial, sans-serif; margin: 20px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(certificateContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}
