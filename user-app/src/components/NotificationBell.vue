<template>
  <div class="notification-bell" @click="toggleNotifications">
    <i class="fa fa-bell"></i>
    <div v-if="notifications.length > 0" class="notification-badge">{{ notifications.length }}</div>

    <div v-if="showNotifications" class="notification-dropdown">
      <NotificationListElement
        v-for="(notification, index) in notifications"
        :key="index"
        :notification="notification"
        @remove-notification="handleRemoveNotification"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import NotificationListElement from './NotificationListElement.vue'

export default {
  components: {
    NotificationListElement
  },
  computed: {
    ...mapGetters(['notifications', 'showNotifications'])
  },
  methods: {
    ...mapMutations(['TOGGLE_SHOW_NOTIFICATIONS']),
    toggleNotifications() {
      this.TOGGLE_SHOW_NOTIFICATIONS()
    },
    ...mapActions(['removeNotification']),
    handleRemoveNotification(notificationId) {
      this.removeNotification(notificationId)
    }
  }
}
</script>

<style scoped>
.notification-bell {
  position: relative;
  cursor: pointer;
  font-size: 20px;
  margin: 5px;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 8px;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000;
}
</style>
