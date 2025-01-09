async function loadNavigationData() {
    try {
        // 優先從 localStorage 讀取數據
        const localData = localStorage.getItem('navigationData');
        if (localData) {
            const data = JSON.parse(localData);
            renderNavigation(data);
            return;
        }

        // 如果 localStorage 沒有數據，則從 JSON 文件讀取
        const response = await fetch('data/navigation.json');
        const data = await response.json();
        renderNavigation(data);
    } catch (error) {
        console.error('Error loading navigation data:', error);
    }
}

function renderNavigation(data) {
    const main = document.querySelector('main');
    const searchSection = document.getElementById('search');
    main.innerHTML = ''; // 清空現有內容
    main.appendChild(searchSection); // 保留搜索欄

    data.categories.forEach(category => {
        const section = document.createElement('section');
        section.className = 'category';
        section.innerHTML = `
            <h2>${category.title}</h2>
            <div class="card-container">
                ${category.tools.map(tool => `
                    <div class="card">
                        <div class="card-header">
                            <img src="${getFavicon(tool.url)}" alt="" class="site-icon">
                            <h3>${tool.name}</h3>
                        </div>
                        <p>${tool.description}</p>
                        <div class="card-footer">
                            <a href="${tool.url}" target="_blank" class="tag visit-link">訪問</a>
                            ${tool.tags.map(tag => `
                                <span class="tag">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        main.appendChild(section);
    });
}

// 獲取網站圖標的函數
function getFavicon(url) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (error) {
        return 'default-icon.png'; // 設置一個默認圖標
    }
}

document.addEventListener('DOMContentLoaded', loadNavigationData); 