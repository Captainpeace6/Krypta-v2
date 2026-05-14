const PRODUCTS = [
  // --- T-SHIRTS (Heavyweight / Drop 001) ---
  {
    id: 1,
    name: "Glorious Death Heavyweight Tee",
    price: 58,
    sizes: ["S", "M", "L", "XL"],
    img: "imgs/img-glorious.png",
    category: "tees",
    desc: "A cornerstone of the KRYPTAA aesthetic. The 'Glorious Death' tee features a sprawling skeleton angel rising from a sea of digital flames. Engineered from 300GSM ultra-heavyweight cotton, this piece provides a structured, boxy drape that commands attention. High-definition DTF printing ensures the gothic artwork remains sharp through every cycle of the void. Defined by power, driven by aura."
  },
  {
    id: 2,
    name: "Cyber Crime Statement Tee",
    price: 58,
    sizes: ["S", "M", "L", "XL"],
    img: "imgs/img-crime.png",
    category: "tees",
    desc: "Merging cyber aesthetics with dark brushstroke textures. The 'Crime' tee is a testament to the underground culture. Crafted from premium 300GSM fabric, it features bold front and back prints that command presence. The oversized silhouette is perfectly balanced for a modern gothic look."
  },
  {
    id: 3,
    name: "Gothic Angel Oversized Tee",
    price: 58,
    sizes: ["S", "M", "L", "XL"],
    img: "imgs/img-angel.png",
    category: "tees",
    desc: "Ethereal and imposing. The Angel tee features intricate gothic line-work on a jet-black canvas. Made with our signature 300GSM cotton, providing a structured fit that feels as powerful as it looks. Each piece is a statement of intent for the SS26 collection."
  },
  {
    id: 4,
    name: "Broken Mirror Surrealist Tee",
    price: 58,
    sizes: ["S", "M", "L", "XL"],
    img: "imgs/img-broken.png",
    category: "tees",
    desc: "A visual exploration of fractured identity. The 'Broken Mirror' tee utilizes premium printing techniques on a 300GSM heavyweight base. Designed for those who find beauty in the distorted, this oversized piece offers a unique silhouette and unmatched comfort."
  },
  {
    id: 5,
    name: "Money Moves Typo Tee",
    price: 58,
    sizes: ["S", "M", "L", "XL"],
    img: "imgs/img-money.png",
    category: "tees",
    desc: "Streetwear edge meets gothic soul. The 'Money Moves' tee is a bold typographic statement. Constructed from heavy 300GSM cotton with an oversized fit that resonates with the hustle of the underground. No noise. Just drops."
  },

  // --- MEN'S JEANS (Drop 001) ---
  {
    id: 10,
    name: "Shadow Tech Cargo Jeans",
    price: 98,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/jeans-grey-cargo.jpg",
    category: "men",
    desc: "Technical excellence in denim. These shadow grey cargo jeans feature multiple utility pockets and custom gothic hardware. The 14oz premium denim is cut into a wide-leg silhouette designed for both movement and presence. Engineered for the urban wanderer."
  },
  {
    id: 11,
    name: "Sakura Blossom Wide-Leg Denim",
    price: 118,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/jeans-flower-full.jpg",
    category: "men",
    desc: "Where nature meets darkness. Premium black denim adorned with a full-leg sakura floral pattern bleached into the fibers. The relaxed wide-leg cut and hand-finished details make this a standout signature piece of the SS26 drop."
  },
  {
    id: 12,
    name: "Crimson Dragon Painted Denim",
    price: 77,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/jeans-red-dragon.jpg",
    category: "men",
    desc: "Unleash the spirit. Featuring a vibrant crimson dragon artwork on deep black denim. Each pair is enzyme-washed for a premium feel while maintaining the rugged integrity of 13.5oz denim. A high-aura piece for the bold."
  },
  {
    id: 14,
    name: "Imperial Gold Dragon Denim",
    price: 75,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/jeans-gold-dragon.jpg",
    category: "men",
    desc: "The flagship of Drop 001. A serpentine gold dragon is hand-painted onto premium jet-black denim. This straight-leg cut stacks perfectly over footwear, creating a powerful, focused silhouette. Limited pre-order, never restocked."
  },
  {
    id: 16,
    name: "Dual Dragon Signature Baggy",
    price: 98,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/jeans-dual-dragon.jpg",
    category: "men",
    desc: "Symmetry in chaos. Featuring dual dragon motifs on high-thread-count black denim. The extra-baggy fit provides a timeless streetwear look with a dark, refined edge. A heavy-duty garment for the core of your wardrobe."
  },
  {
    id: 103,
    name: "Hellfire Distressed Jeans",
    price: 77,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/jeans-flame.jpg",
    category: "men",
    desc: "Ignite the void. Custom flame-cut details and fiery graphics on premium heavyweight denim. Strategically hand-distressed for an authentic, aggressive look that tells a story of survival in the system."
  },
  {
    id: 106,
    name: "Cranial Void Gothic Jeans",
    price: 68,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/jeans-skull.jpg",
    category: "men",
    desc: "Classic gothic imagery redefined. A large skull motif is expertly integrated into the structure of these straight-leg jeans. Crafted from mid-weight black denim for versatility and durability. Built for dominance."
  },

  // --- ANIME COLLECTION ---
  {
    id: 108,
    name: "Six Eyes Gojo Satoru Denim",
    price: 69,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/anime-gojo.jpg",
    category: "anime",
    desc: "Honoring the strongest. Premium denim featuring iconic Gojo Satoru artwork. High-fidelity prints are dye-sublimated into the fabric to ensure they never crack or fade. Modern straight cut with reinforced stitching for a life on the move."
  },
  {
    id: 109,
    name: "Cursed Energy JJK Collage",
    price: 59,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/anime-jjk1.jpg",
    category: "anime",
    desc: "Cursed energy made material. These jeans feature a curated collage of the most intense moments from Jujutsu Kaisen. Precision printed on our standard 12oz black denim, offering a unique texture and a message of power."
  },
  {
    id: 111,
    name: "Demon Back Baki Denim",
    price: 70,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/anime-baki.jpg",
    category: "anime",
    desc: "Strength redefined. Heavyweight custom denim featuring Baki the Grappler graphics. This piece represents the raw power of the Hanma bloodline. Rugged, textured, and built to endure the hardest grinds of the underground."
  },
  {
    id: 112,
    name: "Shinigami Death Note Denim",
    price: 67,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/anime-deathnote.jpg",
    category: "anime",
    desc: "A dark intellectual struggle depicted on fabric. These deep-black jeans feature ethereal depictions of Ryuuk and classic Death Note iconography. Monochromatic, sophisticated, and undeniably gothic."
  },
  {
    id: 113,
    name: "Straw Hat One Piece Jeans",
    price: 77,
    sizes: ["28", "30", "32", "34", "36"],
    img: "imgs/anime-one-piece.jpg",
    category: "anime",
    desc: "The journey to the top. Featuring grand-scale manga panels from One Piece's most epic moments. Using a specialized over-dye process, the graphics blend into the denim for a subtle yet powerful look. Straight fit, 5-pocket construction."
  },

  // --- WOMEN'S JEANS ---
  {
    id: 30,
    name: "Architectural Split-Hem Jeans",
    price: 88,
    sizes: ["XS", "S", "M", "L"],
    img: "imgs/w-blue-split.jpg",
    category: "women",
    desc: "Designing the new feminine silhouette. These mid-wash blue jeans feature a dramatic split-hem and architectural paneling. Made from high-quality denim with a hint of stretch. Dark feminine energy meets modern design excellence."
  },
  {
    id: 31,
    name: "Butterfly Web Wide-Leg",
    price: 115,
    sizes: ["XS", "S", "M", "L"],
    img: "imgs/w-butterfly.jpg",
    category: "women",
    desc: "Delicate yet deadly. Intricate spiderweb and butterfly graphics are laser-etched into the denim for a permanent, high-detail finish. The wide-leg, high-waisted design offers a powerful, editorial look for the SS26 collection."
  },
  {
    id: 201,
    name: "Vintage Dragon High-Waist",
    price: 70,
    sizes: ["XS", "S", "M", "L"],
    img: "imgs/w-vintage-dragon.jpg",
    category: "women",
    desc: "A classic reborn. Vintage-wash jeans with hand-detailed dragon art wrapping around the high-waist. The relaxed leg provides an effortless aesthetic, while the 13oz denim ensures a premium feel that lasts forever."
  },
  {
    id: 202,
    name: "Lunar White Dragon Denim",
    price: 77,
    sizes: ["XS", "S", "M", "L"],
    img: "imgs/w-white-dragon.jpg",
    category: "women",
    desc: "A beacon in the void. Striking white denim serves as the canvas for contrasting black dragon embroidery. High-fashion, high-impact, and undeniably KRYPTAA. Cut with a flattering high-waist and wide-leg profile."
  },
  {
    id: 205,
    name: "Gothic Utility Cargo Jeans",
    price: 70,
    sizes: ["XS", "S", "M", "L"],
    img: "imgs/w-cargo.jpg",
    category: "women",
    desc: "Functionality redefined. These cargo jeans feature oversized utility pockets and custom gunmetal hardware. Adjustable drawstring waist for a versatile fit—wear it high or low. Engineered for those who operate in silence."
  },

  // --- WOMEN'S TOPS / FESTIVAL ---
  {
    id: 50,
    name: "Silver Mesh Chain Crop",
    price: 35,
    sizes: ["XS", "S", "M", "L"],
    img: "imgs/img-angel.png", // Fallback
    category: "tops",
    desc: "Shatter the dark. Shimmering silver mesh construction with hand-linked chain straps. A festival-ready statement piece designed for maximum impact under low light. Sheer, bold, and essential for the dark feminine wardrobe."
  },
  {
    id: 104,
    name: "Glorious Gold-Foil Top",
    price: 50,
    sizes: ["XS", "S", "M", "L"],
    img: "imgs/img-glorious.png",
    category: "tops",
    desc: "Luxury meets the abyss. This editorial-cut top features heavy gold foil detailing of our signature 'Glorious' artwork. The premium stretch-fabric contours to the body, providing a sharp silhouette that bridges streetwear and gothic couture."
  }
];

// Helper functions for data access
function getProductById(id) {
  // Try numeric match first, then string
  return PRODUCTS.find(p => p.id == id);
}

function getProductsByCategory(cat) {
  if (cat === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === cat);
}
