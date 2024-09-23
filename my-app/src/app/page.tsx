'use client';

import { FC, useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { HiPaperAirplane } from "react-icons/hi"; 
import Image from "next/image"; // Send icon

const Home: FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
        { text: "Hi!", sender: 'user' },
        { text: "Hello! How can I help you today?", sender: 'bot' },
    ]);
    const [inputText, setInputText] = useState("");
    const heroRef = useRef<HTMLDivElement>(null); // Ref for hero text animation
    const chatRef = useRef<HTMLDivElement>(null); // Ref for chat message animation
    const descriptionRef = useRef<HTMLDivElement>(null); // Ref for description

    useEffect(() => {
        // GSAP Hero Text Animation
        if (heroRef.current) {
            gsap.fromTo(heroRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
            );
        }
    }, []);

    useEffect(() => {
        // GSAP Chat Message Animation
        if (chatRef.current) {
            gsap.fromTo(chatRef.current,
                { opacity: 0, x: 100 },
                { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }
            );
        }
    }, [messages]); // Re-run the animation when a new message is added

    // const connectWallet = async () => {
    //     if (window.ethereum) {
    //         try {
    //             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //             setIsConnected(true);
    //             setAccount(accounts[0]);
    //             console.log('Connected account:', accounts[0]);
    //         } catch (error) {
    //             console.error("User denied wallet connection");
    //         }
    //     } else {
    //         alert("MetaMask is not installed. Please install MetaMask and try again.");
    //     }
    // };

    const handleSendMessage = async () => {
        if (inputText.trim()) {
            setMessages((prev) => [...prev, { text: inputText, sender: 'user' }]);
            setInputText("");

            try {
                const response = await fetch('http://127.0.0.1:8000/chat_gen', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: inputText }), // Use the inputText as prompt
                });

                const data = await response.json();
                setMessages((prev) => [...prev, { text: data.ans, sender: 'bot' }]);
            } catch (error) {
                console.error("Error sending message to backend:", error);
            }
        }
    };

    return (
        <div
            className="h-[220vh] bg-gradient-to-br from-gray-900 to-black relative overflow-hidden"
            style={{
                backgroundImage: `url(https://mkainsights.com/wp-content/uploads/2020/06/what-is-gene-therapy.jpg)`, // Replace with your image URL
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flex h-[100vh] pt-24">
                {/* Hero Text - 2/3rd */}
                <div ref={heroRef} className="w-2/3 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-7xl font-extrabold text-white shadow-md animate-bounce">
                        Your<span className="text-purple-400"> Voice</span> Matters
                    </h1>
                    <p className="mt-4 text-2xl font-semibold text-gray-300 shadow-md">
                        A compassionate app offering 24/7 support and resources for those in crisis, empowering you to seek help and find hope
                    </p>
                </div>

                {/* Chatbot - Fixed Position with Reduced Height */}
                <div className="fixed right-8 bottom-8 w-[420px] h-[calc(100%-6rem-30px)] rounded-lg p-6 flex flex-col bg-black bg-opacity-90 backdrop-blur-lg border border-purple-600 shadow-lg"
                     style={{
                         boxShadow: '0 0 20px rgba(128, 0, 128, 0.8), 0 0 30px rgba(128, 0, 128, 0.7), 0 0 40px rgba(128, 0, 128, 0.6)',
                     }}>
                    <h2 className="text-xl font-bold text-white mb-4">Confess:</h2>
                    <div ref={chatRef} className="flex-grow overflow-y-auto bg-white/10 p-4 rounded-lg mb-4 backdrop-blur-md">
                        {/* Chat Messages */}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg max-w-xs transition-transform duration-300 ${msg.sender === 'user' ? 'bg-purple-500 text-white transform hover:scale-105' : 'bg-gray-700 text-white transform hover:scale-105'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                            className="flex-grow p-3 border rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-shadow duration-200"
                            placeholder="Type your message..."
                        />
                        <div className="ml-2">
                            <button
                                onClick={handleSendMessage}
                                className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-3 rounded-lg transition-transform duration-200 transform hover:scale-105 flex items-center"
                            >
                                <HiPaperAirplane className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div ref={descriptionRef} className="absolute w-1/2 mx-auto top-[80vh] left-16 p-6">
                <div className="bg-black rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105"
                    style={{
                        border: '1px solid rgba(0, 128, 0, 0.6)',
                        boxShadow: '0 0 20px rgba(0, 0, 128, 0.8), 0 0 30px rgba(0, 0, 128, 0.7), 0 0 40px rgba(0, 0, 128, 0.6)',
                    }}
                >
                    <h2 className="text-4xl font-bold text-white mb-2">Description</h2>
                    <p className="mt-4 text-xl leading-relaxed text-gray-300">
                        This suicide prevention app serves as a vital resource for individuals in crisis, offering a compassionate and supportive environment. It provides a safe space where users can seek help, share their feelings, and access immediate support from trained counselors and mental health professionals.
                        <br />
                        <br />
                        Key features include:
                        <br />
                        <br />
                        Example prompts include:
                        <br />
                        <br />
                        “I’m feeling overwhelmed; can someone help me talk it through?”<br />
                        “What are some coping strategies for dealing with anxiety?”<br />
                        “How do I know if I need professional help?”<br />
                        “Can you provide me with resources for local mental health services?”<br />
                        “What should I do if I’m having suicidal thoughts?”<br />
                        “How can I support a friend who might be in crisis?”<br />
                        <br />
                        The app aims to reduce stigma around mental health, empowering users to take proactive steps toward healing and recovery. By promoting awareness and providing essential support, this app is dedicated to saving lives and fostering a community of hope and resilience.
                    </p>
                </div>
            </div>

            {/* Footer with Blinking Text */}
            <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="text-center">
                    <p className="text-white text-xl flex items-center justify-center">
                        <span className="px-2">Powered by</span>
                        <Image
                            src="https://www.gaianet.ai/images/logo.png" // Replace with your image URL
                            alt="Description of image"
                            width={50} // Specify the width
                            height={30} // Specify the height
                        />
                    </p>
                </div>
            </footer>

            <style jsx>{`
                .blinking {
                    animation: blinkingText 1.5s infinite;
                }

                @keyframes blinkingText {
                    0% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Home;
