onload = () => {
  // 1. ÇİÇEK ANİMASYONU
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);

  // 2. SİSTEMLERİ BAŞLAT
  initNotesSystem();
  initImageSystem();
};

// --- RESİM GALERİSİ SİSTEMİ ---
function initImageSystem() {
  const imgBtn = document.querySelectorAll('.glow-btn')[0]; // Birinci buton (RESİMLER)
  const modal = document.getElementById('image-modal');
  const closeBtn = document.getElementById('close-images');
  const galleryContainer = document.getElementById('image-gallery-container');

  // Resim Ayarları
  const totalImages = 43; // Toplam resim sayısı
  const imageFolder = 'images/'; // Klasör yolu
  const imageName = 'foto'; // Resim isminin kökü (foto1, foto2...)
  const imageExt = '.jpg'; // Uzantı (.jpg veya .png)

  // Modalı Aç
  if (imgBtn) {
    imgBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
      
      // Eğer galeri boşsa resimleri yükle (tekrar tekrar yüklemesin)
      if (galleryContainer.innerHTML.trim() === "") {
        loadImages();
      }
    });
  }

  // Modalı Kapat
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Dışarı tıklayınca kapat
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Resimleri Döngüyle Oluşturma Fonksiyonu
  function loadImages() {
    for (let i = 1; i <= totalImages; i++) {
      const img = document.createElement('img');
      img.src = `${imageFolder}${imageName}${i}${imageExt}`; // Örn: images/foto1.jpg
      img.alt = `Fotoğraf ${i}`;
      img.className = 'gallery-img';
      
      // Resim yüklenemezse (dosya yoksa) konsola hata basmasın, gizlesin
      img.onerror = function() {
        this.style.display = 'none';
      };

      // Resme tıklayınca yeni sekmede büyük halini açsın (İstersen kaldırabilirsin)
      img.onclick = function() {
        window.open(this.src, '_blank');
      };

      galleryContainer.appendChild(img);
    }
  }
}

// --- NOTLAR SİSTEMİ (Önceki Kod) ---
function initNotesSystem() {
  const notesBtn = document.querySelectorAll('.glow-btn')[1]; 
  const modal = document.getElementById('note-modal');
  const closeBtn = document.getElementById('close-notes');
  const addBtn = document.getElementById('add-note-btn');
  const input = document.getElementById('note-input');
  const gallery = document.getElementById('notes-gallery');

  const noteColors = ['#ffeb3b', '#ffc107', '#8bc34a', '#03a9f4', '#e91e63', '#9c27b0', '#00bcd4'];

  if (notesBtn) {
    notesBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
      loadNotes(); 
    });
  }

  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  addBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (text) {
      const newNote = {
        text: text,
        color: noteColors[Math.floor(Math.random() * noteColors.length)],
        rotate: Math.floor(Math.random() * 20) - 10 
      };
      saveNoteToLocal(newNote);
      input.value = '';
      loadNotes();
    }
  });

  input.addEventListener('keypress', (e) => { if(e.key === 'Enter') addBtn.click(); });

  function saveNoteToLocal(noteObj) {
    let notes = JSON.parse(localStorage.getItem('galleryNotes')) || [];
    notes.push(noteObj);
    localStorage.setItem('galleryNotes', JSON.stringify(notes));
  }

  function loadNotes() {
    gallery.innerHTML = ''; 
    let notes = JSON.parse(localStorage.getItem('galleryNotes')) || [];
    notes.slice().reverse().forEach((note, index) => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.style.backgroundColor = note.color || '#ffeb3b';
      card.style.transform = `rotate(${note.rotate || 0}deg)`;
      card.innerHTML = `<p>${note.text}</p><span class="delete-note" onclick="deleteNote(${notes.length - 1 - index})">🗑️</span>`;
      gallery.appendChild(card);
    });
  }

  window.deleteNote = (realIndex) => {
    let notes = JSON.parse(localStorage.getItem('galleryNotes')) || [];
    notes.splice(realIndex, 1);
    localStorage.setItem('galleryNotes', JSON.stringify(notes));
    loadNotes();
  };
}
