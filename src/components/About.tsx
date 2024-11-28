import React from 'react';

const About: React.FC = () => {
    return (
        <section id="about" className="about">
            <h2>About Me</h2>
            <div className="card">
                <h3>Background</h3>
                <p>CS graduate student with 2 years of software development experience.</p>
            </div>
            <div className="card">
                <h3>Technical Skills</h3>
                <p>React, Angular, Python, C++, TypeScript, .NET, Node.js</p>
            </div>
            <div className="card">
                <h3>Current Work</h3>
                <p>Interning with a healthcare company utilizing Make.com, Supabase with Postgres, and Google APIs for automation.</p>
            </div>
            <div className="card">
                <h3>Interests</h3>
                <p>Passionate about technology, Linux, and virtualization (big on VFIO GPU passthrough).</p>
            </div>
            <div className="card">
                <h3>Philosophy</h3>
                <p>Simp for open-source, libre, and FOSS.</p>
            </div>
            <div className="card">
                <h3>Learning Journey</h3>
                <p>Self-learning NixOS and Deep Learning, with plans to explore Machine Learning deployment soon™.</p>
            </div>
            <div className="card">
                <details>
                    <summary>My current hyperfixations:</summary>
                    <ol>
                        <li>Anime, manga, videogames, sketching, vintage digicams, custom keyboards</li>
                        <li>City Pop, J-Rock</li>
                        <li>Arch Linux and NixOS</li>
                        <li>Japanese guitars</li>
                    </ol>
                    <p>
                        As for mechanical keyboards, I build all of them with lubed Cherry MX Blacks on either an aluminum or polycarbonate plate.
                    </p> <br></br>
                    <p>
                        I have recently fallen in love with Topre. Got a prestine condition 2014 HHKB Pro 2 from eBay and have been loving the slightly aged tactility of the domes. The layout was also fairly easy to get used to, since I am terminally online :3.
                    </p> <br></br>
                    <div className="keyboard-cards">
                        <div className="keyboard-card">
                            <strong>
                                <a
                                    href="https://kiboustore.notion.site/Fukuro-Group-Buy-Information-c6bc51f97b834b9e813a83de4619eb90"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Kibou Fukuro
                                </a>
                                :
                            </strong>{' '}
                            GMK Alter, alu top mount, lubed and spring swapped MX Blacks, TX Stabs.
                        </div>
                        <div className="keyboard-card">
                            <strong>
                                <a
                                    href="https://cannonkeys.com/products/gb-crin-keyboard"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Bachoo Crin
                                </a>
                                :
                            </strong>{' '}
                            GMK Kouhai, polycarbonate top mount, lubed and spring swapped Zenclack Pleiades, TX Stabs.
                        </div>
                        <div className="keyboard-card">
                            <strong>
                                <a
                                    href="https://cannonkeys.com/products/angel-keyboard"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    CableCarDesigns Angel
                                </a>
                                :
                            </strong>{' '}
                            Creampacas, polypropylene pinhole mount, lubed and spring swapped creampacas, Durock stabs!
                        </div>
                        <div className="keyboard-card">
                            <strong>
                                <a
                                    href="https://www.hhkeyboard.com/uk/products/pro2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    HHKB Professional 2
                                </a>
                                :
                            </strong>{' '}
                            Got this off a Japanese guy clearing his closet! OEM 45g domes, charcoal keycaps and a modified 3-mode controller from Aliexpress.
                        </div>
                    </div>
                </details>
            </div>
        </section>
    );
};

export default About;
