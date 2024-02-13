import './Login.css'
import React, { useState } from 'react'

const LoginPage = () => {
  const [activeBullet, setActiveBullet] = useState(1); // Add state for active bullet

  const moveSlider = (index) => {
    const currentImage = document.querySelector(`.img-${index}`);
    const images = document.querySelectorAll(".image");
    images.forEach((img) => img.classList.remove("show"));
    currentImage.classList.add("show");

    const textSlider = document.querySelector(".text-group");
    textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;
    setActiveBullet(index); // Update active bullet state
  };

  return (
    <div className='fixed h-screen w-screen bg-[#d8f275] z-50 text-[#fff] flex justify-center items-center'>
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            <form  autoComplete="off" className="sign-in-form">
              <div className="logo">
                <img src="https://i.pinimg.com/564x/80/86/7e/80867e01e51baed5f0a783dbcbe43f1e.jpg" alt="easyclass" />
                <h4>AeroSpace</h4>
              </div>
              <div className="heading">
                <h2>Welcome Back</h2>
                <div className="flex gap-1">
                  <h6>Not registred yet ?</h6>
                  <h6>Contact Admin</h6>
                </div>
              </div>
              <div className="actual-form">
                <div className="input-wrap">
                  <input type="text" minLength={4} className="input-field" autoComplete="off" required />
                  <label>Name</label>
                </div>
                <div className="input-wrap">
                  <input type="password" minLength={4} className="input-field" autoComplete="off" required />
                  <label>Password</label>
                </div>
                <input type="submit" defaultValue="Sign In" className="sign-btn" />
                <p className="text">
                  Forgotten your password or you login datails? <br />
                  Contact Admin
                </p>
              </div>
            </form>
          </div>
          <div className="carousel">
            <div className="images-wrapper">
              <img src="https://res.cloudinary.com/dylnk52kz/image/upload/v1707810632/image1_skyp3w.png" className="image img-1 show" alt />
              <img src="https://res.cloudinary.com/dylnk52kz/image/upload/v1707810632/image2_snc2z4.png" className="image img-2" alt />
              <img src="https://i.pinimg.com/564x/b7/ef/2f/b7ef2ff50453d559703c35c21a9aaaf3.jpg" className="image img-3" alt />
            </div>
            <div class="text-slider">
              <div class="text-wrap">
                <div class="text-group">
                  <h2>Create your Partner</h2>
                  <h2>Customize as you like</h2>
                  <h2>Increase Growth</h2>
                </div>
              </div>

              <div className="bullets">
                <span className={activeBullet === 1 ? "active" : ""} onClick={() => moveSlider(1)} />
                <span className={activeBullet === 2 ? "active" : ""} onClick={() => moveSlider(2)} />
                <span className={activeBullet === 3 ? "active" : ""} onClick={() => moveSlider(3)} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default LoginPage
