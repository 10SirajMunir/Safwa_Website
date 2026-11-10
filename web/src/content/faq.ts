// FAQ content (FR-21). Topics come from PRD §2: MOQ, delivery, payment, samples,
// colour matching. Answers state only facts given in the PRD; items marked
// "confirm" need the owner's wording before launch (OQ-04). Phase 2: AD-06.
import type { FaqItem } from "@/types/content";

export const faqs: FaqItem[] = [
  {
    id: "moq",
    topic: "moq",
    question: "What is your MOQ?",
    answer:
      "Our minimum order quantity (MOQ) is 100 meters per colour. If you order two colours of the same fabric, you need at least 100 meters of each.",
  },
  {
    id: "delivery-pakistan",
    topic: "delivery",
    // confirm: delivery coverage
    question: "Do you deliver across Pakistan?",
    answer:
      "Yes, we deliver across Pakistan. Each fabric page shows whether the fabric is ready stock or made to order, and its dispatch time.",
  },
  {
    id: "payment-methods",
    topic: "payment",
    question: "How can I pay?",
    answer:
      "You can pay by cash on delivery, Easypaisa, JazzCash or bank transfer. Every order gets an Order ID, and we dispatch once your payment, or your cash-on-delivery order, is confirmed.",
  },
  {
    id: "samples",
    topic: "samples",
    // confirm: sample terms
    question: "Can I get a sample before ordering?",
    answer:
      "Yes. Tap \"Order sample\" on any fabric page, or message us on WhatsApp with the fabric name and the colours you want to see.",
  },
  {
    id: "colour-matching",
    topic: "colour-matching",
    question: "Can you match a colour I already use?",
    answer:
      "Send us your colour reference on WhatsApp: a fabric swatch, a shade code or a clear photo in daylight. We reply with the closest colour codes we have.",
  },
  {
    id: "how-to-order",
    topic: "moq",
    question: "How do I place an order?",
    answer:
      "Choose a fabric, pick your colours, decide the quantity (at least 100 meters per colour) and ask for a quote. Once you accept the quote and pay, we dispatch your order.",
  },
];
