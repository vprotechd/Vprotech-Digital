import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { mediaService } from "../../services/api";

import internshipImg from "../../assets/imagesss.png";

export default function InternshipSection() {

const [image, setImage] = useState(internshipImg);

useEffect(() => {
  let isMounted = true;

  const loadInternshipImage = async () => {
    try {
      const response = await mediaService.getMedia();
      const mediaItems = response.media || [];

      const internshipMedia = mediaItems.find(
        (item) => item.key === "career_internship"
      );

      if (isMounted && internshipMedia?.imageUrl) {
        setImage(internshipMedia.imageUrl);
      }
    } catch (error) {
      console.error("Failed to load Internship image:", error);
    }
  };

  loadInternshipImage();

  return () => {
    isMounted = false;
  };
}, []);

  return (
    <section style={styles.section}>
      <div style={styles.container}>

        {/* LEFT CONTENT */}

        <motion.div
          style={styles.left}
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p style={styles.smallHeading}>
            INTERNSHIP PROGRAM
          </p>

          <h2 style={styles.heading}>
            Launch Your Career with
            <span style={{ color: "#4F46E5" }}>
              {" "}Industry Experience
            </span>
          </h2>

          <p style={styles.description}>
            At VProTech Digital, our internship programs are designed to bridge
            the gap between academic learning and real-world software
            development. Work on live projects, collaborate with experienced
            mentors, and build practical skills that prepare you for a
            successful career in technology.
          </p>

          <div style={styles.tags}>
            <span style={styles.tag}>MERN Stack</span>
            <span style={styles.tag}>React.js</span>
            <span style={styles.tag}>Node.js</span>
            <span style={styles.tag}>AI & Machine Learning</span>
            <span style={styles.tag}>UI / UX Design</span>
            <span style={styles.tag}>Cloud Computing</span>
            <span style={styles.tag}>Cyber Security</span>
            <span style={styles.tag}>Digital Marketing</span>
          </div>

          <Link to="/register">
            <button style={styles.button}>
              Apply for Internship
            </button>
          </Link>
        </motion.div>

        {/* RIGHT IMAGE */}

        <motion.div
          style={styles.right}
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <motion.img
  src={image}
  alt="Internship"
  style={styles.image}
  animate={{
    y: [0, -15, 0],
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>
        </motion.div>

      </div>
    </section>
  );
}



const isMobile = window.innerWidth <= 768;
const styles = {

section:{
  padding:isMobile ? "70px 20px" : "90px 5%",
  background:"#F8FAFC",
},

container:{
  display:"flex",
  flexDirection:isMobile ? "column-reverse" : "row",
  justifyContent:"space-between",
  alignItems:"center",
  gap:isMobile ? "40px" : "70px",
  maxWidth:"1400px",
  margin:"auto",
},

left:{
  flex:1,
  textAlign:isMobile ? "center" : "left",
},

right:{
  flex:1,
  display:"flex",
  justifyContent:"center",
},

smallHeading:{
  color:"#4F46E5",
  fontWeight:"700",
  letterSpacing:"3px",
  marginBottom:"18px",
  fontSize:isMobile ? "13px" : "15px",
},

heading:{
  fontSize:isMobile ? "34px" : "52px",
  fontWeight:"800",
  lineHeight:"1.25",
  color:"#111827",
  marginBottom:"24px",
},

description:{
  fontSize:isMobile ? "16px" : "18px",
  lineHeight:"1.8",
  color:"#6B7280",
  marginBottom:"30px",
},

tags:{
  display:"flex",
  flexWrap:"wrap",
  justifyContent:isMobile ? "center" : "flex-start",
  gap:isMobile ? "10px" : "15px",
  marginBottom:"35px",
},

tag:{
  padding:isMobile ? "10px 16px" : "12px 22px",
  background:"#EEF2FF",
  color:"#4F46E5",
  borderRadius:"30px",
  fontWeight:"600",
  fontSize:isMobile ? "13px" : "15px",
},

button:{
  padding:isMobile ? "14px 30px" : "16px 36px",
  border:"none",
  borderRadius:"50px",
  background:"#4F46E5",
  color:"#fff",
  fontSize:isMobile ? "15px" : "17px",
  fontWeight:"700",
  cursor:"pointer",
  transition:".3s",
},

image:{
  width:"100%",
  maxWidth:isMobile ? "320px" : "550px",
  objectFit:"contain",
},

};