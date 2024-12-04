document.addEventListener('DOMContentLoaded', function() {
    // 檢測用戶瀏覽器語言
    const userLang = navigator.language || navigator.userLanguage;
    let currentLang = 'zh-CN'; // 默認語言

    // 根據用戶瀏覽器語言設置初始語言
    if (userLang.includes('zh')) {
        currentLang = userLang.includes('TW') || userLang.includes('HK') ? 'zh-TW' : 'zh-CN';
    } else {
        currentLang = 'en';
    }

    // 設置語言選擇器的初始值
    document.getElementById('languageSelect').value = currentLang;

    // 更新頁面文本的函數
    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.');
            let value = languages[lang];
            for (const k of keys) {
                value = value[k];
            }
            element.textContent = value;
        });

        // 更新 placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const keys = key.split('.');
            let value = languages[lang];
            for (const k of keys) {
                value = value[k];
            }
            element.placeholder = value;
        });

        // 更新頁面標題
        document.title = languages[lang].title;
    }

    // 監聽語言選擇器變化
    document.getElementById('languageSelect').addEventListener('change', function(e) {
        updateLanguage(e.target.value);
        // 可選：保存用戶語言偏好
        localStorage.setItem('preferredLanguage', e.target.value);
    });

    // 初始化語言
    const savedLang = localStorage.getItem('preferredLanguage');
    updateLanguage(savedLang || currentLang);
}); 