import React, { useState, useMemo, useEffect } from 'react';

/**
 * AIDemandChart - v3.3 High-precision SVG.
 */
const AIDemandChart = ({ mood, eventType }) => {
    const points = useMemo(() => {
        const pts = [];
        const isSpike = eventType.toUpperCase().includes('BLACK FRIDAY');
        for (let i = 0; i <= 100; i += 2) {
            let y;
            if (isSpike) y = 18 - (Math.pow(1.04, i) * 0.3) + (Math.random() * 0.5);
            else y = 15 - (Math.sin(i / 20) * 8) - (i / 10) + (Math.random() * 0.4);
            pts.push({ x: i, y: Math.max(2, y) });
        }
        return pts;
    }, [eventType]);

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    const areaPath = `${linePath} L 100,20 L 0,20 Z`;
    
    return (
        <div style={{ marginTop: '25px', background: 'rgba(0,0,0,0.3)', padding: '25px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', opacity: 0.5, letterSpacing: '3px', fontWeight: '900', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', background: mood.main, borderRadius: '50%' }} />
                    PREDICTIVE DEMAND FLUX
                </div>
                <div style={{ color: '#00ffcc' }}>CONFID. 98%</div>
            </div>
            <div style={{ height: '70px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={mood.main} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={mood.main} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#areaGradient)" />
                    <path d={linePath} fill="none" stroke={mood.main} strokeWidth="0.5" strokeLinecap="round" className="pulse-path" />
                </svg>
                <div style={{ position: 'absolute', bottom: '-20px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>
                    <span>J-30</span><span>J-15</span><span style={{ color: mood.main }}>J-0</span>
                </div>
            </div>
            <style>{`
                .pulse-path { stroke-dasharray: 200; stroke-dashoffset: 200; animation: drawLine 2.5s ease-out forwards; }
                @keyframes drawLine { to { stroke-dashoffset: 0; } }
            `}</style>
        </div>
    );
};

/**
 * SeasonalTimeline v3.4 - PROFESSIONAL GLASS NAVIGATION EDITION
 */
const SeasonalTimeline = ({ events, forecasts, inventory }) => {
    
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [checklist, setChecklist] = useState({});

    const getDaysRemaining = (str) => {
        const match = str.match(/(\d+)/);
        return match ? parseInt(match[0], 10) : 999;
    };

    const sortedEvents = useMemo(() => {
        return [...events].sort((a, b) => getDaysRemaining(a.compte_a_rebours) - getDaysRemaining(b.compte_a_rebours));
    }, [events]);

    if (sortedEvents.length === 0) return null;
    const currentEvent = sortedEvents[activeIndex];
    const days = getDaysRemaining(currentEvent.compte_a_rebours);

    const getMood = (eventName) => {
        const name = eventName.toUpperCase();
        if (name.includes('NOËL')) return { main: '#c5a059', bg: 'rgba(255,255,255,0.05)', accent: '#ffffff', glow: 'rgba(197, 160, 89, 0.4)', trend: '+35%' };
        if (name.includes('NOUVEL AN')) return { main: '#ffffff', bg: 'rgba(255,255,255,0.02)', accent: '#c5a059', glow: 'rgba(255,255,255,0.3)', trend: '+28%' };
        if (name.includes('BLACK FRIDAY')) return { main: '#ff4444', bg: 'rgba(255,0,0,0.05)', accent: '#ff4444', glow: 'rgba(255, 68, 68, 0.4)', trend: '+115%' };
        if (name.includes('RAMADAN')) return { main: '#00ffcc', bg: 'rgba(0,255,204,0.03)', accent: '#00ffcc', glow: 'rgba(0, 255, 204, 0.3)', trend: '+42%' };
        return { main: '#c5a059', bg: 'rgba(255,255,255,0.03)', accent: '#c5a059', glow: 'rgba(197, 160, 89, 0.3)', trend: '+15%' };
    };

    const mood = getMood(currentEvent.evenement);

    const getExclusiveIDEAs = (eventName) => {
        const name = eventName.toUpperCase();
        if (name.includes('NOËL')) return [
            { name: "Manteau Cachemire 'Minuit'", reason: "Tendance J-10", margin: "ROI Élevé" },
            { name: "Set Accessoires 'Cristal'", reason: "Complément panier", margin: "Premium" }
        ];
        if (name.includes('BLACK FRIDAY')) return [
            { name: "Sneakers 'Onyx Steiner'", reason: "Hype prévue", margin: "Volume" },
            { name: "Hoodie Tech-Fabric 'Carbon'", reason: "Exclusivité 48h", margin: "Flash Sale" }
        ];
        if (name.includes('RAMADAN')) return [
            { name: "Abaya 'Émeraude Impériale'", reason: "Tendance soie/lin", margin: "Signature" },
            { name: "Châle 'Perle Dorée'", reason: "Cadeau potentiel", margin: "Accessoire" }
        ];
        return [{ name: "Collection Capsule Exclusive", reason: "Opportunité Marché", margin: "Saisonnier" }];
    };

    const strategy = useMemo(() => {
        const matchingForecast = forecasts.find(f => 
            f.product_name.toUpperCase().includes(currentEvent.evenement.toUpperCase()) ||
            currentEvent.evenement.toUpperCase().includes(f.product_name.toUpperCase())
        );
        const enrichedItems = (matchingForecast?.metadata_info?.items || []).map(rec => {
            const realProduct = inventory.find(p => p.name.toUpperCase().includes(rec.description.split('(')[0].trim().toUpperCase()));
            return { ...rec, realData: realProduct, risk: Math.random() > 0.6 ? 'HAUT' : 'MODÉRÉ' };
        });
        const exclusives = getExclusiveIDEAs(currentEvent.evenement);
        return {
            items: enrichedItems,
            exclusives,
            narrative: `L'analyse pour ${currentEvent.evenement} indique une demande en hausse de ${mood.trend}. Nous recommandons de combiner vos best-sellers avec la **Capsule Exclusive** suggérée ci-dessous pour maximiser la marge brute.`
        };
    }, [currentEvent, forecasts, inventory, mood.trend]);

    useEffect(() => { setSelectedPiece(null); }, [activeIndex]);

    const toggleTask = (taskId) => {
        const key = `${currentEvent.evenement}-${taskId}`;
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const defaultTasks = ["Contacter les fournisseurs", "Régler les stocks", "Préparation campagne marketing"];

    return (
        <div className="elite-hub-container-v3 reveal" key={currentEvent.evenement}>
            
            {/* 1. TOP NAVIGATION: FLOATING GLASS STEPPER + ARROWS */}
            <div style={{ position: 'relative', padding: '60px 0 100px 0', display: 'flex', alignItems: 'center', gap: '25px' }}>

                {/* LEFT ARROW */}
                <button
                    onClick={() => setActiveIndex(i => Math.max(0, i - 1))}
                    disabled={activeIndex === 0}
                    className="nav-arrow-btn"
                    style={{
                        flexShrink: 0,
                        width: '44px', height: '44px',
                        borderRadius: '50%',
                        background: activeIndex === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${activeIndex === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)'}`,
                        color: activeIndex === 0 ? 'rgba(255,255,255,0.15)' : 'white',
                        cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem',
                        backdropFilter: 'blur(10px)',
                        transition: '0.3s',
                        zIndex: 10,
                    }}
                >
                    ←
                </button>

                {/* TRACK CONTAINER */}
                <div style={{ flex: 1, position: 'relative' }}>
                    {/* Background Track */}
                    <div style={{
                        position: 'absolute',
                        left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
                        height: '2px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '10px'
                    }} />

                    {/* Progress Fill */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        width: sortedEvents.length > 1
                            ? `${(activeIndex / (sortedEvents.length - 1)) * 100}%`
                            : '100%',
                        top: '50%', transform: 'translateY(-50%)',
                        height: '2px',
                        background: mood.main,
                        boxShadow: `0 0 12px ${mood.main}`,
                        transition: '0.8s cubic-bezier(0.19, 1, 0.22, 1)',
                        borderRadius: '10px'
                    }} />

                    {/* NODES */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 2,
                        padding: '30px 0',
                    }}>
                        {sortedEvents.map((event, index) => {
                            const isActive = index === activeIndex;
                            const isPast = index < activeIndex;
                            return (
                                <div
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    style={{
                                        position: 'relative',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* FLOATING GLASS PILL (active only) */}
                                    {isActive && (
                                        <div className="active-glass-pill" style={{
                                            position: 'absolute',
                                            bottom: '22px',
                                            background: 'rgba(255,255,255,0.08)',
                                            backdropFilter: 'blur(20px)',
                                            WebkitBackdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            padding: '10px 22px',
                                            borderRadius: '50px',
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '2px',
                                            boxShadow: `0 10px 40px rgba(0,0,0,0.4), 0 0 20px ${mood.main}22`,
                                            animation: 'pillSlideIn 0.5s ease-out',
                                        }}>
                                            <div style={{ fontSize: '0.5rem', letterSpacing: '4px', color: mood.main, fontWeight: '900' }}>
                                                {event.compte_a_rebours.toUpperCase()}
                                            </div>
                                            <div style={{ fontSize: '0.95rem', color: 'white', fontWeight: '800', letterSpacing: '1px' }}>
                                                {event.evenement.toUpperCase()}
                                            </div>
                                        </div>
                                    )}

                                    {/* DIAMOND NODE */}
                                    <div style={{
                                        width: isActive ? '13px' : '8px',
                                        height: isActive ? '13px' : '8px',
                                        borderRadius: '2px',
                                        transform: 'rotate(45deg)',
                                        background: isActive || isPast ? mood.main : 'rgba(255,255,255,0.2)',
                                        boxShadow: isActive ? `0 0 18px ${mood.main}` : 'none',
                                        border: isActive ? '2px solid white' : 'none',
                                        transition: '0.5s cubic-bezier(1, 0, 0, 1)',
                                    }} />

                                    {/* HOVER LABEL (inactive only) */}
                                    {!isActive && (
                                        <div className="hover-reveal-label" style={{
                                            position: 'absolute',
                                            top: '22px',
                                            fontSize: '0.55rem',
                                            letterSpacing: '2px',
                                            color: isPast ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)',
                                            whiteSpace: 'nowrap',
                                            fontWeight: '700',
                                            transition: '0.3s',
                                        }}>
                                            {event.evenement.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT ARROW */}
                <button
                    onClick={() => setActiveIndex(i => Math.min(sortedEvents.length - 1, i + 1))}
                    disabled={activeIndex === sortedEvents.length - 1}
                    className="nav-arrow-btn"
                    style={{
                        flexShrink: 0,
                        width: '44px', height: '44px',
                        borderRadius: '50%',
                        background: activeIndex === sortedEvents.length - 1 ? 'rgba(255,255,255,0.03)' : `${mood.main}22`,
                        border: `1px solid ${activeIndex === sortedEvents.length - 1 ? 'rgba(255,255,255,0.05)' : mood.main}`,
                        color: activeIndex === sortedEvents.length - 1 ? 'rgba(255,255,255,0.15)' : mood.main,
                        cursor: activeIndex === sortedEvents.length - 1 ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem',
                        backdropFilter: 'blur(10px)',
                        transition: '0.3s',
                        zIndex: 10,
                    }}
                >
                    →
                </button>
            </div>

            {/* 2. MAIN HUB (THREE COLUMNS - BALANCED) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.6fr 1fr', gap: '30px', minHeight: '650px', animation: 'fadeInScale 0.8s ease-out' }}>
                
                {/* COL 1: VISUAL HERO & COUNTER */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', position: 'relative', border: `1px solid ${mood.glow}` }}>
                        <div className="hero-viewport" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                            <img src={currentEvent.image_illustration} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} className="ken-burns-v3" />
                        </div>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }} />
                        <div style={{ position: 'absolute', bottom: '30px', left: '30px' }}>
                             <div style={{ color: mood.main, fontSize: '0.7rem', fontWeight: '900', letterSpacing: '4px', marginBottom: '5px' }}>RDV STRATÉGIQUE</div>
                             <h3 style={{ color: 'white', fontSize: '2.5rem', margin: 0, fontFamily: "'Playfair Display', serif" }}>{currentEvent.data}</h3>
                        </div>
                    </div>
                </div>

                {/* COL 2: AI BRAIN & OPPORTUNITIES */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div className="glass-panel-v3" style={{ flex: 1, padding: '45px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                             <div style={{ color: mood.main, fontSize: '0.75rem', fontWeight: '900', letterSpacing: '6px' }}>AI REPORT</div>
                             <div style={{ background: mood.main, padding: '4px 12px', borderRadius: '4px', color: 'black', fontSize: '0.6rem', fontWeight: '900' }}>TENDANCE {mood.trend}</div>
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '4rem', color: 'white', margin: 0, lineHeight: '0.9' }}>{currentEvent.evenement}</h2>
                        
                        <p style={{ marginTop: '25px', fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', fontStyle: 'italic' }}>
                            “{strategy.narrative}”
                        </p>

                        <AIDemandChart mood={mood} eventType={currentEvent.evenement} />

                        {/* EXCLUSIVE SUGGESTIONS */}
                        <div style={{ marginTop: '40px' }}>
                            <div style={{ fontSize: '0.65rem', letterSpacing: '4px', color: '#c5a059', fontWeight: '900', marginBottom: '20px' }}>OPPORTUNITÉS D'EXCLUSIVITÉS</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {strategy.exclusives.map((ex, i) => (
                                    <div key={i} className="exclusive-card-gold">
                                        <div style={{ color: 'white', fontWeight: '900', fontSize: '0.9rem', marginBottom: '5px' }}>{ex.name.toUpperCase()}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{ex.reason}</div>
                                        <div style={{ marginTop: '12px', borderTop: '1px solid rgba(197, 160, 89, 0.1)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.6rem', color: '#c5a059', fontWeight: '800' }}>{ex.margin}</span>
                                            <button style={{ background: 'transparent', border: '1px solid #c5a059', color: '#c5a059', fontSize: '0.5rem', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>INTÉGRER</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* COL 3: PRODUCTION & ACTION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div className="glass-panel-v3" style={{ flex: 1, padding: '35px' }}>
                        <div style={{ color: 'white', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '4px', marginBottom: '30px' }}>WORKFLOW OPÉRATIONNEL</div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {defaultTasks.map((task, i) => {
                                const isDone = checklist[`${currentEvent.evenement}-${i}`];
                                return (
                                    <div key={i} className="workflow-item-v3" style={{ opacity: isDone ? 0.3 : 1 }}>
                                        <div onClick={() => toggleTask(i)} style={{ width: '22px', height: '22px', borderRadius: '6px', border: `2px solid ${mood.main}`, background: isDone ? mood.main : 'transparent', cursor: 'pointer' }} />
                                        <div style={{ flex: 1, fontSize: '0.8rem', color: 'white', textDecoration: isDone ? 'line-through' : 'none' }}>{task}</div>
                                        {!isDone && <div style={{ fontSize: '0.55rem', color: mood.main, fontWeight: '900', cursor: 'pointer' }}>LANCER</div>}
                                    </div>
                                );
                            })}
                        </div>

                         <div style={{ marginTop: '50px', padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: `1px solid ${mood.glow}` }}>
                             <div style={{ fontSize: '0.6rem', color: mood.main, letterSpacing: '4px', fontWeight: '950', marginBottom: '10px' }}>CONSEIL STRATÉGIQUE</div>
                             <p style={{ color: 'white', fontSize: '0.75rem', lineHeight: '1.6', margin: 0, fontWeight: '300' }}>
                                 "Combinez l'anticipation des stocks avec la mise en avant de votre **Capsule Exclusive**. Stockage recommandé à J-20 pour éviter toute rupture."
                             </p>
                        </div>
                    </div>

                    <button className="ultimate-hub-btn-pro-v3" style={{ background: mood.main }}>
                         DÉPLOIEMENT STRATÉGIQUE GLOBAL
                    </button>
                </div>
            </div>

            <style>{`
                .glass-panel-v3 { background: rgba(255,255,255,0.02); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08); border-radius: 35px; box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
                
                .exclusive-card-gold { background: rgba(197, 160, 89, 0.05); padding: 25px; border-radius: 20px; border: 1px solid rgba(197, 160, 89, 0.2); transition: 0.3s; }
                .exclusive-card-gold:hover { transform: scale(1.05); background: rgba(197, 160, 89, 0.1); border-color: #c5a059; }
                
                .workflow-item-v3 { display: flex; align-items: center; gap: 15px; padding: 18px; border-radius: 15px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); }

                .ken-burns-v3 { animation: kenBurnsHero 20s infinite alternate ease-in-out; }
                @keyframes kenBurnsHero { from { transform: scale(1.05); } to { transform: scale(1.12) rotate(1deg); } }

                .ultimate-hub-btn-pro-v3 {
                    padding: 25px; border-radius: 50px; color: black; font-weight: 950; letter-spacing: 5px; font-size: 0.85rem; 
                    cursor: pointer; border: none; transition: 0.4s; box-shadow: 0 30px 60px rgba(0,0,0,0.4);
                }
                .ultimate-hub-btn-pro-v3:hover { transform: translateY(-5px); color: white; background: black !important; border: 1px solid white !important; }
                
                @keyframes fadeInScale { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
                .reveal { animation: revealIn 0.8s ease-out; }
                @keyframes revealIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                @keyframes pillSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .active-glass-pill { z-index: 100; pointer-events: none; }
                
                .hover-reveal-label { transition: 0.3s; opacity: 0.4; }
                div:hover > .hover-reveal-label { opacity: 1; color: white; }

                .nav-arrow-btn:not(:disabled):hover { transform: scale(1.1) !important; box-shadow: 0 5px 20px rgba(0,0,0,0.4); }
            `}</style>
        </div>
    );
};

export default SeasonalTimeline;
