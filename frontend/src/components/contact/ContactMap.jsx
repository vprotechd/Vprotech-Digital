import React from "react";
import { motion } from "framer-motion";

export default function ContactMap() {
  return (
    <section style={styles.section}>
      <motion.div
        style={styles.headingContainer}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <p style={styles.tag}>OUR LOCATION</p>

        <h2 style={styles.heading}>
          Visit Our <span style={styles.highlight}>Office</span>
        </h2>

        <p style={styles.description}>
          We'd love to meet you! Visit our office for project discussions,
          business meetings, internship inquiries, or technical consultations.
        </p>
      </motion.div>

      <motion.div
        style={styles.mapContainer}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <iframe
          title="VProTech Digital Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6859.885337398972!2d76.70531749999999!3d30.720012099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fef498d23648f%3A0xb55c9dcea6ec26b!2sVproTech%20Digital!5e0!3m2!1sen!2sin!4v1783322735652!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"
          width="100%"
          height="500"
          style={styles.map}
          loading="lazy"
          allowFullScreen
        ></iframe>
      </motion.div>

      <motion.div
        style={styles.info}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
      >
        
      </motion.div>
    </section>
  );
}



const isMobile = window.innerWidth <= 768;

const styles = {

section:{
  padding: isMobile ? "70px 20px" : "120px 8%",
  background:"#F8FAFC",
},

headingContainer:{
  textAlign:"center",
  marginBottom:isMobile ? "40px" : "60px",
},

tag:{
  color:"#1769e0",
  fontWeight:"700",
  letterSpacing:"3px",
  marginBottom:"15px",
  fontSize:isMobile ? "13px" : "15px",
},

heading:{
  fontSize:isMobile ? "34px" : "52px",
  fontWeight:"800",
  color:"#111827",
  marginBottom:"20px",
  lineHeight:"1.2",
},

highlight:{
  color:"#1769e0",
},

description:{
  maxWidth:"760px",
  margin:"auto",
  fontSize:isMobile ? "16px" : "18px",
  lineHeight:"1.8",
  color:"#6B7280",
},

mapContainer:{
  maxWidth:"1300px",
  margin:isMobile ? "40px auto" : "60px auto",
  borderRadius:isMobile ? "18px" : "25px",
  overflow:"hidden",
  boxShadow:"0 25px 60px rgba(0,0,0,.12)",
  border:"1px solid #E5E7EB",
},

map:{
  border:0,
  display:"block",
  width:"100%",
  height:isMobile ? "320px" : "500px",
},

info:{
  textAlign:"center",
  padding:isMobile ? "0 10px" : "0",
},

office:{
  fontSize:isMobile ? "26px" : "32px",
  fontWeight:"700",
  marginBottom:"15px",
  color:"#111827",
},

address:{
  fontSize:isMobile ? "15px" : "18px",
  color:"#6B7280",
  lineHeight:"1.8",
},

};