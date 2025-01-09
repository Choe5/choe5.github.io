class NavigationManager {
    constructor() {
        this.data = this.loadData();
        this.initializeEventListeners();
        this.updatePreview();
        this.updateCategorySelect();
        window.navigationManager = this;
    }

    loadData() {
        const savedData = localStorage.getItem('navigationData');
        return savedData ? JSON.parse(savedData) : {
            categories: []
        };
    }

    saveData() {
        localStorage.setItem('navigationData', JSON.stringify(this.data));
        this.updatePreview();
        this.updateCategorySelect();
    }

    addCategory(title) {
        this.data.categories.push({
            title: title,
            tools: []
        });
        this.saveData();
    }

    addTool(categoryIndex, tool) {
        this.data.categories[categoryIndex].tools.push(tool);
        this.saveData();
    }

    deleteCategory(index) {
        this.data.categories.splice(index, 1);
        this.saveData();
    }

    deleteTool(categoryIndex, toolIndex) {
        this.data.categories[categoryIndex].tools.splice(toolIndex, 1);
        this.saveData();
    }

    updatePreview() {
        const previewContent = document.getElementById('previewContent');
        previewContent.innerHTML = this.data.categories.map((category, categoryIndex) => `
            <div class="preview-category">
                <h3>
                    ${category.title}
                    <button class="delete-btn" onclick="navigationManager.deleteCategory(${categoryIndex})">删除分类</button>
                </h3>
                <div class="preview-tools">
                    ${category.tools.map((tool, toolIndex) => `
                        <div class="tool-item">
                            <h4>${tool.name}</h4>
                            <p>${tool.description}</p>
                            <a href="${tool.url}" target="_blank">訪問</a>
                            <button class="delete-btn" onclick="navigationManager.deleteTool(${categoryIndex}, ${toolIndex})">删除</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    updateCategorySelect() {
        const select = document.getElementById('categorySelect');
        select.innerHTML = '<option value="">选择分类</option>' + 
            this.data.categories.map((category, index) => 
                `<option value="${index}">${category.title}</option>`
            ).join('');
    }

    initializeEventListeners() {
        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('categoryTitle');
            this.addCategory(titleInput.value);
            titleInput.value = '';
        });

        document.getElementById('toolForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const categoryIndex = document.getElementById('categorySelect').value;
            const tool = {
                name: document.getElementById('toolName').value,
                description: document.getElementById('toolDesc').value,
                url: document.getElementById('toolUrl').value,
                tags: document.getElementById('toolTags').value.split(',').map(tag => tag.trim())
            };
            this.addTool(categoryIndex, tool);
            e.target.reset();
        });

        const exportButton = document.createElement('button');
        exportButton.textContent = '导出数据';
        exportButton.className = 'export-btn';
        exportButton.onclick = () => this.exportData();
        document.querySelector('.admin-panel').appendChild(exportButton);
    }

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'navigation-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
} 