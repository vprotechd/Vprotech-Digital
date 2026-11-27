import React from 'react';
import { motion } from 'framer-motion';
import teamImg from '../../assets/22.jpg';
import visionImg from '../../assets/ourvalues.jpg';
import bottomImg from '../../assets/photo.jpg';

const fadeLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

export default function TeamVisionSection() {
  return (
    <section className="team-vision-section">
      {/* Team */}
      <div className="team-row">
        <motion.div
          className="team-image-box"
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
         <img
  src={teamImg}
  alt="Our Team"
  className="team-image"
  loading="lazy"
  width="640"
  height="514"
/>
        </motion.div>

        <motion.div
          className="team-content"
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-tag">OUR TEAM</span>

          <h2 className="team-heading">
            Passionate Professionals Delivering
            <span className="highlight"> Excellence</span>
          </h2>

          <p className="team-text">
            At VProTech Digital, our team is made up of experienced developers,
            designers, digital marketers, AI specialists, and business consultants.
            We work together with one mission—to create innovative digital
            solutions that help businesses succeed.
          </p>

          <p className="team-text">
            Every project is driven by collaboration, creativity, and a commitment
            to delivering outstanding results for our clients.
          </p>
        </motion.div>
      </div>

      {/* Vision */}
      <div className="team-row reverse">
        <motion.div
          className="team-content"
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-tag">OUR VISION</span>

          <h2 className="team-heading">
            Building a
            <span className="highlight"> Smarter Digital Future</span>
          </h2>

          <p className="team-text">
            Our vision is to become one of India's leading technology companies by
            delivering world-class software, AI, cloud, cybersecurity, and digital
            transformation solutions.
          </p>

          <p className="team-text">
            We believe technology should simplify business, inspire innovation, and
            create opportunities for everyone.
          </p>
        </motion.div>

        <motion.div
          className="team-image-box"
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <img 
            src={visionImg} 
            alt="Vision" 
            className="team-image"
            loading="lazy"
            width="560"
            height="450"
          />
        </motion.div>
      </div>

      {/* Bottom Image */}
      <motion.div
        className="bottom-image-box"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <img 
          src={bottomImg} 
          alt="VProTech Digital" 
          className="bottom-image"
          loading="lazy"
          width="1150"
          height="auto"
        />
      </motion.div>
    </section>
  );
}