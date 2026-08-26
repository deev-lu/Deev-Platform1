/**
 * The WhatsApp Business number, in one place.
 *
 * It was written out in four: the footer's social row, the contact page, the
 * legal page and two blocks of structured data, each with its own idea of the
 * link format. A phone number that appears five times is a phone number that
 * gets changed four times.
 */

/** Digits only, no plus, no spaces. wa.me will not accept anything else. */
export const WHATSAPP_NUMBER = "352691388887";

/** For display. */
export const WHATSAPP_DISPLAY = "+352 691 388 887";

/**
 * A deep link to the chat.
 *
 * wa.me rather than api.whatsapp.com: it is WhatsApp's own short domain, it
 * opens the installed app directly on a phone instead of bouncing through a
 * web page first, and it falls back to WhatsApp Web on a desktop without the
 * app. The prefilled text is a starting line the sender can delete.
 */
export const whatsappHref = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
