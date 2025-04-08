Sure! Here's a clean version of your `README.md` with **only the procedures**—no issue troubleshooting:

---

### 📄 `README.md`

```markdown
# ELVTurc Application

A full-stack Dockerized application for inventory and invoicing, built with:

- 🔧 **Backend**: Node.js + TypeScript + Express + Sequelize
- 🎨 **Frontend**: Angular
- 🛢 **Database**: MySQL
- 🗃 **Automated Backups** via shell script
- ☁️ **Optional Cloud Sync**: Google Drive using `rclone`

---

## 📦 Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/)
- Node.js (for local builds if needed)
- `rclone` (optional, for Google Drive syncing)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/gtsorho/elvturc.git
cd elvturc
```

### 2. Create a `.env` File

```env
DB_HOST=db
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=numlock11
DATABASE=elvturc_db
JWT_KEY=your_jwt_secret
```

---

## 🐳 Running with Docker

```bash
docker-compose up --build
```

This will:

- Build and run the Angular frontend (on `http://localhost:81`)
- Start the backend API (on `http://localhost:3000`)
- Start MySQL DB (accessible on port `3307`)
- Start the backup service (optional)

---

## 🌐 Accessing the App

- **Frontend**: http://localhost:81
- **Backend API**: http://localhost:3000
- **Database**: Connect to `localhost:3307` using any MySQL client

---

## 🔄 Automatic Database Backups

Backups are performed hourly using `cron` inside the `db-backup` service.

### Backup Script: `backup.sh`

- Dumps MySQL to `/backup/elvturc_db_<timestamp>.sql`
- Mounted to `./dbBackups` on host for persistence

### Run manually:

```bash
docker exec -it elvturc_db-backup_1 sh
./backup.sh
```

---

## ☁️ Google Drive Sync (Optional)

Install `rclone` and configure it:

```bash
rclone config
```

Update `backup.sh` to include:

```sh
rclone copy /backup gdrive:elvturc-backups --create-dirs
```

Ensure `rclone` is installed inside the backup container or run from host.

---

## 📂 Project Structure

```
elvturc/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── .env
│   └── backup.sh
├── ui/
│   ├── src/
│   ├── Dockerfile
│   └── nginx/default.conf
├── dbBackups/
├── docker-compose.yml
└── README.md
```

---

## 👨‍💻 Author

- GitHub: [@gtsorho](https://github.com/gtsorho)

---

## 📝 License

This project is licensed under the MIT License.
```

