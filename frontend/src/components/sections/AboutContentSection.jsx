import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import officeImg from '../../assets/vvv.png';
import { mediaService } from '../../services/api';

export default function AboutContentSection() {

const [image, setImage] = useState(officeImg);

useEffect(() => {
  let isMounted = true;

  const loadAboutContentImage = async () => {
    try {
      const response = await mediaService.getMedia();

      const aboutMedia = response.media?.find(
        (item) => item.key === 'about_content'
      );

      if (isMounted && aboutMedia?.imageUrl) {
        setImage(aboutMedia.imageUrl);
      }
    } catch (error) {
      console.error('Failed to load About Content image:', error);
    }
  };

  loadAboutContentImage();

  return () => {
    isMounted = false;
  };
}, []);


  return (
    <section className="about-section">
      <div className="about-container">
        {/* Left Side */}
        <motion.div
          className="left-content"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h5 className="about-small">WHO WE ARE</h5>

          <h2 className="about-heading">
            Building the Future with
            <span style={{ color: "#4F46E5" }}> Innovation & Technology</span>
          </h2>

          <p className="about-text">
            Founded in march, 2020 by Rajat Kumar, VProtech Digital has come a long way from its beginning. When Rajat Kumar first started out, his passion for "making technically strong professional out of students" drove him to start his own business. We provide Industrial Training to students in Chandigarh for Btech, Diploma, BCA and MCA students. Our team of professional trainers train students in web development, web design, Android applications, SEO, social media marketing (SMM), digital marketing and other courses under our six (6) months / 6 weeks industrial training program in Mohali, Chandigarh.
          </p>

          <p className="about-text">
            Under the 9001:2015 ISO Certification, we offer you standardize trainings and 
            personality development sessions that helps building the mindset and vision of the 
            students for their bright future.
          </p>

          <p className="about-text">
            VProTech Digital is a technology-driven company dedicated to helping
            businesses and aspiring professionals succeed in today's digital world.
            We combine creativity, technical expertise, and strategic thinking to
            deliver solutions that solve real business challenges while creating
            meaningful digital experiences.
          </p>

          <p className="about-text">
            Since our inception, we have focused on developing modern websites,
            enterprise software, mobile applications, cloud-based systems, AI
            solutions, and digital marketing strategies that help organizations
            increase productivity, improve customer engagement, and accelerate
            business growth.
          </p>
        </motion.div>

        {/* Right Side */}
        <motion.div
          className="right-image"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.img
            src={image}
            alt="VProTech Digital Office"
            className="about-image"
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{
              scale: 1.05,
              rotate: 1,
            }}
            width="600"
            height="600"
          />
        </motion.div>
      </div>
    </section>
  );
}