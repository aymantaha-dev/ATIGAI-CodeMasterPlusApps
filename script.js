// ============================================
// Kincode+ — Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    var menuToggle = document.getElementById('menuToggle');
    var mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        function toggleMenu(force) {
            var isActive = force !== undefined ? force : !mobileMenu.classList.contains('active');
            mobileMenu.classList.toggle('active', isActive);
            menuToggle.classList.toggle('active', isActive);
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : '';
        }

        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Close when clicking links
        var links = mobileMenu.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function() {
                toggleMenu(false);
            });
        }

        // Close on outside click and on resize to desktop
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                toggleMenu(false);
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                toggleMenu(false);
            }
        });
    }
    
    // Navbar scroll effect
    var navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                navbar.style.background = 'rgba(10, 10, 15, 0.98)';
            } else {
                navbar.style.background = 'rgba(10, 10, 15, 0.85)';
            }
        });
    }
    
    // Smooth scroll for anchor links
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var j = 0; j < anchors.length; j++) {
        anchors[j].addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    var offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    // Delayed download buttons (downloads page)
    var delayedDownloads = document.querySelectorAll('.delayed-download');
    for (var k = 0; k < delayedDownloads.length; k++) {
        delayedDownloads[k].addEventListener('click', function(e) {
            var link = this;
            var targetUrl = link.getAttribute('href');
            if (!targetUrl || link.dataset.loading === 'true') {
                e.preventDefault();
                return;
            }

            e.preventDefault();

            var delayMs = parseInt(link.getAttribute('data-delay'), 10);
            if (isNaN(delayMs) || delayMs < 0) {
                delayMs = 5000;
            }

            var originalHtml = link.innerHTML;
            var originalPointerEvents = link.style.pointerEvents;
            var originalAriaDisabled = link.getAttribute('aria-disabled');
            link.dataset.loading = 'true';
            link.classList.add('is-loading');
            link.style.pointerEvents = 'none';
            link.setAttribute('aria-disabled', 'true');

            var remainingSeconds = Math.ceil(delayMs / 1000);
            function renderLoadingState(seconds) {
                link.innerHTML = '<span class="loading-spinner" aria-hidden="true"></span><span>Loading... (' + seconds + 's)</span>';
            }

            renderLoadingState(remainingSeconds);

            var timer = setInterval(function() {
                remainingSeconds -= 1;
                if (remainingSeconds > 0) {
                    renderLoadingState(remainingSeconds);
                    return;
                }

                clearInterval(timer);
                link.innerHTML = originalHtml;
                link.classList.remove('is-loading');
                link.style.pointerEvents = originalPointerEvents;

                if (originalAriaDisabled === null) {
                    link.removeAttribute('aria-disabled');
                } else {
                    link.setAttribute('aria-disabled', originalAriaDisabled);
                }

                delete link.dataset.loading;
                window.open(targetUrl, '_blank', 'noopener');
            }, 1000);
        });
    }
});
