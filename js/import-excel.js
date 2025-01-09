class ExcelImporter {
    constructor() {
        if (!window.navigationManager) {
            console.error('NavigationManager not found, waiting...');
            // 等待 navigationManager 初始化
            const checkInterval = setInterval(() => {
                if (window.navigationManager) {
                    console.log('NavigationManager found, initializing...');
                    clearInterval(checkInterval);
                    this.initializeFileInput();
                }
            }, 100);
        } else {
            this.initializeFileInput();
        }
    }

    initializeFileInput() {
        console.log('Initializing file input...');

        // 創建容器
        const container = document.createElement('div');
        container.className = 'import-container';

        // 創建上傳區域
        const uploadSection = document.createElement('div');
        uploadSection.className = 'upload-section';

        // 添加標題
        const title = document.createElement('h2');
        title.textContent = '导入 Excel 数据';
        uploadSection.appendChild(title);

        // 創建表單
        const form = document.createElement('div');
        form.className = 'import-form';
        
        // 創建文件輸入元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xlsx, .xls';
        fileInput.className = 'excel-input';
        
        // 創建導入按鈕
        const importButton = document.createElement('button');
        importButton.textContent = '导入 Excel';
        importButton.className = 'import-btn';
        
        // 組裝元素
        form.appendChild(fileInput);
        form.appendChild(importButton);
        uploadSection.appendChild(form);
        container.appendChild(uploadSection);

        // 找到插入點
        const adminPanel = document.querySelector('.admin-panel');
        if (adminPanel) {
            adminPanel.insertBefore(container, adminPanel.firstChild);
            console.log('File input initialized successfully');
        } else {
            console.error('Admin panel not found');
        }

        // 處理文件導入
        importButton.addEventListener('click', () => {
            if (fileInput.files.length) {
                this.handleFile(fileInput.files[0]);
            } else {
                alert('请选择 Excel 文件');
            }
        });
    }

    async handleFile(file) {
        try {
            const data = await this.readExcelFile(file);
            this.importData(data);
        } catch (error) {
            console.error('Error importing file:', error);
            alert('導入失敗：' + error.message);
        }
    }

    async readExcelFile(file) {
        const reader = new FileReader();
        const result = await new Promise((resolve, reject) => {
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
        return result;
    }

    importData(data) {
        // 再次檢查 navigationManager
        if (!window.navigationManager) {
            alert('系統未初始化，請刷新頁面重試');
            return;
        }

        // 獲取現有數據
        const navigationManager = window.navigationManager;
        const existingData = navigationManager.data;

        try {
            // 處理每一行數據
            data.forEach(row => {
                if (!row['大标题'] || !row['网站名称']) {
                    console.warn('跳過無效數據行:', row);
                    return;
                }

                // 檢查分類是否存在
                let categoryIndex = existingData.categories.findIndex(
                    cat => cat.title === row['大标题']
                );

                // 如果分類不存在，創建新分類
                if (categoryIndex === -1) {
                    existingData.categories.push({
                        title: row['大标题'],
                        tools: []
                    });
                    categoryIndex = existingData.categories.length - 1;
                }

                // 添加工具到分類中
                existingData.categories[categoryIndex].tools.push({
                    name: row['网站名称'],
                    description: row['网站说明'] || '',
                    url: row['链接'] || '#',
                    tags: []
                });
            });

            // 保存更新後的數據
            navigationManager.saveData();
            alert('Excel 數據導入成功！');
        } catch (error) {
            console.error('導入數據時發生錯誤:', error);
            alert('導入失敗：' + error.message);
        }
    }
} 