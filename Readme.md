````markdown
# Poultry Farm Service

Selamat datang di Poultry Farm Service, sebuah sistem manajemen peternakan ayam modern yang dirancang dengan arsitektur _microservices_. Sistem ini bertujuan untuk mempermudah pengelolaan data ternak, produk, dan pemantauan kondisi kandang secara _real-time_.

## Arsitektur Sistem

Sistem ini dibangun menggunakan beberapa layanan (services) yang masing-masing memiliki tanggung jawab spesifik dan berkomunikasi satu sama lain. Pengelolaan service-service ini diatur menggunakan Docker Compose untuk mempermudah proses _deployment_ dan _scaling_.

Berikut adalah arsitektur _microservices_ yang digunakan:

1.  **API Gateway**: Merupakan gerbang utama untuk semua permintaan dari klien. Layanan ini bertanggung jawab untuk _routing_, _authentication_, _rate limiting_, dan keamanan.
2.  **Auth Service**: Mengelola semua hal yang berkaitan dengan otentikasi dan manajemen pengguna, termasuk registrasi, login (standar dan Google OAuth), serta pengelolaan data pengguna.
3.  **Livestock Service**: Bertanggung jawab untuk manajemen data ternak, termasuk data jenis ayam (`Ayam`), data kandang (`Kandang`), dan manajemen batch ayam dalam kandang (`BatchAyam`). Layanan ini juga terintegrasi dengan sensor IoT melalui MQTT untuk memantau kondisi kandang.
4.  **Product Service**: Mengelola data produk hasil peternakan seperti telur dan daging. Ini mencakup manajemen jenis produk (`Produk`), lokasi penyimpanan (`Storage`), dan batch produk (`BatchProduk`).
5.  **MongoDB**: Digunakan sebagai database utama untuk semua layanan, menyimpan data secara terpusat.
6.  **Mongo Express**: Sebuah antarmuka web untuk mempermudah pengelolaan database MongoDB.

## Fitur Utama

- **Manajemen Pengguna**: Registrasi dan login pengguna dengan role-based access (`admin`, `employee`). Mendukung login via Google (OAuth 2.0).
- **Manajemen Ternak**:
  - CRUD (Create, Read, Update, Delete) untuk data master jenis ayam (`Ayam`).
  - CRUD untuk data kandang (`Kandang`).
  - Manajemen batch ayam, memungkinkan penempatan ayam ke kandang dengan validasi kapasitas.
- **Manajemen Produk & Inventaris**:
  - CRUD untuk data master produk (telur, daging, dll).
  - CRUD untuk data master lokasi penyimpanan (`Storage`).
  - Manajemen batch produk untuk melacak stok, tanggal masuk, dan asal produk.
- **Pemantauan IoT**: Menerima data sensor (suhu, kelembaban, cahaya) dari kandang secara _real-time_ melalui protokol MQTT.
- **Keamanan**:
  - Otentikasi berbasis JWT (_JSON Web Token_) yang disimpan dalam _cookies_.
  - Pembatasan jumlah permintaan (_rate limiting_) untuk mencegah _abuse_.
  - Komunikasi melalui HTTPS untuk mengenkripsi data.

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose
- **Protokol IoT**: MQTT
- **Lainnya**: JWT, bcrypt, Mongoose, Passport.js

## Dokumentasi API

API Gateway (`http://localhost:7000`) akan meneruskan permintaan ke service yang sesuai.

### 1. Auth Service (`/api/auth`)

Layanan ini menangani otentikasi dan data pengguna.

- **`POST /api/auth/register`**: Registrasi pengguna baru.
  - **Body**: `username`, `email`, `password`, `name`, `role` (`admin` atau `employee`).
- **`POST /api/auth/login`**: Login pengguna. Mengembalikan token JWT dalam _cookie_.
  - **Body**: `username`, `password`.
- **`POST /api/auth/logout`**: Logout pengguna (menghapus _cookie_ token).
- **`GET /api/auth/google`**: Menginisiasi proses login dengan Google OAuth.
- **`GET /api/auth/google/callback`**: Callback URL untuk Google OAuth setelah pengguna memberikan izin.
- **`GET /api/user/:id`**: Mengambil data pengguna berdasarkan ID.

### 2. Livestock Service (`/api/livestock`)

Layanan ini memerlukan token otentikasi (JWT).

- **Ayam (`/api/livestock/ayam`)**

  - `GET /`: Mendapatkan semua data master ayam.
  - `POST /`: Menambahkan data master ayam baru.
  - `PUT /:id`: Memperbarui data master ayam.
  - `DELETE /:id`: Menghapus data master ayam.

- **Kandang (`/api/livestock/kandang`)**

  - `GET /`: Mendapatkan semua data kandang.
  - `POST /`: Menambahkan data kandang baru.
  - `PUT /:id`: Memperbarui data kandang, termasuk data sensor.
  - `DELETE /:id`: Menghapus data kandang.

- **Batch Ayam (`/api/livestock/batchAyam`)**

  - `GET /`: Mendapatkan semua data batch ayam.
  - `GET /:id`: Mendapatkan detail batch ayam berdasarkan ID.
  - `POST /`: Menambahkan batch ayam baru ke dalam kandang.
  - `PUT /:id`: Memperbarui data batch ayam.
  - `DELETE /:id`: Menghapus data batch ayam.

- **IoT (`/api/livestock/iot`)**
  - `GET /kandang`: Melihat data sensor siklus terakhir dari semua kandang yang terhubung.

### 3. Product Service (`/api/product`)

Layanan ini memerlukan token otentikasi (JWT).

- **Produk (`/api/product/produk`)**

  - `GET /`: Mendapatkan semua data master produk.
  - `POST /`: Menambahkan data master produk baru.
  - `GET /:id`: Mendapatkan detail produk berdasarkan ID.
  - `PUT /:id`: Memperbarui data produk.
  - `DELETE /:id`: Menghapus data produk.

- **Storage (`/api/product/storage`)**

  - `GET /`: Mendapatkan semua data storage/penyimpanan.
  - `POST /`: Menambahkan data storage baru.
  - `GET /:id`: Mendapatkan detail storage berdasarkan ID.
  - `PUT /:id`: Memperbarui data storage.
  - `DELETE /:id`: Menghapus data storage.

- **Batch Produk (`/api/product/batchProduk`)**
  - `GET /`: Mendapatkan semua data batch produk.
  - `GET /:id`: Mendapatkan detail batch produk berdasarkan ID.
  - `POST /`: Menambahkan batch produk baru ke dalam storage.
  - `PUT /:id`: Memperbarui data batch produk.
  - `DELETE /:id`: Menghapus data batch produk.

## Panduan Instalasi dan Menjalankan

### Prasyarat

- Docker
- Docker Compose

### Langkah-langkah

1.  **Clone Repository**

    ```bash
    git clone <URL_REPOSITORY>
    cd farm-service
    ```

2.  **Konfigurasi Environment**
    Buat file `.env` di dalam direktori `backend` berdasarkan file `docker-compose.yaml`. Isi variabel-variabel yang diperlukan seperti `MONGO_USER`, `MONGO_PASS`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, dan `GOOGLE_CLIENT_SECRET`.

    Contoh file `.env` di dalam `backend/`:

    ```env
    # MongoDB
    MONGO_USER=admin
    MONGO_PASS=password

    # JWT
    JWT_SECRET=rahasia_sekali_jangan_disebar

    # Google OAuth
    GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx

    ```

3.  **Jalankan Menggunakan Docker Compose**
    Pastikan Anda berada di dalam direktori `backend`, lalu jalankan perintah berikut:

    ```bash
    docker-compose up --build
    ```

    Perintah ini akan membangun _image_ untuk setiap service dan menjalankannya dalam _container_.

4.  **Akses Layanan**
    - **API Gateway**: `https://localhost:7000` (pastikan Anda memiliki file `key.pem` dan `cert.pem` untuk HTTPS, atau ubah `app.js` di API Gateway untuk menggunakan HTTP)
    - **Mongo Express**: `http://localhost:8081`

---

Dibuat dengan ❤️ untuk manajemen peternakan yang lebih baik.
````
