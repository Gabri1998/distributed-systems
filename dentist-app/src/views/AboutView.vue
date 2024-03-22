<template>
  <div class="background">
   
   <div class="container"> 
    <div class="about">
      <h1>About Tooth Fairy Dentist Hub</h1>
      <h3>Welcome to our world of dental excellence and care.</h3>
      
      <h3 class="about-description"> 
        Welcome to Tooth Fairy Dentist Hub, the exclusive platform for registered dentists affiliated with the Tooth Fairy organization in Sweden.
      </h3>
     
      <div class="about-text">
         <h4>🦷 Our Mission:</h4>
         <h5>
          At Tooth Fairy Dentist Hub, we are on a mission to redefine dental practice management. Connected to numerous clinics, our platform streamlines the appointment process for dentists, providing a central hub where they can effortlessly manage their schedules, view bookings, receive timely notifications, and handle cancellations with ease.         
        </h5> 
          
         <h4>💙 Dentist-Focused Features:</h4>
         <h5>
          Our platform goes beyond the ordinary, empowering dentists with a suite of features tailored to their unique needs. Showcase your availability, efficiently manage appointments, and, in critical situations, attend to emergency cases promptly. Tooth Fairy Dentist Hub is more than a tool; it's a unified hub that brings together control, convenience, and a touch of professional magic. 
         </h5>

         <h4>🌟 Why Choose Us:</h4>
         <h5>
          What sets Tooth Fairy Dentist Hub apart is our unwavering commitment to the comfort and efficiency of our dental professionals. Imagine having everything you need in one organized space, designed with care to elevate your dental practice. Experience the ease of managing your appointments, emergency cases, and daily schedules seamlessly, all within our user-friendly interface. We prioritize the success of our dentists, and Tooth Fairy Dentist Hub is crafted to reflect that commitment. 
         </h5>

         <h4>🔗 Unique Priority Bookings:</h4>
         <h5> 
          In times of emergency, we understand the importance of swift action. That's why Tooth Fairy Dentist Hub provides unique priority bookings for our registered dentists. When urgent situations arise, our platform ensures that you can secure appointments as soon as possible, guaranteeing efficient and timely care for your patients.
        </h5>

         <h4>✨ Get Started:</h4>
         <h5>
          Join Tooth Fairy Dentist Hub today and embark on a journey into a world of streamlined dental practice management. Your success is our priority, and Tooth Fairy Dentist Hub is here to support you every step of the way. Because in the world of dentistry, excellence begins with efficient management.
         </h5>
         <p>  <RouterLink class="options" to="/login">Log In</RouterLink>  </p>
        
      </div> 
     </div>
    </div>
  </div>
</template>

<style scoped>
.background{
  background-color: rgba(74, 100, 161, 0.903);
  padding: 3%;
  min-height: 100vh;
  box-sizing: border-box;

}
.container{
  background-color: rgba(211, 215, 223, 0.903);
  height: fit-content;
  border-radius: 20px;
}
.about {
    text-align: center;
    padding: 20px;
  }

  h1 {
    color: rgb(28, 28, 76); 
  }

  h3 {
    font-size: 18px;
    color: rgb(28, 28, 76); 
    margin: 20px 0;
    margin-bottom: 40px;
  }
  h4{
    font-weight: 500;
    margin-bottom: 15px;
  }
  h5{
    font-weight: 300;
    margin-bottom: 15px;
  }
  .options{
   font-size: small;
   color: blue;
  }
  .about-text{
    text-align: left;
  }

  .about-description{
    color: black;
    font-style: normal;
  }



</style>
