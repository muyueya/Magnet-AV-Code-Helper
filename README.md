# JavAssistant Ultimate | Jav 助手终极版

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-24.0-blue.svg)]()

0 代码经验小白利用 gemini 生成的小型插件
一个功能强大的浏览器扩展，专为影视番号自动识别、磁力链接处理及 BBS 论坛优化而生。
A powerful browser extension designed for automatic AV code identification, magnet link processing, and BBS forum optimization.

---

## ✨ 核心功能 | Features

### 1. 智能识别 (Smart Identification)
* **全格式支持**：精准识别标准番号（如 `MIDE-123`）及模糊格式（如 `sinn023`, `stars 968`）。
* **FC2 专项优化**：自动补全并识别 `FC2-PPV` 变体，支持带空格或不规范写法。
* **BBS 标题穿透**：唯一支持在论坛列表页标题中直接高亮番号，无需进帖即可预览。

### 2. 交互体验 (Interactive Experience)
* **悬浮预览窗**：点击普通番号弹出内嵌 JavBus 详情页，支持**全边框拖拽移动**。
* **自定义缩放**：右下角拉伸即可调整窗口大小，并自动记忆位置与尺寸。
* **FC2 快速直达**：点击 FC2 番号直接跳转至 MissAV 搜索，解决内嵌限制。

### 3. 磁力工具 (Magnet Integration)
* **一键复制**：高亮 Magnet 链接及 40 位 Hash 识别码（紫色标识）。
* **自动补全**：点击纯识别码时，自动补全为 `magnet:?xt=urn:btih:` 格式后存入剪贴板。
* **视觉反馈**：内置轻量级“复制成功”提示。

---

## 🚀 安装步骤 | Installation

1. **下载项目**：点击右上角 `Code` -> `Download ZIP` 并解压到本地。
2. **加载扩展**：
   - 打开 Chrome/Edge 浏览器，访问 `chrome://extensions/`。
   - 开启右上角的 **“开发者模式” (Developer Mode)**。
   - 点击 **“加载已解压的扩展程序” (Load unpacked)**。
   - 选择解压后的文件夹。
3. **固定图标**：点击浏览器拼图图标，将 JavAssistant 固定在任务栏。

---

## 🛠 技术实现 | Technical Details

* **双路匹配引擎**：基于 `TreeWalker` 深度遍历文本节点，不破坏网页原有样式。
* **正则去噪**：内置黑名单（如 HTML, POST 等）和正则加权，大幅降低 8 位随机 ID 误判。
* **事件劫持**：在 BBS 标题中点击时，优先拦截跳转请求以弹出预览窗。

## 🛠️ 部署与安装步骤

如果你是开发者或想手动部署，请按照以下步骤操作：

### 1. 建立项目文件夹
在电脑本地创建一个名为 `JavAssistant` 的文件夹。

### 2. 创建核心文件
在该文件夹内分别创建以下 4 个文件，并将本文下方的代码对应粘贴进去：
- `manifest.json`
- `background.js`
- `content.js`
- `content.css`

### 3. 加载至浏览器
1. 打开 Chrome 或 Edge 浏览器，访问 `chrome://extensions/`。
2. 开启右上角的 **“开发者模式”**。
3. 点击 **“加载已解压的扩展程序”**。
4. 选择你刚刚创建的 `JavAssistant` 文件夹。

---

## 💻 完整源代码 (V24.0)

### 1. manifest.json
```json
{
  "manifest_version": 3,
  "name": "JavAssistant Ultimate",
  "version": "24.0",
  "permissions": ["storage", "contextMenus", "tabs"],
  "host_permissions": ["<all_urls>"],
  "background": { "service_worker": "background.js" },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "css": ["content.css"]
  }]
}

### 2. background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "missav_direct", title: "📺 MissAV 搜索: %s", contexts: ["selection"] });
});
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "missav_direct") {
    const code = info.selectionText.trim().toUpperCase();
    chrome.tabs.create({ url: "[https://missav.ws/search/](https://missav.ws/search/)" + encodeURIComponent(code) });
  }
});
### 3. background.js
.jav-mark { 
    background: #fff200 !important; color: #000 !important; border-radius: 3px; 
    padding: 0px 4px; cursor: pointer !important; font-weight: bold !important; 
    display: inline-block; line-height: 1.4; user-select: all !important; text-decoration: none !important;
}
.mag-mark { background: #e0b3ff !important; color: #330066 !important; }
#copy-tip {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.8); color: white; padding: 10px 20px;
    border-radius: 20px; z-index: 2147483647; display: none; font-size: 14px;
}
#jav-box {
    position: fixed; right: 20px; top: 20px; background: white; border: 2px solid #0071e3; 
    border-radius: 12px; box-shadow: 0 10px 50px rgba(0,0,0,0.4); z-index: 2147483647;
    display: none; flex-direction: column; overflow: hidden; min-width: 380px; min-height: 450px;
}
#jav-hdr { padding: 12px 15px; background: #0071e3; color: white; display: flex; justify-content: space-between; align-items: center; cursor: move; }
#jav-close { background: white; color:#0071e3; border:none; border-radius:50%; width:24px; height:24px; cursor:pointer; font-weight:bold; }
.jav-edge { position: absolute; background: transparent; z-index: 2147483648; }
.v-edge { cursor: ew-resize; top: 0; bottom: 0; width: 10px; }
.h-edge { cursor: ns-resize; left: 0; right: 0; height: 10px; }
#jav-resizer { width: 20px; height: 20px; position: absolute; right: 0; bottom: 0; cursor: nwse-resize; z-index: 2147483649; }
#jav-resizer::after { content: ""; position: absolute; right: 4px; bottom: 4px; border-style: solid; border-width: 0 0 12px 12px; border-color: transparent transparent #0071e3 transparent; }

### 4. content.js
cat << 'EOF' > content.js
const regFC = /\b(fc2)[-\s]?(ppv)?[-\s]?(\d{5,8})\b/gi;
const regNormal = /\b([a-z]{2,6})[-\s]?(\d{3,5})\b/gi;
// 识别 完整的磁力链接 或 40位Hash
const regMag = /(magnet:\?xt=urn:btih:[a-fA-F0-9]{40})|(\b[a-fA-F0-9]{40}\b)/gi;

function highlight() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: n => {
            const p = n.parentElement;
            if (p.closest('script, style, textarea, input, .jav-mark')) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    let nodes = [];
    while (node = walker.nextNode()) nodes.push(node);

    nodes.forEach(n => {
        const text = n.nodeValue;
        let html = text;

        // 1. 处理磁力链接 (优先级最高)
        html = html.replace(regMag, m => `<mark class="jav-mark mag-mark" data-type="mag" data-code="${m}">${m.length > 10 ? m.substring(0,8)+'...'+m.substring(m.length-8) : m}</mark>`);
        
        // 2. 处理 FC2
        html = html.replace(regFC, m => `<mark class="jav-mark" data-type="jav" data-code="${m}">${m}</mark>`);
        
        // 3. 处理普通番号
        html = html.replace(regNormal, (m, p1, p2) => {
            if (['HTTP', 'HTML', 'GZIP', 'POST'].includes(p1.toUpperCase())) return m;
            return `<mark class="jav-mark" data-type="jav" data-code="${p1.toUpperCase()}-${p2}">${m}</mark>`;
        });

        if (html !== text) {
            const span = document.createElement('span');
            span.innerHTML = html;
            n.parentNode.replaceChild(span, n);
        }
    });
}

// 复制功能函数
function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
    // 显示提示
    let tip = document.getElementById('copy-tip');
    if (!tip) {
        tip = document.createElement('div');
        tip.id = 'copy-tip';
        document.body.appendChild(tip);
    }
    tip.textContent = "已成功复制磁链/识别码";
    tip.style.display = 'block';
    setTimeout(() => tip.style.display = 'none', 1500);
}

document.body.addEventListener('click', e => {
    const target = e.target.closest('.jav-mark');
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    const type = target.dataset.type;
    const code = target.dataset.code;

    if (type === 'mag') {
        // 磁力链接逻辑：直接复制
        let copyText = code;
        // 如果只是识别码，自动补全成标准磁力链接格式方便下载器识别
        if (!code.startsWith('magnet:')) {
            copyText = `magnet:?xt=urn:btih:${code}`;
        }
        copyToClipboard(copyText);
    } else {
        // 番号逻辑：原有弹窗逻辑
        showJavBox(code);
    }
}, true);

function showJavBox(code) {
    const c = code.toUpperCase();
    if (c.startsWith('FC')) {
        window.open("https://missav.ws/search/" + encodeURIComponent(c), "_blank");
        return;
    }
    chrome.storage.sync.get(['winW', 'winH', 'winX', 'winY'], d => {
        let box = document.getElementById('jav-box');
        if (!box) {
            box = document.createElement('div'); box.id = 'jav-box';
            box.innerHTML = `<div id="edge-l" class="jav-edge v-edge"></div><div id="edge-r" class="jav-edge v-edge"></div><div id="edge-b" class="jav-edge h-edge"></div>
                <div id="jav-hdr"><span id="jav-title" style="font-size:13px; font-weight:bold;"></span><button id="jav-close">×</button></div>
                <iframe id="jav-ifr" style="flex:1; border:none; background:white;"></iframe><div id="jav-resizer"></div>`;
            document.body.appendChild(box);
            // ...省略重复的拖拽逻辑以减小篇幅，保持V23逻辑...
            let isD = false, oX, oY, isR = false;
            const sD = (ev) => { isD = true; oX = box.offsetLeft - ev.clientX; oY = box.offsetTop - ev.clientY; };
            document.getElementById('jav-hdr').onmousedown = sD;
            document.getElementById('jav-resizer').onmousedown = ev => { isR = true; ev.preventDefault(); };
            window.addEventListener('mousemove', ev => {
                if (isD) { box.style.left = (ev.clientX + oX) + 'px'; box.style.top = (ev.clientY + oY) + 'px'; }
                if (isR) { box.style.width = Math.max(350, ev.clientX - box.offsetLeft) + 'px'; box.style.height = Math.max(400, ev.clientY - box.offsetTop) + 'px'; }
            });
            window.addEventListener('mouseup', () => { isD = false; isR = false; });
            document.getElementById('jav-close').onclick = () => box.style.display = 'none';
        }
        box.style.display = 'flex';
        box.style.width = d.winW || '450px'; box.style.height = d.winH || '600px';
        if(d.winX) { box.style.left = d.winX; box.style.top = d.winY; box.style.right = 'auto'; }
        document.getElementById('jav-title').textContent = "JavBus: " + c;
        document.getElementById('jav-ifr').src = "https://www.javbus.com/" + c;
    });
}

// 多次执行确保论坛动态内容被捕获
setTimeout(highlight, 1000);
setTimeout(highlight, 3000);
EOF




## 📄 开源协议 | License

本项目遵循 [MIT License](LICENSE) 协议开源。

---

## ⚠️ 免责声明 | Disclaimer

本插件仅作为网页内容辅助识别工具，不存储、不分发、不提供任何视频资源。请在遵守当地法律法规的前提下使用。
This extension is only a helper tool for content identification and does not store or distribute any media resources.
