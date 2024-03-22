<template>
  <div>
    <footer class="footer-content">
      <div class="section">
        <h6>Contact Us</h6>
        <p>Email: info@toothfairydentisthub.com</p>
        <p>Customer Support: +46 1234-56789</p>
      </div>

      <div class="section">
        <br />
        <p>
          Copyright &copy; 2023 | Version 1.0.0 | <router-link to="/about">About Us</router-link>
        </p>
      </div>

      <div class="section">
        <h6>Accepted Payments</h6>
        <p>Payments are only made at the clinic.</p>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  name: 'web-footer'
}
</script>
<style scoped>
body {
  margin: 0;
}

html,
body,
#app {
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
}
.footer-content {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  padding: 20px;
  background-color: var(--footer-bg);
  color: white;
  bottom: 0;
  width: 100%;
  z-index: 5;
}

.section {
  flex: 1;
  margin-right: 20px;
}

.section h6 {
  margin-bottom: 10px;
  text-decoration: underline;
}

.section p {
  margin: 5px 0;
  font-size: 12px;
}

a {
  color: #ffffff;
}

a:hover {
  color: #81b1de;
}

@media (max-width: 600px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .section {
    margin-right: 0;
    margin-bottom: 20px;
  }
}
</style>
