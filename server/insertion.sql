-- ==============================================================================
-- PARTIE 2 : INSERTION DU CATALOGUE (36 PRODUITS)
-- ==============================================================================

-- PRODUIT 1 : Robe
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(1, 'Robe Fleurie Bohème', 'Mango', 'Robe', 'Femme', NULL, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500', '{ "style": "Bohème", "saison": "Eté" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(1, 'S', 'Rouge Corail', '#FF7F50', 49.99, 5, 'MNGO-ROBE-S'), (1, 'M', 'Rouge Corail', '#FF7F50', 49.99, 12, 'MNGO-ROBE-M'), (1, 'L', 'Rouge Corail', '#FF7F50', 49.99, 20, 'MNGO-ROBE-L');

-- PRODUIT 2 : Parka
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(2, 'Parka Grand Froid', 'North Face', 'Manteau', 'Mixte', NULL, 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500', '{ "style": "Sport", "saison": "Hiver" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, promo_price, stock_quantity, sku) VALUES
(2, 'L', 'Noir', '#000000', 299.00, 250.00, 3, 'NF-PARKA-BLK-L'), (2, 'XL', 'Kaki', '#556B2F', 299.00, NULL, 8, 'NF-PARKA-GRN-XL');

-- PRODUIT 3 : Costume
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(3, 'Costume Slim Fit', 'Hugo Boss', 'Costume', 'Homme', NULL, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500', '{ "style": "Chic", "occasion": "Travail" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(3, '50', 'Bleu Nuit', '#191970', 450.00, 2, 'HB-SUIT-BLU-50'), (3, '52', 'Bleu Nuit', '#191970', 450.00, 5, 'HB-SUIT-BLU-52');

-- PRODUIT 4 : Sneakers
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(4, 'Air Jordan 1 High Retro', 'Nike', 'Chaussures', 'Mixte', NULL, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500', '{ "style": "Streetwear" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(4, '42', 'Rouge/Blanc', '#FF0000', 180.00, 15, 'NK-JD1-RED-42'), (4, '43', 'Rouge/Blanc', '#FF0000', 180.00, 10, 'NK-JD1-RED-43');

-- PRODUIT 5 : Sac
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(5, 'Sac Cabas Classique', 'Gucci', 'Accessoires', 'Femme', NULL, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', '{ "style": "Luxe" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(5, 'Unique', 'Marron', '#8B4513', 1200.00, 2, 'GCC-BAG-BRN');

-- PRODUIT 6 : Hoodie One Piece
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(6, 'Hoodie One Piece Crew', 'AnimeWear', 'Vêtements', 'Mixte', NULL, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', '{ "style": "Streetwear" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(6, 'L', 'Noir', '#000000', 55.00, 20, 'OP-HOODIE-BLK-L'), (6, 'XL', 'Noir', '#000000', 55.00, 14, 'OP-HOODIE-BLK-XL');

-- PRODUIT 7 : Robe de Soirée
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(7, 'Robe de Cocktail Satinée', 'Zara', 'Robe', 'Femme', NULL, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500', '{ "style": "Glamour" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(7, 'S', 'Vert Émeraude', '#50C878', 89.90, 8, 'ZARA-SATIN-GRN-S'), (7, 'M', 'Vert Émeraude', '#50C878', 89.90, 2, 'ZARA-SATIN-GRN-M');

-- PRODUIT 8 : Robe Pull
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(8, 'Robe Pull en Maille', 'H&M', 'Robe', 'Femme', NULL, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500', '{ "style": "Casual", "saison": "Hiver" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(8, 'M', 'Beige', '#F5F5DC', 39.99, 20, 'HM-KNIT-BEI-M'), (8, 'L', 'Beige', '#F5F5DC', 39.99, 15, 'HM-KNIT-BEI-L');

-- PRODUIT 9 : Robe Chemise
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(9, 'Robe Chemise Ceinturée', 'Massimo Dutti', 'Robe', 'Femme', NULL, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500', '{ "style": "Business" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(9, '38', 'Bleu Ciel', '#87CEEB', 79.00, 5, 'MD-SHIRT-BLU-38');

-- PRODUIT 10 : Jean Slim Brut
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(10, 'Jean Slim Brut', 'Levis', 'Pantalon', 'Homme', NULL, 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500', '{ "style": "Casual" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, promo_price, stock_quantity, sku) VALUES
(10, '32', 'Indigo', '#4B0082', 99.00, 79.00, 30, 'LVS-JEAN-IND-32');

-- PRODUIT 11 : Legging
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(11, 'Legging Haute Performance', 'Lululemon', 'Sport', 'Femme', NULL, 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=500', '{ "style": "Sport" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(11, 'S', 'Noir', '#000000', 88.00, 10, 'LULU-LEG-BLK-S');

-- PRODUIT 12 : Veste Denim
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(12, 'Veste Denim Vintage', 'VintageStore', 'Veste', 'Mixte', NULL, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500', '{ "style": "Vintage" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(12, 'L', 'Bleu Délavé', '#ADD8E6', 65.00, 1, 'VINT-JKT-BLU-L');

-- PRODUIT 13 : SmartWatch
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(13, 'SmartWatch Series 5', 'TechBrand', 'Accessoires', 'Mixte', NULL, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500', '{ "style": "Tech" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(13, 'Unique', 'Noir Mat', '#2F4F4F', 250.00, 50, 'TECH-WATCH-BLK');

-- PRODUIT 14 : Chelsea Boots
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(14, 'Chelsea Boots Cuir', 'Dr. Martens', 'Chaussures', 'Mixte', 'Bottines robustes pour l''automne/hiver.', 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=500', '{ "style": "Rock" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(14, '43', 'Marron Foncé', '#654321', 140.00, 6, 'DOC-BOOT-BRN-43');

-- PRODUIT 15 : T-Shirt
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(15, 'T-Shirt Coton Bio', 'Uniqlo', 'T-shirt', 'Homme', NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', '{ "style": "Basique" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(15, 'L', 'Blanc', '#FFFFFF', 15.00, 100, 'UNI-TEE-WHT-L');

-- PRODUIT 16 : Casquette
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(16, 'Casquette NY', 'New Era', 'Accessoires', 'Mixte', NULL, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', '{ "style": "Streetwear" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(16, 'Unique', 'Bleu Marine', '#000080', 25.00, 15, 'NY-CAP-NAVY');

-- PRODUIT 17 : Chemise Lin
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(17, 'Chemise Légère en Lin', 'Ralph Lauren', 'Chemise', 'Homme', 'La chemise respirante indispensable pour l''été.', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', '{ "style": "Casual Chic" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(17, 'L', 'Blanc', '#FFFFFF', 89.00, 15, 'RL-LINEN-WHT-L');

-- PRODUIT 18 : Trench
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(18, 'Trench Coat Beige', 'Burberry', 'Manteau', 'Femme', 'L''icône de la mi-saison, imperméable.', 'https://images.unsplash.com/photo-1620137158758-d4469a473e3a?w=500', '{ "style": "Classique" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(18, 'M', 'Beige', '#F5F5DC', 850.00, 3, 'BUR-TRCH-BEI-M');

-- PRODUIT 19 : Short
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(19, 'Short Running DryFit', 'Nike', 'Sport', 'Homme', NULL, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500', '{ "style": "Sport" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, promo_price, stock_quantity, sku) VALUES
(19, 'L', 'Gris', '#808080', 35.00, 25.00, 50, 'NK-RUN-GRY-L');

-- PRODUIT 20 : Lunettes
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(20, 'Lunettes Aviator', 'Ray-Ban', 'Accessoires', 'Mixte', NULL, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', '{ "style": "Vintage" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(20, 'Unique', 'Doré', '#FFD700', 140.00, 10, 'RB-AVIATOR-GLD');

-- PRODUIT 21 : Blazer
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(21, 'Blazer Cintré Noir', 'Zara', 'Veste', 'Femme', NULL, 'https://images.unsplash.com/photo-1548624313-0396c75e4e1a?w=500', '{ "style": "Business" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(21, '38', 'Noir', '#000000', 59.95, 20, 'ZARA-BLZ-BLK-38');

-- PRODUIT 22 : Maillot
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(22, 'Maillot Une Pièce', 'Etam', 'Plage', 'Femme', NULL, 'https://images.unsplash.com/photo-1576186726580-a816e8b12896?w=500', '{ "style": "Plage" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(22, 'M', 'Bleu Marine', '#000080', 45.00, 0, 'ETAM-SWIM-NAV-M');

-- PRODUIT 23 : Bonnet
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(23, 'Bonnet Côtelé Merino', 'Patagonia', 'Accessoires', 'Mixte', NULL, 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500', '{ "style": "Casual" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(23, 'Unique', 'Gris Chiné', '#A9A9A9', 29.00, 100, 'PAT-BEANIE-GRY');

-- PRODUIT 24 : Escarpins
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(24, 'Escarpins Vernis', 'Louboutin', 'Chaussures', 'Femme', 'L''élégance ultime pour vos soirées de gala.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500', '{ "style": "Glamour" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(24, '38', 'Rouge', '#FF0000', 650.00, 2, 'LOU-PUMP-RED-38');

-- PRODUIT 25 : Polo
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(25, 'Polo Piqué Classique', 'Lacoste', 'T-shirt', 'Homme', NULL, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500', '{ "style": "Sport Chic" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(25, 'L', 'Vert', '#008000', 95.00, 15, 'LAC-POLO-GRN-L');

-- PRODUIT 26 : Sac à Dos
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(26, 'Sac à Dos Laptop', 'Herschel', 'Accessoires', 'Mixte', NULL, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', '{ "style": "Urbain" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(26, 'Unique', 'Gris', '#808080', 75.00, 8, 'HER-BAG-GRY');

-- PRODUIT 27 : Pyjama
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(27, 'Ensemble Pyjama Satin', 'Victoria Secret', 'Nuit', 'Femme', NULL, 'https://images.unsplash.com/photo-1594803730799-75a85c889a74?w=500', '{ "style": "Cocooning" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(27, 'M', 'Rose Poudré', '#FFC0CB', 65.00, 12, 'VS-PJ-PNK-M');

-- PRODUIT 28 : Bomber
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(28, 'Bomber Jacket Aviator', 'Alpha Industries', 'Veste', 'Homme', NULL, 'https://images.unsplash.com/photo-1520975954732-57dd22299614?w=500', '{ "style": "Streetwear" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(28, 'L', 'Kaki', '#556B2F', 149.00, 6, 'ALP-BOMB-GRN-L');

-- PRODUIT 29 : Ceinture
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(29, 'Ceinture Cuir', 'Timberland', 'Accessoires', 'Homme', NULL, 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500', '{ "style": "Casual" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(29, '100cm', 'Marron', '#8B4513', 45.00, 20, 'TIM-BELT-BRN');

-- PRODUIT 30 : Jupe
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(30, 'Jupe Midi Plissée', 'Uniqlo', 'Jupe', 'Femme', NULL, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500', '{ "style": "Chic" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(30, 'M', 'Bleu Nuit', '#191970', 39.90, 8, 'UNI-SKIRT-BLU-M');

-- PRODUIT 31 : Hoodie Crop
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(31, 'Hoodie Crop Top', 'Gymshark', 'Sport', 'Femme', 'Coupe courte tendance pour l''échauffement.', 'https://images.unsplash.com/photo-1556906781-9a412961d28c?w=500', '{ "style": "Sport" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(31, 'S', 'Lavande', '#E6E6FA', 45.00, 15, 'GYM-HOOD-PUR-S');

-- PRODUIT 32 : Chino
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(32, 'Pantalon Chino Stretch', 'Dockers', 'Pantalon', 'Homme', 'L''alternative confortable au jean pour le bureau.', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', '{ "style": "Smart Casual" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, promo_price, stock_quantity, sku) VALUES
(32, '32', 'Sable', '#F4A460', 79.00, 59.00, 10, 'DOC-CHINO-SND-32');

-- PRODUIT 33 : Écharpe
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(33, 'Écharpe 100% Cachemire', 'Burberry', 'Accessoires', 'Mixte', NULL, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500', '{ "style": "Luxe" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(33, 'Unique', 'Beige Check', '#F5F5DC', 350.00, 4, 'BUR-SCARF-CHK');

-- PRODUIT 34 : Sandales
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(34, 'Sandales Spartiates', 'Tropezienne', 'Chaussures', 'Femme', NULL, 'https://images.unsplash.com/photo-1560343776-9aa8f24b2bb9?w=500', '{ "style": "Bohème" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(34, '39', 'Or', '#FFD700', 55.00, 10, 'TRP-SAND-GLD-39');

-- PRODUIT 35 : Cravate
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(35, 'Cravate Soie Unie', 'Hermès', 'Accessoires', 'Homme', NULL, 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=500', '{ "style": "Formal" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(35, 'Unique', 'Bleu Roi', '#4169E1', 180.00, 5, 'HER-TIE-BLU');

-- PRODUIT 36 : Gilet
INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes) VALUES 
(36, 'Gilet Matelassé', 'Uniqlo', 'Veste', 'Homme', NULL, 'https://images.unsplash.com/photo-1555274175-75f4056dc6ed?w=500', '{ "style": "Casual" }');
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock_quantity, sku) VALUES
(36, 'M', 'Bleu Marine', '#000080', 49.90, 25, 'UNI-VEST-NAV-M');

-- MISE À JOUR DES SÉQUENCES POUR ÉVITER LES CONFLITS D'ID LORS DES PROCHAINS AJOUTS
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_variants_id_seq', (SELECT MAX(id) FROM product_variants));

SELECT '36 produits insérés avec succès ! Vous pouvez maintenant lancer le script Python.' as status;