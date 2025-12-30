import React, { useState } from 'react';

const SlideDeck = ({ slides }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
            aspectRatio: '16/9',
            background: 'linear-gradient(145deg, #0f172a, #1e293b)',
            borderRadius: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            {/* Slide Content */}
            <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '4rem',
                textAlign: 'center',
                transition: 'opacity 0.5s ease',
                key: currentSlide
            }}>
                <div style={{
                    fontSize: '1rem',
                    color: '#38bdf8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '1rem',
                    fontWeight: 700
                }}>
                    Slide {currentSlide + 1} / {slides.length}
                </div>

                <h2 style={{
                    fontSize: '3rem',
                    fontWeight: 800,
                    marginBottom: '2rem',
                    background: 'linear-gradient(to right, #f8fafc, #cbd5e1)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent'
                }}>
                    {slides[currentSlide].title}
                </h2>

                <div style={{
                    fontSize: '1.35rem',
                    lineHeight: 1.6,
                    color: '#94a3b8',
                    maxWidth: '80ch'
                }}>
                    {slides[currentSlide].content}
                </div>

                {slides[currentSlide].bullets && (
                    <ul style={{
                        marginTop: '2rem',
                        textAlign: 'left',
                        display: 'inline-block',
                        fontSize: '1.15rem',
                        color: '#cbd5e1',
                        listStyle: 'none'
                    }}>
                        {slides[currentSlide].bullets.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ color: '#818cf8' }}>•</span> {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Controls */}
            <button onClick={prevSlide} style={{
                position: 'absolute',
                left: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                padding: '1rem',
                borderRadius: '50%',
                transition: 'background 0.2s',
                zIndex: 10
            }} className="hover:bg-white/10">
                &#8249;
            </button>

            <button onClick={nextSlide} style={{
                position: 'absolute',
                right: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                padding: '1rem',
                borderRadius: '50%',
                transition: 'background 0.2s',
                zIndex: 10
            }} className="hover:bg-white/10">
                &#8250;
            </button>

            {/* Dots */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '0.75rem'
            }}>
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        style={{
                            width: '0.75rem',
                            height: '0.75rem',
                            borderRadius: '50%',
                            border: 'none',
                            background: currentSlide === idx ? '#38bdf8' : 'rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                            padding: 0
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SlideDeck;
