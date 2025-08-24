// src/router/routes.ts
import MainLayout from 'layouts/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
    meta: { public: true },
  },
{
    path: '/signup',
    name: 'signup',
    component: () => import('pages/SignUpPage.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      // Dacă homepage-ul tău e public, marchează-l public; dacă vrei să fie protejat, scoate meta.public
      { path: '', name: 'home', component: () => import('pages/HomePage.vue') }, // protejat implicit
      { path: 'profile', name: 'profile', component: () => import('pages/ProfilePage.vue') }, // protejat implicit
      // exemple publice:
      { path: 'integrame', component: () => import('pages/IntegrameList.vue'), meta: { public: true } },
      { path: 'integrame/:id', component: () => import('pages/IntegramePlay.vue'), meta: { public: true } },
      { path: 'hearts', component: () => import('pages/HeartsPage.vue'), meta: { public: true } },
      { path: 'map', component: () => import('pages/LevelMap.vue'), meta: { public: true } },
    ],
  },

  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue'), meta: { public: true } },
]

export default routes
