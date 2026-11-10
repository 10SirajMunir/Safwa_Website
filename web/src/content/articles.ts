// STARTER CONTENT (Phase 1): three Fabric Guide articles covering the PRD §2 topics
// (GSM guide, fabric comparison, uses). The owner reviews them before launch (OQ-04).
// Phase 2 moves articles into the admin blog editor (AD-05).
import type { Article } from "@/types/content";

export const articles: Article[] = [
  {
    slug: "what-is-gsm-fabric-weight-guide",
    title: "What is GSM? A buyer's guide to fabric weight",
    description:
      "GSM is the weight of one square meter of fabric in grams. Learn which GSM suits shirts, kurtas, uniforms and trousers before you order.",
    category: "gsm-guides",
    publishedAt: "2026-10-20",
    readingMinutes: 4,
    body: [
      {
        type: "p",
        text: "GSM means grams per square meter. It is the weight of one square meter of fabric, and it is the quickest way to judge how light or heavy a fabric will feel. A 120 GSM cotton is light and airy; a 240 GSM cotton twill is dense and strong.",
      },
      { type: "h2", text: "How GSM changes the fabric" },
      {
        type: "ul",
        items: [
          "Lower GSM (100–140): lighter, cooler, more breathable. Good for summer shirts and kurtas.",
          "Mid GSM (150–200): the everyday range. Holds its shape, still comfortable. Good for shirts, uniforms and light trousers.",
          "Higher GSM (200–260): heavier and more durable. Good for trousers, workwear and home textiles.",
        ],
      },
      { type: "h2", text: "Quick GSM guide by use" },
      {
        type: "table",
        head: ["Use", "Typical GSM", "Why"],
        rows: [
          ["Summer shirts, kurtas", "110–140", "Light and breathable in heat"],
          ["Office and school shirts", "120–160", "Comfortable, irons neatly"],
          ["Uniforms", "160–220", "Survives frequent washing"],
          ["Trousers", "200–260", "Holds a crease, resists wear"],
          ["Home textile", "150–260", "Depends on drape or durability needed"],
        ],
      },
      { type: "h2", text: "GSM is not the whole story" },
      {
        type: "p",
        text: "Two fabrics with the same GSM can feel different. The weave (plain, twill or satin), the fibre (cotton or poly-cotton) and the finish (peach or mercerised) all change the hand-feel and drape. That is why every Al Safwa fabric page lists GSM together with composition, weave, finish and width.",
      },
      { type: "h2", text: "How to check before you order" },
      {
        type: "p",
        text: "Order a sample of the fabric you are considering. Feel the weight, check the drape and test a wash. Our minimum order is 100 meters per colour, so a sample first saves you from an expensive surprise.",
      },
    ],
    relatedFabrics: ["cotton-plain-120-gsm", "cotton-twill-180-gsm", "heavy-cotton-twill-240-gsm"],
  },
  {
    slug: "cotton-vs-poly-cotton",
    title: "Cotton vs poly-cotton: which fabric suits your order?",
    description:
      "100% cotton breathes and feels soft; 65/35 poly-cotton is stronger, shrinks less and needs less ironing. Compare them side by side.",
    category: "fabric-comparisons",
    publishedAt: "2026-10-22",
    readingMinutes: 4,
    body: [
      {
        type: "p",
        text: "Choose 100% cotton when comfort and breathability matter most. Choose a 65% polyester 35% cotton blend when the garment will be washed often and must keep its shape and colour, such as uniforms.",
      },
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "100% Cotton", "65/35 Poly-cotton"],
        rows: [
          ["Comfort in heat", "Excellent, breathes well", "Good, slightly warmer"],
          ["Shrinkage", "Higher (allow for it when cutting)", "Lower"],
          ["Wrinkles", "Creases more, needs ironing", "Resists wrinkles"],
          ["Durability", "Good", "Very good for frequent washing"],
          ["Colour after many washes", "Good", "Very good"],
          ["Feel", "Soft, natural", "Smooth, crisp"],
        ],
      },
      { type: "h2", text: "Which one for your product" },
      {
        type: "ul",
        items: [
          "Kurtas and summer shirts: cotton, for comfort.",
          "School and corporate uniforms: poly-cotton, for durability and easy care.",
          "Trousers: either; heavier cotton twill for a natural feel, poly-cotton twill for low maintenance.",
        ],
      },
      {
        type: "p",
        text: "Not sure? Order samples of both and compare them on your own production line.",
      },
    ],
    relatedFabrics: ["cotton-twill-180-gsm", "poly-cotton-twill-210-gsm", "poly-cotton-plain-140-gsm"],
  },
  {
    slug: "choosing-fabric-for-uniforms",
    title: "Choosing fabric for school and work uniforms",
    description:
      "Uniform fabric must survive daily wear and frequent washing. What to look for in GSM, weave and blend, and how many meters to order.",
    category: "fabric-uses",
    publishedAt: "2026-10-24",
    readingMinutes: 3,
    body: [
      {
        type: "p",
        text: "A good uniform fabric is mid to heavy weight (160–220 GSM), woven in a twill for strength, and usually a poly-cotton blend so it keeps its colour and shape after many washes.",
      },
      { type: "h2", text: "What to check" },
      {
        type: "ul",
        items: [
          "GSM: 160–220 for shirts and tunics, 200–240 for trousers.",
          "Weave: twill hides wear and resists tearing better than plain weave.",
          "Blend: 65/35 poly-cotton for easy care; 100% cotton where comfort comes first.",
          "Colour fastness: ask for wash and rub fastness, especially for dark navy and maroon.",
        ],
      },
      { type: "h2", text: "Planning quantity" },
      {
        type: "p",
        text: "Our minimum order is 100 meters per colour. If your uniform has a shirt and trousers in different colours, each colour needs at least 100 meters. Share your size chart and piece count with us and we will help you estimate the meters you need.",
      },
    ],
    relatedFabrics: ["poly-cotton-twill-210-gsm", "cotton-twill-180-gsm", "heavy-cotton-twill-240-gsm"],
  },
];
