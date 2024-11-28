import React from 'react';

interface Cards {
  title: string;
  description: string;
  linkUrl: string;
}

export const cards: Cards[] = [
    {
        title: 'My Medium Blog',
        description: 'I write about things that interest me! Check me out!',
        linkUrl: 'https://medium.com/@notquitethereyet_/'
      },
  {
    title: 'Degoogling',
    description: 'Reduce the amount of data Google can steal from you!',
    linkUrl: 'https://www.reddit.com/r/degoogle/comments/huk4rp/why_you_should_degoogle_intro_degoogling/'
  },
  {
    title: 'Stay Private Online!',
    description: 'Various Privacy Tools',
    linkUrl: 'https://www.privacytools.io/'
  },
  {
    title: 'Are VPNs really private?',
    description: 'VPNs keep no logs. Right? RIGHT??????',
    linkUrl: 'https://www.youtube.com/watch?v=239w7x2TdWE'
  },
  {
    title: 'BitTorrent crypto mining',
    description: 'Your harem anime spiking CPU usage?',
    linkUrl: 'https://www.trustedreviews.com/news/utorrent-silently-installing-bundled-bitcoin-mining-software-2931825'
  },
  {
    title: 'PlayStation 2 BIOS',
    description: 'Curated BIOS that I need to play PS2 games.',
    linkUrl: 'https://drive.google.com/file/d/1H_ydGw_leVuMpRzrEoC8nAWhmR1kGr0i/view'
  },
  {
    title: 'PlayStation 3 Firmware',
    description: 'Official Sony repo for PS3 firmware! Good job Sony!',
    linkUrl: 'https://www.playstation.com/en-us/support/hardware/ps3/system-software/'
  },
  {
    title: 'Stealing Stuff Pt. 1',
    description: 'Stealing guide for games!',
    linkUrl: 'https://www.reddit.com/r/Piracy/wiki/megathread/games/'
  },
  {
    title: 'Stealing Stuff Pt. 2',
    description: 'Stealing Guide for other software!',
    linkUrl: 'https://www.reddit.com/r/Piracy/wiki/tools'
  },
  {
    title: 'Stealing Stuff Pt. 3',
    description: 'Stealing Guide for stinky weebs!',
    linkUrl: 'https://nyaa.si/'
  }
];

const Links: React.FC = () => {
  return (
    <section id="links" className="links">
      <h2>Important Links</h2>
      <div className="link-cards">
        {cards.map((card, index) => (
          <div key={index} className="link-card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <a href={card.linkUrl} target="_blank" rel="noopener noreferrer">
              Visit
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Links;
