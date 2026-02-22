/**
 * app.js — Landing page interactions
 * Includes: Three.js 3D background, Hero Slider, Navbar effect, Counters
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

            // Check if WebGL is available
            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            // Create Particles
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 1500;
            const posArray = new Float32Array(particlesCount * 3);

            for (let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 10;
            }

            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.005,
                color: '#00d4ff',
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particlesMesh);

            camera.position.z = 2;

            // Animation
            let mouseX = 0;
            let mouseY = 0;

            document.addEventListener('mousemove', (event) => {
                mouseX = event.clientX;
                mouseY = event.clientY;
            });

            const animate = () => {
                requestAnimationFrame(animate);

                particlesMesh.rotation.y += 0.001;

                // Interaction
                const targetX = (mouseX / window.innerWidth - 0.5) * 0.5;
                const targetY = (mouseY / window.innerHeight - 0.5) * 0.5;
                particlesMesh.rotation.x += (targetY - particlesMesh.rotation.x) * 0.05;
                particlesMesh.rotation.y += (targetX - particlesMesh.rotation.y) * 0.05;

                renderer.render(scene, camera);
            };

            animate();

            // Resize
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

    // ── Hero Slider Logic ─────────────────────────────────
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slider .slide');
        let currentSlide = 0;

        if (slides.length <= 1) return;

        // Ensure the first slide is active
        slides[currentSlide].classList.add('active');

        setInterval(() => {
            // Outgoing slide
            const outgoing = slides[currentSlide];
            outgoing.classList.remove('active');
            outgoing.classList.add('exit');

            // Move current index
            currentSlide = (currentSlide + 1) % slides.length;

            // Incoming slide
            const incoming = slides[currentSlide];
            incoming.classList.remove('exit');
            incoming.classList.add('active');

            // Cleanup exit class after transition
            setTimeout(() => {
                outgoing.classList.remove('exit');
            }, 1200);
        }, 5000);
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
                const eased = 1 - Math.pow(1 - progress, 4); // Ease-out Quart
                const current = Math.floor(eased * target);
                counter.textContent = current.toLocaleString() + suffix;
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ── Scroll Reveal ─────────────────────────────────────
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'stats-strip') {
                    animateCounters();
                }

                // Add visible class or run animations
                entry.target.querySelectorAll('.animate-in').forEach(el => {
                    el.classList.add('visible');
                });
            }
        });
    }, observerOptions);

    // Init All
    document.addEventListener('DOMContentLoaded', () => {
        initThreeJS();
        initHeroSlider();

        // Observe all sections for animations
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        const statsStrip = document.getElementById('stats-strip');
        if (statsStrip) observer.observe(statsStrip);

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
