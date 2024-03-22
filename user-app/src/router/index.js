import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Questionnaire from '../views/emergencyForm.vue'
import AppointmentView from '../views/AppointmentView.vue'
import LandingView from '../views/LandingView.vue'
import MyPage from '../views/MyPage.vue'
import InboxView from '../views/InboxView.vue'
import EmergencyForm from '../views/emergencyForm.vue'
import ResultLoader from '../views/resultLoader.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/clinic',
      name: 'clinic-view',
      component: () => import('../views/ClinicView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/appointment',
      name: 'appointment',
      component: AppointmentView
    },
    {
      path: '/questionnaire',
      name: 'questionnaire',
      component: Questionnaire
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/login',
      name: 'login-view',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/my-page',
      name: 'my-page',
      component: MyPage
    },
    {
      path: '/inbox',
      name: 'inbox-view',
      component: InboxView,
    },
    {
      path: '/emergency-form',
      name: 'emergency-form',
      component: EmergencyForm
    },
    {
      path: '/emergency-results',
      name: 'emergency-results',
      component: ResultLoader
    }
  ]
})

export default router
