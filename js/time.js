class TimeDisplay {
    constructor() {
        this.timeElement = document.getElementById('current-time');
        this.dateElement = document.getElementById('current-date');
        this.initTime();
    }

    initTime() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        
        // 更新時間
        this.timeElement.textContent = now.toLocaleTimeString();
        
        // 更新日期
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long' 
        };
        this.dateElement.textContent = now.toLocaleDateString(undefined, options);
    }
} 