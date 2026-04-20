import React, { useState, useEffect, useCallback } from 'react';

const SeasonalAnticipation = ({ forecasts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const allItems = forecasts.reduce((acc, f) => {
        const metadata = f.metadata || f.metadata_info || {};
        return [...acc, ...(metadata.items || [])];
    }, []);

    const getSeasonName = () => {
        const raw = (forecasts.length > 0 ? (forecasts[0].metadata?.season_title || forecasts[0].metadata_info?.season_title) : null) || "";
        const name = raw.toUpperCase().replace("PRÉVISIONS", "").trim();
        if (!name || name.includes("SARTORIAL") || name.includes("MINIMALISME")) return "PRINTEMPS";
        return name;
    };
    const seasonName = getSeasonName();

    const navigate = useCallback((newIndex) => {
        if (isAnimating || newIndex === currentIndex) return;
        setIsAnimating(true);
        setPrevIndex(currentIndex);
        setCurrentIndex(newIndex);
        setTimeout(() => {
            setPrevIndex(null);
            setIsAnimating(false);
        }, 900);
    }, [isAnimating, currentIndex]);

    const goNext = useCallback(() => {
        navigate((currentIndex + 1) % allItems.length);
    }, [currentIndex, allItems.length, navigate]);

    const goPrev = useCallback(() => {
        navigate((currentIndex - 1 + allItems.length) % allItems.length);
    }, [currentIndex, allItems.length, navigate]);

    // Auto-advance
    useEffect(() => {
        if (allItems.length <= 1 || isHovered) return;
        const timer = setInterval(goNext, 3500);
        return () => clearInterval(timer);
    }, [allItems.length, isHovered, goNext]);

    if (!forecasts || allItems.length === 0) return null;

    const currentItem = allItems[currentIndex];
    const descParts = (currentItem.description || "").split('(');
    const itemName = descParts[0].trim();
    const itemContext = descParts[1] ? descParts[1].replace(')', '').trim() : "Style Impressionnant";

    return (
        <div
            className="sa-pro-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            {/* LEFT PANEL: Editorial Content */}
            <div className="sa-pro-text-panel">

                {/* Season Header (always visible) */}
                <div className="sa-pro-header">
                    <div className="sa-pro-label">COLLECTION</div>
                    <h2 className="sa-pro-title">
                        L'Essentiel du <span className="sa-pro-gold">{seasonName}</span>
                    </h2>
                </div>

                {/* Sliding Content */}
                <div className="sa-pro-content" key={currentIndex}>
                    <span className="sa-pro-tag">
                        {String(currentIndex + 1).padStart(2, '0')} — {String(allItems.length).padStart(2, '0')}
                    </span>
                    <h3 className="sa-pro-item-name">{itemName}</h3>
                    <p className="sa-pro-item-desc">
                        "{itemContext}. Une pièce stratégique pour la saison {seasonName.toLowerCase()}."
                    </p>
                </div>

                {/* Footer: Button + Dots */}
                <div className="sa-pro-footer">
                    <button className="sa-pro-cta">EXPLORER</button>
                    <div className="sa-pro-dots">
                        {allItems.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(i)}
                                className={`sa-pro-dot ${i === currentIndex ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Cinematic Image Gallery */}
            <div className="sa-pro-image-panel">
                {/* Leaving Image (old) */}
                {prevIndex !== null && (
                    <div
                        className="sa-pro-img sa-pro-img-exit"
                        style={{ backgroundImage: `url(${allItems[prevIndex].image_url})` }}
                    >
                        <div className="sa-pro-img-overlay-left" />
                    </div>
                )}

                {/* Entering Image (new) */}
                <div
                    className={`sa-pro-img ${isAnimating ? 'sa-pro-img-enter' : 'sa-pro-img-idle'}`}
                    style={{ backgroundImage: `url(${currentItem.image_url})` }}
                >
                    <div className="sa-pro-img-overlay-left" />
                    <div className="sa-pro-img-overlay-bottom" />
                </div>

                {/* SEASON NAME OVERLAY */}
                <div className="sa-pro-season-overlay">
                    <div className="sa-pro-season-tag">SAISON</div>
                    <div className="sa-pro-season-name">{seasonName}</div>
                </div>

                {/* Arrows */}
                <button className="sa-pro-arrow sa-pro-arrow-l" onClick={(e) => { e.stopPropagation(); goPrev(); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button className="sa-pro-arrow sa-pro-arrow-r" onClick={(e) => { e.stopPropagation(); goNext(); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
                </button>

                {/* Timer Bar */}
                {!isHovered && (
                    <div className="sa-pro-timer-track">
                        <div className="sa-pro-timer-fill" key={currentIndex} />
                    </div>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&display=swap');

                .sa-pro-container {
                    height: 560px;
                    display: flex;
                    border-radius: 28px;
                    background: #060606;
                    border: 1px solid rgba(255,255,255,0.06);
                    box-shadow: 0 50px 120px rgba(0,0,0,0.7);
                    position: relative;
                    overflow: hidden;
                }

                /* TEXT PANEL */
                .sa-pro-text-panel {
                    flex: 0 0 46%;
                    padding: 60px 55px 45px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    z-index: 5;
                }
                .sa-pro-header { margin-bottom: auto; }
                .sa-pro-label {
                    color: #c5a059;
                    font-size: 0.65rem;
                    letter-spacing: 8px;
                    font-weight: 900;
                    margin-bottom: 12px;
                }
                .sa-pro-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.8rem;
                    color: white;
                    margin: 0;
                    line-height: 1;
                    letter-spacing: -1px;
                }
                .sa-pro-gold { color: #c5a059; }

                /* ANIMATED CONTENT */
                .sa-pro-content {
                    margin: 45px 0;
                    animation: saContentReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes saContentReveal {
                    0% { opacity: 0; transform: translateY(30px); filter: blur(4px); }
                    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
                }

                .sa-pro-tag {
                    display: inline-block;
                    padding: 5px 14px;
                    background: rgba(197, 160, 89, 0.08);
                    border: 1px solid rgba(197, 160, 89, 0.15);
                    color: #c5a059;
                    font-size: 0.6rem;
                    letter-spacing: 5px;
                    font-weight: 900;
                    margin-bottom: 22px;
                }
                .sa-pro-item-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem;
                    color: white;
                    margin: 0 0 18px;
                    font-weight: 400;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    line-height: 1.2;
                }
                .sa-pro-item-desc {
                    font-size: 1.05rem;
                    color: rgba(255,255,255,0.45);
                    line-height: 1.8;
                    font-style: italic;
                    font-weight: 300;
                    margin: 0;
                }

                /* FOOTER */
                .sa-pro-footer {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .sa-pro-cta {
                    background: transparent;
                    color: white;
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 14px 40px;
                    font-weight: 900;
                    font-size: 0.6rem;
                    letter-spacing: 5px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .sa-pro-cta:hover {
                    background: #c5a059;
                    color: black;
                    border-color: #c5a059;
                }
                .sa-pro-dots { display: flex; gap: 6px; align-items: center; }
                .sa-pro-dot {
                    width: 5px; height: 5px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.15);
                    cursor: pointer;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .sa-pro-dot.active {
                    width: 28px;
                    border-radius: 3px;
                    background: #c5a059;
                }

                /* IMAGE PANEL */
                .sa-pro-image-panel {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                }

                .sa-pro-img {
                    position: absolute;
                    inset: 0;
                    background-size: cover;
                    background-position: center 25%;
                    will-change: transform, opacity, clip-path;
                }

                /* CINEMATIC CLIP-PATH REVEAL */
                .sa-pro-img-enter {
                    animation: saClipReveal 0.9s cubic-bezier(0.77, 0, 0.175, 1) forwards;
                    z-index: 3;
                }
                @keyframes saClipReveal {
                    0% {
                        clip-path: inset(0 100% 0 0);
                        transform: scale(1.08);
                    }
                    100% {
                        clip-path: inset(0 0 0 0);
                        transform: scale(1.03);
                    }
                }

                .sa-pro-img-exit {
                    z-index: 2;
                    animation: saFadeOut 0.9s ease-out forwards;
                }
                @keyframes saFadeOut {
                    0% { opacity: 1; transform: scale(1.03); }
                    100% { opacity: 0; transform: scale(1); }
                }

                /* Slow Ken Burns drift when idle */
                .sa-pro-img-idle {
                    z-index: 3;
                    animation: saKenBurns 18s ease-in-out infinite alternate;
                }
                @keyframes saKenBurns {
                    0% { transform: scale(1.03) translate(0, 0); }
                    100% { transform: scale(1.08) translate(-1%, -0.5%); }
                }

                .sa-pro-img-overlay-left {
                    position: absolute; inset: 0;
                    background: linear-gradient(to right, #060606 0%, transparent 35%);
                }
                .sa-pro-img-overlay-bottom {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(6,6,6,0.5) 0%, transparent 30%);
                }

                /* SEASON OVERLAY ON IMAGE */
                .sa-pro-season-overlay {
                    position: absolute;
                    bottom: 30px; right: 35px;
                    z-index: 8;
                    text-align: right;
                    pointer-events: none;
                }
                .sa-pro-season-tag {
                    font-size: 0.6rem;
                    letter-spacing: 6px;
                    color: rgba(255,255,255,0.4);
                    font-weight: 900;
                    margin-bottom: 4px;
                }
                .sa-pro-season-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 3.5rem;
                    color: rgba(255,255,255,0.12);
                    font-weight: 800;
                    letter-spacing: 8px;
                    text-transform: uppercase;
                    line-height: 1;
                    text-shadow: 0 2px 30px rgba(0,0,0,0.3);
                }

                /* ARROWS (hidden until hover) */
                .sa-pro-arrow {
                    position: absolute;
                    top: 50%; transform: translateY(-50%);
                    z-index: 20;
                    width: 46px; height: 46px;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.7);
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.4s;
                    opacity: 0;
                }
                .sa-pro-container:hover .sa-pro-arrow { opacity: 1; }
                .sa-pro-arrow:hover {
                    background: #c5a059; color: black; border-color: #c5a059;
                    transform: translateY(-50%) scale(1.1);
                }
                .sa-pro-arrow-l { left: 20px; }
                .sa-pro-arrow-r { right: 20px; }

                /* AUTO TIMER BAR */
                .sa-pro-timer-track {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 2px;
                    background: rgba(255,255,255,0.05);
                    z-index: 10;
                }
                .sa-pro-timer-fill {
                    height: 100%;
                    background: #c5a059;
                    animation: saTimerFill 3.5s linear forwards;
                }
                @keyframes saTimerFill {
                    0% { width: 0; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default SeasonalAnticipation;
