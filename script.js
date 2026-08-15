document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        // Simple toggle for now, in a real app this would be a full screen menu or slide out
        const isDisplayed = navLinks.style.display === 'flex';
        navLinks.style.display = isDisplayed ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(10, 10, 15, 0.95)';
        navLinks.style.backdropFilter = 'blur(20px)';
        navLinks.style.padding = '20px';
        navLinks.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        
        // Reset if window is resized
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.style.display = '';
                navLinks.style.flexDirection = '';
                navLinks.style.position = '';
                navLinks.style.top = '';
                navLinks.style.left = '';
                navLinks.style.width = '';
                navLinks.style.background = '';
                navLinks.style.padding = '';
            }
        });
    });

    // --- Smooth Scrolling for Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Slight offset
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Animated Counters ---
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCounter();
        });
    };

    // Trigger counters when stats section comes into view
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // --- Testimonial Carousel ---
    const track = document.getElementById('testimonial-track');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    const slideCount = indicators.length;
    let autoPlayInterval;

    const goToSlide = (index) => {
        // Handle responsive widths
        let cardWidth = 33.333; // desktop
        let gap = 24;
        
        if (window.innerWidth <= 768) {
            cardWidth = 100;
            gap = 0;
        } else if (window.innerWidth <= 1024) {
            cardWidth = 50;
        }

        track.style.transform = `translateX(calc(-${index * cardWidth}% - ${index * gap}px))`;
        
        // Update indicators
        indicators.forEach(ind => ind.classList.remove('active'));
        indicators[index].classList.add('active');
        currentIndex = index;
    };

    // Indicator click events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
    });

    // Auto play functionality
    const startAutoPlay = () => {
        autoPlayInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % slideCount;
            // Adjust logic based on visible cards
            if (window.innerWidth > 1024) {
                // Desktop shows 3 cards, only really need to slide if we have more than 3
                // For this demo, let's just loop index 0, 1, 2 but only really shift if we can
                if (nextIndex > slideCount - 3) nextIndex = 0;
            } else if (window.innerWidth > 768) {
                if (nextIndex > slideCount - 2) nextIndex = 0;
            }
            
            goToSlide(nextIndex);
        }, 5000); // 5 seconds
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    // Start auto play initially
    startAutoPlay();
    
    // Pause on hover
    const carouselContainer = document.querySelector('.testimonial-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
        goToSlide(0); // Reset to first slide on resize to prevent weird layout shifts
    });
});
