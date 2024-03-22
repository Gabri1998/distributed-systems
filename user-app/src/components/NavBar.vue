<template>
  <nav toggleable="lg" class="navbar navbar-expand-md bg-body-tertiary navbar-light">
    <RouterLink class="navbar-brand" to="/">
      <span class="app-name">
        Tooth Ferry<span class="tagline d-none d-md-inline"> - PROTECTS YOUR TEETH!</span>
      </span>
    </RouterLink>

    
      <button class="navbar-toggler" type="button" @click="toggleNav">
        <span class="navbar-toggler-icon"></span>
      </button>
  
      <div class="collapse navbar-collapse justify-content-end" :class="{ show: isNavVisible }">
        <div style="display:flex; justify-content:flex-end">
        <div class="container-fluid justify-content-between">
          <ul class="nav navbar-nav" v-if="!user">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/signup">Sign-up</RouterLink>
            </li>
          </ul>
  
          <ul class="nav navbar-nav" v-if="user">
            <li class="nav-item notify">
              <notification-bell />
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link active" aria-current="page" to="/home">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/my-page">Profile</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/about">About Us</RouterLink>
            </li>
            <li class="nav-item">
            <RouterLink class="nav-link" to="/inbox">Inbox</RouterLink>
          </li>
          <li class="nav-item">
              <a href="javascript:void(0)" @click="handleLogout" class="nav-link">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { getUserInfo } from '../apis/users'
import { disConnect, connect } from '../ws'
import NotificationBell from './NotificationBell.vue'

export default {
  name: 'nav-bar',
  components: {
    NotificationBell
  },
  data() {
    return {
      isNavVisible: false
    }
  },
  setup() {
    onMounted(() => {
      //const store = useStore()
      const router = useRouter()
      const route = useRoute()

      defineUser().then((userDetails) => {
        connect(userDetails.id)
        const token = localStorage.getItem('token')
        if (token && ['/', '/login', '/signup'].includes(route.path)) {
          router.push('/home')
        } else if (!token && !['/', '/login', '/signup'].includes(route.path)) {
          router.push('/login')
        }
      })
      /*  .catch(() => {
          router.push('/login')
        }) */
    })
    const store = useStore()
    const router = useRouter()
    const handleLogout = () => {
      localStorage.removeItem('token')
      disConnect()
      store.dispatch('user', null)
      router.push('/login')
    }

    const defineUser = async () => {
      const userDetails = await getUserInfo()
      store.dispatch('user', userDetails)
      return userDetails
    }

    return { handleLogout }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    toggleNav() {
      this.isNavVisible = !this.isNavVisible
    }
  }
}
</script>

<style scoped>
.show {
  display: block !important;
}

.app-name {
  padding: 20px;
}
</style>
