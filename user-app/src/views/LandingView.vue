<template>
  <img
    src="../assets/Tooth-Ferry.jpg"
    class="min-vh-100 container"
    fluid-grow
    alt="Responsive image"
  />
</template>

<script>
export default {
  components: {}
}
</script>

<style scoped>
.container {
  background-color: #214471;
  text-align: center;
  text-shadow: 4px 4px 8px rgb(255, 255, 255);
  width: 100%;
  height: auto;
  padding: 1%;
}
.min-vh-100 {
  opacity: 0.9;
  object-fit: cover;
}

@media (max-width: 768px) {
  .container {
    min-height: 50vh;
  }
}
</style>
