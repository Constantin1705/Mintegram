# Documentația Rute și Linkuri - Mintegram

## Rute Frontend (Next.js Routes)

### Pagini Principale
- `/` - Pagina de acasă (home page)
- `/login` - Pagina de autentificare
- `/signup` - Pagina de înregistrare
- `/profile` - Profilul utilizatorului
- `/wallet` - Portofelul utilizatorului
- `/hearts` - Managementul inimilor

### Jocuri și Puzzle-uri
- `/integrame` - Lista de integrame
- `/integrame/[slug]` - Integrama specifică (ex: `/integrame/sport-1`)
- `/rebusuri` - Lista de rebusuri
- `/category` - Categorii de puzzle-uri
- `/challenges` - Provocări speciale

### Statistici și Social
- `/leaderboard` - Clasamentul utilizatorilor
- `/stats` - Statistici personale
- `/subscriptions` - Abonamente

### Utilități și Alte Pagini
- `/shop` - Magazine și upgrade-uri
- `/test-map` - Pagina de testare și hartă
- `/badges` - Insignele și recompensele utilizatorului
- `/help` - Pagina de ajutor și tutoriale
- `/contact` - Contact și feedback
- `/privacy` - Politica de confidențialitate
- `/terms` - Termeni și condiții
- `/about` - Despre Mintegram
- `/settings` - Setări utilizator

---

## API Endpoints Backend (Django REST)

### Autentificare (accounts/)
```
POST   /api/auth/login/
POST   /api/auth/signup/
POST   /api/auth/logout/
POST   /api/auth/refresh/
GET    /api/auth/profile/
PUT    /api/auth/profile/
POST   /api/auth/change-password/
```

### Integrame (crosswords/)
```
GET    /api/crosswords/
GET    /api/crosswords/{id}/
POST   /api/crosswords/
PUT    /api/crosswords/{id}/
DELETE /api/crosswords/{id}/
GET    /api/crosswords/by-difficulty/{difficulty}/
GET    /api/crosswords/by-category/{category}/
GET    /api/crosswords/search/?q={query}
POST   /api/crosswords/{id}/submit-solution/
GET    /api/crosswords/{id}/leaderboard/
```

### Rebusuri
```
GET    /api/rebusuri/
GET    /api/rebusuri/{id}/
POST   /api/rebusuri/
PUT    /api/rebusuri/{id}/
DELETE /api/rebusuri/{id}/
GET    /api/rebusuri/by-difficulty/{difficulty}/
GET    /api/rebusuri/by-category/{category}/
POST   /api/rebusuri/{id}/submit-solution/
```

### Abonamente (subscriptions/)
```
GET    /api/subscriptions/
GET    /api/subscriptions/{id}/
POST   /api/subscriptions/create/
DELETE /api/subscriptions/{id}/cancel/
GET    /api/subscriptions/active/
POST   /api/subscriptions/{id}/renew/
```

### Statistici și Progres
```
GET    /api/users/{userId}/stats/
GET    /api/users/{userId}/progress/
POST   /api/users/{userId}/progress/save/
GET    /api/users/{userId}/achievements/
GET    /api/leaderboard/
GET    /api/leaderboard/by-difficulty/{difficulty}/
GET    /api/leaderboard/weekly/
GET    /api/leaderboard/monthly/
```

### Badguri și Recompense
```
GET    /api/badges/
GET    /api/badges/{id}/
GET    /api/badges/my-badges/
GET    /api/badges/user-badges/?user_id={userId}
GET    /api/badges/leaderboard/
POST   /api/users/{userId}/badges/{badgeId}/claim/
```

### Feedback și Sugestii
```
POST   /api/feedback/
GET    /api/feedback/?user_id={userId}
```

### Setări și Preferințe
```
GET    /api/settings/theme/
PATCH  /api/settings/theme/
GET    /api/settings/notifications/
PATCH  /api/settings/notifications/
GET    /api/settings/privacy/
PATCH  /api/settings/privacy/
```

### Portofel și Monede
```
GET    /api/wallet/
GET    /api/wallet/transactions/
POST   /api/wallet/purchase/
POST   /api/wallet/add-coins/
```

### Inima (Hearts)
```
GET    /api/hearts/
GET    /api/hearts/current/
POST   /api/hearts/refill/
GET    /api/feedback/
DELETE /api/feedback/{id}/
```

---

## Resurse Statice (Public Assets)

### Icoane
```
/public/icons/
/public/icons/integrame.svg
/public/icons/rebusuri.svg
/public/icons/leaderboard.svg
/public/icons/profile.svg
/public/icons/shop.svg
/public/icons/wallet.svg
/public/icons/hearts.svg
/public/icons/settings.svg
```

### Animații
```
/public/animations/
/public/animations/loading.json
/public/animations/success.json
/public/animations/error.json
/public/animations/confetti.json
```

---

## Linkuri Externe Posibile

### Rețele Sociale
```
https://facebook.com/mintegram
https://twitter.com/mintegram
https://instagram.com/mintegram
https://linkedin.com/company/mintegram
https://youtube.com/@mintegram
```

### Suport și Informații
```
/help - Pagina de ajutor
/contact - Contact
/privacy - Politica de confidențialitate
/terms - Termeni și condiții
/about - Despre noi
```

---

## Query Parameters Suportați

### Integrame și Rebusuri
```
?difficulty=easy|medium|hard
?category={categoria}
?sort=newest|popular|difficulty
?page={numar}
?limit={per_page}
?search={query}
```

### Leaderboard
```
?timeframe=weekly|monthly|alltime
?difficulty=easy|medium|hard
?page={numar}
```

---

## Autentificare și Headers

### Headers Necesari pentru API
```
Authorization: Bearer {token}
Content-Type: application/json
X-CSRF-Token: {csrf_token}
```

---

## Code Examples - Fetch API Calls

### Login
```typescript
POST /api/auth/login/
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Obținere Integrame
```typescript
GET /api/crosswords/?difficulty=medium&category=sport
```

### Salvare Progres
```typescript
POST /api/users/{userId}/progress/save/
{
  "puzzle_id": 123,
  "puzzle_type": "crossword",
  "time_spent": 300,
  "completed": true,
  "score": 85
}
```

### Trimitere Feedback
```typescript
POST /api/feedback/
{
  "user_id": 123,
  "message": "Sugestie de îmbunătățire...",
  "puzzle_id": 456,
  "rating": 5
}
```

---

## Variabile de Mediu Necesare

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_URL_PRODUCTION=https://api.mintegram.com/api
NEXT_AUTH_SECRET=your_secret_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=UA-XXXXX-X
```

---

## Status Codes API

```
200 OK - Request successful
201 Created - Resource created
204 No Content - Successful deletion
400 Bad Request - Invalid request
401 Unauthorized - Authentication required
403 Forbidden - Access denied
404 Not Found - Resource not found
409 Conflict - Resource conflict
429 Too Many Requests - Rate limit exceeded
500 Internal Server Error - Server error
```
