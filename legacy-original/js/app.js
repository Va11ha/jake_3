// APP STATE MANAGEMENT
let items = [];
let users = [];
let presetTags = [];
let currentUser = null;
let searchQuery = '';
let activeTagFilter = 'all';

document.addEventListener("DOMContentLoaded", async () => {
  await loadState();
  renderAuthHeader();
  renderMainBar();
  renderCards();

  if (document.getElementById('usr-tag-selector')) {
    renderUserTagSelector();
  }
  if (document.getElementById('admin-tags-list')) {
    renderAdminTags();
    renderUsersTable();
    updateAdminStats();
  }
});

async function loadState() {
  const savedItems = localStorage.getItem('savevault_v4_items');
  const savedUsers = localStorage.getItem('savevault_v4_users');
  const savedTags = localStorage.getItem('savevault_v4_tags');

  if (savedItems && savedUsers && savedTags) {
    items = JSON.parse(savedItems);
    users = JSON.parse(savedUsers);
    presetTags = JSON.parse(savedTags);
  } else {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      items = data.items || [];
      users = data.users || [];
      presetTags = data.presetTags || ["#DragonsDogma2", "#ArchLinux", "#Mods", "#Proxy", "#GitHub"];
      saveState();
    } catch (e) {
      console.warn("Couldn't fetch data.json", e);
    }
  }

  const savedSession = localStorage.getItem('savevault_session');
  currentUser = savedSession ? JSON.parse(savedSession) : null;
}

function saveState() {
  localStorage.setItem('savevault_v4_items', JSON.stringify(items));
  localStorage.setItem('savevault_v4_users', JSON.stringify(users));
  localStorage.setItem('savevault_v4_tags', JSON.stringify(presetTags));
  if (currentUser) {
    localStorage.setItem('savevault_session', JSON.stringify(currentUser));
  } else {
    localStorage.removeItem('savevault_session');
  }
}

// AUTH & HEADER
function renderAuthHeader() {
  const container = document.getElementById('auth-container');
  if (!container) return;

  if (currentUser) {
    const isAdmin = currentUser.role === 'admin';
    container.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="text-xs font-mono px-2.5 py-1 rounded-full ${isAdmin ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-800 text-gray-300'}">
          <i class="fa-solid ${isAdmin ? 'fa-user-shield' : 'fa-user'} mr-1"></i>${currentUser.username}
        </span>
        <a href="${isAdmin ? 'admin.html' : 'user.html'}" class="text-xs px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-all">
          Кабинет
        </a>
        <button onclick="handleLogout()" class="text-xs p-2 text-gray-400 hover:text-rose-400 transition-colors" title="Выйти">
          <i class="fa-solid fa-right-from-bracket text-base"></i>
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button onclick="openModal('modal-auth')" class="text-xs font-semibold px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-lg shadow-brand-600/20">
        Вход / Регистрация
      </button>
    `;
  }
}

function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value.trim();

  if (u === 'admin' && p === 'admin') {
    currentUser = { username: 'admin', role: 'admin' };
  } else {
    const found = users.find(x => x.username === u);
    if (found) {
      currentUser = { username: found.username, role: found.role };
    } else {
      alert('Пользователь не найден!');
      return;
    }
  }

  saveState();
  window.location.href = currentUser.role === 'admin' ? 'admin.html' : 'user.html';
}

function handleRegister(e) {
  e.preventDefault();
  const u = document.getElementById('reg-username').value.trim();
  const p = document.getElementById('reg-password').value.trim();

  if (users.some(x => x.username === u)) {
    alert('Пользователь существует!');
    return;
  }

  const newUser = { username: u, role: 'user' };
  users.push(newUser);
  currentUser = newUser;
  saveState();
  window.location.href = 'user.html';
}

function handleLogout() {
  currentUser = null;
  saveState();
  window.location.href = 'index.html';
}

function switchAuthTab(tab) {
  const loginBtn = document.getElementById('tab-login-btn');
  const regBtn = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('form-login');
  const regForm = document.getElementById('form-register');

  if (tab === 'login') {
    loginBtn.className = "flex-1 pb-3 text-sm font-bold border-b-2 border-brand-500 text-brand-500";
    regBtn.className = "flex-1 pb-3 text-sm font-bold border-b-2 border-transparent text-gray-400 hover:text-gray-200";
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
  } else {
    regBtn.className = "flex-1 pb-3 text-sm font-bold border-b-2 border-brand-500 text-brand-500";
    loginBtn.className = "flex-1 pb-3 text-sm font-bold border-b-2 border-transparent text-gray-400 hover:text-gray-200";
    regForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

// TAGS BAR & CARDS
function renderMainBar() {
  const bar = document.getElementById('main-tags-bar');
  if (!bar) return;

  let html = `<button onclick="filterByTag('all')" class="px-3 py-1 rounded-lg text-xs font-mono ${activeTagFilter === 'all' ? 'bg-brand-600 text-white' : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'}">#Все</button>`;
  
  presetTags.forEach(t => {
    html += `<button onclick="filterByTag('${t}')" class="px-3 py-1 rounded-lg text-xs font-mono ${activeTagFilter === t ? 'bg-brand-600 text-white' : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'}">${t}</button>`;
  });

  bar.innerHTML = html;
}

function filterByTag(tag) {
  activeTagFilter = tag;
  renderMainBar();
  renderCards();
}

function handleSearch() {
  searchQuery = document.getElementById('search-input').value.toLowerCase();
  renderCards();
}

function renderCards() {
  const grid = document.getElementById('cards-grid');
  const userGrid = document.getElementById('user-items-grid');
  const empty = document.getElementById('empty-state');
  if (!grid && !userGrid) return;

  let filtered = items.filter(item => {
    const matchesTag = activeTagFilter === 'all' || (item.tags && item.tags.includes(activeTagFilter));
    const q = searchQuery;
    const matchesSearch = !q || 
      item.title.toLowerCase().includes(q) || 
      (item.desc && item.desc.toLowerCase().includes(q)) ||
      (item.content && item.content.toLowerCase().includes(q));
    return matchesTag && matchesSearch;
  });

  if (grid) {
    grid.innerHTML = '';
    if (filtered.length === 0) {
      if (empty) empty.classList.remove('hidden');
    } else {
      if (empty) empty.classList.add('hidden');
      filtered.forEach(item => {
        grid.appendChild(createCardElement(item));
      });
    }
  }

  if (userGrid && currentUser) {
    userGrid.innerHTML = '';
    const myItems = items.filter(x => x.author === currentUser.username);
    myItems.forEach(item => {
      userGrid.appendChild(createCardElement(item, true));
    });
  }
}

function createCardElement(item, isUserCabinet = false) {
  const card = document.createElement('div');
  card.className = "bg-dark-card border border-dark-border hover:border-gray-700 rounded-2xl p-5 flex flex-col justify-between shadow-lg";

  const tagsHTML = (item.tags || []).map(t => `<span class="px-2 py-0.5 rounded bg-dark-bg text-gray-400 font-mono text-[10px] border border-dark-border">${t}</span>`).join(' ');

  card.innerHTML = `
    <div>
      <div class="flex items-center justify-between gap-2 mb-2">
        <div class="flex flex-wrap gap-1">${tagsHTML || '<span class="text-[10px] text-gray-600">Без тегов</span>'}</div>
        <span class="text-[10px] font-mono text-gray-500"><i class="fa-regular fa-clock mr-1"></i>${item.date}</span>
      </div>

      <h3 class="font-bold text-gray-100 text-base leading-snug">${escapeHTML(item.title)}</h3>
      <p class="text-xs text-gray-400 mt-1">${escapeHTML(item.desc || '')}</p>

      <div class="relative mt-3">
        <pre class="bg-dark-bg p-3 rounded-xl border border-dark-border font-mono text-xs text-gray-300 max-h-36 overflow-y-auto whitespace-pre-wrap">${escapeHTML(item.content)}</pre>
        <button onclick="copyToClipboard(\`${escapeForJS(item.content)}\`)" class="absolute top-2 right-2 px-2 py-1 bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-semibold rounded-lg">
          Копия
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between pt-3 mt-3 border-t border-dark-border text-xs text-gray-500 font-mono">
      <span>Автор: ${item.author || 'Аноним'}</span>
      ${(isUserCabinet || (currentUser && currentUser.role === 'admin')) ? `
        <button onclick="deleteItem('${item.id}')" class="text-rose-400 hover:underline">Удалить</button>
      ` : ''}
    </div>
  `;
  return card;
}

// USER CREATE NOTE LOGIC
function renderUserTagSelector() {
  const box = document.getElementById('usr-tag-selector');
  if (!box) return;

  let html = '';
  presetTags.forEach((t, i) => {
    html += `
      <label class="inline-flex items-center space-x-1 bg-dark-bg border border-dark-border px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer hover:border-brand-500">
        <input type="checkbox" value="${t}" class="usr-tag-checkbox rounded text-brand-500 bg-dark-input border-dark-border">
        <span class="text-gray-300">${t}</span>
      </label>
    `;
  });
  box.innerHTML = html;
}

function toggleUserMode() {
  const mode = document.getElementById('usr-mode').value;
  document.getElementById('usr-box-text').classList.toggle('hidden', mode !== 'text');
  document.getElementById('usr-box-file').classList.toggle('hidden', mode !== 'file');
  document.getElementById('usr-box-github').classList.toggle('hidden', mode !== 'github');
}

async function handleUserCreate(e) {
  e.preventDefault();
  const title = document.getElementById('usr-title').value.trim();
  const desc = document.getElementById('usr-desc').value.trim();
  const customTag = document.getElementById('usr-custom-tag').value.trim();
  const mode = document.getElementById('usr-mode').value;

  // Collect checked tags
  let selectedTags = [];
  document.querySelectorAll('.usr-tag-checkbox:checked').forEach(cb => {
    selectedTags.push(cb.value);
  });
  if (customTag) {
    selectedTags.push(customTag.startsWith('#') ? customTag : `#${customTag}`);
  }

  // Auto Date Generation (DD.MM.YYYY HH:MM)
  const now = new Date();
  const autoDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth()+1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  let content = '';

  if (mode === 'text') {
    content = document.getElementById('usr-text-content').value;
  } else if (mode === 'file') {
    const fileInput = document.getElementById('usr-file-input');
    if (fileInput.files.length > 0) {
      content = await fileInput.files[0].text();
    }
  } else if (mode === 'github') {
    content = document.getElementById('usr-github-url').value;
  }

  if (!content) {
    alert('Пожалуйста, введите текст, выберите файл или укажите ссылку!');
    return;
  }

  const newItem = {
    id: `item-${Date.now()}`,
    title,
    desc,
    tags: selectedTags,
    content,
    date: autoDate,
    author: currentUser ? currentUser.username : 'Гость'
  };

  items.unshift(newItem);
  saveState();
  renderCards();
  alert('Заметка успешно сохранена!');
  window.location.href = 'index.html';
}

function deleteItem(id) {
  if (!confirm('Удалить эту запись?')) return;
  items = items.filter(x => x.id !== id);
  saveState();
  renderCards();
}

// ADMIN FUNCTIONS
function renderAdminTags() {
  const box = document.getElementById('admin-tags-list');
  if (!box) return;

  let html = '';
  presetTags.forEach(t => {
    html += `
      <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-dark-bg border border-dark-border text-xs font-mono text-gray-300">
        <span>${t}</span>
        <button onclick="deleteAdminTag('${t}')" class="text-rose-400 hover:text-rose-300 ml-1">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    `;
  });
  box.innerHTML = html;
}

function handleAdminAddTag(e) {
  e.preventDefault();
  const input = document.getElementById('adm-new-tag');
  let tag = input.value.trim();
  if (!tag.startsWith('#')) tag = `#${tag}`;

  if (!presetTags.includes(tag)) {
    presetTags.push(tag);
    saveState();
    renderAdminTags();
    renderMainBar();
    input.value = '';
  }
}

function deleteAdminTag(tag) {
  presetTags = presetTags.filter(t => t !== tag);
  saveState();
  renderAdminTags();
  renderMainBar();
}

function renderUsersTable() {
  const tbody = document.getElementById('admin-users-table');
  if (!tbody) return;
  tbody.innerHTML = '';

  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-dark-bg/50 transition-colors";
    tr.innerHTML = `
      <td class="p-3 font-medium">${u.username}</td>
      <td class="p-3"><span class="px-2 py-0.5 rounded text-xs font-mono ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-400'}">${u.role}</span></td>
      <td class="p-3 text-right">
        ${u.username !== 'admin' ? `
          <button onclick="deleteUser('${u.username}')" class="text-xs px-2 py-1 bg-rose-500/10 text-rose-400 rounded">Удалить</button>
        ` : '<span class="text-xs text-gray-500">Система</span>'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteUser(username) {
  users = users.filter(x => x.username !== username);
  saveState();
  renderUsersTable();
  updateAdminStats();
}

function updateAdminStats() {
  if (document.getElementById('stat-items-count')) document.getElementById('stat-items-count').innerText = items.length;
  if (document.getElementById('stat-users-count')) document.getElementById('stat-users-count').innerText = users.length;
  if (document.getElementById('stat-tags-count')) document.getElementById('stat-tags-count').innerText = presetTags.length;
}

// UTILS
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => alert('Скопировано!'));
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('hidden'); el.classList.add('flex'); }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('hidden'); el.classList.remove('flex'); }
}

function escapeHTML(str) {
  return str ? str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)) : '';
}

function escapeForJS(str) {
  return str ? str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${') : '';
}
