const RAW_PRODUCTS = [
  { id: 1, name: "Medusa Serpent Oversized Tee", price: 39, sizes: ["S", "M", "L", "XL", "2XL"], img: "imgs/tees/tee-1.png", hero: "imgs/tees/tee-1-homescreen.png", gallery: [{src:"imgs/tees/tee-1.png",label:"Back"},{src:"imgs/tees/tee-1-g2.png",label:"Back (Male)"},{src:"imgs/tees/tee-1-g3.png",label:"Front"},{src:"imgs/tees/tee-1-g4.png",label:"Side"},{src:"imgs/tees/tee-1-g5.png",label:"Artwork"},{src:"imgs/tees/tee-1-g6.png",label:"Detail"},{src:"imgs/tees/tee-1-g7.png",label:"Close Up"}], category: "tees", collection: "Heavyweight / Drop 001", tags: ["300GSM", "100% Cotton", "Oversized"], materials: "300GSM · 100% Ring-Spun Cotton · Drop-Shoulder Box Cut", availability: "Limited Drop", desc: "Black oversized heavyweight tee with Medusa serpent goddess back print and dark gothic throne graphic on the front. 300GSM 100% cotton — built heavy, cut wide." },
  { id: 3, name: "Angel of Death Heavyweight Tee", price: 39, sizes: ["S", "M", "L", "XL", "2XL"], img: "imgs/tees/tee-2.png", gallery: [{src:"imgs/tees/tee-2.png",label:"Front"},{src:"imgs/tees/tee-2-g2.png",label:"Back"},{src:"imgs/tees/tee-2-g3.png",label:"Side"},{src:"imgs/tees/tee-2-g4.png",label:"45° Angle"},{src:"imgs/tees/tee-2-g5.png",label:"Artwork"},{src:"imgs/tees/tee-2-g6.png",label:"Detail"},{src:"imgs/tees/tee-2-g7.png",label:"Close Up"}], category: "tees", collection: "Heavyweight / Drop 001", tags: ["300GSM", "100% Cotton", "Metal Graphic"], materials: "300GSM · 100% Ring-Spun Cotton · Drop-Shoulder Box Cut", availability: "Limited Drop", desc: "Black heavyweight tee with full-front Angel of Death graphic — winged skeleton rising over flame and skulls with blood-drip type. 300GSM 100% cotton, built to carry the print." },
  { id: 4, name: "Broken Skull Heavyweight Tee", price: 39, sizes: ["S", "M", "L", "XL", "2XL"], img: "imgs/tees/tee-3.png", gallery: [{src:"imgs/tees/tee-3.png",label:"Front"},{src:"imgs/tees/tee-3-g2.png",label:"Back"},{src:"imgs/tees/tee-3-g3.png",label:"Graphic"},{src:"imgs/tees/tee-3-g4.png",label:"Artwork"},{src:"imgs/tees/tee-3-g5.png",label:"View 5"},{src:"imgs/tees/tee-3-g6.png",label:"Detail"},{src:"imgs/tees/tee-3-g7.png",label:"Close Up"}], category: "tees", collection: "Heavyweight / Drop 001", tags: ["300GSM", "100% Cotton", "Skull Graphic"], materials: "300GSM · 100% Ring-Spun Cotton · Oversized Drop-Shoulder", availability: "Limited Drop", desc: "Charcoal grey oversized heavyweight tee with 'BROKEN' blood-drip lettering and a cigar-smoking flaming skull. Front graphic, 'BROKEN' back text. 300GSM 100% cotton." },
  { id: 5, name: "Need Some Money Oversized Tee", price: 39, sizes: ["S", "M", "L", "XL", "2XL"], img: "imgs/tees/tee-4.png", gallery: [{src:"imgs/tees/tee-4.png",label:"Back"},{src:"imgs/tees/tee-4-g2.png",label:"Artwork"},{src:"imgs/tees/tee-4-g3.png",label:"Front"},{src:"imgs/tees/tee-4-g4.png",label:"Side"},{src:"imgs/tees/tee-4-g5.png",label:"45° Angle"},{src:"imgs/tees/tee-4-g6.png",label:"Detail"},{src:"imgs/tees/tee-4-g7.png",label:"Close Up"}], category: "tees", collection: "Heavyweight / Drop 001", tags: ["300GSM", "100% Cotton", "Gothic Type"], materials: "300GSM · 100% Ring-Spun Cotton · Oversized Drop-Shoulder", availability: "Limited Drop", desc: "Charcoal grey oversized tee with angel statue holding cash amid flames and chain-link on the front. Old English 'need some MONEY' back text. 300GSM 100% cotton." },

  { id: 10, name: "Vintage Distressed Wide-Leg", price: 67, sizes: ["S", "M", "L", "XL"], img: "imgs/pants/mens-pant-1.jpg", sizeChart: "imgs/pants/sizechart-pant-1.png", gallery: [{src:"imgs/pants/mens-pant-1.jpg",label:"Front"},{src:"imgs/pants/mens-pant-1-g2.jpg",label:"Back"},{src:"imgs/pants/mens-pant-1-g3.jpg",label:"Left Side"},{src:"imgs/pants/mens-pant-1-g4.jpg",label:"Right Side"},{src:"imgs/pants/mens-pant-1-g5.jpg",label:"45° Angle"},{src:"imgs/pants/mens-pant-1-g6.jpg",label:"Close Up"},{src:"imgs/pants/mens-pant-1-g7.jpg",label:"Detail"},{src:"imgs/pants/mens-pant-1-g8.jpg",label:"Detail 2"},{src:"imgs/pants/mens-pant-1-g9.jpg",label:"Detail 3"},{src:"imgs/pants/sizechart-pant-1.png",label:"Size Chart"}], category: "men", collection: "Men's Denim / Drop 001", tags: ["Sand Wash", "Heavy Rips", "Wide Leg"], availability: "Limited Drop", desc: "Sand-washed wide-leg denim with aggressive side rips and a broken-in vintage soul. Baggy stacked fit made for presence." },
  { id: 11, name: "Red Gothic Embroidery Denim", price: 67, sizes: ["S", "M", "L", "XL"], img: "imgs/pants/mens-pant-2.jpg", sizeChart: "imgs/pants/sizechart-pant-2.png", gallery: [{src:"imgs/pants/mens-pant-2.jpg",label:"Front"},{src:"imgs/pants/mens-pant-2-g2.jpg",label:"Back"},{src:"imgs/pants/mens-pant-2-g4.jpg",label:"Right Side"},{src:"imgs/pants/mens-pant-2-g5.jpg",label:"45° Angle"},{src:"imgs/pants/mens-pant-2-g6.jpg",label:"Close Up"},{src:"imgs/pants/mens-pant-2-g7.jpg",label:"Detail"},{src:"imgs/pants/mens-pant-2-g8.jpg",label:"Detail 2"},{src:"imgs/pants/mens-pant-2-g9.jpg",label:"Detail 3"},{src:"imgs/pants/sizechart-pant-2.png",label:"Size Chart"}], category: "men", collection: "Men's Denim / Drop 001", tags: ["Gothic Embroidery", "Studded Hem", "Statement"], availability: "Limited Drop", desc: "Black denim with full-leg red gothic snake embroidery and studded raw hem. The loudest piece in the Drop 001 arsenal." },
  { id: 12, name: "Acid Rust Patchwork Jeans", price: 63, sizes: ["S", "M", "L", "XL"], img: "imgs/pants/mens-pant-3.jpg", sizeChart: "imgs/pants/sizechart-pant-3.png", gallery: [{src:"imgs/pants/mens-pant-3.jpg",label:"Front"},{src:"imgs/pants/mens-pant-3-g2.jpg",label:"Back"},{src:"imgs/pants/mens-pant-3-g3.jpg",label:"Left Side"},{src:"imgs/pants/mens-pant-3-g4.jpg",label:"Right Side"},{src:"imgs/pants/mens-pant-3-g5.jpg",label:"45° Angle"},{src:"imgs/pants/mens-pant-3-g6.jpg",label:"Close Up"},{src:"imgs/pants/mens-pant-3-g7.jpg",label:"Detail"},{src:"imgs/pants/mens-pant-3-g8.jpg",label:"Detail 2"},{src:"imgs/pants/mens-pant-3-g9.jpg",label:"Detail 3"},{src:"imgs/pants/sizechart-pant-3.png",label:"Size Chart"}], category: "men", collection: "Men's Denim / Drop 001", tags: ["Acid Wash", "Patchwork", "KRYPTAA HW"], availability: "Limited Drop", desc: "Dark indigo denim with copper acid wash bleed, raw patchwork layers, and a custom KRYPTAA hardware button." },
  { id: 14, name: "Ice Cargo Wide-Leg Denim", price: 63, sizes: ["S", "M", "L", "XL"], img: "imgs/pants/mens-pant-4.jpg", sizeChart: "imgs/pants/sizechart-pant-4.png", gallery: [{src:"imgs/pants/mens-pant-4.jpg",label:"Front"},{src:"imgs/pants/mens-pant-4-g2.jpg",label:"Back"},{src:"imgs/pants/mens-pant-4-g3.jpg",label:"Left Side"},{src:"imgs/pants/mens-pant-4-g4.jpg",label:"Right Side"},{src:"imgs/pants/mens-pant-4-g5.jpg",label:"45° Angle"},{src:"imgs/pants/mens-pant-4-g6.jpg",label:"Close Up"},{src:"imgs/pants/mens-pant-4-g7.jpg",label:"Detail"},{src:"imgs/pants/mens-pant-4-g8.jpg",label:"Detail 2"},{src:"imgs/pants/sizechart-pant-4.png",label:"Size Chart"}], category: "men", collection: "Men's Denim / Drop 001", tags: ["Ice Wash", "Cargo", "Ripped"], availability: "Limited Drop", desc: "Light ice-wash cargo denim with utility pockets and strategic ripping across the thigh. Statement without Noise." },

  { id: 108, name: "Six Eyes Gojo Satoru Denim", price: 69, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-gojo.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Anime", "Sublimated", "Straight"], availability: "Limited pre-order", desc: "Gojo artwork printed with high-fidelity contrast on a clean straight denim base." },
  { id: 109, name: "Cursed Energy JJK Collage", price: 59, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-jjk1.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["JJK", "Collage", "Black Denim"], availability: "In production", desc: "A dense cursed-energy collage composed across black denim for movement and impact." },
  { id: 110, name: "Cursed Energy JJK Vol. 2", price: 65, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-jjk2.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["JJK", "Vol. 2", "Panel Art"], availability: "Archive pulled from GitHub", restockDate: "Coming Soon", desc: "A second JJK panel treatment with darker character contrast and a more graphic streetwear read." },
  { id: 111, name: "Demon Back Baki Denim", price: 70, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-baki.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Baki", "Heavy Graphic", "Rugged"], availability: "Limited pre-order", desc: "A raw Baki graphic treatment on rugged denim with a strength-first silhouette." },
  { id: 112, name: "Shinigami Death Note Denim", price: 67, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-deathnote.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Death Note", "Monochrome", "Gothic"], availability: "Low quantity", desc: "Death Note iconography in a darker monochrome composition for a more refined anime piece." },
  { id: 113, name: "Straw Hat One Piece Jeans", price: 77, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-one-piece.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["One Piece", "Manga Panel", "Overdye"], availability: "Limited pre-order", desc: "Manga-scale artwork blended into denim for a wearable panel effect." },
  { id: 114, name: "Horror Anime Black Denim", price: 64, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-horror.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Horror", "Black Denim", "Graphic"], availability: "Archive pulled from GitHub", restockDate: "Coming Soon", desc: "A darker horror-anime composition built for the gothic side of the KRYPTAA archive." },
  { id: 115, name: "Six Eyes Gojo Vol. 2", price: 69, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-gojo2.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Gojo", "Vol. 2", "Cobalt"], availability: "Archive pulled from GitHub", restockDate: "Coming Soon", desc: "A second Gojo denim with cooler tones and high-contrast artwork for stronger movement." },
  { id: 116, name: "Black Red Anime Denim", price: 65, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-blackred.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Black Red", "Anime", "Statement"], availability: "Archive pulled from GitHub", restockDate: "Coming Soon", desc: "Red-on-black anime artwork made for a sharper, club-lit color hit inside the denim line." },

  { id: 30, name: "Gothic Skull Wide-Leg", price: 51, sizes: ["S", "M", "L", "XL"], img: "imgs/pants/womens-pant-5.jpg", sizeChart: "imgs/pants/sizechart-pant-5.png", gallery: [{src:"imgs/pants/womens-pant-5.jpg",label:"Front"},{src:"imgs/pants/womens-pant-5-g2.jpg",label:"Back"},{src:"imgs/pants/womens-pant-5-g3.jpg",label:"Left Side"},{src:"imgs/pants/womens-pant-5-g4.jpg",label:"Right Side"},{src:"imgs/pants/womens-pant-5-g5.jpg",label:"45° Angle"},{src:"imgs/pants/womens-pant-5-g6.jpg",label:"Close Up"},{src:"imgs/pants/womens-pant-5-g7.jpg",label:"Detail"},{src:"imgs/pants/womens-pant-5-g8.jpg",label:"Detail 2"},{src:"imgs/pants/womens-pant-5-g9.jpg",label:"Detail 3"},{src:"imgs/pants/womens-pant-5-g10.jpg",label:"Detail 4"},{src:"imgs/pants/sizechart-pant-5.png",label:"Size Chart"}], category: "women", collection: "Women's Denim / Drop 001", tags: ["Pink Skull", "Wide Leg", "Gothic Art"], availability: "Limited Drop", desc: "Black wide-leg denim with full pink gothic skull and angelic script print across the back. High-waist silhouette with a dramatic floor-length stack." },
  { id: 31, name: "Gold Baroque Wide-Leg", price: 62, sizes: ["S", "M", "L", "XL"], img: "imgs/pants/womens-pant-6-g5.jpg", sizeChart: "imgs/pants/sizechart-pant-6.png", gallery: [{src:"imgs/pants/womens-pant-6.jpg",label:"Front"},{src:"imgs/pants/womens-pant-6-g2.jpg",label:"Back"},{src:"imgs/pants/womens-pant-6-g3.jpg",label:"Left Side"},{src:"imgs/pants/womens-pant-6-g4.jpg",label:"Right Side"},{src:"imgs/pants/womens-pant-6-g5.jpg",label:"45° Angle"},{src:"imgs/pants/womens-pant-6-g6.jpg",label:"Close Up"},{src:"imgs/pants/womens-pant-6-g7.jpg",label:"Detail"},{src:"imgs/pants/womens-pant-6-g8.jpg",label:"Detail 2"},{src:"imgs/pants/womens-pant-6-g9.jpg",label:"Detail 3"},{src:"imgs/pants/womens-pant-6-g10.jpg",label:"Detail 4"},{src:"imgs/pants/sizechart-pant-6.png",label:"Size Chart"}], category: "women", collection: "Women's Denim / Drop 001", tags: ["Gold Baroque", "Wide Leg", "Ornamental"], availability: "Limited Drop", desc: "Black wide-leg denim with full gold baroque ornamental print. Opulent gothic energy from waist to hem." },
  { id: 32, name: "Creature Graphic Wide-Leg", price: 62, sizes: ["S", "M", "L", "XL"], img: "imgs/pants/unisex-pant-7.jpg", sizeChart: "imgs/pants/sizechart-pant-7.png", gallery: [{src:"imgs/pants/unisex-pant-7.jpg",label:"Front"},{src:"imgs/pants/unisex-pant-7-g2.jpg",label:"Back"},{src:"imgs/pants/unisex-pant-7-g3.jpg",label:"Left Side"},{src:"imgs/pants/unisex-pant-7-g4.jpg",label:"Right Side"},{src:"imgs/pants/unisex-pant-7-g5.jpg",label:"45° Angle"},{src:"imgs/pants/unisex-pant-7-g6.jpg",label:"Close Up"},{src:"imgs/pants/unisex-pant-7-g7.jpg",label:"Detail"},{src:"imgs/pants/unisex-pant-7-g8.jpg",label:"Detail 2"},{src:"imgs/pants/sizechart-pant-7.png",label:"Size Chart"}], category: "women", collection: "Women's Denim / Drop 001", tags: ["Creature Print", "Wide Leg", "Unisex"], availability: "Limited Drop", desc: "Black wide-leg denim with scattered white creature graphic across both legs. Unisex cut with a bold underground statement." },

  { id: 70, name: "Rhinestone Mesh Hooded Crop", price: 28, sizes: ["XS", "S", "M", "L"], noZoom: true, img: "imgs/tops/top-70.png", gallery: [{src:"imgs/tops/top-70.png",label:"Front"},{src:"imgs/tops/top-70-g2.png",label:"Cowl Neck"},{src:"imgs/tops/top-70-g3.png",label:"Outdoor"},{src:"imgs/tops/top-70-g4.png",label:"Side Hood"},{src:"imgs/tops/top-70-g5.png",label:"Back"},{src:"imgs/tops/top-70-g6.png",label:"Mirror"}], category: "women_wear", collection: "Women Wear / Drop 001", tags: ["Rhinestone Mesh", "Hooded", "Backless"], availability: "In stock", desc: "Sheer rhinestone mesh hooded crop top with an open cowl-neck drape and open back tied with a delicate chain. Drop 001 Midnight Glow Statement." },
  { id: 80, name: "Holographic Sequin Bra Top", price: 24, sizes: ["XS", "S", "M", "L"], noZoom: true, img: "imgs/tops/top-80.png", gallery: [{src:"imgs/tops/top-80.png",label:"Front"},{src:"imgs/tops/top-80-g2.png",label:"Front 2"},{src:"imgs/tops/top-80-g3.png",label:"Relaxed"},{src:"imgs/tops/top-80-g4.png",label:"Editorial"},{src:"imgs/tops/top-80-g5.png",label:"Back"}], category: "women_wear", collection: "Women Wear / Drop 001", tags: ["Holographic", "Sequin", "Festival"], availability: "In stock", desc: "Rainbow iridescent sequin halter bra with open-back chain tie. Catches every light on the dance floor. Drop 001 — Midnight Glow Statement." },
  { id: 90, name: "Silver Metallic Crop Set", price: 45, sizes: ["XS", "S", "M", "L"], noZoom: true, img: "imgs/tops/top-90.png", gallery: [{src:"imgs/tops/top-90.png",label:"Full Set"},{src:"imgs/tops/top-90-g2.png",label:"Editorial"},{src:"imgs/tops/top-90-g3.png",label:"Portrait"},{src:"imgs/tops/top-90-g4.png",label:"Crop Only"},{src:"imgs/tops/top-90-g5.png",label:"Skirt Detail"},{src:"imgs/tops/top-90-g6.png",label:"Side"}], category: "women_wear", collection: "Women Wear / Drop 001", tags: ["Silver", "Metallic", "Set"], availability: "In stock", desc: "High-shine silver metallic crop top paired with a matching chain-waist mini skirt. Sculptural shoulder seam and liquid-chrome finish. Drop 001 Midnight Glow Statement." },

  { id: 401, name: "Obsidian Grey Baggy Track Pant", price: 65, sizes: ["XS", "S", "M", "L"], img: "imgs/w-grey-baggy.webp", category: "women_track", collection: "Women's Track Pants / Drop 002", tags: ["Baggy", "Motion Fit", "Cyber Utility"], availability: "Drop 002 preview", desc: "A baggy grey motion pant styled from the women's archive into the missing track-pant lane the site needed." },
  { id: 402, name: "Gothic Utility Track Cargo", price: 70, sizes: ["XS", "S", "M", "L"], img: "imgs/w-cargo.jpg", category: "women_track", collection: "Women's Track Pants / Drop 002", tags: ["Cargo", "Utility", "Adjustable"], availability: "Drop 002 preview", desc: "Cargo utility pockets and a relaxed technical leg for the cyberpunk side of KRYPTAA's women's drop." },
  { id: 403, name: "Distressed Motion Track Pant", price: 62, sizes: ["XS", "S", "M", "L"], img: "imgs/w-distressed.webp", category: "women_track", collection: "Women's Track Pants / Drop 002", tags: ["Distressed", "Motion", "Black Wash"], availability: "Drop 002 preview", desc: "A distressed movement pant with the weight and attitude of denim but the styling language of trackwear." },
  { id: 404, name: "Side Rip Technical Track Pant", price: 67, sizes: ["XS", "S", "M", "L"], img: "imgs/w-side-rip.webp", category: "women_track", collection: "Women's Track Pants / Drop 002", tags: ["Side Rip", "Technical", "Stacked"], availability: "Drop 002 preview", desc: "Side-rip details and stacked proportions give this track silhouette a sharper gothic finish." },

  { id: 500, name: "Unisex Street Track Pant — Blue", price: 42, sizes: ["XS", "S", "M", "L", "XL"], soldOutSizes: ["XL"], img: "imgs/pants/womens-st-blue-01.jpg", sizeChart: "imgs/pants/womens-st-sizechart.png", gallery: [{src:"imgs/pants/womens-st-blue-01.jpg",label:"Front"},{src:"imgs/pants/womens-st-blue-02.jpg",label:"Back"},{src:"imgs/pants/womens-st-blue-03.jpg",label:"Left Side"},{src:"imgs/pants/womens-st-blue-04.jpg",label:"Right Side"},{src:"imgs/pants/womens-st-blue-05.jpg",label:"45° Angle"},{src:"imgs/pants/womens-st-blue-06.jpg",label:"Detail"},{src:"imgs/pants/womens-st-blue-07.jpg",label:"Full Length"},{src:"imgs/pants/womens-st-sizechart.png",label:"Size Chart"}], category: "women_st", collection: "Unisex Street Track Pants / Drop 001", tags: ["Track Pant", "Blue", "Unisex"], availability: "Limited Drop", desc: "Wide-leg unisex street track pant in deep blue. Clean structured silhouette with a relaxed fit — built for presence and movement." },
  { id: 501, name: "Unisex Street Track Pant — Green", price: 42, sizes: ["XS", "S", "M", "L", "XL"], soldOutSizes: ["XL"], img: "imgs/pants/womens-st-green-01.jpg", sizeChart: "imgs/pants/womens-st-sizechart.png", gallery: [{src:"imgs/pants/womens-st-green-01.jpg",label:"Front"},{src:"imgs/pants/womens-st-green-02.jpg",label:"Back"},{src:"imgs/pants/womens-st-green-03.jpg",label:"Left Side"},{src:"imgs/pants/womens-st-green-04.jpg",label:"Right Side"},{src:"imgs/pants/womens-st-green-05.jpg",label:"45° Angle"},{src:"imgs/pants/womens-st-green-06.jpg",label:"Detail"},{src:"imgs/pants/womens-st-green-07.jpg",label:"Full Length"},{src:"imgs/pants/womens-st-sizechart.png",label:"Size Chart"}], category: "women_st", collection: "Unisex Street Track Pants / Drop 001", tags: ["Track Pant", "Green", "Unisex"], availability: "Limited Drop", desc: "Wide-leg unisex street track pant in muted green. Clean structured silhouette with a relaxed fit — built for presence and movement." },
  { id: 502, name: "Unisex Street Track Pant — Red", price: 42, sizes: ["XS", "S", "M", "L", "XL"], soldOutSizes: ["XL"], img: "imgs/pants/womens-st-red-01.jpg", sizeChart: "imgs/pants/womens-st-sizechart.png", gallery: [{src:"imgs/pants/womens-st-red-01.jpg",label:"Front"},{src:"imgs/pants/womens-st-red-02.jpg",label:"Back"},{src:"imgs/pants/womens-st-red-03.jpg",label:"Left Side"},{src:"imgs/pants/womens-st-red-04.jpg",label:"Right Side"},{src:"imgs/pants/womens-st-red-05.jpg",label:"45° Angle"},{src:"imgs/pants/womens-st-red-06.jpg",label:"Detail"},{src:"imgs/pants/womens-st-sizechart.png",label:"Size Chart"}], category: "women_st", collection: "Unisex Street Track Pants / Drop 001", tags: ["Track Pant", "Red", "Unisex"], availability: "Limited Drop", desc: "Wide-leg unisex street track pant in bold red. Clean structured silhouette with a relaxed fit — built for presence and movement." },
  { id: 503, name: "Unisex Street Track Pant — Yellow", price: 42, sizes: ["XS", "S", "M", "L", "XL"], soldOutSizes: ["XL"], img: "imgs/pants/womens-st-yellow-01.jpg", sizeChart: "imgs/pants/womens-st-sizechart.png", gallery: [{src:"imgs/pants/womens-st-yellow-01.jpg",label:"Front"},{src:"imgs/pants/womens-st-yellow-02.jpg",label:"Back"},{src:"imgs/pants/womens-st-yellow-03.jpg",label:"Left Side"},{src:"imgs/pants/womens-st-yellow-04.jpg",label:"Right Side"},{src:"imgs/pants/womens-st-yellow-05.jpg",label:"45° Angle"},{src:"imgs/pants/womens-st-yellow-06.jpg",label:"Detail"},{src:"imgs/pants/womens-st-sizechart.png",label:"Size Chart"}], category: "women_st", collection: "Unisex Street Track Pants / Drop 001", tags: ["Track Pant", "Yellow", "Unisex"], availability: "Limited Drop", desc: "Wide-leg unisex street track pant in gold yellow. Clean structured silhouette with a relaxed fit — built for presence and movement." }
];

const CATEGORY_CONFIGS = {
  men: {
    title: "Men",
    label: "Shadow Denim",
    nav: "Men",
    href: "men.html",
    description: "Vintage washes, gothic embroidery, acid distressing and cargo silhouettes — engineered for presence.",
    heroIds: [11, 10, 12, 14],
    featuredIds: [11, 10, 12, 14]
  },
  women: {
    title: "Women",
    label: "Dark Feminine",
    nav: "Women",
    href: "women.html",
    description: "Wide-leg gothic denim with skull prints, baroque gold, and creature art — cut for the underground.",
    heroIds: [30, 31, 32],
    featuredIds: [30, 31, 32]
  },
  all_jeans: {
    title: "Jeans",
    label: "Denim Archive",
    nav: "Jeans",
    href: "jeans.html",
    description: "Men's and women's denim — gothic embroidery, acid wash, skull prints, baroque gold, and creature art.",
    heroIds: [11, 30, 31, 12, 32],
    featuredIds: [11, 30, 12, 31]
  },
  tees: {
    title: "T-Shirts",
    label: "Heavyweight Cotton",
    nav: "T-Shirts",
    href: "t-shirts.html",
    description: "300GSM gothic graphics with dense structure, oversized drape, and sharp print clarity.",
    heroIds: [1, 3, 4, 5],
    featuredIds: [1, 3, 4, 5]
  },
  anime: {
    title: "Anime",
    label: "Graphic Denim",
    nav: "Anime",
    href: "anime.html",
    description: "Anime iconography treated as dark denim art rather than novelty graphics.",
    heroIds: [108, 115, 109, 110, 116],
    featuredIds: [108, 115, 109, 116]
  },
  women_wear: {
    title: "Women Wear",
    label: "Drop 001 — New Arrivals",
    nav: "Women Wear",
    href: "women-wear.html",
    description: "Rhinestone mesh, holographic sequin, silver metallic — KRYPTAA women's wear built for festival nights and after-dark statements.",
    heroIds: [70, 80, 90],
    featuredIds: [70, 80, 90]
  },
  women_track: {
    title: "Women Track Pants",
    label: "Drop 002 Motion",
    nav: "Women Track",
    href: "women-track-pants.html",
    description: "The missing women's track-pant lane: baggy motion bottoms, utility cargos, side-rip details, and cyber-goth styling.",
    heroIds: [401, 402, 403, 404, 207],
    featuredIds: [401, 402, 403, 404]
  },
  track: {
    title: "Track Pants",
    label: "Drop 002 Motion",
    nav: "Track Pants",
    href: "track-pants.html",
    description: "Movement-ready bottoms with utility attitude, pulled into a real shoppable capsule instead of a placeholder.",
    heroIds: [401, 402, 403, 404, 10],
    featuredIds: [401, 402, 403, 404]
  },
  women_st: {
    title: "Unisex Street Track Pants",
    label: "Drop 001 Bottoms",
    nav: "Street Trackpants",
    href: "women-streetwear-trousers.html",
    description: "Wide-leg street track pants in four bold colours — blue, green, red, and yellow. Unisex silhouette. Clean architecture, underground attitude.",
    heroIds: [500, 501, 502, 503],
    featuredIds: [500, 501, 502, 503]
  }
};

const HOME_FEATURE_IDS = [11, 30, 12, 31, 108, 14, 32, 304];

const STORY_DEFAULTS = {
  tees: {
    technical: "Built from heavyweight cotton selected for structure, opacity, and a premium hand feel.",
    artisticConcept: "Gothic artwork is scaled like a poster piece, balancing dark symbolism with clean streetwear utility.",
    fit: "Oversized and boxy. Choose true size for a structured drape or size up for a more dramatic shoulder.",
    materials: "300GSM cotton jersey with a compact knit and substantial collar recovery.",
    finish: "High-definition print application designed to hold edge clarity through repeated wear.",
    shipping: "In stock and ready to ship. Dispatched within 3–5 business days in branded KRYPTAA packaging.",
    brandConnection: "Part of the KRYPTAA uniform: heavy, quiet, and built around aura instead of noise."
  },
  denim: {
    technical: "Reinforced denim construction with durable seams, structured pockets, and hardware selected for daily wear.",
    artisticConcept: "Artwork is placed to move with the leg, turning the denim into a walking graphic composition.",
    fit: "Relaxed through the leg with intentional stacking. Size true for a clean fall or up for more volume.",
    materials: "Mid-to-heavyweight cotton denim with wash treatments selected per garment artwork.",
    finish: "Graphic, wash, and distress details are finished to feel integrated with the cloth instead of pasted on top.",
    shipping: "In stock and ready to ship. Dispatched within 3–5 business days in branded KRYPTAA packaging.",
    brandConnection: "KRYPTAA denim is the armor layer: dark, graphic, and made to carry identity without explanation."
  },
  tops: {
    technical: "Cut for statement styling with detail placement designed to catch light in motion.",
    artisticConcept: "A darker festival language: metallic flash, gothic references, and controlled exposure.",
    fit: "Close to body. Size up if you prefer more coverage or a less compressed silhouette.",
    materials: "Stretch or mesh-led materials selected for shine, movement, and after-dark styling.",
    finish: "Foil, chain, or graphic details are treated as jewelry for the garment.",
    shipping: "In stock and ready to ship. Dispatched within 3–5 business days in branded KRYPTAA packaging.",
    brandConnection: "This is the high-voltage edge of KRYPTAA: more light, same darkness."
  },
  women_wear: {
    technical: "Lightweight rhinestone mesh, holographic sequin, and metallic fabric — selected for visual impact, movement, and festival-ready shine.",
    artisticConcept: "KRYPTAA festival aesthetic: maximum light capture, open-back silhouettes, and body-aware cuts built for after-dark statements.",
    fit: "Runs small — size up one for more coverage. Designed to sit close to the body for a sculpted festival silhouette.",
    materials: "Rhinestone mesh, holographic sequin, and liquid metallic jersey — each chosen for stage and night wearability.",
    finish: "Rhinestone embellishment, chain tie closures, and iridescent foil finishes applied for maximum visual impact.",
    shipping: "In stock and ready to ship. Dispatched within 3–5 business days in branded KRYPTAA packaging.",
    brandConnection: "Drop 001 extends the KRYPTAA language into women's festival wear — the same darkness, built to reflect light."
  }
};

function productFamily(product) {
  if (product.category === "tees") return "tees";
  if (product.category === "tops") return "tops";
  if (product.category === "women_wear") return "women_wear";
  if (product.category === "women_track") return "denim";
  return "denim";
}

function enrichProduct(product) {
  const defaults = STORY_DEFAULTS[productFamily(product)];
  return {
    ...defaults,
    ...product,
    gallery: product.gallery || [{src: product.img, label: "Front"}],
    hero: product.hero || product.img,
    story: product.story || product.desc,
    material: product.material || defaults.materials,
    slug: String(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  };
}

const PRODUCTS = RAW_PRODUCTS.map(enrichProduct);

function formatPrice(value) {
  try {
    const curr = localStorage.getItem("k_currency") || "USD";
    if (curr === "INR") return "₹" + Math.round(Number(value) * 84).toLocaleString("en-IN");
  } catch (e) {}
  return "$" + Number(value).toFixed(2);
}

function getProductById(id) {
  return PRODUCTS.find((product) => String(product.id) === String(id));
}

function getProductsByCategory(category) {
  if (!category || category === "all") return PRODUCTS;
  if (category === "all_jeans") {
    return PRODUCTS.filter((product) => ["men", "women", "anime"].includes(product.category));
  }
  if (category === "track") {
    return getProductsByIds(CATEGORY_CONFIGS.track.featuredIds);
  }
  return PRODUCTS.filter((product) => product.category === category);
}

function getProductsByIds(ids) {
  return ids.map(getProductById).filter(Boolean);
}

function getFeaturedProducts() {
  return getProductsByIds(HOME_FEATURE_IDS);
}

function getCategoryConfig(category) {
  return CATEGORY_CONFIGS[category] || CATEGORY_CONFIGS.men;
}

function getPageCategory() {
  const explicit = document.body.dataset.shop;
  if (explicit) return explicit;
  const filename = window.location.pathname.split("/").pop();
  const fromFile = {
    "men.html": "men",
    "women.html": "women",
    "jeans.html": "all_jeans",
    "t-shirts.html": "tees",
    "anime.html": "anime",
    "women-wear.html": "women_wear", "women-tops.html": "women_wear",
    "women-track-pants.html": "women_track",
    "track-pants.html": "track",
    "women-streetwear-trousers.html": "women_st",
    "shop-template.html": "all_jeans"
  };
  return fromFile[filename] || "men";
}

const REVIEWS = {
  1: [
    { author: "Rahul M.", date: "Dec 2025", rating: 5, size: "L", body: "Insane quality. The dragon artwork is even more detailed in person — wore it to a show and got stopped twice. Heavyweight as advertised." },
    { author: "Jordan K.", date: "Dec 2025", rating: 5, size: "M", body: "Best denim I've owned. The weight is serious — this isn't fast fashion. KRYPTAA is the real deal." },
    { author: "Aiden S.", date: "Jan 2026", rating: 4, size: "L", body: "Great fit and the graphic is wild. Delivery took a bit longer than expected but absolutely worth the wait." },
  ],
  2: [
    { author: "Dev R.", date: "Jan 2026", rating: 5, size: "M", body: "The koi artwork is stunning — super vibrant and detailed. Quality is top tier, worth every penny." },
    { author: "Chris L.", date: "Feb 2026", rating: 5, size: "L", body: "Statement piece. Wore this to a rooftop event and it turned every head. Fabric weight is serious." },
  ],
  30: [
    { author: "Priya T.", date: "Jan 2026", rating: 5, size: "S", body: "Literally the most beautiful jeans I've ever owned. The skull print on the back is stunning in person. Fits perfectly." },
    { author: "Meera V.", date: "Feb 2026", rating: 5, size: "M", body: "Oversized fit is everything. Got so many compliments at the festival. Fabric quality is exceptional." },
  ],
  70: [
    { author: "Sofia R.", date: "Feb 2026", rating: 5, size: "Universal", body: "The rhinestone mesh catches light from every angle. Perfect for festival season and the fit is genuinely flattering." },
    { author: "Nisha P.", date: "Mar 2026", rating: 4, size: "Universal", body: "Love the look and quality. Wore it to a club and stood out instantly. Would love more colour options." },
  ],
  80: [
    { author: "Anya K.", date: "Mar 2026", rating: 5, size: "Universal", body: "Rainbow iridescent sequins are EVERYTHING. The open-back chain tie is such a luxe touch. Absolutely obsessed." },
  ],
};
window.REVIEWS = REVIEWS;

window.STOCK_DATA = {
  1:   { S: 30, M: 30, L: 30, XL: 30 },
  3:   { S: 30, M: 30, L: 30, XL: 30 },
  4:   { S: 5,  M: 30, L: 30, XL: 4  },
  5:   { S: 30, M: 30, L: 30, XL: 30 },
  10:  { S: 5,  M: 10, L: 10, XL: 5 }, // Men's — real stock
  11:  { S: 5,  M: 10, L: 10, XL: 5 },
  12:  { S: 5,  M: 10, L: 10, XL: 5 },
  14:  { S: 5,  M: 10, L: 10, XL: 5 },
  30:  { S: 5,  M: 10, L: 10, XL: 5 }, // Women's — real stock
  31:  { S: 5,  M: 8,  L: 11, XL: 6 },
  32:  { S: 5,  M: 10, L: 10, XL: 5 },
  70:  { XS: 30, S: 30, M: 30, L: 30 },
  80:  { XS: 30, S: 30, M: 30, L: 30 },
  90:  { XS: 30, S: 30, M: 30, L: 30 },
  500: { XS: 9,  S: 12, M: 12, L: 12, XL: 0 }, // Blue  — real count
  501: { XS: 9,  S: 15, M: 13, L: 11, XL: 0 }, // Green — real count
  502: { XS: 7,  S: 12, M: 12, L: 11, XL: 0 }, // Red   — real count
  503: { XS: 12, S: 12, M: 9,  L: 7,  XL: 0 }, // Yellow — real count
};
window.DEFAULT_STOCK = 30;
window.RAW_PRODUCTS = RAW_PRODUCTS;

window.PRODUCTS = PRODUCTS;
window.CATEGORY_CONFIGS = CATEGORY_CONFIGS;
window.HOME_FEATURE_IDS = HOME_FEATURE_IDS;
window.formatPrice = formatPrice;
window.getProductById = getProductById;
window.getProductsByCategory = getProductsByCategory;
window.getProductsByIds = getProductsByIds;
window.getFeaturedProducts = getFeaturedProducts;
window.getCategoryConfig = getCategoryConfig;
window.getPageCategory = getPageCategory;

// Merge any stock edits saved from the admin dashboard into STOCK_DATA
(function () {
  try {
    var _s = localStorage.getItem('kryptaa_stock');
    if (!_s) return;
    var _o = JSON.parse(_s);
    Object.keys(_o).forEach(function (id) {
      if (id === '_savedAt') return;
      var k = parseInt(id);
      if (!window.STOCK_DATA[k]) return;
      Object.keys(_o[id]).forEach(function (sz) {
        window.STOCK_DATA[k][sz] = _o[id][sz];
      });
    });
  } catch (e) {}
})();

// Fetch live stock from backend (server-authoritative, overrides localStorage cache)
(function () {
  fetch('https://kryptaa-backend.netlify.app/.netlify/functions/get-stock')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data || !data.stock) return;
      Object.keys(data.stock).forEach(function (id) {
        var k = parseInt(id);
        if (!window.STOCK_DATA[k]) return;
        Object.keys(data.stock[id]).forEach(function (sz) {
          window.STOCK_DATA[k][sz] = data.stock[id][sz];
        });
      });
      if (window.__onStockUpdated) window.__onStockUpdated();
    })
    .catch(function () {});
})();
