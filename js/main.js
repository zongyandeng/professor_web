document.addEventListener('DOMContentLoaded', () => {
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

    // 2. 研究成果頁面 Tab 切換邏輯
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
                }
            });
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
