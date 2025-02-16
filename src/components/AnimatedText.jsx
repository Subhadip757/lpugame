import React, { useState, useEffect } from "react";

const AnimatedText = () => {
  const words = ["Tests", "Quizes", "Games"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const typingSpeed = isDeleting ? 100 : 150;
    const pauseBeforeDelete = 1000;
    const pauseBetweenWords = 1500;

    if (!isDeleting && subIndex === words[index].length) {
      // Word is fully typed, pause before deleting
      setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      return;
    }

    if (isDeleting && subIndex === 0) {
      // Word is fully deleted, move to next word
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => (isDeleting ? prev - 1 : prev + 1));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, words]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-4 rounded-xl w-72 overflow-hidden text-center">
        <div className="text-gray-400 font-medium text-xl flex items-center justify-center">
          <p className="text-2xl mr-2">Available</p>
          <span className="text-orange-500">
            {words[index].substring(0, subIndex)}
            <span className={`${blink ? "opacity-100" : "opacity-0"}`}>|</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedText;
