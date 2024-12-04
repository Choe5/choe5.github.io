class WeatherTime {
    constructor() {
        this.timeElement = document.getElementById('current-time');
        this.dateElement = document.getElementById('current-date');
        this.weatherIcon = document.getElementById('weather-icon');
        this.temperature = document.getElementById('temperature');
        this.weatherDesc = document.getElementById('weather-desc');
        
        this.initTime();
        this.initWeather();
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

    async initWeather() {
        try {
            // 獲取用戶位置
            const position = await this.getCurrentPosition();
            
            // 使用 OpenWeatherMap API 獲取天氣
            const apiKey = 'YOUR_API_KEY'; // 需要替換成您的 API key
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`
            );
            
            if (!response.ok) throw new Error('Weather data fetch failed');
            
            const data = await response.json();
            this.updateWeather(data);
            
            // 每30分鐘更新一次天氣
            setInterval(() => this.initWeather(), 30 * 60 * 1000);
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.weatherDesc.textContent = '天氣數據獲取失敗';
        }
    }

    updateWeather(data) {
        // 更新溫度
        this.temperature.textContent = `${Math.round(data.main.temp)}°C`;
        
        // 更新天氣描述
        this.weatherDesc.textContent = this.getWeatherDescription(data.weather[0].id);
        
        // 更新天氣圖標
        this.weatherIcon.textContent = this.getWeatherIcon(data.weather[0].id);
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    getWeatherDescription(weatherId) {
        // 根據天氣代碼返回中文描述
        const weatherMap = {
            200: '雷雨',
            300: '毛毛雨',
            500: '雨',
            600: '雪',
            700: '霧',
            800: '晴',
            801: '多雲',
            // ... 可以添加更多天氣代碼
        };
        
        const firstDigit = Math.floor(weatherId / 100);
        return weatherMap[firstDigit * 100] || '未知';
    }

    getWeatherIcon(weatherId) {
        // 使用 emoji 作為天氣圖標
        const iconMap = {
            200: '⛈️',  // 雷雨
            300: '🌦️',  // 毛毛雨
            500: '🌧️',  // 雨
            600: '🌨️',  // 雪
            700: '🌫️',  // 霧
            800: '☀️',  // 晴
            801: '⛅',  // 多雲
            // ... 可以添加更多圖標
        };
        
        const firstDigit = Math.floor(weatherId / 100);
        return iconMap[firstDigit * 100] || '🌡️';
    }
} 