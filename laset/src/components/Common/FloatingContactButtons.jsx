import { assets } from '../../assets/assets.js';

const contacts = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/254704519867',
    icon: assets.whatsapp,
    label: 'Chat on WhatsApp',
    className: 'bg-green-600 hover:bg-green-700',
  },
  {
    name: 'Call',
    href: 'tel:0704519867',
    icon: assets.phone,
    label: 'Call us',
    className: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'Facebook',
    href: 'https://web.facebook.com/profile.php?id=100078224891871',
    icon: assets.facebook,
    label: 'Visit our Facebook page',
    className: 'bg-sky-700 hover:bg-sky-800',
  },
];

function FloatingContactButtons() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {contacts.map((contact, index) => (
        <a
          key={contact.name}
          href={contact.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={contact.label}
          className={`floating-contact-btn flex h-14 w-14 items-center justify-center rounded-full border border-white/30 shadow-lg transition-transform duration-300 hover:scale-110 ${contact.className}`}
          style={{ animationDelay: `${index * 0.12}s` }}
        >
          <img src={contact.icon} alt={contact.name} className="h-7 w-7 object-contain" />
        </a>
      ))}
    </div>
  );
}

export default FloatingContactButtons;
