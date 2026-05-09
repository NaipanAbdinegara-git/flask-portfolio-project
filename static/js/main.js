document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil Element target
    const typingElement = document.getElementById('typing-text');
    
    // 2. Setting Kata & Speed
    const words = ["Naipan Abdinegara", "Naipan", "NaipanAbdinegara-git"];
    let wordIndex = 0;
    let charIndex = 0;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const wordPause = 1500;

    // 3. Fungsi Ngetik
    function typeWriterEffect() {
        const currentWord = words[wordIndex];
        
        if (!typingElement) return;

        if (charIndex < currentWord.length) {
            typingElement.textContent += currentWord.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriterEffect, typingSpeed);
        } else {
            typingElement.classList.remove('typing-cursor'); 
            setTimeout(deleteText, wordPause);
        }
    }

    // 4. Fungsi Hapus
    function deleteText() {
        const currentWord = words[wordIndex];
        
        if (!typingElement) return;

        if (charIndex > 0) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(deleteText, deletingSpeed);
        } 
        else {
            wordIndex = (wordIndex + 1) % words.length; 
            charIndex = 0; 
            typingElement.classList.add('typing-cursor');
            setTimeout(typeWriterEffect, 500); 
        }
    }

    // 5. Eksekusi
    if (typingElement) {
        typingElement.classList.add('typing-cursor');
        typeWriterEffect();
    }
});

// Paksa browser buat selalu start dari atas pas reload
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Tambahan buat mastiin beneran di atas pas load
window.scrollTo(0, 0);