const translations = {
    en: {
        title: "Share this Page",
        shareWebTitle: "Shared website title",
        shareTitle: "Share via ?",
        otherShareTitle: "Ohter Share via Navigator",
        share: "Share",
        invalid: "Invalid",
        alertTitle: "Invalid",
        successCopy: "Copy successful!",
        errorCopy: "Copy failed!",
        errorShare: "Share failed!",
        navigatorShareSuccess: "Thank you for sharing",
        navigatorShareCancel: "You have canceled sharing this message",
        unsupported: "Unsupported browser",
        facebook: "Facebook",
        line: "Line",
        wechat: "WeChat",
        skype: "Skype",
        telegram: "Telegram",
        whatsapp: "WhatsApp",
        x: "X",
        linkedin: "LinkedIn",
    },
    "zh-TW": {
        title: "分享此頁面",
        shareWebTitle: "分享的網站標題",
        shareTitle: "分享通過？",
        otherShareTitle: "通過導航器方式分享",
        share: "分享",
        invalid: "不合法",
        alertTitle: "不合法",
        successCopy: "複製成功！",
        errorCopy: "複製失敗！",
        errorShare: "分享失敗!",
        navigatorShareSuccess: "感謝你的的分享",
        navigatorShareCancel: "您已取消分享此訊息",
        unsupported: "不支援的瀏覽器",
        facebook: "臉書",
        line: "LINE",
        wechat: "微信",
        skype: "Skype",
        telegram: "Telegram",
        whatsapp: "WhatsApp",
        x: "X",
        linkedin: "LinkedIn",
    },
    "zh-CN": {
        title: "分享此页面",
        shareWebTitle: "分享的网站标题",
        shareTitle: "分享通过？",
        otherShareTitle: "通过导航器方式分享",
        share: "分享",
        invalid: "非法的",
        alertTitle: "非法的",
        successCopy: "拷贝成功！",
        errorCopy: "拷贝失败！",
        errorShare: "分享失败!",
        navigatorShareSuccess: "感谢你的分享",
        navigatorShareCancel: "您已取消分享此消息",
        unsupported: "不支持的浏览器",
        facebook: "脸书",
        line: "LINE",
        wechat: "微信",
        skype: "Skype",
        telegram: "Telegram",
        whatsapp: "WhatsApp",
        x: "X",
        linkedin: "LinkedIn",
    }
};

//設定語言
function setLanguage(lang) {
    const elements = document.querySelectorAll('.share-text');
    const translation = translations[lang] || translations['en'];

    //標體
    document.getElementById('title').textContent = translation.title;

    //分享標題
    document.getElementById('web-title').textContent = translation.shareWebTitle;
    document.getElementById('share-title').textContent = translation.shareTitle;

    document.getElementById('other-share-title').textContent = translation.otherShareTitle;

    document.getElementById('other-share-btn-txt').textContent = translation.share;

    //alert
    if (document.getElementById('alert-container-title')) {
        // 使用正則表達式擷取 "Invalid" 後的訊息
        const errorMessage = document.getElementById('alert-container-title').textContent;
        const match = errorMessage.match(/Invalid (.*)/);

        let extractedMessage = match ? match[1] : errorMessage;

        document.getElementById('alert-container-title').textContent = translation.alertTitle + extractedMessage;
    }

    //分享按鈕
    elements.forEach((el, index) => {
        //const keys = Object.keys(translation);
        //el.textContent = translation[keys[index + 1]];

        const key = el.getAttribute('aria-label');
        el.setAttribute('data-bs-original-title', translation[key]);
    });
}

//檢測語言
function detectLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    if (translations[lang]) {
        document.getElementById('language-select').value = lang;
        setLanguage(lang);
    } else {
        setLanguage('en');
    }
}

// 檢查 URL 是否有效的函數
function isValidUrl(url) {
    // 避免在 chrome:// 和 chrome-extension:// 頁面上執行腳本
    return !url.startsWith('chrome://') && !url.startsWith('chrome-extension://');
  }
  

//設定當前URL
function setUrlText() {
    getCurrentWebUrl(function (error, url) {
        document.getElementById('url-text').value = url;
    });
}

//設定當前title
function setUrlTitle() {
    getCurrentWebTitle(function (error, title) {
        document.getElementById('url-title').textContent = title;
    });
}

//得到當前的URL
function getCurrentWebUrl(callback) {
    const promise = new Promise((resolve, reject) => {
        if (typeof browser !== 'undefined') {
            // Firefox and Edge
            browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
                
                if (isValidUrl(tabs[0].url)){
                    resolve(tabs[0].url);
                } else {
                    
                    resolve(getParamsInfo(tabs[0]).url);
                }
            });
        } else if (typeof chrome !== 'undefined') {
            // Chrome
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
              
                if (isValidUrl(tabs[0].url)){
                    resolve(tabs[0].url);
                } else {
                    resolve(getParamsInfo(tabs[0]).url);
                }
               
            });
        } else {
            const lang = document.getElementById('language-select').value;
            const translation = translations[lang] || translations['en'];
            reject(new Error(translation.unsupported));
        }

    });

    if (callback) {
        promise.then(result => callback(null, result)).catch(error => callback(error));
    } else {
        return promise;
    }
}



//得到當前的網站標題
function getCurrentWebTitle(callback) {
    const promise = new Promise((resolve, reject) => {
        if (typeof browser !== 'undefined') {
            // Firefox and Edge
            browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
                if (isValidUrl(tabs[0].url)){
                    resolve(tabs[0].title);
                } else {
                    resolve(getParamsInfo(tabs[0]).title);
                }
                
            });
        } else if (typeof chrome !== 'undefined') {
            // Chrome
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                if (isValidUrl(tabs[0].url)){
                    resolve(tabs[0].title);
                } else {
                    resolve(getParamsInfo(tabs[0]).title);
                }
            });
        } else {
            const lang = document.getElementById('language-select').value;
            const translation = translations[lang] || translations['en'];
            reject(new Error(translation.unsupported));
        }

    });

    if (callback) {
        promise.then(result => callback(null, result)).catch(error => callback(error));
    } else {
        return promise;
    }
}

//取得傳遞的網站資訊
function getParamsInfo(tabs){
    const params = new URLSearchParams(window.location.search);
    let title = params.get('title');
    let url = params.get('url');

    if (!url || url == 'undefined') {
        url = tabs.url;
    }

    if (!title || title == 'undefined') {
        title = tabs.title;
    }

    const webInfo = {
        title: title,
        url: url
    }

    return webInfo;
}

//分享
function shareViaApp(app) {
    getCurrentWebUrl(function (error, url) {
        if (!url || !url.startsWith('http') || !isValidUrl(url)) {
            const lang = document.getElementById('language-select').value;
            const translation = translations[lang] || translations['en'];
            const title = translation.errorShare;
            let message = '<p>' + translation.invalid + ' URL:</p><p>' + url + '</p>';
            showBaseSwalAlert(title, message, "error");
            //showAlert('Invalid URL:' + url);
            return;
        }

        let shareUrl = '';

        switch (app) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'line':
                shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(url)}`;
                break;
            case 'wechat':
                showQRCode(url);
                return;
            case 'skype':
                shareUrl = `https://web.skype.com/share?url=${encodeURIComponent(url)}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
                break;
            case 'x':
                shareUrl = `https://twitter.com/share?url=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank');
    });
}

async function shareViaNavigator() {
    
    const lang = document.getElementById('language-select').value;
    const translation = translations[lang] || translations['en'];   
    const title = translation.errorShare;

    try {  
                   
        const WebUrl = await new Promise((resolve, reject) => {
            getCurrentWebUrl(function (error, url) {
                if (!url || !url.startsWith('http')) {
                    let message = '<p>' + translation.invalid + ' URL:</p><p>' + url + '</p>';
                    reject(new Error(message)); 
                    return;                   
                } 
                
                resolve(url);
                               
            });
            
        });

        const [webTitle] = await Promise.all([
            getCurrentWebTitle()
        ]);

        const shareData = {
            title: webTitle,
            url: WebUrl
        };
        
        // 在這裡可以使用 shareData，例如調用其他函數
        try {
            // 使用 Web Share API
            await navigator.share(shareData);
            result.textContent = translation.navigatorShareSuccess;
        } catch (error) {
            // 使用者拒絕分享或發生錯誤
            const { name, message } = error;
            if (name === "AbortError") {
                result.textContent = translation.navigatorShareCancel;
            } else {
                result.textContent = error;
                showBaseSwalAlert(title, error, "error");
            }
        }
    } catch (error) {   
        const { name, message } = error;
        const errorMessage = message;
        const match = errorMessage.match(/URL/);
        if (match){
            showBaseSwalAlert(title, errorMessage, "error");
        }         
        //console.error('Error retrieving web info:', error);
    }
}

function shareNotSupportNavigator() {
    new ClipboardJS('.url-copy');    
}

//顯示QRcode
function showQRCode(url) {
    const qrCodeContainer = document.createElement('div');
    qrCodeContainer.style.position = 'fixed';
    qrCodeContainer.style.top = '0';
    qrCodeContainer.style.left = '0';
    qrCodeContainer.style.width = '100%';
    qrCodeContainer.style.height = '100%';
    qrCodeContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    qrCodeContainer.style.display = 'flex';
    qrCodeContainer.style.alignItems = 'center';
    qrCodeContainer.style.justifyContent = 'center';
    qrCodeContainer.style.zIndex = '1000';

    const qrCodeImage = document.createElement('img');
    qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
    qrCodeImage.style.border = '5px solid white';

    qrCodeContainer.appendChild(qrCodeImage);
    document.body.appendChild(qrCodeContainer);

    qrCodeContainer.addEventListener('click', () => {
        document.body.removeChild(qrCodeContainer);
    });
}

function showBaseSwalAlert(title, message, icon) {
    Swal.fire({
        title: title,
        html: message,
        icon: icon,
    });
}

//顯示警告
function showAlert(message) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
      <div class="alert alert-danger alert-dismissible" role="alert">
        <div class="d-flex">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
          </div>
          <div id="alertTitle">
          <span id="alert-container-title">${message}</span>
          </div>
        </div>
        <a class="btn-close" data-bs-dismiss="alert" aria-label="close"></a>
        </div>
      </div>
    `;
}

//複製
var clipboard = new ClipboardJS('.url-copy');

clipboard.on('success', function (e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();

    const lang = document.getElementById('language-select').value;
    const translation = translations[lang] || translations['en'];

    Swal.fire({
        title: translation.successCopy,
        icon: "success",
    });
});

clipboard.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);

    const lang = document.getElementById('language-select').value;
    const translation = translations[lang] || translations['en'];

    Swal.fire({
        title: translation.errorCopy,
        icon: "error",
    });
});

//視窗載入時
window.onload = function () {
    //console.log("Page is fully loaded");
    // Additional code to execute when the page loads

};

//元件
document.getElementById('language-select').addEventListener('change', (event) => {
    setLanguage(event.target.value);
});

//DOM載入啟動項
document.addEventListener('DOMContentLoaded', () => {
    detectLanguage();
    setUrlTitle();
    setUrlText();
});

document.getElementById('facebook-share').addEventListener('click', () => {
    shareViaApp('facebook');
});

document.getElementById('line-share').addEventListener('click', () => {
    shareViaApp('line');
});

document.getElementById('wechat-share').addEventListener('click', () => {
    shareViaApp('wechat');
});

document.getElementById('skype-share').addEventListener('click', () => {
    shareViaApp('skype');
});

document.getElementById('telegram-share').addEventListener('click', () => {
    shareViaApp('telegram');
});

document.getElementById('whatsapp-share').addEventListener('click', () => {
    shareViaApp('whatsapp');
});

document.getElementById('x-share').addEventListener('click', () => {
    shareViaApp('x');
});

document.getElementById('linkedin-share').addEventListener('click', () => {
    shareViaApp('linkedin');
});

document.getElementById('ohter-share').addEventListener('click', async () => {
    // 判斷瀏覽器是否支援 Web Share API
    if (navigator.share) {
        shareViaNavigator();   
    } else {
        shareNotSupportNavigator();
    }
});
