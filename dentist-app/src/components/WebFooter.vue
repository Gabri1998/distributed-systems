<template>
    <footer>
      <div class="footer-content">
        <div class="section">
          <h6>Contact Us</h6>
          <p>Email: clinic.support@toothfairydentisthub.com</p>
          <p>Customer Support: +46 1111-22334</p>
        </div>
  
        <div class="section">
          <br/><p>Copyright &copy; 2023 | Version 1.0.0 | <router-link to="/about">About Us</router-link></p>
        </div>
  
        <div class="section">
            <h6>Payment Information</h6>
            <p>Payments are handled at our clinic during your visit.</p>
        </div>

      </div>
    </footer>
  </template>
  
  <style scoped>
  .footer-content {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    padding: 20px;
    background-color: #214471;
    color: white;
    position:fixed;
    bottom: 0;
    width: 100%;
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

  </style>
  