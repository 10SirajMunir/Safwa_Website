// The order flow from PRD §2 (How to Order): choose fabric > colours > quantity >
// quote > payment > dispatch. Payment and dispatch wording follows PRD §5.
export const orderSteps = [
  {
    title: "Choose your fabric",
    text: "Browse the catalogue and open any fabric to see its GSM, width, composition and uses.",
  },
  {
    title: "Pick your colours",
    text: "Every colour has a name and a colour code. Note the codes you want.",
  },
  {
    title: "Decide the quantity",
    text: "The minimum is 100 meters per colour. Order more of any colour as you need.",
  },
  {
    title: "Get your quote",
    text: "Send a quote request on the fabric page or on WhatsApp. We reply with your price.",
  },
  {
    title: "Pay the way you prefer",
    text: "Cash on delivery, Easypaisa, JazzCash or bank transfer. Every order has its own Order ID.",
  },
  {
    title: "We dispatch",
    text: "Once your payment, or your cash-on-delivery order, is confirmed, we dispatch your fabric.",
  },
] as const;
