# Mintegram Docker Setup

Aceasta este o configurație Docker completă pentru toată aplicația Mintegram.

## Servicii incluse

1. **Backend (Django)** - Port 8000
   - Framework: Django REST Framework
   - Bază de date: SQLite (implicit) sau PostgreSQL (dacă dezactivezi comentariile)

2. **Frontend Quasar** - Port 5173
   - Framework: Quasar (Vue.js)
   - Hot reload activat

3. **Frontend Next.js** - Port 3000
   - Framework: Next.js (React)
   - Versiunea de producție

4. **React Native App** - Port 3001
   - Framework: Next.js + React Native Web
   - Versiunea de producție

## Cerințe preliminare

- Docker Desktop instalat
- Docker Compose instalat

## Instalare și pornire

### Varianta 1: Pornire cu SQLite (simplă)

```bash
docker-compose up --build
```

### Varianta 2: Cu PostgreSQL (producție)

1. Decomentează serviciul `postgres` din `docker-compose.yml`
2. Decomentează `depends_on: postgres` din serviciul `backend`
3. Decomentează variabila `DATABASE_URL` din backend

```bash
docker-compose up --build
```

## Accesare serviciilor

- **Backend API**: http://localhost:8000
- **Frontend Quasar**: http://localhost:5173
- **Frontend Next.js**: http://localhost:3000
- **React Native App**: http://localhost:3001

## Comenzi utile

### Pornire servicii
```bash
docker-compose up
```

### Pornire în background
```bash
docker-compose up -d
```

### Oprire servicii
```bash
docker-compose down
```

### Rebuild imagini
```bash
docker-compose up --build
```

### Vizualizare logs
```bash
docker-compose logs -f
```

### Acces la un serviciu specific
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f next_frontend
docker-compose logs -f rn_app
```

### Executare comenzi în container
```bash
# Django migrations
docker-compose exec backend python manage.py migrate

# Django shell
docker-compose exec backend python manage.py shell

# NPM install în frontend
docker-compose exec frontend npm install
```

## Configurări

### Backend Django

**Fișierul**: `mintegram_backend/Dockerfile`

Dacă ai nevoie de dependențe suplimentare, actualizează `requirements.txt` și rebuild-ează:

```bash
docker-compose up --build
```

### Frontend Quasar

**Fișierul**: `mintegram_frontend/Dockerfile`

Dev server se pornește cu hot reload. Modificările sunt reflectate în timp real.

### Frontend Next.js

**Fișierul**: `mintegram_next/Dockerfile`

Dacă vrei să rulezi în development mode, schimbă comanda în:
```yaml
command: npm run dev
```

### React Native

**Fișierul**: `mintegram_rn/Dockerfile`

Configurat să ruleze pe portul 3001 cu dev server activ.

## Variabile de mediu

Poți seta variabile în fișierul `.env` la rădăcina proiectului:

```bash
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@postgres:5432/db
```

## Probleme frecvente

### Portul deja în uz
Schimbă porturile în `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Backend pe 8001
```

### Dependențe Node.js
Containerele au volum `node_modules` montat. Dacă ai probleme:
```bash
docker-compose down -v  # Șterge volumes
docker-compose up --build
```

### Permisiuni fișiere pe Linux
Dacă ai probleme cu permisiunile:
```bash
sudo chown -R $USER:$USER .
```

## Producție

Pentru producție, trebuie să:

1. Setezi `DEBUG=False` în Django
2. Configurezi o bază de date PostgreSQL externă
3. Folosești reverse proxy (nginx)
4. Activezi SSL/HTTPS

Exemplu de `nginx.conf` pentru producție se poate adăuga în proiect.

## Troubleshooting

Dacă ceva nu merge:

```bash
# Verifică status
docker-compose ps

# Șterge totul și pornește de la 0
docker-compose down -v
docker system prune
docker-compose up --build
```
