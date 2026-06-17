// --- 1. DEKLARASI DATA DEFAULT (SIMULASI DATABASE) ---
const defaultUsers = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'umum', password: '123', role: 'umum' }
];

const defaultProfiles = {
    dkv: {
        desc: "DKV di SMK Informatika Kota Serang mendidik siswa agar mampu menghasilkan karya komunikasi visual yang menarik dan fungsional. Fokus pengajaran mencakup desain cetak, periklanan, ilustrasi digital, animasi, serta produksi konten multimedia.",
        skills: ["Desain Grafis (Photoshop/Illustrator)", "Fotografi Studio & Videografi", "Penyuntingan Video (Premiere/After Effects)", "Ilustrasi dan Gambar Digital"],
        jobs: ["Desainer Grafis Mandiri", "Fotografer & Videografer", "Content Creator", "Staf Kreatif Agensi Periklanan"]
    },
    mplb: {
        desc: "Jurusan MPLB membekali siswa dengan pemahaman mendalam tentang tata kelola perkantoran modern, korespondensi bisnis digital, kearsipan elektronik, serta kemampuan komunikasi interpersonal yang prima demi menunjang operasional perusahaan.",
        skills: ["Manajemen Dokumen & Arsip Digital", "Korespondensi Bahasa Indonesia & Inggris", "Aplikasi Perkantoran Terpadu (Office)", "Pelayanan Prima (Customer Service)"],
        jobs: ["Staf Administrasi Kantor", "Sekretaris / Asisten Eksekutif", "Customer Service Officer", "Staf Pengelola Arsip / Dokumentasi"]
    }
};

// --- 2. INISIALISASI DATABASE SAAT HALAMAN DI-LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem('profiles')) {
        localStorage.setItem('profiles', JSON.stringify(defaultProfiles));
    }
    if (!localStorage.getItem('messages')) {
        localStorage.setItem('messages', JSON.stringify([]));
    }
});

// State Aplikasi Aktif
let currentUser = null;

// --- 3. LOGIKA AUTENTIKASI ---
function switchLoginTab(role) {
    const tabUmum = document.getElementById('tab-umum');
    const tabAdmin = document.getElementById('tab-admin');
    const roleInput = document.getElementById('login-role');

    roleInput.value = role;

    if (role === 'umum') {
        tabUmum.classList.add('bg-white', 'text-blue-900', 'shadow');
        tabUmum.classList.remove('text-gray-500');
        tabAdmin.classList.remove('bg-white', 'text-blue-900', 'shadow');
        tabAdmin.classList.add('text-gray-500');
    } else {
        tabAdmin.classList.add('bg-white', 'text-blue-900', 'shadow');
        tabAdmin.classList.remove('text-gray-500');
        tabUmum.classList.remove('bg-white', 'text-blue-900', 'shadow');
        tabUmum.classList.add('text-gray-500');
    }
}

function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;
    const roleInput = document.getElementById('login-role').value;

    const users = JSON.parse(localStorage.getItem('users'));
    
    // Verifikasi kredensial login
    const matchedUser = users.find(u => 
        u.username.toLowerCase() === usernameInput.toLowerCase() && 
        u.password === passwordInput && 
        u.role === roleInput
    );

    if (matchedUser) {
        currentUser = matchedUser;
        showDashboard();
    } else {
        alert('Login Gagal! Mohon periksa kembali username, password, dan kategori peran Anda.');
    }
}

function logout() {
    currentUser = null;
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    document.getElementById('navbar').classList.add('hidden');
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('login-view').classList.remove('hidden');
}

// --- 4. NAVIGASI MENU ---
function showDashboard() {
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('navbar').classList.remove('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');

    document.getElementById('nav-user-info').innerHTML = `
        <i class="fa-solid fa-user mr-1.5 text-xs"></i> Logged as: <span class="font-bold">${currentUser.username} (${currentUser.role.toUpperCase()})</span>
    `;

    const adminMenuBtn = document.getElementById('menu-admin-only');
    if (currentUser.role === 'admin') {
        adminMenuBtn.classList.remove('hidden');
    } else {
        adminMenuBtn.classList.add('hidden');
    }

    switchMenu('home');
    loadDatabaseData();
}

function switchMenu(targetId) {
    const contents = document.querySelectorAll('.dashboard-content');
    contents.forEach(content => content.classList.add('hidden'));

    document.getElementById(`content-${targetId}`).classList.remove('hidden');

    const menuBtns = document.querySelectorAll('.menu-btn');
    menuBtns.forEach(btn => {
        btn.classList.remove('bg-blue-800', 'text-white', 'font-medium');
        btn.classList.add('hover:bg-slate-800', 'text-slate-300');
    });

    const activeBtn = Array.from(menuBtns).find(btn => btn.getAttribute('onclick').includes(`'${targetId}'`));
    if (activeBtn) {
        activeBtn.classList.add('bg-blue-800', 'text-white', 'font-medium');
        activeBtn.classList.remove('hover:bg-slate-800', 'text-slate-300');
    }
}

// --- 5. LOGIKA DOKUMEN & MANAJEMEN DATABASE ---
function loadDatabaseData() {
    const profiles = JSON.parse(localStorage.getItem('profiles'));

    // Profil DKV
    document.getElementById('dkv-desc-display').innerText = profiles.dkv.desc;
    document.getElementById('edit-dkv-desc').value = profiles.dkv.desc;
    
    const dkvSkills = document.getElementById('dkv-skills-list');
    dkvSkills.innerHTML = '';
    profiles.dkv.skills.forEach(skill => {
        dkvSkills.innerHTML += `<li>${skill}</li>`;
    });

    const dkvJobs = document.getElementById('dkv-jobs-list');
    dkvJobs.innerHTML = '';
    profiles.dkv.jobs.forEach(job => {
        dkvJobs.innerHTML += `<li>${job}</li>`;
    });

    // Profil MPLB
    document.getElementById('mplb-desc-display').innerText = profiles.mplb.desc;
    document.getElementById('edit-mplb-desc').value = profiles.mplb.desc;

    const mplbSkills = document.getElementById('mplb-skills-list');
    mplbSkills.innerHTML = '';
    profiles.mplb.skills.forEach(skill => {
        mplbSkills.innerHTML += `<li>${skill}</li>`;
    });

    const mplbJobs = document.getElementById('mplb-jobs-list');
    mplbJobs.innerHTML = '';
    profiles.mplb.jobs.forEach(job => {
        mplbJobs.innerHTML += `<li>${job}</li>`;
    });

    renderAdminMessages();
}

function saveMessage(event) {
    event.preventDefault();
    const name = document.getElementById('msg-name').value;
    const email = document.getElementById('msg-email').value;
    const content = document.getElementById('msg-content').value;

    const messages = JSON.parse(localStorage.getItem('messages'));
    const dateStr = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });

    messages.push({
        date: dateStr,
        name: name,
        email: email,
        content: content
    });

    localStorage.setItem('messages', JSON.stringify(messages));
    
    alert('Pesan berhasil dikirim ke database sekolah!');
    document.getElementById('message-form').reset();
    renderAdminMessages();
}

function updateProfiles() {
    if (currentUser.role !== 'admin') {
        alert('Akses Ditolak! Hanya administrator yang dapat memperbarui data.');
        return;
    }

    const profiles = JSON.parse(localStorage.getItem('profiles'));
    profiles.dkv.desc = document.getElementById('edit-dkv-desc').value;
    profiles.mplb.desc = document.getElementById('edit-mplb-desc').value;

    localStorage.setItem('profiles', JSON.stringify(profiles));
    alert('Database Profil Jurusan berhasil diperbarui!');
    loadDatabaseData();
}

function renderAdminMessages() {
    const messages = JSON.parse(localStorage.getItem('messages'));
    const tableBody = document.getElementById('admin-messages-table');
    tableBody.innerHTML = '';

    if (messages.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4 text-gray-400 italic">Belum ada pesan masuk di database.</td>
            </tr>
        `;
        return;
    }

    messages.forEach(msg => {
        tableBody.innerHTML += `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-900">${msg.date}</td>
                <td class="px-4 py-3">${escapeHTML(msg.name)}</td>
                <td class="px-4 py-3">${escapeHTML(msg.email)}</td>
                <td class="px-4 py-3 text-slate-700">${escapeHTML(msg.content)}</td>
            </tr>
        `;
    });
}

function clearMessages() {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat pesan dari database?')) {
        localStorage.setItem('messages', JSON.stringify([]));
        renderAdminMessages();
    }
}

// Sanitasi Input (XSS Prevention)
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}