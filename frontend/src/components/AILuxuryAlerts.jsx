import React, { useState } from 'react';

export const AILuxuryAlerts = ({ alerts, markAllAlertsAsRead, fetchAlerts, unreadCount, markAlertAsRead, setSelectedProductId }) => {
    const [activeTab, setActiveTab] = useState(0); // 0, 1, 2, 3
    const [selectedIds, setSelectedIds] = useState({ 0: null, 1: null, 2: null, 3: null });
    const [sortConfig, setSortConfig] = useState({ key: 'impact', direction: 'desc' }); // Default to strategic impact
    const [modalAlert, setModalAlert] = useState(null); // Alert selected for the modal

    const detectSeasonalTheme = (items) => {
        if (!items || items.length === 0) return null;
        const text = items.map(i => (i.message + ' ' + i.product_name).toLowerCase()).join(' ');
        
        if (text.includes('ramadan') || text.includes('aid') || text.includes('aïd')) {
            return {
                id: 'ramadan', name: 'RAMADAN KAREEM', primary: '#d4af37', secondary: 'rgba(50, 40, 15, 0.8)',
                icon: '🌙', bgGradient: 'radial-gradient(circle at top right, rgba(212,175,55,0.15), transparent 60%)',
                glowShadow: '0 0 50px rgba(212,175,55,0.3)', ringOpacity: '0.8',
            };
        }
        if (text.includes('été') || text.includes('summer') || text.includes('plage') || text.includes('vacances')) {
            return {
                id: 'summer', name: 'SUMMER VIBES', primary: '#ff8c00', secondary: 'rgba(40, 20, 0, 0.8)',
                icon: '☀️', bgGradient: 'radial-gradient(circle at center, rgba(255,140,0,0.15), transparent 70%)',
                glowShadow: '0 0 50px rgba(255,140,0,0.3)', ringOpacity: '0.9',
            };
        }
        if (text.includes('hiver') || text.includes('winter') || text.includes('neige') || text.includes('froid')) {
            return {
                id: 'winter', name: 'FROST EDITION', primary: '#add8e6', secondary: 'rgba(0, 10, 30, 0.8)',
                icon: '❄️', bgGradient: 'radial-gradient(circle at top, rgba(173,216,230,0.15), transparent 80%)',
                glowShadow: '0 0 50px rgba(173,216,230,0.3)', ringOpacity: '0.8',
            };
        }
        if (text.includes('valentin') || text.includes('amour') || text.includes('saint')) {
            return {
                id: 'valentine', name: 'SAINT VALENTIN', primary: '#ff1493', secondary: 'rgba(40, 0, 10, 0.8)',
                icon: '💝', bgGradient: 'radial-gradient(circle at bottom left, rgba(255,20,147,0.15), transparent 70%)',
                glowShadow: '0 0 50px rgba(255,20,147,0.3)', ringOpacity: '0.9',
            };
        }
        return null;
    };

    const outOfStockItems = alerts.filter(a => a.alert_type === 'out_of_stock' && !a.is_read);
    const lowStockItems = alerts.filter(a => a.alert_type === 'low_stock' && !a.is_read);
    const seasonalItems = alerts.filter(a => a.alert_type === 'seasonal' && !a.is_read);
    const readItems = alerts.filter(a => a.is_read);

    const seasonalTheme = detectSeasonalTheme(seasonalItems);

    const panes = [
        { id: 0, type: 'out_of_stock', title: 'RUPTURES CRITIQUES', color: '#ff4444', items: outOfStockItems, isTable: true },
        { id: 1, type: 'low_stock', title: 'STOCKS FAIBLES', color: '#c5a059', items: lowStockItems, isTable: true },
        { id: 2, type: 'seasonal', title: 'TENDANCES IA', color: seasonalTheme ? seasonalTheme.primary : '#00f0ff', items: seasonalItems, theme: seasonalTheme },
        { id: 3, type: 'all', title: 'HISTORIQUE TRAITÉ', color: '#888888', items: readItems, isTable: true }
    ];

    const handleSelect = (paneId, alertId) => {
        setSelectedIds(prev => ({ ...prev, [paneId]: alertId }));
    };

    const extractLoss = (text) => {
        if (!text) return 0;
        // Robust extraction: Look for numbers with € or EUR, handling spaces/dots
        const cleanText = text.replace(/[\s\.]/g, '');
        const currencyMatch = cleanText.match(/(\d+)€|€(\d+)|(\d+)EUR|EUR(\d+)/i);
        if (currencyMatch) {
            const val = currencyMatch[1] || currencyMatch[2] || currencyMatch[3] || currencyMatch[4];
            return parseInt(val) || 0;
        }
        // Fallback: take the largest number (losses are usually the main figure)
        const allNumbers = cleanText.match(/\d+/g);
        if (allNumbers) {
            return Math.max(...allNumbers.map(n => parseInt(n)));
        }
        return 0;
    };

    const getBadgeStyle = (type, themeColor = null) => {
        if (type === 'out_of_stock') return { color: '#ff4444', label: 'CRITIQUE', border: '#ff4444' };
        if (type === 'low_stock') return { color: '#c5a059', label: 'IMPORTANT', border: '#c5a059' };
        if (type === 'seasonal') return { color: themeColor || '#00f0ff', label: 'TENDANCE', border: themeColor || '#00f0ff' };
        return { color: '#888888', label: 'RÉSOLU', border: '#888888' };
    };

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key !== key) return { key, direction: 'asc' };
            if (prev.direction === 'asc') return { key, direction: 'desc' };
            return { key: null, direction: 'asc' }; // Reset to match inventory
        });
    };

    const getSortedItems = (items) => {
        let sorted = [...items];
        if (sortConfig.key) {
            sorted.sort((a, b) => {
                let valA, valB;
                if (sortConfig.key === 'name') {
                    valA = a.product_name.toLowerCase();
                    valB = b.product_name.toLowerCase();
                    return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                } else if (sortConfig.key === 'date') {
                    valA = new Date(a.created_at || 0).getTime();
                    valB = new Date(b.created_at || 0).getTime();
                } else if (sortConfig.key === 'id') {
                    valA = a.id;
                    valB = b.id;
                } else if (sortConfig.key === 'impact') {
                    const getVal = (item) => {
                        const base = item.metadata?.impact_ca || extractLoss(item.metadata?.analyse_financiere);
                        return Number(String(base).replace(/[^\d\.]/g, '')) || 0;
                    };
                    valA = getVal(a);
                    valB = getVal(b);
                } else if (sortConfig.key === 'stock') {
                    valA = Number(a.metadata?.stock !== undefined ? a.metadata.stock : 999);
                    valB = Number(b.metadata?.stock !== undefined ? b.metadata.stock : 999);
                }
                return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
            });
        }
        return sorted;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Outfit', sans-serif", position: 'relative' }}>
            
            {/* Modal for Focused Item Details */}
            {modalAlert && (
                <div style={{ 
                    position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center',
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s'
                }} onClick={() => setModalAlert(null)}>
                    
                    <div style={{ 
                        background: 'rgba(15, 12, 10, 0.95)', border: `1px solid ${getBadgeStyle(modalAlert.alert_type).color}`,
                        borderRadius: '24px', padding: '50px', width: '900px', maxWidth: '90%', 
                        display: 'flex', gap: '40px', boxShadow: `0 30px 60px rgba(0,0,0,0.8), inset 0 0 30px ${getBadgeStyle(modalAlert.alert_type).color}20`,
                        position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                        
                        <button onClick={() => setModalAlert(null)} style={{ position: 'absolute', top: '25px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.5 }}>✕</button>

                        <div style={{ flex: '0 0 40%', height: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#080808', borderRadius: '16px', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)', overflow: 'hidden' }}>
                                {modalAlert.image_url ? (
                                    <img src={modalAlert.image_url} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <div style={{ fontSize: '6rem', opacity: 0.2 }}>📦</div>
                                )}
                            </div>
                            
                            {/* KPI Badges for Supply Chain */}
                            {modalAlert.metadata && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '5px' }}>STOCK RÉEL</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: modalAlert.metadata.stock === 0 ? '#ff4444' : '#fff' }}>{modalAlert.metadata.stock} PCS</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '5px' }}>PRIX UNITAIRE</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{modalAlert.metadata.prix_unitaire} €</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '25px' }}>
                                <span style={{ 
                                    display: 'inline-block', background: 'rgba(50,0,0,0.4)', border: `1px solid ${getBadgeStyle(modalAlert.alert_type).color}`, 
                                    color: getBadgeStyle(modalAlert.alert_type).color, fontSize: '0.65rem', padding: '6px 15px', 
                                    borderRadius: '100px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '15px'
                                }}>
                                    {modalAlert.metadata?.categorie || getBadgeStyle(modalAlert.alert_type).label}
                                </span>
                                
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '2.5rem', fontFamily: "'Playfair Display', serif" }}>{modalAlert.product_name}</h3>
                                {modalAlert.metadata?.details && (
                                    <div style={{ fontSize: '0.8rem', color: '#c5a059', letterSpacing: '2px', fontWeight: 'bold' }}>{modalAlert.metadata.details.toUpperCase()}</div>
                                )}
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                {/* Standard Message section */}
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', marginBottom: '10px', fontWeight: 'bold' }}>RAPPORT OPÉRATIONNEL</div>
                                    <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                                        {modalAlert.message.split('|')[0]}
                                    </p>
                                </div>

                                {/* Luxury Financial Analysis Section from n8n */}
                                {modalAlert.metadata?.analyse_financiere && (
                                    <div style={{ background: 'rgba(197, 160, 89, 0.05)', borderLeft: '3px solid #c5a059', padding: '20px 25px', borderRadius: '0 12px 12px 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>💎</span>
                                            <span style={{ fontSize: '0.7rem', color: '#c5a059', letterSpacing: '2px', fontWeight: 'bold' }}>ANALYSE STRATÉGIQUE IA</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#fff', fontStyle: 'italic', lineHeight: '1.6' }}>
                                            "{modalAlert.metadata.analyse_financiere}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
                                {!modalAlert.is_read && (
                                    <button 
                                        onClick={() => { markAlertAsRead(modalAlert.id); setModalAlert(null); }}
                                        style={{ flex: 1, background: getBadgeStyle(modalAlert.alert_type).color, border: 'none', color: '#000', padding: '18px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '1px', cursor: 'pointer', transition: '0.3s' }}
                                    >
                                        VALIDER & TRAITER
                                    </button>
                                )}
                                {modalAlert.product_id && (
                                    <button 
                                        onClick={() => { setSelectedProductId(modalAlert.product_id); setModalAlert(null); }}
                                        style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '18px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '1px', cursor: 'pointer', transition: '0.3s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        INVENTAIRE DÉTAILLÉ →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* THE NEW REGISTRATION STYLE CONTAINER */}
            <div style={{ 
                flex: 1, display: 'flex', flexDirection: 'column', 
                background: 'rgba(20, 20, 20, 0.4)', backdropFilter: 'blur(40px)',
                borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.5)', overflow: 'hidden', padding: '40px'
            }}>
                
                {/* Header Actions & Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', color: 'white', margin: 0, fontFamily: "'Playfair Display', serif", letterSpacing: '1px' }}>REGISTRE DES ALERTES IA</h2>
                        <p style={{ color: '#c5a059', fontSize: '0.65rem', letterSpacing: '4px', fontWeight: 'bold', marginTop: '8px' }}>SYSTÈME D'ANALYSE PRÉDICTIVE</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={markAllAlertsAsRead} disabled={unreadCount === 0} style={{ 
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', 
                            padding: '12px 25px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', transition: '0.3s'
                        }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                            MARQUER TOUT LU
                        </button>
                        <button onClick={fetchAlerts} style={{ 
                            background: '#c5a059', border: 'none', color: 'black', padding: '12px 30px', borderRadius: '100px', 
                            cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', boxShadow: '0 10px 20px rgba(197,160,89,0.2)' 
                        }}>
                            ACTUALISER
                        </button>
                    </div>
                </div>

                {/* Styled Category Tabs (Match Inventory Filtering feel) */}
                <div style={{ display: 'flex', gap: '40px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
                    {panes.map((pane) => (
                        <div 
                            key={pane.id}
                            onClick={() => setActiveTab(pane.id)}
                            style={{ cursor: 'pointer', padding: '10px 0', position: 'relative', transition: '0.3s', opacity: activeTab === pane.id ? 1 : 0.4 }}
                        >
                            <span style={{ fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2px', color: activeTab === pane.id ? pane.color : 'white' }}>
                                {pane.theme && activeTab === pane.id ? `${pane.theme.icon} ${pane.title}` : pane.title}
                                <span style={{ marginLeft: '10px', fontSize: '0.6rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '100px', color: 'white' }}>{pane.items.length}</span>
                            </span>
                            {activeTab === pane.id && (
                                <div style={{ position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '2px', background: pane.color, boxShadow: `0 0 15px ${pane.color}` }}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Viewport for Sliding Windows */}
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ 
                        display: 'flex', width: '100%', height: '100%',
                        transition: 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
                        transform: `translateX(-${activeTab * 100}%)`
                    }}>
                        
                        {panes.map(pane => (
                            <div key={pane.id} className="custom-scroll" style={{ minWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                                
                                {pane.items.length === 0 ? (
                                    <div style={{ textAlign: 'center', opacity: 0.3, padding: '100px 0' }}>
                                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔔</div>
                                        <div style={{ letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>AUCUNE ALERTE ACTIVE</div>
                                    </div>
                                ) : pane.isTable ? (
                                    <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '15px' }} className="custom-scroll">
                                        <table className="history-table-luxury">
                                            <thead>
                                                <tr>
                                                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                                        DÉSIGNATION {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                    </th>
                                                    <th onClick={() => handleSort('id')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                                        RÉFÉRENCE {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                    </th>
                                                    <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                                        STOCK / PRIX {sortConfig.key === 'stock' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                    </th>
                                                    <th onClick={() => handleSort('date')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                                        DÉLAI {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                    </th>
                                                    <th onClick={() => handleSort('impact')} style={{ cursor: 'pointer', userSelect: 'none', color: '#c5a059' }}>
                                                        PERTE DE CA {sortConfig.key === 'impact' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                    </th>
                                                    <th>ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getSortedItems(pane.items).map(a => {
                                                    const statusStyle = getBadgeStyle(pane.type, pane.color);
                                                    const parts = a.product_name.includes(' - ') ? a.product_name.split(' - ') : [null, a.product_name];
                                                    const brand = parts[0];
                                                    const name = parts[1];

                                                    return (
                                                        <tr key={a.id} onClick={() => setModalAlert(a)} 
                                                            className={a.metadata?.categorie === 'URGENCE' ? 'aura-critical' : ''}
                                                            style={{ cursor: 'pointer' }}>
                                                            
                                                            {/* Designation */}
                                                            <td style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px' }}>
                                                                <div style={{ width: '40px', height: '40px', background: '#0a0a0a', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                                                                    {a.image_url ? <img src={a.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    {brand && <span style={{ fontSize: '0.55rem', color: '#c5a059', letterSpacing: '1px', fontWeight: 'bold' }}>{brand.toUpperCase()}</span>}
                                                                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{name.toUpperCase()}</div>
                                                                </div>
                                                            </td>

                                                            {/* Reference / ID */}
                                                            <td style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.6)' }}>#{a.id}</td>

                                                            {/* Stock / Price peek */}
                                                            <td style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                                                                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>{a.metadata?.stock ?? '?'}</span> <span style={{ opacity: 0.5 }}>uni.</span>
                                                                <div style={{ fontSize: '0.65rem', color: '#c5a059' }}>{a.metadata?.prix_unitaire ? `${a.metadata.prix_unitaire}€ / uni.` : 'Détails IA'}</div>
                                                            </td>

                                                            {/* Status Badge */}
                                                            <td>
                                                                <span style={{ 
                                                                    display: 'inline-block', padding: '6px 12px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '1px',
                                                                    background: `${statusStyle.color}15`, border: `1px solid ${statusStyle.color}30`, color: statusStyle.color
                                                                }}>
                                                                    {a.metadata?.categorie === "URGENCE" ? "AURA CRITIQUE" : (a.metadata?.categorie || statusStyle.label)}
                                                                </span>
                                                            </td>

                                                            {/* Impact IA peek */}
                                                            <td style={{ fontSize: '0.9rem', color: '#c5a059', fontWeight: '900' }}>
                                                                {a.metadata?.impact_ca ? `${a.metadata.impact_ca}€` : `${extractLoss(a.metadata?.analyse_financiere)}€`}
                                                            </td>

                                                            <td style={{ textAlign: 'right' }}>
                                                                <button onClick={(e) => { e.stopPropagation(); setModalAlert(a); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 12px', borderRadius: '4px', fontSize: '0.6rem', cursor: 'pointer' }}>DÉTAILS IA</button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    /* Seasonal Mode Header-style Card */
                                    (() => {
                                        const theme = pane.theme;
                                        const selectedAlert = pane.items.find(a => a.id === selectedIds[pane.id]) || pane.items[0];
                                        return (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                <div style={{ 
                                                    background: theme ? theme.secondary : 'rgba(5, 5, 8, 0.4)',
                                                    backgroundImage: theme ? theme.bgGradient : 'none',
                                                    borderRadius: '24px', padding: '40px', display: 'flex', alignItems: 'center', gap: '50px',
                                                    position: 'relative', border: '1px solid rgba(255,255,255,0.05)',
                                                    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4)'
                                                }}>
                                                    <div style={{ flex: '0 0 30%', textAlign: 'center' }}>
                                                        <div style={{ fontSize: '6rem' }}>{theme?.icon || '⚙️'}</div>
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{ margin: 0, fontSize: '2.5rem', fontFamily: "'Playfair Display', serif" }}>{selectedAlert.product_name}</h3>
                                                        <p style={{ margin: '15px 0 30px 0', fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>{selectedAlert.message}</p>
                                                        <button onClick={() => setModalAlert(selectedAlert)} style={{ background: pane.color, border: 'none', color: 'black', padding: '15px 40px', borderRadius: '100px', fontWeight: 'bold', cursor: 'pointer' }}>CONSULTER L'ANALYSE</button>
                                                    </div>
                                                </div>
                                                {/* Mini bars for others */}
                                                {pane.items.map(a => (
                                                    <div key={a.id} onClick={() => handleSelect(pane.id, a.id)} style={{ background: 'rgba(255,255,255,0.02)', padding: '15px 25px', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'bold' }}>{a.product_name}</span>
                                                        <span style={{ color: pane.color }}>+ Détails</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium UI Animations & Styles */}
            <style>{`
                @keyframes auraPulse {
                    0% { box-shadow: 0 0 10px rgba(255, 68, 68, 0.1); }
                    50% { box-shadow: 0 0 25px rgba(255, 68, 68, 0.3); }
                    100% { box-shadow: 0 0 10px rgba(255, 68, 68, 0.1); }
                }

                .aura-critical {
                    animation: auraPulse 3s infinite ease-in-out;
                }

                .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: rgba(197, 160, 89, 0.3);
                    border-radius: 10px;
                }
                .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(197, 160, 89, 0.5);
                }
            `}</style>
        </div>
    );
};
