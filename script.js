// ============================================
// Kincode+ — Main JavaScript
// ============================================

(function () {
    var STORAGE_LANG_KEY = 'kincode-language';

    function icon(name) {
        var icons = {
            menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
            x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
            globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
            github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>',
            twitter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4l16 16"></path><path d="M20 4L4 20"></path></svg>',
            arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>',
            copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
            check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        };
        return icons[name] || '';
    }



    var TRANSLATIONS = {
        en: {
            'nav.home':'Home','nav.features':'Features','nav.download':'Download','nav.downloads':'Downloads','nav.changelog':'Changelog','nav.about':'About',
            'common.github':'GitHub','footer.privacy':'Privacy Policy','footer.terms':'Terms of Service','footer.license':'License',
            'downloads.notify':'Notify Me','downloads.status':'Status','common.comingSoon':'Coming Soon','common.stable':'Stable'
        },
        ar: {
            'nav.home':'الرئيسية','nav.features':'المميزات','nav.download':'تحميل','nav.downloads':'التحميلات','nav.changelog':'سجل التغييرات','nav.about':'حول',
            'common.github':'جيت هب','footer.privacy':'سياسة الخصوصية','footer.terms':'شروط الخدمة','footer.license':'الترخيص',
            'downloads.notify':'أبلغني','downloads.status':'الحالة','common.comingSoon':'قريبًا','common.stable':'مستقر'
        }
    };

    function applyTranslations(lang) {
        var dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
        var nodes = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < nodes.length; i++) {
            var key = nodes[i].getAttribute('data-i18n');
            if (dict[key]) nodes[i].textContent = dict[key];
        }
    }


    function ensureArabicScript(callback) {
        if (window.KinCodeArabic) {
            callback();
            return;
        }

        var existing = document.querySelector('script[data-lang-script="ar"]');
        if (existing) {
            existing.addEventListener('load', callback, { once: true });
            return;
        }

        var s = document.createElement('script');
        s.src = 'language/ar.js';
        s.defer = true;
        s.setAttribute('data-lang-script', 'ar');
        s.onload = callback;
        document.head.appendChild(s);
    }

    function applyLanguage(lang) {
        var normalized = lang === 'ar' ? 'ar' : 'en';
        document.documentElement.lang = normalized;
        document.documentElement.dir = normalized === 'ar' ? 'rtl' : 'ltr';
        document.body.classList.toggle('lang-ar', normalized === 'ar');
        document.body.classList.toggle('lang-en', normalized === 'en');
        localStorage.setItem(STORAGE_LANG_KEY, normalized);
        applyTranslations(normalized);

        if (normalized === 'ar') {
            ensureArabicScript(function () {
                if (window.KinCodeArabic && window.KinCodeArabic.apply) window.KinCodeArabic.apply();
            });
        } else if (window.KinCodeArabic && window.KinCodeArabic.restore) {
            window.KinCodeArabic.restore();
        }

        var toggles = document.querySelectorAll('[data-lang-toggle]');
        for (var i = 0; i < toggles.length; i++) {
            toggles[i].setAttribute('data-current', normalized);
            var label = toggles[i].querySelector('.lang-label');
            if (label) {
                label.textContent = normalized === 'ar' ? 'AR' : 'EN';
            }
        }
    }

    function setupLanguageToggle() {
        var navActions = document.querySelector('.nav-actions.desktop-only');
        if (navActions && !document.querySelector('[data-lang-toggle]')) {
            var button = document.createElement('button');
            button.className = 'lang-toggle btn btn-ghost';
            button.type = 'button';
            button.setAttribute('data-lang-toggle', '');
            button.innerHTML = '<span class="lang-flag" aria-hidden="true">' + icon('globe') + '</span><span class="lang-label">EN</span>';
            navActions.insertBefore(button, navActions.firstChild);
        }

        var mobileActions = document.querySelector('.mobile-actions');
        if (mobileActions && !mobileActions.querySelector('[data-lang-toggle]')) {
            var mobileButton = document.createElement('button');
            mobileButton.className = 'lang-toggle btn btn-ghost btn-full';
            mobileButton.type = 'button';
            mobileButton.setAttribute('data-lang-toggle', '');
            mobileButton.innerHTML = '<span class="lang-flag" aria-hidden="true">' + icon('globe') + '</span><span class="lang-label">EN</span>';
            mobileActions.appendChild(mobileButton);
        }

        var stored = localStorage.getItem(STORAGE_LANG_KEY);
        var detected = ((navigator.language || 'en').toLowerCase().indexOf('ar') === 0) ? 'ar' : 'en';
        applyLanguage(stored || detected);

        document.addEventListener('click', function (event) {
            var target = event.target.closest('[data-lang-toggle]');
            if (!target) return;
            var current = document.documentElement.lang === 'ar' ? 'ar' : 'en';
            applyLanguage(current === 'ar' ? 'en' : 'ar');
        });
    }

    function setupMenu() {
        var menuToggle = document.getElementById('menuToggle');
        var mobileMenu = document.getElementById('mobileMenu');
        if (!menuToggle || !mobileMenu) return;

        menuToggle.innerHTML = '<span class="menu-icon-open">' + icon('menu') + '</span><span class="menu-icon-close">' + icon('x') + '</span>';

        function toggleMenu(force) {
            var isActive = force !== undefined ? force : !mobileMenu.classList.contains('active');
            mobileMenu.classList.toggle('active', isActive);
            menuToggle.classList.toggle('active', isActive);
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : '';
        }

        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            toggleMenu();
        });

        mobileMenu.addEventListener('click', function (e) {
            if (e.target.closest('a')) {
                toggleMenu(false);
            }
        });

        document.addEventListener('click', function (e) {
            if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) toggleMenu(false);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) toggleMenu(false);
        });
    }

    function setupNavbarScroll() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;
        function update() {
            navbar.classList.toggle('is-scrolled', window.scrollY > 12);
        }
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    function setupSmoothScroll() {
        var anchors = document.querySelectorAll('a[href^="#"]');
        for (var i = 0; i < anchors.length; i++) {
            anchors[i].addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (!href || href === '#') return;
                var target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 84, behavior: 'smooth' });
            });
        }
    }

    function setupChecksumCopy() {
        var cells = document.querySelectorAll('.checksum-cell');
        for (var i = 0; i < cells.length; i++) {
            var code = cells[i].querySelector('code');
            if (!code || cells[i].querySelector('.copy-hash')) continue;
            var button = document.createElement('button');
            button.className = 'copy-hash';
            button.type = 'button';
            button.setAttribute('aria-label', 'Copy SHA256');
            button.innerHTML = icon('copy');
            cells[i].appendChild(button);
            button.addEventListener('click', function (e) {
                var btn = e.currentTarget;
                var hash = btn.parentElement.querySelector('code').textContent;
                navigator.clipboard.writeText(hash).then(function () {
                    btn.innerHTML = icon('check');
                    btn.classList.add('copied');
                    setTimeout(function () {
                        btn.innerHTML = icon('copy');
                        btn.classList.remove('copied');
                    }, 1400);
                });
            });
        }
    }

    function setupBackToTop() {
        if (document.querySelector('.back-to-top')) return;
        var button = document.createElement('button');
        button.className = 'back-to-top';
        button.type = 'button';
        button.setAttribute('aria-label', 'Back to top');
        button.innerHTML = icon('arrowUp');
        document.body.appendChild(button);
        window.addEventListener('scroll', function () {
            button.classList.toggle('visible', window.scrollY > 240);
        }, { passive: true });
        button.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function setupFooterUpgrade() {
        var footer = document.querySelector('footer.footer');
        if (!footer || footer.querySelector('.footer-grid')) return;
        var container = footer.querySelector('.container');
        if (!container) return;
        var grid = document.createElement('div');
        grid.className = 'footer-grid';
        grid.innerHTML = '<div class="footer-column footer-brand"><a href="index.html" class="logo"><img class="logo-icon" src="logo.svg" alt="Kincode+ logo"><div class="logo-text"><span class="logo-main">Kincode+</span><span class="logo-sub">by ATIGAI</span></div></a><p class="footer-description">Professional AI-powered development environment for modern engineering teams.</p></div>' +
            '<div class="footer-column"><h4>Product</h4><a href="index.html#features">Features</a><a href="downloads.html">Downloads</a><a href="changelog.html">Changelog</a></div>' +
            '<div class="footer-column"><h4>Legal</h4><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="license.html">License</a></div>' +
            '<div class="footer-column"><h4>Connect</h4><div class="footer-social"><a href="https://github.com/aymantaha-dev/Kincode-plus" target="_blank" rel="noopener" aria-label="GitHub">' + icon('github') + '</a><a href="https://x.com" target="_blank" rel="noopener" aria-label="X">' + icon('twitter') + '</a></div></div>';
        container.insertBefore(grid, container.firstChild);
    }

    function setupDelayedDownloads() {
        var delayedDownloads = document.querySelectorAll('.delayed-download');
        for (var i = 0; i < delayedDownloads.length; i++) {
            delayedDownloads[i].addEventListener('click', function (e) {
                var link = this;
                var targetUrl = link.getAttribute('href');
                if (!targetUrl || link.dataset.loading === 'true') {
                    e.preventDefault();
                    return;
                }
                e.preventDefault();
                var delayMs = parseInt(link.getAttribute('data-delay'), 10);
                if (isNaN(delayMs) || delayMs < 0) delayMs = 5000;
                var originalHtml = link.innerHTML;
                link.dataset.loading = 'true';
                link.classList.add('is-loading');
                link.style.pointerEvents = 'none';
                var remainingSeconds = Math.ceil(delayMs / 1000);
                function render(seconds) {
                    link.innerHTML = '<span class="loading-spinner" aria-hidden="true"></span><span>Loading... ' + seconds + 's</span>';
                }
                render(remainingSeconds);
                var timer = setInterval(function () {
                    remainingSeconds -= 1;
                    if (remainingSeconds > 0) return render(remainingSeconds);
                    clearInterval(timer);
                    link.innerHTML = originalHtml;
                    link.classList.remove('is-loading');
                    link.style.pointerEvents = '';
                    delete link.dataset.loading;
                    window.open(targetUrl, '_blank', 'noopener');
                }, 1000);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupLanguageToggle();
        setupMenu();
        setupNavbarScroll();
        setupSmoothScroll();
        setupFooterUpgrade();
        setupBackToTop();
        setupChecksumCopy();
        setupDelayedDownloads();
    });
})();
