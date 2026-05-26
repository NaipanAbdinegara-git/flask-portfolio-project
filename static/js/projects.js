document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('see-more-btn');
    const container = document.getElementById('project-container');
    const itemsPerPage = 4;

    if (btn && container) {
        btn.addEventListener('click', function() {
            // Cari semua item yang masih tersembunyi
            const hiddenItems = container.querySelectorAll('.project-wrapper.hidden');
            
            // Tampilkan 4 item berikutnya
            for (let i = 0; i < itemsPerPage; i++) {
                if (hiddenItems[i]) {
                    hiddenItems[i].classList.remove('hidden');
                    // Tambahin efek reveal biar smooth dan premium
                    hiddenItems[i].style.animation = "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards";
                }
            }

            // Kalau udah nggak ada yang tersembunyi, hapus tombolnya
            if (container.querySelectorAll('.project-wrapper.hidden').length === 0) {
                btn.parentElement.style.display = 'none';
            }
        });
    }
});