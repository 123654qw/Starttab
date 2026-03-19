// 默认配置
let config = {
showLogo: true,
showShortcuts: false,
randomWallpaper: false,
lockedWallpaper: null, // 新增：锁定的壁纸
defaultSearchEngine: 'bing'
};

// 捷径数组
let shortcuts = [
{ name: '百度', url: 'https://www.baidu.com', icon: 'https://www.baidu.com/favicon.ico' },
{ name: 'Google', url: 'https://www.google.com', icon: 'https://www.google.com/favicon.ico' },
{ name: 'GitHub', url: 'https://www.github.com', icon: 'https://www.github.com/favicon.ico' }
];

// 搜索引擎配置
const searchEngines = {
bing: {
name: '必应',
url: 'https://www.bing.com/search?q='
},
baidu: {
name: '百度',
url: 'https://www.baidu.com/s?wd='
},
so: {
name: '360搜索',
url: 'https://www.so.com/s?q='
}
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
loadConfig();
loadShortcuts();
initializeEventListeners();
updateUIBasedOnConfig();
loadRandomBackgroundImage();

// 设置默认搜索引擎按钮状态
setActiveEngineButton(config.defaultSearchEngine);

// 每隔一段时间更换背景图片（如果启用了随机壁纸）
if (config.randomWallpaper) {
setInterval(loadRandomBackgroundImage, 30000); // 每30秒更换一次
}

// 确保锁定壁纸复选框状态正确
document.getElementById('lock-wallpaper').checked = config.lockedWallpaper !== null;
});

// 设置激活的搜索引擎按钮
function setActiveEngineButton(engine) {
// 先清除所有按钮的active类
document.querySelectorAll('.engine-btn').forEach(btn => {
btn.classList.remove('active');
});

// 为指定引擎的按钮添加active类
const activeBtn = document.querySelector(`.engine-btn[data-engine="${engine}"]`);
if (activeBtn) {
activeBtn.classList.add('active');
currentEngine = engine;
}
}

// 加载配置
function loadConfig() {
const savedConfig = localStorage.getItem('starttab_config');
if (savedConfig) {
config = { ...config, ...JSON.parse(savedConfig) };
}
}

// 保存配置
function saveConfig() {
localStorage.setItem('starttab_config', JSON.stringify(config));
}

// 加载捷径
function loadShortcuts() {
const savedShortcuts = localStorage.getItem('starttab_shortcuts');
if (savedShortcuts) {
shortcuts = JSON.parse(savedShortcuts);
}
renderShortcuts();
}

// 保存捷径
function saveShortcuts() {
localStorage.setItem('starttab_shortcuts', JSON.stringify(shortcuts));
}

// 初始化事件监听器
function initializeEventListeners() {
// 搜索表单提交
document.getElementById('search-form').addEventListener('submit', handleSearch);

// 搜索引擎按钮点击
const engineButtons = document.querySelectorAll('.engine-btn');
engineButtons.forEach(button => {
button.addEventListener('click', function() {
// 移除所有按钮的active类
engineButtons.forEach(btn => btn.classList.remove('active'));
// 给当前按钮添加active类
this.classList.add('active');
// 更新当前搜索引擎
currentEngine = this.dataset.engine;
});
});

// 设置按钮点击
document.getElementById('settings-btn').addEventListener('click', toggleSettingsPanel);

// 保存设置按钮
document.getElementById('save-settings').addEventListener('click', saveSettings);

// 添加快捷方式按钮
document.getElementById('add-shortcut-btn').addEventListener('click', openAddShortcutModal);

// 关闭模态框
document.querySelector('.close').addEventListener('click', closeAddShortcutModal);
window.addEventListener('click', function(event) {
const modal = document.getElementById('add-shortcut-modal');
if (event.target === modal) {
closeAddShortcutModal();
}
});

// 提交添加快捷方式表单
document.getElementById('add-shortcut-form').addEventListener('submit', addShortcut);

// 右键点击快捷方式栏
document.getElementById('shortcuts-bar').addEventListener('contextmenu', function(e) {
e.preventDefault();
openAddShortcutModal();
});
}

// 当前选中的搜索引擎
let currentEngine = 'bing';

// 处理搜索
function handleSearch(e) {
e.preventDefault();

const searchInput = document.getElementById('search-input');

const query = searchInput.value.trim();
const selectedEngine = currentEngine;

if (!query) return;

if (selectedEngine === 'url') {
// 如果是纯网址模式，检查是否是有效URL
let url = query;
if (!/^https?:\/\//i.test(url)) {
url = 'https://' + url;
}

try {
new URL(url);
window.open(url, '_blank');
} catch (error) {
alert('请输入有效的网址');
}
} else {
// 搜索引擎模式
const engineUrl = searchEngines[selectedEngine].url;
window.open(engineUrl + encodeURIComponent(query), '_blank');
}

// 清空搜索框
searchInput.value = '';
}

// 切换设置面板
function toggleSettingsPanel() {
const panel = document.getElementById('settings-panel');
panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

// 获取当前背景图片
function getCurrentBackgroundImage() {
const backgroundImageStyle = document.getElementById('background-image').style.backgroundImage;
if (backgroundImageStyle) {
// 提取URL部分
const match = backgroundImageStyle.match(/url\("?(.*?)"?\)/);
if (match) {
return match[1];
}
}
return null;
}

// 保存设置
function saveSettings() {
config.showLogo = document.getElementById('show-logo').checked;
config.showShortcuts = document.getElementById('show-shortcuts').checked;
config.randomWallpaper = document.getElementById('random-wallpaper').checked;
config.lockedWallpaper = document.getElementById('lock-wallpaper').checked ? getCurrentBackgroundImage() : null;
config.defaultSearchEngine = document.getElementById('default-search-engine').value;

saveConfig();
updateUIBasedOnConfig();

// 设置默认搜索引擎按钮
setActiveEngineButton(config.defaultSearchEngine);

// 隐藏设置面板
document.getElementById('settings-panel').style.display = 'none';
}

// 更新UI基于配置
function updateUIBasedOnConfig() {
// 更新Logo显示
document.getElementById('logo-container').style.opacity = config.showLogo ? '1' : '0';

// 更新捷径栏显示
document.getElementById('shortcuts-container').style.opacity = config.showShortcuts ? '1' : '0';

// 更新随机壁纸
if (config.randomWallpaper) {
document.getElementById('background-image').style.display = 'block';

// 如果有锁定的壁纸，使用锁定的壁纸；否则随机选择
if (config.lockedWallpaper) {
document.getElementById('background-image').style.backgroundImage = `url('${config.lockedWallpaper}')`;
} else {
loadRandomBackgroundImage();
}
} else {
document.getElementById('background-image').style.display = 'none';
}

// 更新锁定壁纸复选框状态
document.getElementById('lock-wallpaper').checked = config.lockedWallpaper !== null;

// 设置默认搜索引擎按钮
setActiveEngineButton(config.defaultSearchEngine);
}

// 加载随机背景图片
function loadRandomBackgroundImage() {
if (!config.randomWallpaper) return;

fetch('list_images.php')
.then(response => response.json())
.then(images => {
if (images.length > 0) {
const randomImage = images[Math.floor(Math.random() * images.length)];
document.getElementById('background-image').style.backgroundImage = `url('${randomImage}')`;
} else {
// 如果没有找到图片，隐藏背景元素
document.getElementById('background-image').style.display = 'none';
}
})
.catch(error => {
console.error('加载背景图片失败:', error);
// 出错时隐藏背景元素
document.getElementById('background-image').style.display = 'none';
});
}

// 渲染捷径
function renderShortcuts() {
const shortcutsBar = document.getElementById('shortcuts-bar');
shortcutsBar.innerHTML = '';

shortcuts.forEach(shortcut => {
const shortcutElement = document.createElement('div');
shortcutElement.className = 'shortcut-item';
shortcutElement.dataset.url = shortcut.url;

shortcutElement.innerHTML = `
<img src="${shortcut.icon}" alt="${shortcut.name}" class="shortcut-icon" onerror="this.src='https://www.google.com/s2/favicons?domain='+new URL('${shortcut.url}').hostname+'&sz=32'; this.onerror=null;">
<span>${shortcut.name}</span>
`;

shortcutElement.addEventListener('click', () => {
window.open(shortcut.url, '_blank');
});

shortcutsBar.appendChild(shortcutElement);
});

// 添加加号按钮
const addButton = document.createElement('div');
addButton.className = 'add-shortcut';
addButton.id = 'add-shortcut-btn';
addButton.textContent = '+';
addButton.addEventListener('click', openAddShortcutModal);
shortcutsBar.appendChild(addButton);
}

// 打开添加快捷方式模态框
function openAddShortcutModal() {
document.getElementById('add-shortcut-modal').style.display = 'block';
document.getElementById('shortcut-name').value = '';
document.getElementById('shortcut-url').value = '';
document.getElementById('shortcut-icon').value = '';
}

// 关闭添加快捷方式模态框
function closeAddShortcutModal() {
document.getElementById('add-shortcut-modal').style.display = 'none';
}

// 添加快捷方式
async function addShortcut(e) {
e.preventDefault();

const name = document.getElementById('shortcut-name').value.trim();
const url = document.getElementById('shortcut-url').value.trim();
const icon = document.getElementById('shortcut-icon').value.trim();

if (!name || !url) {
alert('请填写名称和网址');
return;
}

try {
new URL(url);
} catch (error) {
alert('请输入有效的网址');
return;
}

// 如果没有提供图标URL，则尝试获取网站的favicon
let iconUrl = icon;
if (!iconUrl) {
// 构造favicon URL
const parsedUrl = new URL(url);
iconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=32`;
}

shortcuts.push({
name: name,
url: url,
icon: iconUrl
});

saveShortcuts();
renderShortcuts();
closeAddShortcutModal();
}

// 获取网站图标
function getFaviconUrl(domain) {
return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}
