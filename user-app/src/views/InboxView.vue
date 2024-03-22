<template>
    <div>
      <h1>Inbox</h1>
      <div v-for="notification in notifications" :key="notification.id">
        <NotificationListElement :notification="notification" />
      </div>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalNotifications"
        :per-page="perPage"
        @change="fetchNotifications"
      ></b-pagination>
      <button @click="onClick">Mark All read</button>
    </div>
  </template>
  
  <script>
  import NotificationListElement from '@/components/NotificationListElement.vue';
  import { getUserNotifications } from '@/apis/notification';
  import { readNotification } from '@/apis/notification';
  
  
  export default {
    name: 'inbox-view',
    components: {
      NotificationListElement,
    },
    data() {
      return {
        notifications: [],
        currentPage: 1,
        perPage: 10,
        totalNotifications: 0,
      };
    },
    mounted() {
      this.fetchNotifications();
    },
    methods: {
      async fetchNotifications() {
        try {
          const response = await getUserNotifications();
          if (response) {
            console.log('response.data:', response);
            this.notifications = response;
            this.totalNotifications = response.length;
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      },
      onClick() {
        for (let i = 0; i < this.notifications.length; i++) {
          if (this.notifications[i].read === false) {
            readNotification(this.notifications[i]._id);
          }
        }
      },
    },
  };
  </script>
  