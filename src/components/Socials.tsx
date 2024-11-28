import React from 'react';

interface Social {
  name: string;
  url: string;
  icon: string; // URL or class for an icon
}

const socials: Social[] = [
  { name: 'GitHub', url: 'https://github.com/notquitethereyet', icon: '/assets/github.svg' },
  { name: 'Medium', url: 'https://medium.com/@notquitethereyet_/', icon: '/assets/medium.svg' },
  { name: 'Discord', url: 'https://discord.com/users/708534253809434684', icon: '/assets/discord.svg' },
  { name: 'Twitter', url: 'https://twitter.com/notquiteartyet', icon: '/assets/x.svg' },
  { name: 'Instagram', url: 'https://instagram.com/notquite28', icon: '/assets/instagram.svg' },
  { name: 'YouTube', url: 'https://youtube.com/channel/UC1CqG4CxLro2i_H2uBX0DCw', icon: '/assets/youtube.svg' }
];

const Socials: React.FC = () => {
  return (
    <section id="socials" className="socials">
      <h2>Find me elsewhere</h2>
      <div className="social-cards">
        {socials.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
          >
            <img src={social.icon} alt={`${social.name} icon`} className="social-icon" />
            <span>{social.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Socials;
