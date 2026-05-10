document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('see-more-btn');
    const container = document.getElementById('project-container');
    const itemsPerPage = 4;

    if (btn) {
        btn.addEventListener('click', function() {
            // Cari semua item yang masih tersembunyi
            const hiddenItems = container.querySelectorAll('.project-item-container.hidden');
            
            // Tampilkan 4 item berikutnya
            for (let i = 0; i < itemsPerPage; i++) {
                if (hiddenItems[i]) {
                    hiddenItems[i].classList.remove('hidden');
                    // Tambahin efek reveal biar smooth
                    hiddenItems[i].style.animation = "fadeIn 0.5s ease forwards";
                }
            }

            // Kalau udah nggak ada yang tersembunyi, hapus tombolnya
            if (container.querySelectorAll('.project-item-container.hidden').length === 0) {
                btn.parentElement.style.display = 'none';
            }
        });
    }
});