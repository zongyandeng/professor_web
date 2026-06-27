// 立即執行：套用儲存的風格以防止頁面加載閃爍
(function() {
    const savedTheme = localStorage.getItem('lab-theme') || 'classic';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
    // 0. 初始化風格切換器
    initThemeSwitcher();

    // 1. 導覽列滾動效果
    const nav = document.querySelector('.main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // 2. 研究成果頁面 Tab 切換邏輯與篩選整合
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有按鈕的 active 狀態
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // 移除所有內容的 active 狀態
                tabContents.forEach(content => content.classList.remove('active'));

                // 為當前按鈕加上 active 狀態
                button.classList.add('active');
                
                // 顯示對應的內容
                const targetId = button.getAttribute('data-tab');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    // 當切換 Tab 時，重新套用篩選並播放動畫
                    applyFilters(targetId);
                }
            });
        });
    }

    // 3. 成果與計畫篩選器互動邏輯
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    function applyFilters(tabId) {
        const tabContent = document.getElementById(tabId);
        if (!tabContent) return;

        const items = tabContent.querySelectorAll('.publication-item');
        if (items.length === 0) return;
        
        // 獲取該 Tab 下當前啟用的篩選條件
        let selectedYear = 'all';
        let selectedRole = 'all';

        if (tabId === 'projects') {
            const yearBtn = tabContent.querySelector('.filter-buttons[data-filter-type="year"] .filter-btn.active');
            const roleBtn = tabContent.querySelector('.filter-buttons[data-filter-type="role"] .filter-btn.active');
            if (yearBtn) selectedYear = yearBtn.getAttribute('data-filter');
            if (roleBtn) selectedRole = roleBtn.getAttribute('data-filter');
        } else {
            const yearBtn = tabContent.querySelector('.filter-container .filter-btn.active');
            if (yearBtn) selectedYear = yearBtn.getAttribute('data-filter');
        }

        items.forEach(item => {
            const itemYear = item.getAttribute('data-year');
            const itemRole = item.getAttribute('data-role');

            const yearMatch = (selectedYear === 'all' || itemYear === selectedYear);
            const roleMatch = (selectedRole === 'all' || itemRole === selectedRole);

            // 移除舊的 fade-in 效果以重新觸發動畫
            item.classList.remove('fade-in');

            if (yearMatch && roleMatch) {
                item.classList.remove('filtered-out');
                // 觸發 reflow 確保動畫重繪
                void item.offsetWidth;
                item.classList.add('fade-in');
            } else {
                item.classList.add('filtered-out');
            }
        });
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 找到同一個按鈕群組並切換 active
                const parentGroup = button.parentElement;
                const siblings = parentGroup.querySelectorAll('.filter-btn');
                siblings.forEach(sib => sib.classList.remove('active'));
                button.classList.add('active');

                // 找到當前所在的 tab-content id 並套用篩選
                const tabContent = button.closest('.tab-content');
                if (tabContent) {
                    applyFilters(tabContent.id);
                }
            });
        });

        // 頁面加載時，對當前 active 的 tab 初始化篩選動畫
        tabContents.forEach(tab => {
            if (tab.classList.contains('active')) {
                applyFilters(tab.id);
            }
        });
    }

    // 3. 聯絡表單送出模擬與驗證
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 獲取欄位值
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('請填寫所有必填欄位 (姓名、Email、留言內容)！');
                return;
            }

            // Email 格式簡單驗證
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('請輸入有效的 Email 地址！');
                return;
            }

            // 模擬送出成功
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '傳送中...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // 成功動畫或提示
                alert('感謝您的來信！我們已收到您的留言，將盡快回覆您。');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1200);
        });
    }

});

/**
 * 初始化風格切換器 (Theme Switcher)
 */
function initThemeSwitcher() {
    // 防止重複注入
    if (document.querySelector('.theme-switcher-wrapper')) return;

    // 建立風格切換器的 HTML
    const switcherHTML = `
        <div class="theme-switcher-wrapper">
            <button class="theme-trigger-btn" aria-label="切換網頁風格">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03445 19.1759 5.09901 19.431 5.02108 19.6749L4.5 21.3033C4.38386 21.6662 4.70732 22 5.0886 22H12Z"/>
                    <circle cx="7.5" cy="9" r="1.5" fill="currentColor"/>
                    <circle cx="11.5" cy="6" r="1.5" fill="currentColor"/>
                    <circle cx="16.5" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="15.5" cy="13" r="1.5" fill="currentColor"/>
                </svg>
            </button>
            <div class="theme-menu">
                <div class="theme-menu-title">風格展示切換</div>
                <button class="theme-option-btn" data-theme-value="classic">
                    <span class="theme-dot classic-dot"></span>
                    <span class="theme-name">🏛️ 經典學術</span>
                </button>
                <button class="theme-option-btn" data-theme-value="tech">
                    <span class="theme-dot tech-dot"></span>
                    <span class="theme-name">⚡ 現代科技</span>
                </button>
                <button class="theme-option-btn" data-theme-value="minimalist">
                    <span class="theme-dot minimalist-dot"></span>
                    <span class="theme-name">✍️ 極簡人文</span>
                </button>
                <button class="theme-option-btn" data-theme-value="ucore">
                    <span class="theme-dot ucore-dot"></span>
                    <span class="theme-name">🌱 譽科智慧</span>
                </button>
                <button class="theme-option-btn" data-theme-value="mirror">
                    <span class="theme-dot mirror-dot"></span>
                    <span class="theme-name">🌹 鏡像時尚</span>
                </button>
                <button class="theme-option-btn" data-theme-value="moonlake">
                    <span class="theme-dot moonlake-dot"></span>
                    <span class="theme-name">🌙 月湖物理</span>
                </button>
            </div>
        </div>
    `;

    // 注入到 body 最前面
    document.body.insertAdjacentHTML('afterbegin', switcherHTML);

    // 動態注入導覽列品牌 Logo 區塊 (供 Tech/Minimalist 隱藏舊 Header 後使用)
    const navContainer = document.querySelector('.nav-container');
    if (navContainer && !document.querySelector('.nav-brand')) {
        const brandHTML = `
            <a href="index.html" class="nav-brand" aria-label="回到首頁">
                <svg viewBox="0 0 100 100" style="width: 36px; height: 36px; flex-shrink: 0;" aria-hidden="true">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="3" opacity="0.2"/>
                    <path d="M15 50 L32 50 L42 20 L52 80 L62 40 L70 55 L75 50 L85 50" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="nav-brand-text">
                    <h4>訊號處理實驗室</h4>
                    <p>NTNU SPLAB</p>
                </div>
            </a>
        `;
        navContainer.insertAdjacentHTML('afterbegin', brandHTML);
    }

    const switcherWrapper = document.querySelector('.theme-switcher-wrapper');
    const triggerBtn = document.querySelector('.theme-trigger-btn');
    const optionBtns = document.querySelectorAll('.theme-option-btn');

    if (!switcherWrapper || !triggerBtn || optionBtns.length === 0) return;

    // 讀取當前設定的主題並標記為 active
    const currentTheme = localStorage.getItem('lab-theme') || 'classic';
    optionBtns.forEach(btn => {
        if (btn.getAttribute('data-theme-value') === currentTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 點擊觸發按鈕展開/收合選單
    triggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        switcherWrapper.classList.toggle('active');
        triggerBtn.classList.toggle('open');
    });

    // 點擊其他地方收合選單
    document.addEventListener('click', () => {
        switcherWrapper.classList.remove('active');
        triggerBtn.classList.remove('open');
    });

    // 阻止點擊選單內部時收合
    const themeMenu = document.querySelector('.theme-menu');
    if (themeMenu) {
        themeMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 風格選項按鈕點擊事件
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTheme = btn.getAttribute('data-theme-value');
            const activeTheme = localStorage.getItem('lab-theme') || 'classic';
            
            if (targetTheme === activeTheme) return;

            // 加上切換動畫 class
            document.documentElement.classList.add('theme-transitioning');

            // 設定新主題並儲存
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('lab-theme', targetTheme);

            // 更新選項 active 狀態
            optionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 觸發自定義事件，讓可能需要的第三方組件知道主題變了
            window.dispatchEvent(new CustomEvent('lab-theme-change', { detail: targetTheme }));

            // 計算重導向的目標 HTML 檔案名稱
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            let basePageName = currentPage.replace(/_(ucore|mirror|moonlake)\.html$/, '.html');
            if (basePageName === '') basePageName = 'index.html';
            
            let targetPage = basePageName;
            if (targetTheme === 'ucore') {
                targetPage = basePageName.replace('.html', '_ucore.html');
            } else if (targetTheme === 'mirror') {
                targetPage = basePageName.replace('.html', '_mirror.html');
            } else if (targetTheme === 'moonlake') {
                targetPage = basePageName.replace('.html', '_moonlake.html');
            }

            // 延遲重導向，讓過渡動畫播放
            setTimeout(() => {
                window.location.href = targetPage;
            }, 150);

            // 收合選單
            switcherWrapper.classList.remove('active');
            triggerBtn.classList.remove('open');
        });
    });
}



