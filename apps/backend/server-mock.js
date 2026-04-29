const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());

// ── Real photos from sushistory.ae ──────────────────────────────────────────
const BASE = 'https://www.sushistory.ae/wp-content/uploads';

const IMG = {
  ebi_tapuri:     `${BASE}/2025/07/EBI-TAPURI--e1752662073687.jpg`,
  vegan_roll:     `${BASE}/2025/07/VEGAN-ROLL-e1752661725306.jpg`,
  oceanic_roll:   `${BASE}/2025/07/OCEANIC-ROLL-e1752661493675.jpg`,
  peri_peri:      `${BASE}/2025/07/PERI-PERI-ROLL-e1752661190935.jpg`,
  smoked_tapuri:  `${BASE}/2025/07/SMOKE-SALMON-TAPURI-1-e1752659176785.jpg`,
  rocky_roll:     `${BASE}/2025/07/ROCKY-ROLL-e1752660230651.jpg`,
  smoked_roll:    `${BASE}/2025/07/SMOKE-SALMON-ROLL-e1752660766363.jpg`,
  komainu:        `${BASE}/2022/11/GIBEON-ROLL.jpg`,
  tatare:         `${BASE}/2022/11/TATARE-ROLL.jpg`,
  wagyu_tapuri:   `${BASE}/2022/11/WAGYU-TAPURI.jpg`,
  volcano:        `${BASE}/2015/07/Volcano-Roll-Price-50.jpg`,
  omaya:          `${BASE}/2019/03/OMAYA-ROLL.jpg`,
  dynamite_roll:  `${BASE}/2015/07/Dynamite-Roll-price-50.jpg`,
  california:     `${BASE}/2025/07/WhatsApp-Image-2025-07-16-at-14.42.42_59b2e311-scaled-e1752665908956.jpg`,
  tiger_shrimp:   `${BASE}/2019/03/TIGER-SHRIMP-ROLL_.jpg`,
  maguro_tapuri:  `${BASE}/2022/10/Maguro-tapuri1.jpg`,
  kyokujitsu:     `${BASE}/2019/03/KYOKUJITSU-MAKI.jpg`,
  philadelphia:   `${BASE}/2019/03/PHILADELPHIA-ROLL_.jpg`,
  parisian:       `${BASE}/2018/03/Parisian-roll.jpg`,
  tokyo:          `${BASE}/2018/03/Tokyo-roll.jpg`,
  kazoku:         `${BASE}/2019/03/KAZOKU-SET.jpg`,
  shizoku:        `${BASE}/2018/03/Shizoku-combo_sml.jpg`,
  sushi_imperial: `${BASE}/2018/03/Shizoku-combo_sml.jpg`,
  yamabushi:      `${BASE}/2018/03/Sashimono-combo_sml.jpg`,
  mosou:          `${BASE}/2015/02/tepk-chef-sp.jpg`,
  sashimono:      `${BASE}/2018/03/Sashimono-combo_sml.jpg`,
  wagyu_berries:  `${BASE}/2022/11/WAGYU-BERRIES.jpg`,
  wagyu_wasabi:   `${BASE}/2022/11/WAGYU-WASABI-PEPPER.jpg`,
  oyako_salmon:   `${BASE}/2019/03/OYAKO-SALMON_.jpg`,
  hotate:         `${BASE}/2019/03/HOTATE-EBI-KINOKO_.jpg`,
  grilled_wasabi: `${BASE}/2010/11/Grilled-Salmon-With-Wasabi-Pepper-Sauce.jpg`,
  grilled_butter: `${BASE}/2018/03/EMD_9067_sml.jpg`,
  spider:         `${BASE}/2015/07/Dynamite-Roll-price-50.jpg`,
  mexican:        `${BASE}/2019/03/PHILADELPHIA-ROLL_.jpg`,
  sushi_special:  `${BASE}/2018/03/Sushi-Story-special.jpeg`,
  ebi_yaki:       `${BASE}/2022/11/EBITAKI.jpg`,
  tori_karaage:   `${BASE}/2022/11/Tori-karaage.jpg`,
  fried_calamari: `${BASE}/2022/11/Fried-calamari.jpg`,
  tatake_salmon:  `${BASE}/2025/07/WhatsApp-Image-2025-07-16-at-14.41.57_5a5ddf95-scaled-e1752664915803.jpg`,
  aburi_salmon:   `${BASE}/2018/03/aburi.jpg`,
  kani_salad:     `${BASE}/2022/10/Kani-Salad.jpg`,
  salmon_cracker: `${BASE}/2019/03/SALMON-CRACKER-SALAD1.jpg`,
  seafood_gyoza:  `${BASE}/2022/10/Seafood-Gyoza-1.jpg`,
  mochi:          `${BASE}/2024/02/MOCHI-ICE-CREAM.jpg`,
  asahi:          `${BASE}/2024/04/WhatsApp-Image-2024-04-19-at-7.56.43-PM.jpeg`,
  perrier:        `${BASE}/2024/03/Perrier..png`,
  lemon_mint:     `${BASE}/2022/10/Lemon-mint.jpg`,
  juice:          `${BASE}/2015/03/juices.jpg`,
  japanese_tea:   `${BASE}/2015/03/tea.jpg`,
  soft_drink:     `${BASE}/2015/02/soft-drinks.jpg`,
};

// ── Products ─────────────────────────────────────────────────────────────────
const products = [

  // ══════════════════════════ ROLLS ═══════════════════════════
  {
    _id: '1', name: 'Ebi Tapuri', category: 'rolls', price: 45, isHit: false,
    weight: '320g', pieces: 8,
    image: IMG.ebi_tapuri, images: [IMG.ebi_tapuri],
    description: '320g · 8 pcs · Sushi rice · nori · spicy mayo · avocado · cucumber · crabstick · mochi ebi · dynamite sauce · goma sauce · teriyaki glaze · black tobiko · green tobiko',
    fullDescription: '320g · 8 pcs · Sushi rice · nori · spicy mayo · avocado · cucumber · crabstick · mochi ebi · dynamite sauce · goma sauce · teriyaki glaze · black tobiko · green tobiko',
    rating: 4.9, reviews: 134,
  },
  {
    _id: '2', name: 'Vegan Roll', category: 'rolls', price: 34, isHit: false,
    weight: '280g', pieces: 8,
    image: IMG.vegan_roll, images: [IMG.vegan_roll],
    description: '280g · 8 pcs · Sushi rice · nori · mango · avocado · cucumber · pickled ginger · dates · white sesame seeds · spicy mayo · strawberry glaze · fresh strawberry',
    fullDescription: '280g · 8 pcs · Sushi rice · nori · mango · avocado · cucumber · pickled ginger · dates · white sesame seeds · spicy mayo · strawberry glaze · fresh strawberry',
    rating: 4.7, reviews: 89,
  },
  {
    _id: '3', name: 'Oceanic Roll', category: 'rolls', price: 61, isHit: true,
    weight: '340g', pieces: 8,
    image: IMG.oceanic_roll, images: [IMG.oceanic_roll],
    description: '340g · 8 pcs · Sushi rice · nori · fresh salmon · fresh tuna · avocado top · spicy mayo · dynamite sauce · teriyaki glaze · red tobiko · spring onion',
    fullDescription: '340g · 8 pcs · Sushi rice · nori · fresh salmon · fresh tuna · avocado top · spicy mayo · dynamite sauce · teriyaki glaze · red tobiko · spring onion',
    rating: 4.9, reviews: 201,
  },
  {
    _id: '4', name: 'Peri Peri Roll', category: 'rolls', price: 41, isHit: false,
    weight: '300g', pieces: 8,
    image: IMG.peri_peri, images: [IMG.peri_peri],
    description: '300g · 8 pcs · Sushi rice · nori · smoked salmon · avocado · cucumber · homemade spicy furikake · goma sauce',
    fullDescription: '300g · 8 pcs · Sushi rice · nori · smoked salmon · avocado · cucumber · homemade spicy furikake · goma sauce',
    rating: 4.7, reviews: 112,
  },
  {
    _id: '5', name: 'Smoked Salmon Tapuri', category: 'rolls', price: 48, isHit: false,
    weight: '320g', pieces: 8,
    image: IMG.smoked_tapuri, images: [IMG.smoked_tapuri],
    description: '320g · 8 pcs · Sushi rice · nori · avocado · crabstick · cucumber · smoked salmon top · goma sauce · honey mustard · teriyaki glaze · crispy black kibi',
    fullDescription: '320g · 8 pcs · Sushi rice · nori · avocado · crabstick · cucumber · smoked salmon top · goma sauce · honey mustard · teriyaki glaze · crispy black kibi',
    rating: 4.8, reviews: 156,
  },
  {
    _id: '6', name: 'Rocky Roll', category: 'rolls', price: 58, isHit: false,
    weight: '330g', pieces: 8,
    image: IMG.rocky_roll, images: [IMG.rocky_roll],
    description: '330g · 8 pcs · Sushi rice · nori · smoked salmon · crabstick · avocado · crispy black kibi crust · shrimp tempura top · spicy mayo · chipotle sauce · teriyaki glaze · red tobiko',
    fullDescription: '330g · 8 pcs · Sushi rice · nori · smoked salmon · crabstick · avocado · crispy black kibi crust · shrimp tempura top · spicy mayo · chipotle sauce · teriyaki glaze · red tobiko',
    rating: 4.9, reviews: 178,
  },
  {
    _id: '7', name: 'Smoked Salmon Roll', category: 'rolls', price: 60, isHit: false,
    weight: '340g', pieces: 8,
    image: IMG.smoked_roll, images: [IMG.smoked_roll],
    description: '340g · 8 pcs · Sushi rice · nori · philadelphia cream cheese · cucumber · smoked salmon · jalapeño · crabstick · avocado top · spicy mayo · chipotle sauce · teriyaki glaze · red & black kibi',
    fullDescription: '340g · 8 pcs · Sushi rice · nori · philadelphia cream cheese · cucumber · smoked salmon · jalapeño · crabstick · avocado top · spicy mayo · chipotle sauce · teriyaki glaze · red & black kibi',
    rating: 4.8, reviews: 143,
  },
  {
    _id: '8', name: 'Komainu Roll', category: 'rolls', price: 57, isHit: false,
    weight: '330g', pieces: 8,
    image: IMG.komainu, images: [IMG.komainu],
    description: '330g · 8 pcs · Sushi rice · nori · spicy mayo · shrimp tempura · lollo rosso lettuce · cucumber · crispy crabstick coating · teriyaki sauce · chipotle sauce · crispy rice sticks · red tobiko',
    fullDescription: '330g · 8 pcs · Sushi rice · nori · spicy mayo · shrimp tempura · lollo rosso lettuce · cucumber · crispy crabstick coating · teriyaki sauce · chipotle sauce · crispy rice sticks · red tobiko',
    rating: 4.7, reviews: 98,
  },
  {
    _id: '9', name: 'Tatare Roll', category: 'rolls', price: 62, isHit: true,
    weight: '300g', pieces: 8,
    image: IMG.tatare, images: [IMG.tatare],
    description: '300g · 8 pcs · Sushi rice · nori · yellow tail tartare filling · fresh salmon top · black tobiko',
    fullDescription: '300g · 8 pcs · Sushi rice · nori · yellow tail tartare filling · fresh salmon top · black tobiko',
    rating: 4.9, reviews: 211,
  },
  {
    _id: '10', name: 'Wagyu Tapuri', category: 'rolls', price: 88, isHit: true,
    weight: '320g', pieces: 8,
    image: IMG.wagyu_tapuri, images: [IMG.wagyu_tapuri],
    description: '320g · 8 pcs · Sushi rice · nori · cucumber · shrimp tempura · spicy mayo · premium wagyu striploin top · tamago sauce · teriyaki glaze · black tobiko · special salt',
    fullDescription: '320g · 8 pcs · Sushi rice · nori · cucumber · shrimp tempura · spicy mayo · premium wagyu striploin top · tamago sauce · teriyaki glaze · black tobiko · special salt',
    rating: 5.0, reviews: 267,
  },
  {
    _id: '11', name: 'Volcano Roll', category: 'rolls', price: 66, isHit: false,
    weight: '350g', pieces: 8,
    image: IMG.volcano, images: [IMG.volcano],
    description: '350g · 8 pcs · Sushi rice · avocado · cucumber · crabstick · philadelphia cream cheese · shredded Japanese crabstick top · honey mustard · spicy mayo · teriyaki sauce · chipotle sauce',
    fullDescription: '350g · 8 pcs · Sushi rice · avocado · cucumber · crabstick · philadelphia cream cheese · shredded Japanese crabstick top · honey mustard · spicy mayo · teriyaki sauce · chipotle sauce',
    rating: 4.8, reviews: 189,
  },
  {
    _id: '12', name: 'Omaya Roll', category: 'rolls', price: 60, isHit: false,
    weight: '330g', pieces: 8,
    image: IMG.omaya, images: [IMG.omaya],
    description: '330g · 8 pcs · Sushi rice · shrimp tempura · avocado · spicy mayo · crabstick top · philadelphia cream cheese · dynamite sauce · honey mustard · teriyaki glaze · green tobiko',
    fullDescription: '330g · 8 pcs · Sushi rice · shrimp tempura · avocado · spicy mayo · crabstick top · philadelphia cream cheese · dynamite sauce · honey mustard · teriyaki glaze · green tobiko',
    rating: 4.7, reviews: 134,
  },
  {
    _id: '13', name: 'Dynamite Roll', category: 'rolls', price: 66, isHit: true,
    weight: '340g', pieces: 8,
    image: IMG.dynamite_roll, images: [IMG.dynamite_roll],
    description: '340g · 8 pcs · Sushi rice · cooked salmon · chipotle sauce · avocado · salmon outer wrap · seared finish · dynamite shrimp top · tobiko · spicy mayo · philadelphia cream cheese · teriyaki glaze',
    fullDescription: '340g · 8 pcs · Sushi rice · cooked salmon · chipotle sauce · avocado · salmon outer wrap · seared finish · dynamite shrimp top · tobiko · spicy mayo · philadelphia cream cheese · teriyaki glaze',
    rating: 4.9, reviews: 223,
  },
  {
    _id: '14', name: 'California Roll', category: 'rolls', price: 37, isHit: false,
    weight: '280g', pieces: 8,
    image: IMG.california, images: [IMG.california],
    description: '280g · 8 pcs · Sushi rice · crabstick · cucumber · avocado · flying fish roe · Japanese mayo',
    fullDescription: '280g · 8 pcs · Sushi rice · crabstick · cucumber · avocado · flying fish roe · Japanese mayo',
    rating: 4.6, reviews: 301,
  },
  {
    _id: '15', name: 'Tiger Shrimp Roll', category: 'rolls', price: 57, isHit: false,
    weight: '330g', pieces: 8,
    image: IMG.tiger_shrimp, images: [IMG.tiger_shrimp],
    description: '330g · 8 pcs · Sushi rice · shrimp tempura · jalapeño · spicy mayo · avocado top · crabstick · dynamite sauce · goma sauce · teriyaki glaze · red tobiko · green tobiko · black sesame seeds',
    fullDescription: '330g · 8 pcs · Sushi rice · shrimp tempura · jalapeño · spicy mayo · avocado top · crabstick · dynamite sauce · goma sauce · teriyaki glaze · red tobiko · green tobiko · black sesame seeds',
    rating: 4.8, reviews: 167,
  },
  {
    _id: '16', name: 'Maguro Tapuri', category: 'rolls', price: 59, isHit: false,
    weight: '330g', pieces: 8,
    image: IMG.maguro_tapuri, images: [IMG.maguro_tapuri],
    description: '330g · 8 pcs · Sushi rice · ebi · crabstick · jalapeño · avocado · cucumber · spicy mayo · tuna top · red & black tobiko · crunchy filo · spring onion · chipotle sauce · teriyaki glaze',
    fullDescription: '330g · 8 pcs · Sushi rice · ebi · crabstick · jalapeño · avocado · cucumber · spicy mayo · tuna top · red & black tobiko · crunchy filo · spring onion · chipotle sauce · teriyaki glaze',
    rating: 4.9, reviews: 145,
  },
  {
    _id: '17', name: 'Kyokujitsu Maki', category: 'rolls', price: 55, isHit: false,
    weight: '320g', pieces: 8,
    image: IMG.kyokujitsu, images: [IMG.kyokujitsu],
    description: '320g · 8 pcs · Sushi rice · unagi · ebi · kani · avocado · asparagus · white sesame seeds · spicy mayo · avocado top · chipotle sauce · teriyaki glaze · black tobiko · crunchy filo',
    fullDescription: '320g · 8 pcs · Sushi rice · unagi · ebi · kani · avocado · asparagus · white sesame seeds · spicy mayo · avocado top · chipotle sauce · teriyaki glaze · black tobiko · crunchy filo',
    rating: 4.8, reviews: 122,
  },
  {
    _id: '18', name: 'Philadelphia Roll', category: 'rolls', price: 55, isHit: false,
    weight: '300g', pieces: 8,
    image: IMG.philadelphia, images: [IMG.philadelphia],
    description: '300g · 8 pcs · Sushi rice · philadelphia cream cheese · fresh salmon · spicy mayo · avocado top · crunchy filo · black sesame seeds',
    fullDescription: '300g · 8 pcs · Sushi rice · philadelphia cream cheese · fresh salmon · spicy mayo · avocado top · crunchy filo · black sesame seeds',
    rating: 4.7, reviews: 198,
  },
  {
    _id: '19', name: 'Parisian Roll', category: 'rolls', price: 64, isHit: false,
    weight: '330g', pieces: 8,
    image: IMG.parisian, images: [IMG.parisian],
    description: '330g · 8 pcs · Sushi rice · salmon · mango · shiso leaves · spicy mayo · avocado top · yuzu miso sauce · spicy mayo drizzle · red tobiko · black tobiko · spring onion',
    fullDescription: '330g · 8 pcs · Sushi rice · salmon · mango · shiso leaves · spicy mayo · avocado top · yuzu miso sauce · spicy mayo drizzle · red tobiko · black tobiko · spring onion',
    rating: 4.9, reviews: 176,
  },
  {
    _id: '20', name: 'Tokyo Roll', category: 'rolls', price: 60, isHit: false,
    weight: '320g', pieces: 8,
    image: IMG.tokyo, images: [IMG.tokyo],
    description: '320g · 8 pcs · Sushi rice · unagi · avocado · asparagus · apple · sesame seeds · mayo su miso sauce · mango top · chipotle drizzle · fruit salsa · red tobiko',
    fullDescription: '320g · 8 pcs · Sushi rice · unagi · avocado · asparagus · apple · sesame seeds · mayo su miso sauce · mango top · chipotle drizzle · fruit salsa · red tobiko',
    rating: 4.8, reviews: 154,
  },

  // ══════════════════════════ SETS ════════════════════════════
  {
    _id: '21', name: 'Kazoku Set', category: 'sets', price: 465, isHit: false,
    weight: '1.8kg', pieces: 60,
    image: IMG.kazoku, images: [IMG.kazoku],
    description: '1.8kg · ~60 pcs · Sashimi: salmon · tuna · ebi · hamachi · shime saba · Nigiri: salmon · kani · ebi · Maki: California · special California · ten maki · spicy tuna · tiger shrimp roll · dynamite roll · miso soup ×4 · serves 4–5',
    fullDescription: '1.8kg · ~60 pcs · Sashimi: salmon · tuna · ebi · hamachi · shime saba · Nigiri: salmon · kani · ebi · Maki: California · special California · ten maki · spicy tuna · tiger shrimp roll · dynamite roll · miso soup ×4 · serves 4–5',
    rating: 5.0, reviews: 98,
  },
  {
    _id: '22', name: 'Shizoku Combo', category: 'sets', price: 68, isHit: false,
    weight: '480g', pieces: 14,
    image: IMG.shizoku, images: [IMG.shizoku],
    description: '480g · 14 pcs · Ten maki ×4 · California roll ×4 · ebi nigiri ×1 · kani nigiri ×1 · unagi nigiri ×1 · miso soup',
    fullDescription: '480g · 14 pcs · Ten maki ×4 · California roll ×4 · ebi nigiri ×1 · kani nigiri ×1 · unagi nigiri ×1 · miso soup',
    rating: 4.8, reviews: 143,
  },
  {
    _id: '23', name: 'Sushi Imperial', category: 'sets', price: 80, isHit: false,
    weight: '520g', pieces: 13,
    image: IMG.sushi_imperial, images: [IMG.sushi_imperial],
    description: '520g · 13 pcs · Ten maki ×4 · aburi salmon ×2 · aburi suzuki ×2 · unagi nigiri ×2 · ebi nigiri ×1 · miso soup · special salt · yuzu finish',
    fullDescription: '520g · 13 pcs · Ten maki ×4 · aburi salmon ×2 · aburi suzuki ×2 · unagi nigiri ×2 · ebi nigiri ×1 · miso soup · special salt · yuzu finish',
    rating: 4.9, reviews: 112,
  },
  {
    _id: '24', name: 'Yamabushi Combo', category: 'sets', price: 68, isHit: false,
    weight: '460g', pieces: 13,
    image: IMG.yamabushi, images: [IMG.yamabushi],
    description: '460g · 13 pcs · Special California ×4 · cucumber roll ×6 · salmon nigiri ×1 · tuna nigiri ×1 · seabass nigiri ×1 · miso soup',
    fullDescription: '460g · 13 pcs · Special California ×4 · cucumber roll ×6 · salmon nigiri ×1 · tuna nigiri ×1 · seabass nigiri ×1 · miso soup',
    rating: 4.7, reviews: 89,
  },
  {
    _id: '25', name: 'Mosou Platter', category: 'sets', price: 83, isHit: false,
    weight: '580g', pieces: 13,
    image: IMG.mosou, images: [IMG.mosou],
    description: '580g · 13 pcs · California maki ×4 · chef-choice nigiri ×9 · miso soup · Japanese salad · soy sauce · wasabi · pickled ginger',
    fullDescription: '580g · 13 pcs · California maki ×4 · chef-choice nigiri ×9 · miso soup · Japanese salad · soy sauce · wasabi · pickled ginger',
    rating: 4.8, reviews: 134,
  },
  {
    _id: '26', name: 'Sashimono Combo', category: 'sets', price: 60, isHit: false,
    weight: '400g', pieces: 8,
    image: IMG.sashimono, images: [IMG.sashimono],
    description: '400g · 8 pcs · Sushi Story special slices ×4 · deep-fried jumbo roll slices ×4 · wasabi · pickled ginger · soy sauce',
    fullDescription: '400g · 8 pcs · Sushi Story special slices ×4 · deep-fried jumbo roll slices ×4 · wasabi · pickled ginger · soy sauce',
    rating: 4.7, reviews: 102,
  },
  {
    _id: '27', name: 'Wagyu Berries Set', category: 'sets', price: 250, isHit: true,
    weight: '320g', pieces: 1,
    image: IMG.wagyu_berries, images: [IMG.wagyu_berries],
    description: '320g · Angus wagyu striploin · mixed berry reduction sauce · garlic chips · Japanese potato salad',
    fullDescription: '320g · Angus wagyu striploin · mixed berry reduction sauce · garlic chips · Japanese potato salad',
    rating: 5.0, reviews: 201,
  },
  {
    _id: '28', name: 'Wagyu Wasabi Pepper', category: 'sets', price: 250, isHit: false,
    weight: '320g', pieces: 1,
    image: IMG.wagyu_wasabi, images: [IMG.wagyu_wasabi],
    description: '320g · Angus wagyu striploin · wasabi pepper sauce · garlic chips · Japanese potato salad',
    fullDescription: '320g · Angus wagyu striploin · wasabi pepper sauce · garlic chips · Japanese potato salad',
    rating: 5.0, reviews: 178,
  },
  {
    _id: '29', name: 'Oyako Salmon', category: 'sets', price: 90, isHit: false,
    weight: '280g', pieces: 1,
    image: IMG.oyako_salmon, images: [IMG.oyako_salmon],
    description: '280g · Grilled salmon fillet · asparagus · tamago sauce · salmon roe (ikura) · spring onion',
    fullDescription: '280g · Grilled salmon fillet · asparagus · tamago sauce · salmon roe (ikura) · spring onion',
    rating: 4.9, reviews: 156,
  },
  {
    _id: '30', name: 'Hotate Ebi Kinoko', category: 'sets', price: 90, isHit: false,
    weight: '260g', pieces: 1,
    image: IMG.hotate, images: [IMG.hotate],
    description: '260g · Grilled tiger shrimp · shimeji mushroom · scallop base · soy cream butter sauce',
    fullDescription: '260g · Grilled tiger shrimp · shimeji mushroom · scallop base · soy cream butter sauce',
    rating: 4.9, reviews: 122,
  },
  {
    _id: '31', name: 'Grilled Salmon Wasabi', category: 'sets', price: 80, isHit: false,
    weight: '300g', pieces: 1,
    image: IMG.grilled_wasabi, images: [IMG.grilled_wasabi],
    description: '300g · Grilled salmon fillet · wasabi pepper glaze · sautéed beansprouts · julienne carrots · button mushrooms',
    fullDescription: '300g · Grilled salmon fillet · wasabi pepper glaze · sautéed beansprouts · julienne carrots · button mushrooms',
    rating: 4.8, reviews: 139,
  },
  {
    _id: '32', name: 'Grilled Salmon Cream Butter', category: 'sets', price: 83, isHit: false,
    weight: '300g', pieces: 1,
    image: IMG.grilled_butter, images: [IMG.grilled_butter],
    description: '300g · Pan-grilled salmon · cream butter lemon sauce · homemade fresh potato fries · asparagus · crispy salmon skin',
    fullDescription: '300g · Pan-grilled salmon · cream butter lemon sauce · homemade fresh potato fries · asparagus · crispy salmon skin',
    rating: 4.9, reviews: 167,
  },
  {
    _id: '33', name: 'Spider Roll', category: 'sets', price: 66, isHit: false,
    weight: '320g', pieces: 8,
    image: IMG.spider, images: [IMG.spider],
    description: '320g · 8 pcs · Sushi rice · deep-fried soft shell crab · avocado · karashi mayo · cucumber · tobiko · spring onion',
    fullDescription: '320g · 8 pcs · Sushi rice · deep-fried soft shell crab · avocado · karashi mayo · cucumber · tobiko · spring onion',
    rating: 4.8, reviews: 145,
  },
  {
    _id: '34', name: 'Mexican Roll', category: 'sets', price: 64, isHit: false,
    weight: '340g', pieces: 8,
    image: IMG.mexican, images: [IMG.mexican],
    description: '340g · 8 pcs · Sushi rice · mango · cucumber · avocado · philadelphia cream cheese · ebi · jalapeño · spicy mayo · seared salmon · tuna · seabass · hamachi top · chipotle · teriyaki · green tobiko',
    fullDescription: '340g · 8 pcs · Sushi rice · mango · cucumber · avocado · philadelphia cream cheese · ebi · jalapeño · spicy mayo · seared salmon · tuna · seabass · hamachi top · chipotle · teriyaki · green tobiko',
    rating: 4.9, reviews: 198,
  },
  {
    _id: '35', name: 'Sushi Story Special', category: 'sets', price: 65, isHit: false,
    weight: '310g', pieces: 8,
    image: IMG.sushi_special, images: [IMG.sushi_special],
    description: '310g · 8 pcs · Sushi rice · spicy salmon kabayaki · avocado · cucumber · shiso leaves · panko breadcrumb crust · spicy mayo · chipotle sauce · teriyaki sauce · spring onion · red tobiko',
    fullDescription: '310g · 8 pcs · Sushi rice · spicy salmon kabayaki · avocado · cucumber · shiso leaves · panko breadcrumb crust · spicy mayo · chipotle sauce · teriyaki sauce · spring onion · red tobiko',
    rating: 4.8, reviews: 112,
  },

  // ══════════════════════════ SIDES ═══════════════════════════
  {
    _id: '36', name: 'Ebi Yaki', category: 'sides', price: 55, isHit: true,
    weight: '180g', pieces: 3,
    image: IMG.ebi_yaki, images: [IMG.ebi_yaki],
    description: '180g · 3 pcs · Grilled tiger prawns · tofu ponzu sauce · orange segments · black caviar · spring onion',
    fullDescription: '180g · 3 pcs · Grilled tiger prawns · tofu ponzu sauce · orange segments · black caviar · spring onion',
    rating: 4.9, reviews: 134,
  },
  {
    _id: '37', name: 'Tori Karaage', category: 'sides', price: 48, isHit: true,
    weight: '200g', pieces: 6,
    image: IMG.tori_karaage, images: [IMG.tori_karaage],
    description: '200g · 6 pcs · Japanese fried chicken thigh · ponzu dipping sauce · Japanese potato salad · shredded cabbage',
    fullDescription: '200g · 6 pcs · Japanese fried chicken thigh · ponzu dipping sauce · Japanese potato salad · shredded cabbage',
    rating: 4.8, reviews: 178,
  },
  {
    _id: '38', name: 'Fried Calamari', category: 'sides', price: 37, isHit: false,
    weight: '180g', pieces: 8,
    image: IMG.fried_calamari, images: [IMG.fried_calamari],
    description: '180g · 8 pcs · Breaded squid rings · shima dipping sauce · shredded cabbage · cucumber garnish',
    fullDescription: '180g · 8 pcs · Breaded squid rings · shima dipping sauce · shredded cabbage · cucumber garnish',
    rating: 4.6, reviews: 143,
  },
  {
    _id: '39', name: 'Tatake Salmon', category: 'sides', price: 55, isHit: false,
    weight: '160g', pieces: 5,
    image: IMG.tatake_salmon, images: [IMG.tatake_salmon],
    description: '160g · 5 pcs · Seared salmon · jalapeño ponzu su sauce · sliced white onion · fresh strawberry · cilantro',
    fullDescription: '160g · 5 pcs · Seared salmon · jalapeño ponzu su sauce · sliced white onion · fresh strawberry · cilantro',
    rating: 4.9, reviews: 165,
  },
  {
    _id: '40', name: 'Aburi Salmon', category: 'sides', price: 39, isHit: false,
    weight: '140g', pieces: 4,
    image: IMG.aburi_salmon, images: [IMG.aburi_salmon],
    description: '140g · 4 pcs · Salmon sushi · lightly seared · special salt · yuzu juice finish · red tobiko · spring onion',
    fullDescription: '140g · 4 pcs · Salmon sushi · lightly seared · special salt · yuzu juice finish · red tobiko · spring onion',
    rating: 4.9, reviews: 212,
  },
  {
    _id: '41', name: 'Kani Salad', category: 'sides', price: 41, isHit: false,
    weight: '180g', pieces: 1,
    image: IMG.kani_salad, images: [IMG.kani_salad],
    description: '180g · Shredded Japanese crabstick · lollo rosso lettuce · diced mango · tempura flakes · spicy mayo · tobiko',
    fullDescription: '180g · Shredded Japanese crabstick · lollo rosso lettuce · diced mango · tempura flakes · spicy mayo · tobiko',
    rating: 4.7, reviews: 98,
  },
  {
    _id: '42', name: 'Salmon Cracker Salad', category: 'sides', price: 46, isHit: false,
    weight: '160g', pieces: 1,
    image: IMG.salmon_cracker, images: [IMG.salmon_cracker],
    description: '160g · Fresh salmon · avocado · red capsicum · Japanese cracker · spicy mayo · teriyaki sauce · tempura flakes · spring onion · wasabi goma · ikura salmon roe',
    fullDescription: '160g · Fresh salmon · avocado · red capsicum · Japanese cracker · spicy mayo · teriyaki sauce · tempura flakes · spring onion · wasabi goma · ikura salmon roe',
    rating: 4.8, reviews: 121,
  },
  {
    _id: '43', name: 'Seafood Gyoza', category: 'sides', price: 45, isHit: false,
    weight: '160g', pieces: 6,
    image: IMG.seafood_gyoza, images: [IMG.seafood_gyoza],
    description: '160g · 6 pcs · Pan-fried gyoza dumplings · shrimp · scallop · spring onion · ginger filling · ponzu dipping sauce',
    fullDescription: '160g · 6 pcs · Pan-fried gyoza dumplings · shrimp · scallop · spring onion · ginger filling · ponzu dipping sauce',
    rating: 4.8, reviews: 156,
  },

  // ══════════════════════════ DRINKS ══════════════════════════
  {
    _id: '44', name: 'Mochi Ice Cream', category: 'drinks', price: 16, isHit: false,
    weight: '60g', pieces: 1,
    image: IMG.mochi, images: [IMG.mochi],
    description: '60g · Japanese mochi rice cake · ice cream filling · flavours: strawberry · chocolate · vanilla · mango · matcha green tea',
    fullDescription: '60g · Japanese mochi rice cake · ice cream filling · flavours: strawberry · chocolate · vanilla · mango · matcha green tea',
    rating: 4.9, reviews: 289,
  },
  {
    _id: '45', name: 'Asahi Dry Zero', category: 'drinks', price: 25, isHit: false,
    weight: '330ml', pieces: 1,
    image: IMG.asahi, images: [IMG.asahi],
    description: '330ml · Non-alcoholic Japanese beer · dry crisp finish · zero alcohol · Halal certified',
    fullDescription: '330ml · Non-alcoholic Japanese beer · dry crisp finish · zero alcohol · Halal certified',
    rating: 4.7, reviews: 134,
  },
  {
    _id: '46', name: 'Perrier', category: 'drinks', price: 13, isHit: false,
    weight: '330ml', pieces: 1,
    image: IMG.perrier, images: [IMG.perrier],
    description: '330ml · Natural sparkling mineral water · fine natural carbonation · sourced in France',
    fullDescription: '330ml · Natural sparkling mineral water · fine natural carbonation · sourced in France',
    rating: 4.5, reviews: 87,
  },
  {
    _id: '47', name: 'Fresh Lemon Mint', category: 'drinks', price: 18, isHit: false,
    weight: '400ml', pieces: 1,
    image: IMG.lemon_mint, images: [IMG.lemon_mint],
    description: '400ml · Fresh squeezed lemon · mint leaves · sugar syrup · still or sparkling water · crushed ice',
    fullDescription: '400ml · Fresh squeezed lemon · mint leaves · sugar syrup · still or sparkling water · crushed ice',
    rating: 4.8, reviews: 203,
  },
  {
    _id: '48', name: 'Fresh Juice', category: 'drinks', price: 20, isHit: false,
    weight: '350ml', pieces: 1,
    image: IMG.juice, images: [IMG.juice],
    description: '350ml · Freshly pressed seasonal fruit juice · no added sugar · served chilled · ask for today\'s selection',
    fullDescription: '350ml · Freshly pressed seasonal fruit juice · no added sugar · served chilled · ask for today\'s selection',
    rating: 4.7, reviews: 145,
  },
  {
    _id: '49', name: 'Japanese Tea', category: 'drinks', price: 15, isHit: false,
    weight: '300ml', pieces: 1,
    image: IMG.japanese_tea, images: [IMG.japanese_tea],
    description: '300ml · Premium Japanese loose-leaf tea · served hot or iced · choice of: sencha · matcha · hojicha · genmaicha',
    fullDescription: '300ml · Premium Japanese loose-leaf tea · served hot or iced · choice of: sencha · matcha · hojicha · genmaicha',
    rating: 4.8, reviews: 178,
  },
  {
    _id: '50', name: 'Soft Drink', category: 'drinks', price: 12, isHit: false,
    weight: '330ml', pieces: 1,
    image: IMG.soft_drink, images: [IMG.soft_drink],
    description: '330ml · Selection of chilled soft drinks · Pepsi · 7UP · Miranda · Aquafina · served over ice',
    fullDescription: '330ml · Selection of chilled soft drinks · Pepsi · 7UP · Miranda · Aquafina · served over ice',
    rating: 4.4, reviews: 92,
  },
];

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let result = [...products];
  if (category && category !== 'all') result = result.filter(p => p.category === category);
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }
  res.json({ success: true, data: result, count: result.length });
});

app.get('/api/products/:id', (req, res) => {
  const p = products.find(x => x._id === req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: p });
});

app.post('/api/orders', (req, res) => {
  const order = { ...req.body, _id: `ord_${Date.now()}`, status: 'pending', createdAt: new Date() };
  res.status(201).json({ success: true, data: order });
});

app.get('/api/orders',  (_req, res) => res.json({ success: true, data: [] }));
app.get('/api/health',  (_req, res) => res.json({ ok: true, products: products.length }));

const PORT = 5001;
app.listen(PORT, () => console.log(`✅  SushiMate mock API → http://localhost:${PORT}/api  |  ${products.length} products  |  ${products.filter(p=>p.isHit).length} bestsellers`));
