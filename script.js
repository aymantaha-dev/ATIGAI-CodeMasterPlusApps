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
});