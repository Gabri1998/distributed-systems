<template>
  <div>
    <h1>Notifications</h1>
    <div v-if="unreadMessageCount">You have {{ unreadMessageCount }} new notifications!</div>
    <NotificationListElement
      v-for="notification in notifications"
      :notification="notification"
      :key="notification.id"
    />
  </div>
</template>

<script>
import NotificationListElement from '@/components/NotificationListElement.vue'
import { mapGetters, useStore } from 'vuex'
import { computed, onMounted } from 'vue'

export default {
  name: 'NotificationsList',
  components: {
    NotificationListElement
  },
  setup() {
    const store = useStore()

    // Use mapGetters to map specific getters to local variables
    const { notifications } = mapGetters(['notifications'])

    // Example usage in a computed property
    const unreadMessageCount = computed(() => {
      return notifications.filter((notification) => !notification.read).length
    })

    onMounted(() => {
      store.getters.notifications
    })

    return {
      notifications,
      unreadMessageCount
    }
  }
}
</script>

<style scoped></style>
