import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import aboutBg from '../../assets/about.jpg';
import modern from '../../assets/modern.jpg';
import aiml from '../../assets/ai&image.jpg';
import marketing from '../../assets/markting.jpg';
import devops from '../../assets/devops.jpg';
import cyber from '../../assets/cyber.jpg';
import { mediaService } from '../../services/api';

export default function WhyChooseSection() {
  const [cloudinaryImages, setCloudinaryImages] = useState({});

  

useEffect(() => {
  let isMounted = true;

  const loadWhyChooseImages = async () => {
    try {
      const response = await mediaService.getMedia();
      const mediaItems = response.media || [];

      const imageMap = {};

      mediaItems.forEach((item) => {
        if (item.key.startsWith('why_choose_')) {
          imageMap[item.key] = item.imageUrl;
        }
      });

      if (isMounted) {
        setCloudinaryImages(imageMap);
      }
    } catch (error) {
      console.error('Failed to load Why Choose images:', error);
    }
  };

  loadWhyChooseImages();

  return () => {
    isMounted = false;
  };
}, []);


const features = [
  {
    img: cloudinaryImages.why_choose_1 || aboutBg,
    title: "Custom Software & Development",
    desc: "We build secure, scalable custom software solutions designed to streamline your business operations and drive digital growth."
  },
  {
    img: cloudinaryImages.why_choose_2 || modern,
    title: "Modern Web & Mobile Apps",
    desc: "We create responsive websites and high-performance mobile applications using the latest technologies for exceptional user experiences."
  },
  {
    img: cloudinaryImages.why_choose_3 || aiml,
    title: "Internship & Training",
    desc: "We provide custom software development services alongside industry-aligned internship and professional training programs."
  },
  {
    img: cloudinaryImages.why_choose_4 || marketing,
    title: "AI & Digital Marketing",
    desc: "From AI-powered automation to SEO, social media marketing and branding, we help businesses achieve sustainable digital growth."
  },
  {
    img: cloudinaryImages.why_choose_5 || devops,
    title: "Cloud & DevOps Solutions",
    desc: "We implement secure cloud infrastructure, CI/CD pipelines, and DevOps practices that improve deployment speed, reliability, and business scalability."
  },
  {
    img: cloudinaryImages.why_choose_6 || cyber,
    title: "Cyber Security Services",
    desc: "Protect your business with advanced cybersecurity solutions including network protection, data security, threat monitoring, and secure application development."
  }
];


  return (
    <section className="why-section">
      <div className="why-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h5 className="small-heading">WHY CHOOSE US</h5>

          <h2 className="main-heading">
            Empowering Businesses Through
            <span style={{ color: "rgba(79,70,229,0.95)" }}> Technology & Innovation</span>
          </h2>

          <p className="section-desc">
            At VProTech Digital, we combine innovation, expertise, and cutting-edge
            technology to deliver software solutions that help businesses grow,
            automate operations, and stay ahead in today's digital world.
          </p>
        </motion.div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover="hover"
            >
              <img
                src={feature.img}
                alt={feature.title}
                className="card-image"
                loading="lazy"
                width="400"
                height="360"
              />

              <motion.div
                className="card-overlay"
                variants={{
                  hover: {
                    backgroundColor: "rgba(0,0,0,0.55)",
                  },
                }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="card-content"
                  variants={{
                    hover: {
                      y: 0,
                      opacity: 1,
                    },
                  }}
                  initial={{
                    y: 80,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="card-text">{feature.desc}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}