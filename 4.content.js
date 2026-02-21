const regFC = /\b(fc2)[-\s]?(ppv)?[-\s]?(\d{5,8})\b/gi;
const regNormal = /\b([a-z]{2,6})[-\s]?(\d{3,5})\b/gi;
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
    let node;
    while (node = walker.nextNode()) nodes.push(node);

    nodes.forEach(n => {
        const text = n.nodeValue;
        let html = text;

        html = html.replace(regMag, m => `<mark class="jav-mark mag-mark" data-type="mag" data-code="${m}">${m.length > 20 ? m.substring(0,8)+'...'+m.substring(m.length-8) : m}</mark>`);
        html = html.replace(regFC, m => `<mark class="jav-mark" data-type="jav" data-code="${m}">${m}</mark>`);
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

function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
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
        let copyText = code;
        if (!code.startsWith('magnet:')) {
            copyText = `magnet:?xt=urn:btih:${code}`;
        }
        copyToClipboard(copyText);
    } else {
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

setTimeout(highlight, 1000);
setTimeout(highlight, 3000);
