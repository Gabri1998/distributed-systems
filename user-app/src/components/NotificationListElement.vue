<template>
  <b-card class="card">
    <div>
      <b-card-text>
        <b-card-title>{{ notification.id }}</b-card-title>
        <b-card-sub-title>{{ notification.type }}</b-card-sub-title>
        <b-card-text>{{ notification.note }}</b-card-text>
      </b-card-text>
    </div>
    <div>
      <span @click="removeNotification" class="close-icon">x</span>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'NotificationListElement',
  props: {
    notification: {
      id: String,
      user_id: String,
      note: String,
      type: String,
      notification: Object
    }
  },
  methods: {
    removeNotification() {
      this.$emit('remove-notification', this.notification._id)
    }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 8px;
  position: relative;
}

.card:hover {
  background-color: rgba(0, 0, 0, 0.1); /* Darken the background color on hover */
}

.close-icon {
  position: absolute;
  top: 0;
  right: 0;
  color: red;
  padding: 3px;
  border: 1px solid red;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-icon:hover {
  background-color: lightcoral; /* Highlight background on hover */
}
</style>
