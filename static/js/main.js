document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Typing Effect (Original Code Preserved)
    // ==========================================
    const typingElement = document.getElementById('typing-text');
    const words = ["Naipan Abdinegara", "Naipan", "NaipanAbdinegara-git"];
    let wordIndex = 0;
    let charIndex = 0;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const wordPause = 1500;

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

    function deleteText() {
        const currentWord = words[wordIndex];
        if (!typingElement) return;
        if (charIndex > 0) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(deleteText, deletingSpeed);
        } else {
            wordIndex = (wordIndex + 1) % words.length; 
            charIndex = 0; 
            typingElement.classList.add('typing-cursor');
            setTimeout(typeWriterEffect, 500); 
        }
    }

    if (typingElement) {
        typingElement.classList.add('typing-cursor');
        typeWriterEffect();
    }

    // ==========================================
    // 2. On-Demand AJAX Lazy Loading Engine
    // ==========================================
    const lazySections = document.querySelectorAll('.lazy-section');

    // Function to load a section dynamically
    async function loadLazySection(section) {
        if (section.classList.contains('loaded') || section.classList.contains('loading')) {
            return true; // Already loaded or loading
        }

        const url = section.getAttribute('data-url');
        if (!url) return false;

        section.classList.add('loading');

        try {
            const response = await fetch(url + '?ajax=1', {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const html = await response.text();
            
            // Inject HTML content
            section.innerHTML = html;
            section.classList.remove('loading');
            section.classList.add('loaded');

            // Fade in the section divider
            const divider = document.getElementById(`${section.id}-divider`);
            if (divider) {
                divider.style.opacity = '0.3';
            }

            // Post-load behavior for specific sections
            if (section.id === 'projects') {
                bindSeeMoreProjects();
            }
            
            return true;
        } catch (error) {
            console.error(`Error loading section ${section.id}:`, error);
            section.classList.remove('loading');
            return false;
        }
    }

    // IntersectionObserver to trigger loads when scrolling down
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                loadLazySection(section);
                observer.unobserve(section); // Stop watching once loaded
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px 250px 0px', // Fetch 250px before entering viewport
        threshold: 0
    });

    lazySections.forEach(section => {
        lazyLoadObserver.observe(section);
    });

    // ==========================================
    // 3. See More Projects Button Binding
    // ==========================================
    function bindSeeMoreProjects() {
        const btn = document.getElementById('see-more-btn');
        const container = document.getElementById('project-container');
        const itemsPerPage = 4;

        if (btn && container) {
            btn.addEventListener('click', function() {
                const hiddenItems = container.querySelectorAll('.project-wrapper.hidden');
                
                for (let i = 0; i < itemsPerPage; i++) {
                    if (hiddenItems[i]) {
                        hiddenItems[i].classList.remove('hidden');
                        hiddenItems[i].style.animation = "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards";
                    }
                }

                if (container.querySelectorAll('.project-wrapper.hidden').length === 0) {
                    btn.parentElement.style.display = 'none';
                }
            });
        }
    }

    // ==========================================
    // 4. Smooth Navigation & SPA Anchors Interceptor
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');

    // Smooth scroll helper
    function scrollToSection(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            const href = link.getAttribute('href');
            if (href.includes('/#')) {
                e.preventDefault();
                const hash = href.substring(href.indexOf('#')); // e.g. "#projects"
                const targetSection = document.querySelector(hash);

                if (targetSection) {
                    // Update Active Style immediately in UI
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');

                    // If it is a lazy-load section and not loaded, load it first
                    if (targetSection.classList.contains('lazy-section') && !targetSection.classList.contains('loaded')) {
                        const success = await loadLazySection(targetSection);
                        if (success) {
                            // Small timeout to allow browser layout parsing before scrolling
                            setTimeout(() => {
                                scrollToSection(hash);
                                history.pushState(null, null, hash);
                            }, 100);
                        }
                    } else {
                        scrollToSection(hash);
                        history.pushState(null, null, hash);
                    }
                } else {
                    // Fail-safe redirect if not on main page
                    window.location.href = href;
                }
            }
        });
    });

    // ==========================================
    // 5. Active Section Navigation Highlighting
    // ==========================================
    const allSections = document.querySelectorAll('.scroll-section');
    
    const navHighlightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `/#${sectionId}` || href === `/${sectionId}` || href.endsWith(`#${sectionId}`) || (href === '/' && sectionId === 'home')) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Precise viewport crossbar trigger
        threshold: 0
    });

    allSections.forEach(section => {
        navHighlightObserver.observe(section);
    });

    // ==========================================
    // 6. Deep-Link Hash Routing on Page Load
    // ==========================================
    async function handleInitialHashRoute() {
        const hash = window.location.hash; // e.g. "#about"
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                // If it is a lazy-load section, fetch it and all preceding sections to prevent layout gaps
                if (targetSection.classList.contains('lazy-section')) {
                    // Load all lazy sections up to and including the targeted one
                    let loadPromises = [];
                    let metTarget = false;
                    
                    const sections = Array.from(document.querySelectorAll('.lazy-section'));
                    for (const sec of sections) {
                        if (!metTarget) {
                            loadPromises.push(loadLazySection(sec));
                            if (`#${sec.id}` === hash) metTarget = true;
                        }
                    }

                    await Promise.all(loadPromises);
                }

                // Scroll to target smoothly after layout is computed
                setTimeout(() => {
                    scrollToSection(hash);
                }, 300);
            }
        } else {
            // Highlight Home by default if no hash
            const homeLink = document.querySelector('a[href="/"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }

    // Execute hash routing on load
    handleInitialHashRoute();
});