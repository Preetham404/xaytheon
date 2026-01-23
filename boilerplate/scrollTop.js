// rocket-button.js - COMPLETE WORKING VERSION
(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Create the rocket button structure
        const rocketButton = document.createElement('div');
        rocketButton.id = 'rocketButton';
        rocketButton.className = 'rocket-button';
        rocketButton.innerHTML = `
            <div class="circle-ring"></div>
            <div class="inner-circle"></div>
            
            <button class="rocket-btn" aria-label="Scroll to top">
                <div class="smoke-trail" id="smokeTrail"></div>
                <div class="explosion" id="explosion"></div>
                
                <div class="rocket-container">
                    <div class="rocket">
                        <div class="rocket-window"></div>
                    </div>
                    <div class="fire-effect"></div>
                </div>
            </button>
        `;
        
        // Append to body
        document.body.appendChild(rocketButton);
        
        // Get references
        const btn = rocketButton.querySelector('.rocket-btn');
        const rocketContainer = btn.querySelector('.rocket-container');
        const smokeTrail = rocketButton.querySelector('#smokeTrail');
        const explosion = rocketButton.querySelector('#explosion');
        
        // Create smoke particles
        function createSmoke() {
            if (!smokeTrail) return;
            
            // Clear existing smoke
            const existingSmoke = smokeTrail.querySelectorAll('.smoke');
            existingSmoke.forEach(smoke => {
                if (smoke.getAnimations) {
                    const animations = smoke.getAnimations();
                    if (animations.length > 0) {
                        animations[0].cancel();
                    }
                }
                smoke.remove();
            });
            
            // Create new smoke particles
            for (let i = 0; i < 6; i++) {
                const smoke = document.createElement('div');
                smoke.className = 'smoke';
                smoke.style.setProperty('--offset', `${(Math.random() - 0.5) * 30}px`);
                smoke.style.animation = `smokeFloat 0.8s ease-out ${i * 0.08}s forwards`;
                smokeTrail.appendChild(smoke);
                
                // Remove after animation
                setTimeout(() => {
                    if (smoke.parentNode === smokeTrail) {
                        smoke.remove();
                    }
                }, 800);
            }
        }
        
        // Create explosion particles
        function createExplosion() {
            if (!explosion) return;
            
            // Clear existing explosion
            explosion.innerHTML = '';
            explosion.style.opacity = '1';
            
            // Create explosion particles
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'explosion-particle';
                particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 80}px`);
                particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 80}px`);
                particle.style.animation = `particleExplode 0.6s ease-out forwards`;
                particle.style.animationDelay = `${Math.random() * 0.2}s`;
                
                // Different colors for particles
                const colors = ['#ff9900', '#ff3300', '#ffffff'];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                explosion.appendChild(particle);
            }
            
            // Hide explosion after animation
            setTimeout(() => {
                explosion.style.opacity = '0';
                setTimeout(() => {
                    explosion.innerHTML = '';
                }, 600);
            }, 600);
        }
        
        // Show/hide button based on scroll position
        function toggleButtonVisibility() {
            if (!rocketButton) return;
            
            if (window.pageYOffset > 300) {
                rocketButton.classList.add('visible');
            } else {
                rocketButton.classList.remove('visible');
            }
        }
        
        // Scroll to top with rocket launch animation
        function scrollToTop(e) {
            if (e) e.preventDefault();
            
            if (!btn || !rocketContainer || !smokeTrail) return;
            
            // Disable button during animation
            btn.style.pointerEvents = 'none';
            
            // Start launch sequence
            btn.classList.add('launching');
            createSmoke();
            
            // Create explosion at launch
            setTimeout(() => {
                createExplosion();
            }, 250);
            
            // Start smooth scroll to top
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 350);
            
            // Create continuous smoke during scroll
            let smokeInterval = setInterval(() => {
                createSmoke();
            }, 120);
            
            // Reset rocket after launch animation completes
            setTimeout(() => {
                // Remove launching class
                btn.classList.remove('launching');
                
                // Reset rocket position
                if (rocketContainer) {
                    rocketContainer.style.animation = 'none';
                    void rocketContainer.offsetWidth; // Trigger reflow
                    rocketContainer.style.animation = '';
                }
                
                // Re-enable button
                setTimeout(() => {
                    btn.style.pointerEvents = 'auto';
                }, 500);
                
                // Stop smoke
                clearInterval(smokeInterval);
                
                // Hide button at top
                rocketButton.classList.remove('visible');
            }, 1200);
        }
        
        // Mouse hover effects
        function setupHoverEffects() {
            if (!btn) return;
            
            let hoverSmokeInterval;
            
            btn.addEventListener('mouseenter', () => {
                createSmoke();
                
                // Create subtle continuous smoke on hover
                hoverSmokeInterval = setInterval(() => {
                    if (!btn.matches(':hover')) {
                        clearInterval(hoverSmokeInterval);
                        return;
                    }
                    
                    const smoke = document.createElement('div');
                    smoke.className = 'smoke';
                    smoke.style.setProperty('--offset', `${(Math.random() - 0.5) * 15}px`);
                    smoke.style.animation = `smokeFloat 1.2s ease-out forwards`;
                    smoke.style.bottom = '35px';
                    smoke.style.opacity = '0.4';
                    if (smokeTrail) smokeTrail.appendChild(smoke);
                    
                    setTimeout(() => {
                        if (smoke.parentNode === smokeTrail) {
                            smoke.remove();
                        }
                    }, 1200);
                }, 400);
            });
            
            btn.addEventListener('mouseleave', () => {
                if (hoverSmokeInterval) {
                    clearInterval(hoverSmokeInterval);
                }
            });
        }
        
        // Initialize everything
        function initRocketButton() {
            // Set initial visibility
            toggleButtonVisibility();
            
            // Setup event listeners
            if (btn) {
                btn.addEventListener('click', scrollToTop);
                setupHoverEffects();
            }
            
            // Listen for scroll events
            window.addEventListener('scroll', toggleButtonVisibility);
            
            // Create occasional subtle smoke when button is visible
            setInterval(() => {
                if (rocketButton.classList.contains('visible') && Math.random() > 0.7) {
                    const smoke = document.createElement('div');
                    smoke.className = 'smoke';
                    smoke.style.setProperty('--offset', `${(Math.random() - 0.5) * 10}px`);
                    smoke.style.animation = `smokeFloat 2s ease-out forwards`;
                    smoke.style.opacity = '0.15';
                    if (smokeTrail) smokeTrail.appendChild(smoke);
                    
                    setTimeout(() => {
                        if (smoke.parentNode === smokeTrail) {
                            smoke.remove();
                        }
                    }, 2000);
                }
            }, 3000);
            
            // Cleanup on resize
            window.addEventListener('resize', () => {
                if (smokeTrail) smokeTrail.innerHTML = '';
            });
        }
        
        // Start the rocket button
        initRocketButton();
        
        // Export for debugging (optional)
        window.rocketButton = {
            scrollToTop,
            createSmoke,
            createExplosion
        };
    });
})();