import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Award, Calendar, MapPin, Briefcase, Users } from 'lucide-react';
import founderImage from '../../assets/Rajat Vprotech.png';
import { mediaService } from '../../services/api';

const leftVariants = {
  hidden: { opacity: 0, x: -80, rotate: -5 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 1,
    },
  },
};

const rightVariants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 1,
      delay: 0.3,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const stats = [
  { number: "5+", label: "Years of Excellence", icon: <Award size={20} /> },
  { number: "20+", label: "Team Members", icon: <Users size={20} /> },
];

export default function FounderSection() {

const [image, setImage] = useState(founderImage);

useEffect(() => {
  let isMounted = true;

  const loadFounderImage = async () => {
    try {
      const response = await mediaService.getMedia();

      const founderMedia = response.media?.find(
        (item) => item.key === 'founder_main'
      );

      if (isMounted && founderMedia?.imageUrl) {
        setImage(founderMedia.imageUrl);
      }
    } catch (error) {
      console.error('Failed to load Founder image:', error);
    }
  };

  loadFounderImage();

  return () => {
    isMounted = false;
  };
}, []);

  return (
    <section className="founder-section">
      <div className="founder-container">
        {/* LEFT - Founder Image */}
        <motion.div
          className="founder-left"
          variants={leftVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="founder-image-wrapper">
            <div className="founder-image-container">
              <img
                src={image}
                alt="Founder - VProTech Digital"
                className="founder-image"
                loading="lazy"
                width="480"
                height="550"
              />
              <div className="founder-image-overlay">
                <div className="founder-name-tag">
                  <h3>VProTech Digital</h3>
                  <p>Founded in 2020</p>
                </div>
              </div>
            </div>
            
            {/* Floating Badges */}
            <motion.div
              className="floating-badge badge-1"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Award size={20} color="#4F46E5" />
              <span>5+ Years</span>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT - Founder Information */}
        <motion.div
          className="founder-right"
          variants={rightVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="founder-content"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
          

            <motion.h2 className="founder-title" variants={itemVariants}>
              The Vision Behind{' '}
              <span className="highlight-text">VProTech Digital</span>
            </motion.h2>

            <motion.div className="founder-quote" variants={itemVariants}>
              <Quote size={28} className="quote-icon" />
              <p>
                "Technology is not just about code and machines — it's about 
                empowering people, solving real problems, and creating a 
                future where innovation serves humanity."
              </p>
            </motion.div>

            <motion.div className="founder-bio" variants={itemVariants}>
              <p>
                Founded in 2020, VProTech Digital was born from a vision to 
                bridge the gap between technology and practical application. 
                What started as a small team of passionate developers has 
                grown into a comprehensive digital solutions provider, 
                serving clients across India and globally.
              </p>
              <p>
                Our founder believed that technology should be accessible, 
                innovative, and impactful. This philosophy drives everything 
                we do — from web development to digital marketing, from 
                training programs to internship opportunities.
              </p>
            </motion.div>

            <motion.div className="founder-stats" variants={itemVariants}>
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <h4>{stat.number}</h4>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div className="founder-meta" variants={itemVariants}>
              <div className="meta-item">
                <Calendar size={18} />
                <span>Founded: 2020</span>
              </div>
              <div className="meta-item">
                <MapPin size={18} />
                <span>Mohali, Punjab</span>
              </div>
              <div className="meta-item">
                <Briefcase size={18} />
                <span>IT Solutions & Training</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}