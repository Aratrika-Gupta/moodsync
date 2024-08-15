"use client";

import { motion } from "framer-motion";
import React, {useState} from "react";
import { AuroraBackground } from "./ui/aurora";
import TypingAnimation from "./ui/typing";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export function AuroraBackgroundDemo() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
    const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log('User logged in with Google successfully');
      navigate('/generate'); // Redirect to the generation page
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <TypingAnimation className="text-3xl text-white md:text-7xl font-bold text-center" text="Let me Weave your Dream."/>
        <div className="font-extralight text-white text-base md:text-4xl py-4">
          Reach for the Stars.
        </div>
        <button className="bg-white rounded-full w-fit text-black px-4 py-2"onClick={handleGoogleLogin}>Login with Google</button>
      </motion.div>
    </AuroraBackground>
  );
}
