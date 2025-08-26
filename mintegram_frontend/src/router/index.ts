// src/router/index.ts
import { createRouter, createWebHistory, createWebHashHistory, createMemoryHistory } from 'vue-router'
import routes from './routes'
import { useAuth } from 'stores/auth'
import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'

export default function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const router = createRouter({
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
  })

  router.beforeEach((to) => {
    // 1) Luăm tokenul fie din store, fie din LocalStorage (store-ul poate fi gol imediat după reload)
    const auth = useAuth()
    const token =
      auth.access ||
      LocalStorage.getItem<string>('access') ||
      null

    // 2) Setăm headerul Authorization imediat dacă avem token
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }

    // 3) Public / privat (default: protected if meta.public !== true)
    // For nested routes, check the matched array for any meta.public === true
    const isPublic = to.matched.some(record => record.meta && record.meta.public === true)

    // DEBUG: vezi tokenul și isPublic la fiecare navigare
    console.log('[RouterGuard] token:', token, '| isPublic:', isPublic, '| to:', to.fullPath)

    // 4) Dacă e logat și merge spre /login => du-l la redirect sau /
    if (token && (to.path === '/login' || to.name === 'login')) {
      const redirect = (to.query.redirect as string) || '/'
      return { path: redirect, replace: true }
    }

    // 5) Dacă ruta NU e publică și nu există token => la /login cu redirect în query
    if (!isPublic && !token) {
      return {
        path: '/',
        query: { redirect: to.fullPath },
        replace: true,
      }
    }

    return true
  })

  return router
}
