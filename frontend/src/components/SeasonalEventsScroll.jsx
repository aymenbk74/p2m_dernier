import React, { useState, useEffect } from 'react';

/**
 * SeasonalEventsScroll - A premium sliding component to display
 * upcoming seasonal events (Christmas, New Year, etc.) with countdowns.
 */
const SeasonalEventsScroll = ({ events }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!events || events.length <= 1 || isHovered) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
        }, 2200); // Faster scrolling (2.2 seconds)
        return () => clearInterval(interval);
    }, [events, isHovered]);

    if (!events || events.length === 0) return null;

    const currentEvent = events[currentIndex];

    // Manual navigation
    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % events.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    };

    return (
        <div 
            className="reveal" 
            style={{ 
                marginBottom: '50px', 
                overflow: 'hidden', 
                height: '550px', 
                display: 'flex',
                borderRadius: '24px',
                background: '#0a0a0a',
                border: '1px solid rgba(197, 160, 89, 0.1)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
                position: 'relative'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* BACKGROUND IMAGE WITH SCALE ANIMATION */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                {events.map((event, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${event.image_illustration})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: index === currentIndex ? 1 : 0,
                            transform: index === currentIndex ? 'scale(1.05)' : 'scale(1.15)',
                            transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 8s linear',
                        }}
                    >
                        {/* LUXURY GRADIENT OVERLAY */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.7) 40%, transparent 100%)'
                        }} />
                    </div>
                ))}
            </div>

            {/* CONTENT LAYER */}
            <div style={{ 
                position: 'relative', 
                zIndex: 1, 
                width: '50%', 
                padding: '80px', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div key={currentIndex} className="reveal-event">
                    {/* COUNTDOWN BADGE */}
                    <div style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(197, 160, 89, 0.15)',
                        border: '1px solid rgba(197, 160, 89, 0.3)',
                        padding: '8px 20px',
                        borderRadius: '100px',
                        marginBottom: '30px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <span style={{ color: '#c5a059', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px' }}>
                            {currentEvent.compte_a_rebours.toUpperCase()}
                        </span>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff4444', boxShadow: '0 0 10px #ff4444' }} />
                    </div>

                    <div style={{ color: '#c5a059', fontSize: '0.9rem', letterSpacing: '8px', fontWeight: '800', marginBottom: '15px', opacity: 0.8 }}>
                        ÉVÉNEMENT PROCHE
                    </div>

                    <h2 style={{ 
                        fontFamily: "'Playfair Display', serif", 
                        fontSize: '4.5rem', 
                        color: 'white', 
                        margin: 0,
                        lineHeight: '1',
                        letterSpacing: '-2px',
                        textTransform: 'uppercase'
                    }}>
                        {currentEvent.evenement}
                    </h2>

                    <div style={{ 
                        fontSize: '1.4rem', 
                        color: 'rgba(255,255,255,0.5)', 
                        marginTop: '20px',
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: 'italic',
                        fontWeight: '300'
                    }}>
                        {currentEvent.data}
                    </div>

                    <p style={{ 
                        fontSize: '1.1rem', 
                        color: 'rgba(255,255,255,0.4)', 
                        lineHeight: '1.8', 
                        marginTop: '30px',
                        maxWidth: '450px'
                    }}>
                        Préparez votre inventaire pour l'un des moments les plus stratégiques de l'année. L'IA recommande une anticipation des stocks sur les catégories phares.
                    </p>

                    <button style={{
                        marginTop: '40px',
                        background: 'transparent',
                        color: '#c5a059',
                        border: '1px solid #c5a059',
                        padding: '18px 45px',
                        borderRadius: '0',
                        fontWeight: '900',
                        fontSize: '0.8rem',
                        letterSpacing: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#c5a059'; e.currentTarget.style.color = 'black'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c5a059'; }}
                    >
                        OPTIMISER LES STOCKS
                    </button>
                </div>
            </div>

            {/* NAVIGATION DOTS */}
            <div style={{ 
                position: 'absolute', 
                bottom: '40px', 
                left: '80px', 
                display: 'flex', 
                gap: '15px', 
                zIndex: 2 
            }}>
                {events.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            height: '2px',
                            width: index === currentIndex ? '50px' : '20px',
                            background: index === currentIndex ? '#c5a059' : 'rgba(255,255,255,0.15)',
                            transition: 'all 0.6s ease',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>

            {/* SIDE NAVIGATION ARROWS */}
            <div style={{ position: 'absolute', bottom: '40px', right: '40px', display: 'flex', gap: '15px', zIndex: 10 }}>
                <button onClick={handlePrev} style={navButtonStyle}>‹</button>
                <button onClick={handleNext} style={navButtonStyle}>›</button>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&display=swap');
                .reveal-event {
                    animation: slideUpFade 1s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
            `}</style>
        </div>
    );
};

const navButtonStyle = {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '1.5rem',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: '0.3s',
    backdropFilter: 'blur(10px)'
};

export default SeasonalEventsScroll;
