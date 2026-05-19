const RAW_PRODUCTS = [
  { id: 1, name: "Glorious Death Heavyweight Tee", price: 37, sizes: ["S", "M", "L", "XL"], img: "imgs/img-glorious.png", category: "tees", collection: "Heavyweight / Drop 001", tags: ["300GSM", "DTF Print", "Boxy"], availability: "Limited pre-order", desc: "A cornerstone of the KRYPTAA aesthetic: skeleton angel artwork, dense cotton structure, and a heavy box silhouette made to hold shape under black light." },
  { id: 2, name: "Cyber Crime Statement Tee", price: 37, sizes: ["S", "M", "L", "XL"], img: "imgs/img-crime.png", category: "tees", collection: "Heavyweight / Drop 001", tags: ["300GSM", "Gothic Type", "Oversized"], availability: "In production", desc: "Cyber-goth brush texture and bold front/back placement on an oversized black cotton base." },
  { id: 3, name: "Gothic Angel Oversized Tee", price: 37, sizes: ["S", "M", "L", "XL"], img: "imgs/img-angel.png", category: "tees", collection: "Heavyweight / Drop 001", tags: ["Angel Graphic", "Jet Black", "Heavyweight"], availability: "Limited pre-order", desc: "Intricate gothic line work placed on structured cotton for a sharp, draped streetwear silhouette." },
  { id: 4, name: "Broken Mirror Surrealist Tee", price: 37, sizes: ["S", "M", "L", "XL"], img: "imgs/img-broken.png", category: "tees", collection: "Heavyweight / Drop 001", tags: ["Surreal", "Premium Print", "Box Fit"], availability: "Low quantity", desc: "A fractured identity graphic rendered with a dark surrealist finish and a dense premium hand feel." },
  { id: 5, name: "Money Moves Typo Tee", price: 37, sizes: ["S", "M", "L", "XL"], img: "imgs/img-money.png", category: "tees", collection: "Heavyweight / Drop 001", tags: ["Type Graphic", "Street", "Box Fit"], availability: "In production", desc: "A direct typographic strike built for quiet confidence and hard silhouettes." },

  { id: 10, name: "Shadow Tech Cargo Jeans", price: 98, sizes: ["28", "30", "32", "34", "36"], img: "imgs/jeans-grey-cargo.jpg", category: "men", collection: "Men's Denim / Drop 001", tags: ["14oz Denim", "Cargo", "Wide Leg"], availability: "Limited pre-order", desc: "Technical grey cargo denim with utility pockets, custom hardware energy, and a stacked wide-leg profile." },
  { id: 11, name: "Sakura Blossom Wide-Leg Denim", price: 118, sizes: ["28", "30", "32", "34", "36"], img: "imgs/jeans-flower-full.jpg", category: "men", collection: "Men's Denim / Drop 001", tags: ["Sakura", "Wide Leg", "Bleached Art"], availability: "Low quantity", desc: "Black denim carrying a full-leg sakura treatment that reads soft from distance and dangerous up close." },
  { id: 12, name: "Crimson Dragon Painted Denim", price: 77, sizes: ["28", "30", "32", "34", "36"], img: "imgs/jeans-red-dragon.jpg", category: "men", collection: "Men's Denim / Drop 001", tags: ["Dragon", "Crimson", "Washed"], availability: "Limited pre-order", desc: "A red dragon graphic locked onto deep black denim with a hard streetwear stance." },
  { id: 14, name: "Imperial Gold Dragon Denim", price: 75, sizes: ["28", "30", "32", "34", "36"], img: "imgs/jeans-gold-dragon.jpg", category: "men", collection: "Men's Denim / Drop 001", tags: ["Gold Dragon", "Signature", "Straight Leg"], availability: "Never restocked", desc: "The flagship dragon piece: gold artwork, jet-black ground, and a straight cut that stacks cleanly over footwear." },
  { id: 16, name: "Dual Dragon Signature Baggy", price: 98, sizes: ["28", "30", "32", "34", "36"], img: "imgs/jeans-dual-dragon.jpg", category: "men", collection: "Men's Denim / Drop 001", tags: ["Dual Dragon", "Baggy", "Signature"], availability: "Limited pre-order", desc: "Symmetric dragon motifs on a baggy black denim shape built for volume and presence." },
  { id: 17, name: "Midnight Sakura Detail Denim", price: 72, sizes: ["28", "30", "32", "34", "36"], img: "imgs/jeans-flower-detail.jpg", category: "men", collection: "Men's Denim / Drop 001", tags: ["Sakura Detail", "Black Denim", "Wide Leg"], availability: "Archive pulled from GitHub", desc: "A closer, sharper sakura placement from the original KRYPTAA archive, rebuilt into the v3 luxury product system." },
  { id: 103, name: "Hellfire Distressed Jeans", price: 77, sizes: ["28", "30", "32", "34", "36"], img: "imgs/jeans-flame.jpg", category: "men", collection: "Men's Denim / Drop 001", tags: ["Distressed", "Flame", "Wide Leg"], availability: "In production", desc: "Flame-cut details and distressed texture for a worn-in, aggressive denim story." },
  { id: 106, name: "Cranial Void Gothic Jeans", price: 68, sizes: ["28", "30", "32", "34", "36"], img: "imgs/jeans-skull.jpg", category: "men", collection: "Men's Denim / Drop 001", tags: ["Skull", "Gothic", "Straight Leg"], availability: "Limited pre-order", desc: "A skull motif integrated into black denim for a cleaner gothic uniform piece." },

  { id: 108, name: "Six Eyes Gojo Satoru Denim", price: 69, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-gojo.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Anime", "Sublimated", "Straight"], availability: "Limited pre-order", desc: "Gojo artwork printed with high-fidelity contrast on a clean straight denim base." },
  { id: 109, name: "Cursed Energy JJK Collage", price: 59, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-jjk1.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["JJK", "Collage", "Black Denim"], availability: "In production", desc: "A dense cursed-energy collage composed across black denim for movement and impact." },
  { id: 110, name: "Cursed Energy JJK Vol. 2", price: 65, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-jjk2.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["JJK", "Vol. 2", "Panel Art"], availability: "Archive pulled from GitHub", desc: "A second JJK panel treatment with darker character contrast and a more graphic streetwear read." },
  { id: 111, name: "Demon Back Baki Denim", price: 70, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-baki.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Baki", "Heavy Graphic", "Rugged"], availability: "Limited pre-order", desc: "A raw Baki graphic treatment on rugged denim with a strength-first silhouette." },
  { id: 112, name: "Shinigami Death Note Denim", price: 67, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-deathnote.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Death Note", "Monochrome", "Gothic"], availability: "Low quantity", desc: "Death Note iconography in a darker monochrome composition for a more refined anime piece." },
  { id: 113, name: "Straw Hat One Piece Jeans", price: 77, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-one-piece.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["One Piece", "Manga Panel", "Overdye"], availability: "Limited pre-order", desc: "Manga-scale artwork blended into denim for a wearable panel effect." },
  { id: 114, name: "Horror Anime Black Denim", price: 64, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-horror.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Horror", "Black Denim", "Graphic"], availability: "Archive pulled from GitHub", desc: "A darker horror-anime composition built for the gothic side of the KRYPTAA archive." },
  { id: 115, name: "Six Eyes Gojo Vol. 2", price: 69, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-gojo2.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Gojo", "Vol. 2", "Cobalt"], availability: "Archive pulled from GitHub", desc: "A second Gojo denim with cooler tones and high-contrast artwork for stronger movement." },
  { id: 116, name: "Black Red Anime Denim", price: 65, sizes: ["28", "30", "32", "34", "36"], img: "imgs/anime-blackred.jpg", category: "anime", collection: "Anime Denim / Drop 001", tags: ["Black Red", "Anime", "Statement"], availability: "Archive pulled from GitHub", desc: "Red-on-black anime artwork made for a sharper, club-lit color hit inside the denim line." },

  { id: 30, name: "Architectural Split-Hem Jeans", price: 88, sizes: ["XS", "S", "M", "L"], img: "imgs/w-blue-split.jpg", category: "women", collection: "Women's Denim / Drop 001", tags: ["Split Hem", "High Waist", "Panelled"], availability: "Limited pre-order", desc: "Mid-wash denim with split hems and architectural paneling for a sharp feminine shape." },
  { id: 31, name: "Butterfly Web Wide-Leg", price: 115, sizes: ["XS", "S", "M", "L"], img: "imgs/w-butterfly.jpg", category: "women", collection: "Women's Denim / Drop 001", tags: ["Butterfly", "Wide Leg", "Laser Detail"], availability: "Low quantity", desc: "Spiderweb and butterfly art across a high-waisted wide-leg cut with editorial tension." },
  { id: 201, name: "Vintage Dragon High-Waist", price: 70, sizes: ["XS", "S", "M", "L"], img: "imgs/w-vintage-dragon.jpg", category: "women", collection: "Women's Denim / Drop 001", tags: ["Dragon", "Vintage Wash", "High Waist"], availability: "In production", desc: "Vintage-wash denim with dragon art wrapping the waist and leg for an old-soul gothic read." },
  { id: 202, name: "Lunar White Dragon Denim", price: 77, sizes: ["XS", "S", "M", "L"], img: "imgs/w-white-dragon.jpg", category: "women", collection: "Women's Denim / Drop 001", tags: ["White Denim", "Dragon", "Contrast"], availability: "Limited pre-order", desc: "White denim cut against black dragon artwork for the brightest piece in the void." },
  { id: 205, name: "Gothic Utility Cargo Jeans", price: 70, sizes: ["XS", "S", "M", "L"], img: "imgs/w-cargo.jpg", category: "women", collection: "Women's Denim / Drop 001", tags: ["Cargo", "Utility", "Adjustable"], availability: "Limited pre-order", desc: "A utility cargo shape with oversized pockets and a dark feminine technical edge." },
  { id: 206, name: "Distressed Ritual Denim", price: 62, sizes: ["XS", "S", "M", "L"], img: "imgs/w-distressed.jpg", category: "women", collection: "Women's Denim / Drop 001", tags: ["Distressed", "Relaxed", "Washed"], availability: "Archive pulled from GitHub", desc: "A distressed black wash with a softer fall, pulled back into the site so the women's drop feels complete." },
  { id: 207, name: "Grey Baggy Motion Denim", price: 65, sizes: ["XS", "S", "M", "L"], img: "imgs/w-grey-baggy.jpg", category: "women", collection: "Women's Denim / Drop 001", tags: ["Grey Wash", "Baggy", "Motion"], availability: "Archive pulled from GitHub", desc: "Grey baggy denim with an easy stacked leg, useful as the bridge between streetwear utility and track energy." },
  { id: 208, name: "Pink Skull Gothic Denim", price: 68, sizes: ["XS", "S", "M", "L"], img: "imgs/w-pink-skull.jpg", category: "women", collection: "Women's Denim / Drop 001", tags: ["Skull", "Pink Detail", "High Waist"], availability: "Archive pulled from GitHub", desc: "A softer color strike over gothic skull language for the women's denim archive." },
  { id: 209, name: "Side Rip Black Denim", price: 67, sizes: ["XS", "S", "M", "L"], img: "imgs/w-side-rip.jpg", category: "women", collection: "Women's Denim / Drop 001", tags: ["Side Rip", "Black Wash", "Stacked"], availability: "Archive pulled from GitHub", desc: "Side-rip detailing gives this black denim a more aggressive, movement-led shape." },

  { id: 301, name: "Angel Oversized Top", price: 45, sizes: ["XS", "S", "M", "L"], img: "imgs/img-angel.png", category: "tops", collection: "Women's Tops / Drop 001", tags: ["Angel Graphic", "Oversized", "Black Cotton"], availability: "Archive pulled from GitHub", desc: "The Angel graphic brought into the women's tops system with a roomy streetwear shoulder and dark altar artwork." },
  { id: 302, name: "Broken Mirror Top", price: 48, sizes: ["XS", "S", "M", "L"], img: "imgs/img-broken.png", category: "tops", collection: "Women's Tops / Drop 001", tags: ["Surreal", "Mirror", "Box Fit"], availability: "Archive pulled from GitHub", desc: "A fractured surrealist graphic with a clean black body and sharper fashion-editorial tension." },
  { id: 303, name: "Crime Scene Top", price: 42, sizes: ["XS", "S", "M", "L"], img: "imgs/img-crime.png", category: "tops", collection: "Women's Tops / Drop 001", tags: ["Cyber Gothic", "Statement", "Limited"], availability: "Limited pre-order", desc: "Bold cyber-goth lettering and dark scene work tuned for a fitted or oversized women's silhouette." },
  { id: 304, name: "Glorious Gold-Foil Top", price: 50, sizes: ["XS", "S", "M", "L"], img: "imgs/img-glorious.png", category: "tops", collection: "Women's Tops / Drop 001", tags: ["Gold Foil", "Stretch", "Editorial"], availability: "Limited pre-order", desc: "A contour top using gold-foil graphic energy to bridge gothic couture and streetwear." },
  { id: 305, name: "Money Moves Top", price: 46, sizes: ["XS", "S", "M", "L"], img: "imgs/img-money.png", category: "tops", collection: "Women's Tops / Drop 001", tags: ["Type Graphic", "Street", "Box Fit"], availability: "Archive pulled from GitHub", desc: "A clean typographic piece built for fast styling, low-light gold jewelry, and black denim." },
  { id: 306, name: "Silver Mesh Chain Crop", price: 35, sizes: ["XS", "S", "M", "L"], img: "imgs/img-angel.png", category: "tops", collection: "Women's Tops / Festival", tags: ["Mesh", "Chain", "Festival"], availability: "Sample preview", desc: "A silver mesh crop concept with chain strap attitude and after-dark styling." },

  { id: 401, name: "Obsidian Grey Baggy Track Pant", price: 65, sizes: ["XS", "S", "M", "L"], img: "imgs/w-grey-baggy.jpg", category: "women_track", collection: "Women's Track Pants / Drop 002", tags: ["Baggy", "Motion Fit", "Cyber Utility"], availability: "Drop 002 preview", desc: "A baggy grey motion pant styled from the women's archive into the missing track-pant lane the site needed." },
  { id: 402, name: "Gothic Utility Track Cargo", price: 70, sizes: ["XS", "S", "M", "L"], img: "imgs/w-cargo.jpg", category: "women_track", collection: "Women's Track Pants / Drop 002", tags: ["Cargo", "Utility", "Adjustable"], availability: "Drop 002 preview", desc: "Cargo utility pockets and a relaxed technical leg for the cyberpunk side of KRYPTAA's women's drop." },
  { id: 403, name: "Distressed Motion Track Pant", price: 62, sizes: ["XS", "S", "M", "L"], img: "imgs/w-distressed.jpg", category: "women_track", collection: "Women's Track Pants / Drop 002", tags: ["Distressed", "Motion", "Black Wash"], availability: "Drop 002 preview", desc: "A distressed movement pant with the weight and attitude of denim but the styling language of trackwear." },
  { id: 404, name: "Side Rip Technical Track Pant", price: 67, sizes: ["XS", "S", "M", "L"], img: "imgs/w-side-rip.jpg", category: "women_track", collection: "Women's Track Pants / Drop 002", tags: ["Side Rip", "Technical", "Stacked"], availability: "Drop 002 preview", desc: "Side-rip details and stacked proportions give this track silhouette a sharper gothic finish." }
];

const CATEGORY_CONFIGS = {
  men: {
    title: "Men",
    label: "Shadow Denim",
    nav: "Men",
    href: "men.html",
    description: "Utility denim, dragon graphics, and black-volume silhouettes engineered for presence.",
    heroIds: [14, 10, 11, 17, 16],
    featuredIds: [14, 10, 11, 17]
  },
  women: {
    title: "Women",
    label: "Dark Feminine",
    nav: "Women",
    href: "women.html",
    description: "High-waist denim, split hems, and gothic detailing cut with an editorial eye.",
    heroIds: [31, 202, 207, 30, 205],
    featuredIds: [31, 202, 207, 208]
  },
  all_jeans: {
    title: "Jeans",
    label: "Denim Archive",
    nav: "Jeans",
    href: "jeans.html",
    description: "The complete denim field: dragon work, anime panels, utility cargos, and architectural women's cuts.",
    heroIds: [14, 31, 108, 202, 17],
    featuredIds: [14, 31, 108, 202]
  },
  tees: {
    title: "T-Shirts",
    label: "Heavyweight Cotton",
    nav: "T-Shirts",
    href: "t-shirts.html",
    description: "300GSM gothic graphics with dense structure, oversized drape, and sharp print clarity.",
    heroIds: [1, 2, 3, 4, 5],
    featuredIds: [1, 2, 3, 4]
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
  tops: {
    title: "Women Tops",
    label: "Dark Feminine Tops",
    nav: "Tops",
    href: "women-tops.html",
    description: "Women's tops from the KRYPTAA archive: angel graphics, gold foil, cyber typography, and fitted after-dark styling.",
    heroIds: [301, 304, 302, 303, 305],
    featuredIds: [301, 304, 302, 305]
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
  }
};

const HOME_FEATURE_IDS = [14, 31, 301, 401, 108, 202, 17, 304];

const STORY_DEFAULTS = {
  tees: {
    technical: "Built from heavyweight cotton selected for structure, opacity, and a premium hand feel.",
    artisticConcept: "Gothic artwork is scaled like a poster piece, balancing dark symbolism with clean streetwear utility.",
    fit: "Oversized and boxy. Choose true size for a structured drape or size up for a more dramatic shoulder.",
    materials: "300GSM cotton jersey with a compact knit and substantial collar recovery.",
    finish: "High-definition print application designed to hold edge clarity through repeated wear.",
    shipping: "Ships folded in protective KRYPTAA packaging. Pre-order timing is estimated at 2-3 weeks.",
    brandConnection: "Part of the KRYPTAA uniform: heavy, quiet, and built around aura instead of noise."
  },
  denim: {
    technical: "Reinforced denim construction with durable seams, structured pockets, and hardware selected for daily wear.",
    artisticConcept: "Artwork is placed to move with the leg, turning the denim into a walking graphic composition.",
    fit: "Relaxed through the leg with intentional stacking. Size true for a clean fall or up for more volume.",
    materials: "Mid-to-heavyweight cotton denim with wash treatments selected per garment artwork.",
    finish: "Graphic, wash, and distress details are finished to feel integrated with the cloth instead of pasted on top.",
    shipping: "Limited pre-order pieces ship after final finishing and inspection. Allow 2-3 weeks unless marked otherwise.",
    brandConnection: "KRYPTAA denim is the armor layer: dark, graphic, and made to carry identity without explanation."
  },
  tops: {
    technical: "Cut for statement styling with detail placement designed to catch light in motion.",
    artisticConcept: "A darker festival language: metallic flash, gothic references, and controlled exposure.",
    fit: "Close to body. Size up if you prefer more coverage or a less compressed silhouette.",
    materials: "Stretch or mesh-led materials selected for shine, movement, and after-dark styling.",
    finish: "Foil, chain, or graphic details are treated as jewelry for the garment.",
    shipping: "Ships in protective KRYPTAA packaging. Sample preview items may have limited size availability.",
    brandConnection: "This is the high-voltage edge of KRYPTAA: more light, same darkness."
  }
};

function productFamily(product) {
  if (product.category === "tees") return "tees";
  if (product.category === "tops") return "tops";
  if (product.category === "women_track") return "denim";
  return "denim";
}

function enrichProduct(product) {
  const defaults = STORY_DEFAULTS[productFamily(product)];
  return {
    ...defaults,
    ...product,
    gallery: product.gallery || [product.img],
    hero: product.hero || product.img,
    story: product.story || product.desc,
    material: product.material || defaults.materials,
    slug: String(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  };
}

const PRODUCTS = RAW_PRODUCTS.map(enrichProduct);

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
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
    "women-tops.html": "tops",
    "women-track-pants.html": "women_track",
    "track-pants.html": "track",
    "shop-template.html": "all_jeans"
  };
  return fromFile[filename] || "men";
}

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
