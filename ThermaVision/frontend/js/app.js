/**
 * app.js — Landing page interactions
 * Includes: Three.js 3D background, Robust Hero Slider, Navbar, Counters, Scroll In/Out Animations
 */

(function () {
    'use strict';

    // ── Three.js Animated Background ──────────────────────
    function initThreeJS() {
        const canvas = document.querySelector('#three-canvas');
        if (!canvas) return;

        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 1500;
            const posArray = new Float32Array(particlesCount * 3);

            for (let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 10;
            }

            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.005,
                color: '#ff8c00',
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particlesMesh);
            camera.position.z = 2;

            let mouseX = 0;
            let mouseY = 0;

            document.addEventListener('mousemove', (event) => {
                mouseX = event.clientX;
                mouseY = event.clientY;
            });

            const animate = () => {
                requestAnimationFrame(animate);
                particlesMesh.rotation.y += 0.001;
                const targetX = (mouseX / window.innerWidth - 0.5) * 0.5;
                const targetY = (mouseY / window.innerHeight - 0.5) * 0.5;
                particlesMesh.rotation.x += (targetY - particlesMesh.rotation.x) * 0.05;
                particlesMesh.rotation.y += (targetX - particlesMesh.rotation.y) * 0.05;
                renderer.render(scene, camera);
            };

            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        } catch (e) {
            console.warn("WebGL not supported or failed to initialize:", e);
            canvas.style.display = 'none';
        }
    }

    // ── Robust Hero Slider (crossfade — always one image visible) ──
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slider .slide');
        if (slides.length <= 1) {
            // Single-slide pages — just ensure it's visible
            if (slides.length === 1) slides[0].classList.add('active');
            return;
        }

        let currentSlide = 0;
        let isTransitioning = false;

        // Preload all background images to avoid blank frames
        slides.forEach((slide) => {
            const style = slide.getAttribute('style') || '';
            const urlMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
            if (urlMatch && urlMatch[1]) {
                const img = new Image();
                img.src = urlMatch[1];
            }
        });

        // Ensure the first slide is active, others are not
        slides.forEach((s, i) => {
            s.classList.remove('active', 'exit');
            if (i === 0) s.classList.add('active');
        });

        function nextSlide() {
            if (isTransitioning) return;
            isTransitioning = true;

            const outgoing = slides[currentSlide];
            currentSlide = (currentSlide + 1) % slides.length;
            const incoming = slides[currentSlide];

            // Incoming starts fading in (overlaps outgoing — both visible briefly)
            incoming.classList.add('active');

            // After incoming is fully visible, remove outgoing
            setTimeout(() => {
                outgoing.classList.remove('active');
                outgoing.classList.add('exit');
                setTimeout(() => {
                    outgoing.classList.remove('exit');
                    isTransitioning = false;
                }, 600);
            }, 1400); // Match CSS transition duration
        }

        setInterval(nextSlide, 5500);
    }

    // ── Navbar scroll effect ──────────────────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        });
    }

    // ── Animated Counters ─────────────────────────────────
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        counters.forEach(counter => {
            if (counter.classList.contains('animated')) return;
            counter.classList.add('animated');

            const target = parseInt(counter.dataset.target, 10);
            const suffix = counter.dataset.suffix || '';
            const duration = 2500;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(eased * target);
                counter.textContent = current.toLocaleString() + suffix;
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ── Scroll In/Out Animation Engine ────────────────────
    function initScrollAnimations() {
        // Observe individual .animate-in elements
        const animateElements = document.querySelectorAll('.animate-in');
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.remove('scroll-out');
                } else {
                    if (entry.target.classList.contains('visible')) {
                        entry.target.classList.add('scroll-out');
                        entry.target.classList.remove('visible');
                    }
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

        animateElements.forEach(el => elementObserver.observe(el));

        // Observe section-level animations
        const sections = document.querySelectorAll('.section-animate');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    entry.target.classList.remove('out-view');
                } else {
                    if (entry.target.classList.contains('in-view')) {
                        entry.target.classList.add('out-view');
                        entry.target.classList.remove('in-view');
                    }
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

        sections.forEach(s => sectionObserver.observe(s));

        // Observe section-bg elements for subtle background reveals
        const bgSections = document.querySelectorAll('.section-bg');
        bgSections.forEach(s => sectionObserver.observe(s));

        // Stats strip counter trigger
        const statsStrip = document.getElementById('stats-strip');
        if (statsStrip) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                    }
                });
            }, { threshold: 0.1 });
            statsObserver.observe(statsStrip);
        }
    }

    // ── Init All ──────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        initThreeJS();
        initHeroSlider();
        initScrollAnimations();

        // Mobile Menu Toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    const isOpening = navLinks.classList.contains('active');
                    icon.setAttribute('data-lucide', isOpening ? 'x' : 'menu');
                    if (window.lucide) window.lucide.createIcons();
                }
            });
        }
    });

})();
