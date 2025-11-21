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
      { path: '', name: 'home', component: () => import('pages/HomePage.vue'), meta: { public: true } },
    { path: 'dog', name: 'dog', component: () => import('pages/DogPage.vue'), meta: { public: true } },
    { path: 'leaderboard', name: 'leaderboard', component: () => import('pages/LeaderboardPage.vue'), meta: { public: true } },
    { path: 'profile', name: 'profile', component: () => import('pages/ProfilePage.vue'), meta: { public: true } },
    { path: 'shop', name: 'shop', component: () => import('pages/ShopPage.vue'), meta: { public: true } },
    { path: 'challenges', name: 'challenges', component: () => import('pages/ChallengesPage.vue'), meta: { public: true } },
  { path: 'stats', name: 'stats', component: () => import('pages/StatsPage.vue'), meta: { public: false } },
  { path: 'settings', name: 'settings', component: () => import('pages/AccountSettings.vue') }, // protected
  { path: 'integrame', component: () => import('pages/IntegrameList.vue') }, // protected
  { path: 'categorii', name: 'categorii', component: () => import('pages/CategoryList.vue'), meta: { public: true } },
      { path: 'integrame/:id', component: () => import('pages/IntegramePlay.vue') }, // protected
      { path: 'hearts', component: () => import('pages/HeartsPage.vue') }, // protected
      { path: 'map', component: () => import('pages/LevelMap.vue') }, // protected
      { path: 'testmap', component: () => import('pages/GameMapPage.vue') }, // protected
      { path: 'subscriptions', component: () => import('pages/SubscriptionsPage.vue') }, // protected
    ],
  },

  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue'), meta: { public: true } },
]

export default routes
