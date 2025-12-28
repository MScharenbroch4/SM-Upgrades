// Homepage Component - Modern Enterprise Analytics Design
// Premium visual aesthetics with maintained functionality

export class Homepage {
  constructor(containerId, onNavigate) {
    this.containerId = containerId;
    this.onNavigate = onNavigate;
    this.isMobileMenuOpen = false;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="home">
        <!-- Mobile Menu Overlay -->
        <div class="home-mobile-overlay" id="mobileOverlay"></div>
        
        <!-- Header -->
        <header class="home-header">
          <div class="home-header__brand">
            <!-- Mobile Menu Button -->
            <button class="home-header__menu-btn" id="mobileMenuBtn" aria-label="Toggle menu" aria-expanded="false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div class="home-header__logo">
              <svg viewBox="0 0 44 44" fill="none">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2d5a8a"/>
                    <stop offset="100%" stop-color="#1a3d5c"/>
                  </linearGradient>
                </defs>
                <rect width="44" height="44" rx="10" fill="url(#logoGradient)"/>
                <path d="M11 30V20h5v10H11zM19 30V14h5v16h-5zM27 30V10h5v20h-5z" fill="white" opacity="0.95"/>
              </svg>
            </div>
            <div class="home-header__title-group">
              <span class="home-header__title">MS Analytics</span>
              <span class="home-header__subtitle">Demo Portal</span>
            </div>
          </div>
          <nav class="home-header__nav">
            <a href="#contact" class="home-header__link">
              <svg class="home-header__link-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              Contact Us
            </a>
          </nav>
        </header>

        <!-- Main Layout -->
        <div class="home-layout">
          <!-- Sidebar -->
          <aside class="home-sidebar" id="mobileSidebar">
            <!-- Close button for mobile -->
            <button class="home-sidebar__close-btn" id="sidebarCloseBtn" aria-label="Close menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <div class="home-sidebar__section-label">Navigation</div>
            <nav class="home-sidebar__nav">
              <a href="#" class="home-sidebar__link home-sidebar__link--active">
                <span class="home-sidebar__icon-wrap">
                  <svg class="home-sidebar__icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </span>
                <span class="home-sidebar__text">Report Dashboard</span>
              </a>
              <a href="#" class="home-sidebar__link">
                <span class="home-sidebar__icon-wrap">
                  <svg class="home-sidebar__icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                  </svg>
                </span>
                <span class="home-sidebar__text">Index</span>
              </a>
              <a href="#" class="home-sidebar__link">
                <span class="home-sidebar__icon-wrap">
                  <svg class="home-sidebar__icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                  </svg>
                </span>
                <span class="home-sidebar__text">Support Center</span>
              </a>
            </nav>
            
            <div class="home-sidebar__footer">
              <div class="home-sidebar__version">v2.1.0</div>
            </div>
          </aside>

          <!-- Content Area -->
          <main class="home-content">
            <div class="home-content__header">
              <h1 class="home-content__title">Analytics Dashboards</h1>
              <p class="home-content__subtitle">Select a module to view detailed analytics and reports</p>
            </div>
            
            <div class="home-cards">
              <!-- Dashboards Card -->
              <article class="home-card home-card--disabled" tabindex="0" role="button" id="dashboardsCard"
                       aria-label="Dashboards - Coming soon">
                <div class="home-card__accent"></div>
                <header class="home-card__header">
                  <div class="home-card__header-content">
                    <div class="home-card__icon-container">
                      <svg class="home-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                        <rect x="14" y="14" width="7" height="7" rx="1"/>
                      </svg>
                    </div>
                    <div class="home-card__title-wrap">
                      <h2 class="home-card__title">Dashboards</h2>
                      <p class="home-card__desc">Executive dashboards and analytics reports</p>
                    </div>
                  </div>
                  <span class="home-card__badge home-card__badge--soon">Coming Soon</span>
                </header>
              </article>

              <!-- Child Welfare Card -->
              <article class="home-card home-card--featured" tabindex="0" role="button" id="childWelfareCard"
                       aria-label="Child Welfare - Time to Investigation Dashboard">
                <div class="home-card__accent home-card__accent--active"></div>
                <header class="home-card__header">
                  <div class="home-card__header-content">
                    <div class="home-card__icon-container home-card__icon-container--active">
                      <svg class="home-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <div class="home-card__title-wrap">
                      <h2 class="home-card__title">Child Welfare</h2>
                      <p class="home-card__desc">Investigation timelines and screening analytics</p>
                    </div>
                  </div>
                  <span class="home-card__badge home-card__badge--active">2 Reports</span>
                </header>
                
                <div class="home-card__body">
                  <div class="home-card__item" id="timeToInvestigationLink" tabindex="0">
                    <div class="home-card__item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20V10"/>
                        <path d="M18 20V4"/>
                        <path d="M6 20v-4"/>
                      </svg>
                    </div>
                    <div class="home-card__item-content">
                      <span class="home-card__item-title">Time to Investigation</span>
                      <span class="home-card__item-meta">Timeliness metrics & trends</span>
                    </div>
                    <span class="home-card__item-arrow">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </span>
                  </div>
                  
                  <div class="home-card__item" id="sdmHotlineLink" tabindex="0">
                    <div class="home-card__item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div class="home-card__item-content">
                      <span class="home-card__item-title">SDM Hotline Screening Decision</span>
                      <span class="home-card__item-meta">Referral outcomes & patterns</span>
                    </div>
                    <span class="home-card__item-arrow">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </main>
        </div>

        <!-- Footer -->
        <footer class="home-footer">
          <div class="home-footer__content">
            <div class="home-footer__brand">
              <svg class="home-footer__logo" viewBox="0 0 24 24" fill="currentColor">
                <rect width="24" height="24" rx="4" fill="currentColor" opacity="0.2"/>
                <path d="M6 16V12h3v4H6zM10 16V8h3v8h-3zM14 16V6h3v10h-3z" fill="currentColor"/>
              </svg>
              <span>Powered by MS Analytics</span>
            </div>
            <div class="home-footer__meta">
              <span>© 2025 Enterprise Analytics Platform</span>
            </div>
          </div>
        </footer>
      </div>
    `;

    this.addStyles();
    this.attachEventListeners();
  }

  addStyles() {
    if (document.getElementById('homepage-styles')) {
      document.getElementById('homepage-styles').remove();
    }

    const style = document.createElement('style');
    style.id = 'homepage-styles';
    style.textContent = `
      /* ============================================
         Homepage Styles - Modern Enterprise Design
         ============================================ */
      
      .home {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        font-family: var(--font-family);
        overflow: hidden;
      }

      /* ============================================
         Header - Premium Gradient Design
         ============================================ */
      .home-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 28px;
        background: linear-gradient(135deg, #1a3d5c 0%, #234b6e 50%, #1e4976 100%);
        color: white;
        box-shadow: 0 4px 20px rgba(26, 61, 92, 0.25);
        position: relative;
        z-index: 100;
      }

      .home-header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      }

      .home-header__brand {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .home-header__logo svg {
        width: 44px;
        height: 44px;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        transition: transform 0.3s ease;
      }

      .home-header__logo:hover svg {
        transform: scale(1.05);
      }

      .home-header__title-group {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .home-header__title {
        font-size: 1.375rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        line-height: 1.2;
      }

      .home-header__subtitle {
        font-size: 0.8125rem;
        font-weight: 500;
        opacity: 0.75;
        letter-spacing: 0.02em;
      }

      .home-header__nav {
        display: flex;
        gap: 24px;
      }

      /* Mobile Menu Button - Hidden on desktop */
      .home-header__menu-btn {
        display: none;
      }

      /* Mobile Overlay - Hidden by default */
      .home-mobile-overlay {
        display: none;
      }

      /* Close button - Hidden by default */
      .home-sidebar__close-btn {
        display: none;
      }

      .home-header__link {
        display: flex;
        align-items: center;
        gap: 8px;
        color: rgba(255,255,255,0.85);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        padding: 10px 18px;
        border-radius: 8px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.12);
        transition: all 0.25s ease;
      }

      .home-header__link:hover {
        background: rgba(255,255,255,0.15);
        color: white;
        border-color: rgba(255,255,255,0.25);
        transform: translateY(-1px);
      }

      .home-header__link-icon {
        width: 16px;
        height: 16px;
        opacity: 0.9;
      }

      /* ============================================
         Layout - Enhanced Structure
         ============================================ */
      .home-layout {
        display: flex;
        flex: 1;
        min-height: 0;
      }

      /* ============================================
         Sidebar - Modern Navigation
         ============================================ */
      .home-sidebar {
        width: 240px;
        background: linear-gradient(180deg, #1a3d5c 0%, #15334d 100%);
        padding: 20px 0 12px 0;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        box-shadow: 4px 0 24px rgba(0,0,0,0.12);
      }

      .home-sidebar__section-label {
        padding: 0 24px 12px 24px;
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(255,255,255,0.4);
      }

      .home-sidebar__nav {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 12px;
        flex: 1;
      }

      .home-sidebar__link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        color: rgba(255,255,255,0.7);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
        border-radius: 10px;
        position: relative;
      }

      .home-sidebar__link::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 0;
        background: #60a5fa;
        border-radius: 0 2px 2px 0;
        transition: height 0.2s ease;
      }

      .home-sidebar__link:hover {
        background: rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.95);
      }

      .home-sidebar__link:hover::before {
        height: 20px;
      }

      .home-sidebar__link--active {
        background: rgba(96, 165, 250, 0.15);
        color: white;
      }

      .home-sidebar__link--active::before {
        height: 28px;
        background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
      }

      .home-sidebar__icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: rgba(255,255,255,0.08);
        border-radius: 8px;
        transition: all 0.2s ease;
      }

      .home-sidebar__link:hover .home-sidebar__icon-wrap {
        background: rgba(255,255,255,0.12);
      }

      .home-sidebar__link--active .home-sidebar__icon-wrap {
        background: rgba(96, 165, 250, 0.25);
      }

      .home-sidebar__icon {
        width: 18px;
        height: 18px;
        opacity: 0.85;
      }

      .home-sidebar__link--active .home-sidebar__icon {
        opacity: 1;
      }

      .home-sidebar__text {
        flex: 1;
      }

      .home-sidebar__footer {
        padding: 16px 24px;
        border-top: 1px solid rgba(255,255,255,0.08);
        margin-top: auto;
      }

      .home-sidebar__version {
        font-size: 0.75rem;
        color: rgba(255,255,255,0.35);
        font-weight: 500;
      }

      /* ============================================
         Content Area - Clean Layout
         ============================================ */
      .home-content {
        flex: 1;
        padding: 28px 40px;
        background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        overflow-y: auto;
      }

      .home-content__header {
        margin-bottom: 20px;
      }

      .home-content__title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 4px 0;
        letter-spacing: -0.02em;
      }

      .home-content__subtitle {
        font-size: 0.9375rem;
        color: #64748b;
        margin: 0;
        font-weight: 400;
      }

      .home-cards {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 600px;
      }

      /* ============================================
         Cards - Modern Design
         ============================================ */
      .home-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        position: relative;
        border: 1px solid rgba(0,0,0,0.04);
      }

      .home-card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.08);
        transform: translateY(-2px);
      }

      .home-card:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0,0,0,0.1);
      }

      .home-card--disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .home-card--disabled:hover {
        transform: none;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
      }

      .home-card__accent {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #94a3b8, #cbd5e1);
      }

      .home-card__accent--active {
        background: linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6);
        background-size: 200% 100%;
        animation: shimmer 3s ease-in-out infinite;
      }

      @keyframes shimmer {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      .home-card__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        gap: 14px;
      }

      .home-card__header-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .home-card__icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        border-radius: 10px;
        flex-shrink: 0;
      }

      .home-card__icon-container--active {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      }

      .home-card__icon {
        width: 24px;
        height: 24px;
        color: #475569;
      }

      .home-card__icon-container--active .home-card__icon {
        color: #2563eb;
      }

      .home-card__title-wrap {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .home-card__title {
        margin: 0;
        font-size: 1.0625rem;
        font-weight: 700;
        color: #1e293b;
        letter-spacing: -0.01em;
      }

      .home-card__desc {
        margin: 0;
        font-size: 0.875rem;
        color: #64748b;
        font-weight: 400;
      }

      .home-card__badge {
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 20px;
        letter-spacing: 0.02em;
        flex-shrink: 0;
      }

      .home-card__badge--soon {
        background: #f1f5f9;
        color: #64748b;
      }

      .home-card__badge--active {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        color: #1d4ed8;
      }

      /* Card Body - Menu Items */
      .home-card__body {
        padding: 6px 14px 14px 14px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .home-card__item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 8px;
        transition: all 0.2s ease;
        cursor: pointer;
      }

      .home-card__item:hover {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      }

      .home-card__item:focus {
        outline: none;
        background: #eff6ff;
        box-shadow: inset 0 0 0 2px #3b82f6;
      }

      .home-card__item-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: #eff6ff;
        border-radius: 10px;
        flex-shrink: 0;
        transition: all 0.2s ease;
      }

      .home-card__item:hover .home-card__item-icon {
        background: #dbeafe;
        transform: scale(1.05);
      }

      .home-card__item-icon svg {
        width: 20px;
        height: 20px;
        color: #3b82f6;
      }

      .home-card__item-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .home-card__item-title {
        font-size: 0.9375rem;
        font-weight: 600;
        color: #1e293b;
        line-height: 1.3;
      }

      .home-card__item-meta {
        font-size: 0.8125rem;
        color: #64748b;
        font-weight: 400;
      }

      .home-card__item-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: #f1f5f9;
        border-radius: 8px;
        color: #64748b;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }

      .home-card__item:hover .home-card__item-arrow {
        background: #3b82f6;
        color: white;
        transform: translateX(4px);
      }

      .home-card__item-arrow svg {
        width: 16px;
        height: 16px;
      }

      /* ============================================
         Footer - Clean & Professional
         ============================================ */
      .home-footer {
        padding: 12px 24px;
        background: white;
        border-top: 1px solid #e2e8f0;
      }

      .home-footer__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .home-footer__brand {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #475569;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .home-footer__logo {
        width: 24px;
        height: 24px;
        color: #3b82f6;
      }

      .home-footer__meta {
        font-size: 0.8125rem;
        color: #94a3b8;
      }

      /* ============================================
         Responsive Adjustments
         ============================================ */
      @media (max-width: 900px) {
        .home-header {
          padding: 14px 20px;
        }

        .home-sidebar {
          width: 220px;
        }

        .home-content {
          padding: 32px;
        }

        .home-cards {
          max-width: 100%;
        }
      }

      @media (max-width: 768px) {
        /* Header - Mobile alignment */
        .home-header {
          padding: 12px 16px;
          gap: 8px;
        }

        .home-header__brand {
          gap: 10px;
        }

        .home-header__logo {
          display: flex;
        }

        .home-header__logo svg {
          width: 36px;
          height: 36px;
        }

        .home-header__title-group {
          gap: 0;
        }

        .home-header__title {
          font-size: 1.1rem;
        }

        .home-header__subtitle {
          font-size: 0.7rem;
          opacity: 0.7;
        }

        .home-header__nav {
          gap: 8px;
        }

        .home-header__link {
          padding: 8px 12px;
          font-size: 0.75rem;
          gap: 6px;
        }

        .home-header__link-icon {
          width: 14px;
          height: 14px;
        }

        .home-layout {
          flex-direction: column;
        }

        .home-sidebar {
          width: 100%;
          padding: 12px 0;
        }

        .home-sidebar__section-label {
          display: none;
        }

        .home-sidebar__nav {
          flex-direction: row;
          overflow-x: auto;
          gap: 8px;
          padding: 0 12px;
          -webkit-overflow-scrolling: touch;
        }

        .home-sidebar__link {
          padding: 10px 14px;
          white-space: nowrap;
          border-radius: 8px;
        }

        .home-sidebar__link::before {
          display: none;
        }

        .home-sidebar__icon-wrap {
          width: 32px;
          height: 32px;
        }

        .home-sidebar__footer {
          display: none;
        }

        .home-content {
          padding: 24px 16px;
        }

        .home-content__title {
          font-size: 1.5rem;
        }

        .home-card__header {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .home-footer__content {
          flex-direction: column;
          gap: 8px;
          text-align: center;
        }

        /* Mobile Menu Button */
        .home-header__menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .home-header__menu-btn:hover {
          background: rgba(255,255,255,0.15);
        }

        .home-header__menu-btn svg {
          width: 24px;
          height: 24px;
          color: white;
        }

        /* Mobile Overlay */
        .home-mobile-overlay {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 90;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .home-mobile-overlay--active {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile Sidebar Drawer */
        .home-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          z-index: 100;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          padding: 20px 0;
          flex-direction: column;
        }

        .home-sidebar--open {
          transform: translateX(0);
        }

        .home-sidebar__close-btn {
          display: flex;
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: white;
        }

        .home-sidebar__section-label {
          display: block;
          padding: 16px 20px 8px;
        }

        .home-sidebar__nav {
          flex-direction: column;
          overflow-x: visible;
          padding: 0 16px;
        }

        .home-sidebar__link {
          padding: 14px 16px;
          white-space: normal;
        }

        .home-sidebar__link::before {
          display: block;
        }

        .home-sidebar__footer {
          display: flex;
          margin-top: auto;
          padding: 20px;
        }

        .home-sidebar__text {
          display: block;
        }
      }

      /* Small Mobile - 480px */
      @media (max-width: 480px) {
        .home-header {
          padding: 10px 12px;
        }

        .home-header__menu-btn {
          width: 40px;
          height: 40px;
        }

        .home-header__menu-btn svg {
          width: 20px;
          height: 20px;
        }

        .home-header__logo svg {
          width: 32px;
          height: 32px;
        }

        .home-header__title {
          font-size: 0.95rem;
        }

        .home-header__subtitle {
          display: none;
        }

        .home-header__link {
          padding: 6px 10px;
          font-size: 0.7rem;
        }

        .home-header__link-icon {
          display: none;
        }

        .home-content {
          padding: 20px 12px;
        }

        .home-content__title {
          font-size: 1.25rem;
        }

        .home-card {
          border-radius: 12px;
        }

        .home-card__item {
          padding: 12px 14px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  toggleMobileMenu(open) {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('mobileOverlay');
    const menuBtn = document.getElementById('mobileMenuBtn');

    if (sidebar && overlay && menuBtn) {
      if (open) {
        sidebar.classList.add('home-sidebar--open');
        overlay.classList.add('home-mobile-overlay--active');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
      } else {
        sidebar.classList.remove('home-sidebar--open');
        overlay.classList.remove('home-mobile-overlay--active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
      this.isMobileMenuOpen = open;
    }
  }

  attachEventListeners() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const overlay = document.getElementById('mobileOverlay');

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        this.toggleMobileMenu(!this.isMobileMenuOpen);
      });
    }

    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', () => {
        this.toggleMobileMenu(false);
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        this.toggleMobileMenu(false);
      });
    }

    // Dashboards Card - Coming soon
    const dashboardsCard = document.getElementById('dashboardsCard');
    if (dashboardsCard) {
      const handleDashboards = () => {
        alert('Dashboard module coming soon.');
      };
      dashboardsCard.addEventListener('click', handleDashboards);
      dashboardsCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleDashboards();
        }
      });
    }

    // Child Welfare Group
    const childWelfareCard = document.getElementById('childWelfareCard');
    const timeToInvestigationLink = document.getElementById('timeToInvestigationLink');
    const sdmHotlineLink = document.getElementById('sdmHotlineLink');

    // Helper for navigation
    const navigate = (page) => {
      if (this.onNavigate) this.onNavigate(page);
    };

    // Time to Investigation
    if (timeToInvestigationLink) {
      timeToInvestigationLink.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate('dashboard');
      });
      timeToInvestigationLink.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          navigate('dashboard');
        }
      });
    }

    // SDM Hotline
    if (sdmHotlineLink) {
      sdmHotlineLink.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate('sdm-hotline');
      });
      sdmHotlineLink.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          navigate('sdm-hotline');
        }
      });
    }

    // Card click fallback (defaults to first dashboard)
    if (childWelfareCard) {
      childWelfareCard.addEventListener('click', (e) => {
        // Only navigate if clicking the card background/header, not specific links
        if (!e.target.closest('.home-card__item')) {
          navigate('dashboard');
        }
      });
      childWelfareCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!e.target.closest('.home-card__item')) {
            navigate('dashboard');
          }
        }
      });
    }
  }
}

