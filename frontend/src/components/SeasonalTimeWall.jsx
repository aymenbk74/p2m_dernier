import React, { useState } from 'react';

/**
 * SeasonalTimeWall - A sophisticated Masonry Grid ("Mur du Temps")
 * combining visual seasonal events with operational stock forecasts.
 */
const SeasonalTimeWall = ({ events, forecasts }) => {
    
    // Helper to parse days from countdown string like "- 45 jours"
    const getDaysRemaining = (str) => {
        const match = str.match(/(\d+)/);
        return match ? parseInt(match[0], 10) : 999;
    };

    // Card Sizing Logic based on urgency
    const getCardStyle = (days) => {
        if (days <= 25) return { gridColumn: 'span 2', gridRow: 'span 2' }; // FEATURED
        if (days <= 60) return { gridRow: 'span 2' }; // URGENT TALL
        return { gridRow: 'span 1' }; // STANDARD
    };

    // Filter forecasts for a given event name
    const getStrategyForEvent = (eventName) => {
        const matchingForecast = forecasts.find(f => 
            f.product_name.toUpperCase().includes(eventName.toUpperCase()) ||
            eventName.toUpperCase().includes(f.product_name.toUpperCase())
        );
        
        if (!matchingForecast) return "Stratégie IA recommandée : Optimisation générale des stocks saisonniers.";
        
        const items = matchingForecast.metadata_info?.items || [];
        if (items.length === 0) return "Réapprovisionnement suggéré sur les pièces phares de la saison.";
        
        return `Focus suggéré : ${items.slice(0, 2).map(it => it.description.split('(')[0].trim()).join(', ')}...`;
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gridAutoRows: '220px',
            gridAutoFlow: 'dense',
            gap: '24px',
            marginTop: '30px'
        }}>
            {events.map((event, index) => {
                const days = getDaysRemaining(event.compte_a_rebours);
                const cardStyle = getCardStyle(days);
                const strategy = getStrategyForEvent(event.evenement);

                return (
                    <TimeWallCard 
                        key={index} 
                        event={event} 
                        style={cardStyle} 
                        days={days}
                        strategy={strategy}
                    />
                );
            })}

            <style>{`
                .timewall-card {
                    position: relative;
                    border-radius: 20px;
                    overflow: hidden;
                    background: #0a0a0a;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                .timewall-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    border-color: rgba(197, 160, 89, 0.4);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.6);
                    z-index: 10;
                }
                .timewall-image {
                    position: absolute;
                    inset: 0;
                    background-size: cover;
                    background-position: center;
                    transition: filter 0.6s ease, transform 0.8s ease;
                }
                .timewall-card:hover .timewall-image {
                    filter: blur(8px) brightness(0.6);
                    transform: scale(1.1);
                }
                .timewall-overlay {
                    position: absolute;
                    inset: 0;
                    padding: 30px;
                    display: flex;
                    flexDirection: column;
                    justifyContent: flex-end;
                    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%);
                    transition: background 0.5s ease;
                }
                .timewall-card:hover .timewall-overlay {
                    background: rgba(0,0,0,0.4);
                    justifyContent: center;
                    alignItems: center;
                    textAlign: center;
                }
                .strategy-text {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.5s ease 0.1s;
                    color: #c5a059;
                    font-size: 0.9rem;
                    lineHeight: 1.5;
                    marginTop: 20px;
                    fontStyle: italic;
                }
                .timewall-card:hover .strategy-text {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

const TimeWallCard = ({ event, style, days, strategy }) => {
    return (
        <div className="timewall-card" style={style}>
            <div className="timewall-image" style={{ backgroundImage: `url(${event.image_illustration})` }} />
            
            <div className="timewall-overlay">
                {/* DATE & COUNTDOWN */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                     <div style={{ 
                        background: days <= 25 ? '#ff4444' : '#c5a059', 
                        height: '6px', width: '6px', borderRadius: '50%',
                        boxShadow: days <= 25 ? '0 0 8px #ff4444' : 'none'
                    }} />
                    <span style={{ fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 'bold', color: 'rgba(255,255,255,0.6)' }}>
                        {event.compte_a_rebours.toUpperCase()}
                    </span>
                </div>

                <h4 style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: style.gridColumn ? '2.4rem' : '1.4rem', 
                    color: 'white', 
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {event.evenement}
                </h4>

                <div style={{ color: '#c5a059', fontSize: '0.75rem', marginTop: '5px', letterSpacing: '1px', opacity: 0.8 }}>
                    {event.data}
                </div>

                {/* HOVER STRATEGY REVEAL */}
                <div className="strategy-text">
                    <div style={{ marginBottom: '10px', fontSize: '0.6rem', color: 'white', letterSpacing: '2px', opacity: 0.5, textTransform: 'uppercase' }}>Intelligence Stratégique</div>
                    {strategy}
                </div>
            </div>
        </div>
    );
};

export default SeasonalTimeWall;
