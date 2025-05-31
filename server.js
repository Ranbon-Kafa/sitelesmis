const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname)); // HTML, JS, CSS dosyalarını sun
app.use(express.json());            // JSON verisini parse et

// GİRİŞ İŞLEMİ
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ success: false, message: 'Sunucu hatası' });

    const users = JSON.parse(data);
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Hatalı kullanıcı adı veya şifre' });
    }
  });
});

// KAYIT İŞLEMİ
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({ success: false, message: 'Kullanıcı adı ve şifre gerekli.' });

  const filePath = path.join(__dirname, 'users.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ success: false, message: 'Sunucu hatası' });

    let users = [];
    try {
      users = JSON.parse(data || '[]');
    } catch (e) {
      return res.status(500).json({ success: false, message: 'Kullanıcı verisi okunamadı' });
    }

    const exists = users.find(u => u.username === username);
    if (exists) {
      return res.json({ success: false, message: 'Bu kullanıcı adı zaten kayıtlı.' });
    }

    users.push({ username, password });

    fs.writeFile(filePath, JSON.stringify(users, null, 2), err => {
      if (err) return res.status(500).json({ success: false, message: 'Kayıt kaydedilemedi' });
      res.json({ success: true });
    });
  });
});

// SUNUCUYU BAŞLAT
app.listen(PORT, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${PORT}/login.html`);
});
