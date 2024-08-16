import React, { useState } from 'react';
import { Spotlight } from "./ui/spotlight";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db, collection, addDoc } from '../firebase';



const genAI = new GoogleGenerativeAI("YOUR API KEY");

export function StoryGenerator() {
  const [responses, setResponses] = useState({
    feel: '',
    taleType: '',
  });
  const [story, setStory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);
  const handleChange = (field, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { feel, taleType } = responses;
  
    if (!feel.trim() || !taleType.trim()) return;
  
    setLoading(true);
    setError('');
  
    const prompt = `
      Generate a story based on the following input:
      - Feeling: ${feel}
      - Tale Type: ${taleType}
      The story should be engaging and tailored to the specified feeling and type of tale. 
      Ensure the story is captivating and aligns with the input provided.
      It should be long, beautiful and well structured.
    `;
  
    try {
      const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      setStory(text);
      setApiData(text);
  
      // Store story in Firestore
      await addDoc(collection(db, 'stories'), {
        feeling: feel,
        taleType: taleType,
        story: text,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error generating content:", error);
      setError("An error occurred while generating the story.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language here
    speechSynthesis.speak(utterance);
  };


  return (
    <div className="h-[50rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          MoodSync <br /> brings to you peace.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Share your feelings and tale type, and let me craft a story for you.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">How do you feel?</label>
            <input
              type="text"
              value={responses.feel}
              onChange={(e) => handleChange('feel', e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">What type of tale would be soothing for you?</label>
            <input
              type="text"
              value={responses.taleType}
              onChange={(e) => handleChange('taleType', e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {loading ? 'Generating...' : 'Generate Story'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {story && (
          <div className="mt-4 max-h-[15rem] overflow-y-auto bg-gray-800 p-4 rounded-md">
            <h3 className="text-xl text-white font-bold">Your Story:</h3>
            <div className='text-white'>{formatResponse(story)}</div>
          </div>
        )}
        <button
              onClick={() => handleTextToSpeech(story)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Read Aloud
            </button>
      </div>
    </div>
  );
};  
// Function to format AI responses with HTML
const formatResponse = (text) => {
  // Split the text into paragraphs
  const paragraphs = text.split("\n").filter((para) => para.trim() !== "");

  return paragraphs.map((paragraph, index) => {
    // Replace **text** with <strong>text</strong>
    const boldFormatted = paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Replace _text_ with <em>text</em>
    const italicFormatted = boldFormatted.replace(/_(.*?)_/g, "<em>$1</em>");

    // Check if the paragraph starts with a number (for options)
    const isOption = /^\d+\.\s/.test(paragraph);
    return (
      <p
        key={index}
        className={`mb-2 ${isOption ? "font-semibold" : ""}`}
        dangerouslySetInnerHTML={{ __html: italicFormatted }}
      />
    );
  });
};
