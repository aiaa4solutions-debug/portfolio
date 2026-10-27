// Public contact details only. Never put calendar credentials in this file.
export const contact = {
  email: "aiaa4solutions@gmail.com",
  phone: "+261349403247",
  whatsapp: "https://wa.me/261349403247",
  github: "https://github.com/aiaa4solutions-debug",
  linkedin: "https://linkedin.com/in/ranaivoarisoa",
  // Set the public booking URL after the owner confirms it.
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
};
export const meetingEmail = `mailto:${contact.email}?subject=${encodeURIComponent("Meeting / Rendez-vous")}`;
