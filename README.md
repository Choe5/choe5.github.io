# ChoeChoeStudio 網站

https://choe5.github.io — ChoeChoeStudio 的工作室首頁（中英雙語），列出上架 Google Play 的 App、隱私權政策與聯絡信箱。

- `index.html`：整個網站（CSS、JS 都在裡面）。App 清單在檔案下方的 `APPS` 陣列，新增 App 時在那裡加一筆，圖示放 `images/apps/<套件名>.webp`。
- `favicon.svg`：網站圖示。

## ⚠️ 不能刪的檔案

- `app-ads.txt`、`ads.txt`：**AdMob 驗證用**。所有 App 在 Google Play 填的「開發人員網站」都是 `https://choe5.github.io`，AdMob 會讀這裡的 `app-ads.txt`；刪掉或改錯，全部 App 的 AdMob 驗證都會失敗。
