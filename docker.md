# Docker + GitHub — Frontend (FE)

Panduan buat anggota baru: jalanin **frontend** pakai Docker, dan push code ke
GitHub sebagai `main`. Panduan backend ada di
[`tubes-cheva2-be/docker.md`](../tubes-cheva2-be/docker.md).

## Prasyarat

| Kebutuhan            | Kenapa                                                   |
|----------------------|----------------------------------------------------------|
| **Docker Desktop**   | Buat build & jalanin FE di container nginx                |
| **Git**              | Buat ambil & upload code                                 |
| **Akun GitHub**      | Tempat repo project                                      |

Cek semua sudah terpasang:

```bash
docker --version
docker compose version
git --version
```

> FE belum masuk `docker-compose.yml` — di-build & di-run manual sebagai
> container nginx (file `Dockerfile` + `nginx.conf` di folder ini).

---

## 1. Ambil Project (Clone dari GitHub)

```bash
git clone https://github.com/Goldenkwi/tubes-cheva2-fe.git
cd tubes-cheva2-fe
```

> Setiap kali mau update code terbaru dari tim:
> ```bash
> git pull
> ```

---

## 2. Jalanin Frontend Pakai Docker

```bash
docker build -t cheva-fe .
docker run -d --name cheva-fe -p 8080:80 cheva-fe
```

| Yang dibuka          | URL                              |
|----------------------|----------------------------------|
| Frontend             | http://localhost:8080            |

> **URL API default** di image adalah `http://localhost:8000/api` (build arg
> `VITE_API_BASE_URL`). Kalau backend jalan di host lain / port lain, override
> saat build:
> ```bash
> docker build --build-arg VITE_API_BASE_URL=http://localhost:8000/api -t cheva-fe .
> ```

---

## 3. Putus/Padamkan Container

```bash
docker stop cheva-fe && docker rm cheva-fe
```

Lihat log frontend:

```bash
docker logs -f cheva-fe
```

---

## 4. Push Perubahan ke GitHub (Sebagai `main`)

Style yang dipakai tim ini: **langsung push ke branch `main`**.

### a. Cek posisi

Pastikan kamu di branch `main` dan di folder project FE:

```bash
git branch
git status
```

> Kalau belum di `main`:
> ```bash
> git checkout main
> git pull
> ```

### b. Lihat & pilih file yang berubah

```bash
git status                    # daftar file yang berubah
git add <file>                # pilih file tertentu
git add .                     # atau ambil SEMUA perubahan
```

### c. Commit dengan pesan jelas

```bash
git commit -m "pesan: apa yang kamu ubah"
```

Contoh: `git commit -m "fix: perbaiki layout dashboard"`

### d. Push ke GitHub

```bash
git push origin main
```

Selesai. Code kamu sudah naik ke repo GitHub, anggota lain tinggal
`git pull` untuk dapat perubahan yang sama.

---

## Tips

- **Jangan commit file sensitif** — `.env` (berisi `VITE_API_BASE_URL`) sudah
  otomatis dikecualikan lewat `.gitignore`. Jangan pernah paksa push file itu
  (`git add -f .env` itu terlarang).
- **Pull dulu sebelum push** — biar tidak konflik:
  ```bash
  git pull && git push origin main
  ```
- **Kalau terjadi konflik** — tanya anggota yang lebih senior, jangan di-asal
  hapus. Konflik itu normal dan bisa diselesaikan.
- **Pesanan kalau bingung**: clone → pull → build Docker → cek FE → ubah
  code → add → commit → push. Alur itu aja.