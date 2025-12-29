// --- FIREBASE KÜTÜPHANELERİNİ İÇERİ AL ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// --- AYARLAR (BURAYI KENDİ KODLARINLA DEĞİŞTİR) ---
const firebaseConfig = {
  apiKey: "AIzaSyBMM_yhDt2QUzkUJM0CM9HHT_VK0fap1lo",
  authDomain: "mylove-b4bb2.firebaseapp.com",
  databaseURL: "https://mylove-b4bb2-default-rtdb.firebaseio.com",
  projectId: "mylove-b4bb2",
  storageBucket: "mylove-b4bb2.firebasestorage.app",
  messagingSenderId: "1009944408502",
  appId: "1:1009944408502:web:78b0e4666b93086c2bd117",
  measurementId: "G-PB3T4NGZHR"
};

// --- FIREBASE'İ BAŞLAT ---
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const notesRef = ref(db, 'notes'); // Veritabanındaki 'notes' klasörü

// --- SAYFA YÜKLENİNCE ---
window.onload = () => {
  // 1. Çiçek Animasyonu
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);

  // 2. Sistemleri Başlat
  initNotesSystem();
  initImageSystem();
};

// --- NOT SİSTEMİ (FIREBASE ENTEGRELİ) ---
function initNotesSystem() {
  const notesBtn = document.querySelectorAll('.glow-btn')[1];
  const modal = document.getElementById('note-modal');
  const closeBtn = document.getElementById('close-notes');
  const addBtn = document.getElementById('add-note-btn');
  const input = document.getElementById('note-input');
  const gallery = document.getElementById('notes-gallery');

  const noteColors = ['#ffeb3b', '#ffc107', '#8bc34a', '#03a9f4', '#e91e63', '#9c27b0', '#00bcd4'];

  // Modalı Aç
  if (notesBtn) {
    notesBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  }

  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  // Not Ekleme (Firebase'e Gönder)
  addBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (text) {
      const newNote = {
        text: text,
        color: noteColors[Math.floor(Math.random() * noteColors.length)],
        rotate: Math.floor(Math.random() * 20) - 10,
        date: Date.now() // Sıralama için tarih
      };

      push(notesRef, newNote); // VERİTABANINA YAZ
      input.value = '';
    }
  });

  input.addEventListener('keypress', (e) => { if(e.key === 'Enter') addBtn.click(); });

  // Notları Dinle (Firebase'den Veri Gelince Çalışır)
  onValue(notesRef, (snapshot) => {
    gallery.innerHTML = ''; // Önce temizle
    const data = snapshot.val();

    if (data) {
      // Firebase objesini diziye çevir
      const notesArray = Object.entries(data).map(([key, value]) => {
        return { id: key, ...value };
      });

      // Ters çevir (Yeni en başta)
      notesArray.reverse().forEach((note) => {
        createNoteElement(note);
      });
    }
  });

  function createNoteElement(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.style.backgroundColor = note.color;
    card.style.transform = `rotate(${note.rotate}deg)`;
    
    // Silme butonu (ID ile siler)
    card.innerHTML = `
      <p>${note.text}</p>
      <span class="delete-note" id="${note.id}">🗑️</span>
    `;
    
    gallery.appendChild(card);

    // Silme İşlemi
    const delBtn = card.querySelector('.delete-note');
    delBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Karta tıklanmasını engelle
        const exactLocationOfNote = ref(db, `notes/${note.id}`);
        remove(exactLocationOfNote); // Veritabanından sil
    });
  }
}

// --- RESİM SİSTEMİ (AYNI KALDI) ---
function initImageSystem() {
  const imgBtn = document.querySelectorAll('.glow-btn')[0];
  const modal = document.getElementById('image-modal');
  const closeBtn = document.getElementById('close-images');
  const galleryContainer = document.getElementById('image-gallery-container');

  const totalImages = 22;
  const imageFolder = 'images/';
  const imageName = 'foto';
  const imageExt = '.jpg';

  if (imgBtn) {
    imgBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
      if (galleryContainer.innerHTML.trim() === "") {
        loadImages();
      }
    });
  }

  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  function loadImages() {
    for (let i = 1; i <= totalImages; i++) {
      const img = document.createElement('img');
      img.src = `${imageFolder}${imageName}${i}${imageExt}`;
      img.alt = `Fotoğraf ${i}`;
      img.className = 'gallery-img';
      img.onerror = function() { this.style.display = 'none'; };
      img.onclick = function() { window.open(this.src, '_blank'); };
      galleryContainer.appendChild(img);
    }
  }
}
