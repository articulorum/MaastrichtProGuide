// Laad dynamisch de losse HTML componenten per pagina
async function loadModule(pageName, photoSrc) {
    try {
        let response = await fetch(pageName + '.html');
        let html = await response.text();
        document.getElementById('appContent').innerHTML = html;

        // Activeer juiste nav knop
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        event.currentTarget.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Wissel achtergrondfoto
        let photo = document.getElementById('bgPhoto');
        if (photo) {
            photo.style.opacity = '0';
            setTimeout(() => { photo.src = photoSrc; photo.style.opacity = '0.35'; }, 400);
        }

        // Init specifieke functies per pagina
        if (pageName === 'home') loadWeatherWidget();
        if (pageName === 'books') renderBooks(booksDatabase);
        if (pageName === 'directory') renderDirectory(masterDatabase);
    } catch (error) {
        console.error("Fout bij laden module:", error);
    }
}

// Start direct met de homepagina bij openen
window.onload = () => {
    loadModule('home', 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1920&q=80');
};

// Audio, Valuta en Databases logica
let audioPlaying = false;
function toggleAudio() {
    let audio = document.getElementById('ambientAudio');
    let btn = document.getElementById('audioToggle');
    if (audioPlaying) {
        audio.pause();
        audioPlaying = false;
        btn.innerText = "🎵 Chanson: OFF";
    } else {
        audio.play().catch(e => console.log("Audio prevented"));
        audioPlaying = true;
        btn.innerText = "🎵 Chanson: ON";
    }
}

function loadWeatherWidget() {
    let weatherEl = document.getElementById('weatherText');
    if (weatherEl) {
        weatherEl.innerHTML = `🌡️ <strong>17°C & Zonnig</strong> in Maastricht. Perfect weer!`;
    }
}

// Boeken Database (152 Titels)
let booksDatabase = [];
for (let i = 1; i <= 152; i++) {
    booksDatabase.push({
        id: i,
        title: `Meesterwerk Titel #${i}`,
        author: `Auteur ${i}`,
        category: ['Filosofie', 'Psychologie', 'Leiderschap', 'Fictie'][i % 4],
        description: "Diepgaand werk over persoonlijke groei.",
        words: "75.000 woorden",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        bolUrl: "https://www.bol.com"
    });
}

function renderBooks(data) {
    let grid = document.getElementById('booksMatrixGrid');
    if (!grid) return;
    grid.innerHTML = '';
    data.forEach(book => {
        let card = document.createElement('div');
        card.className = 'book-matrix-card';
        card.innerHTML = `
            <img src="${book.image}" style="width:100%; height:160px; object-fit:cover; border-radius:8px; margin-bottom:10px;">
            <span style="color:var(--gold); font-size:0.7rem; font-weight:700;">${book.category}</span>
            <h4 style="color:#fff; font-size:1rem; margin:4px 0;">${book.title}</h4>
            <p style="color:var(--text-muted); font-size:0.8rem; margin-bottom:10px;">Door ${book.author}</p>
            <a href="${book.bolUrl}" target="_blank" style="background:#0000ff; color:#fff; padding:8px; text-align:center; display:block; border-radius:6px; text-decoration:none; font-size:0.75rem; font-weight:700;">Bestel op bol.com</a>
        `;
        grid.appendChild(card);
    });
}

function filterBooks() {
    let query = document.getElementById('bookSearchInput').value.toLowerCase();
    let filtered = booksDatabase.filter(b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query));
    renderBooks(filtered);
}

let masterDatabase = [{ id: 1, title: "Grand Vrijthof", category: "Gastronomy", description: "Luxe pleinbeleving." }];
function renderDirectory(data) {
    let grid = document.getElementById('directoryGrid');
    if (!grid) return;
    grid.innerHTML = data.map(item => `<div class="directory-card"><h4 style="color:#fff">${item.title}</h4><p style="color:var(--text-muted)">${item.description}</p></div>`).join('');
}