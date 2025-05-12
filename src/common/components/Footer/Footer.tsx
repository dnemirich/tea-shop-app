import React, { useState } from 'react';
import styles from './footer.module.css';
import { Mail, MapPin, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const Footer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Mobile burger menu */}
        <div className={styles.mobileMenu}>
          {/* Collections */}
          <div className={styles.mobileSection}>
            <button className={styles.mobileTitle} onClick={() => toggleSection('collections')}>
              <span>COLLECTIONS</span>
              {activeSection === 'collections' ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            {activeSection === 'collections' && (
              <ul className={styles.mobileList}>
                <li>Black teas</li>
                <li>Green teas</li>
                <li>White teas</li>
                <li>Herbal teas</li>
                <li>Matcha</li>
                <li>Puer</li>
                <li>Oolong</li>
                <li>Rooibos</li>
                <li>Teaware</li>
              </ul>
            )}
          </div>

          {/* Learn */}
          <div className={styles.mobileSection}>
            <button className={styles.mobileTitle} onClick={() => toggleSection('learn')}>
              <span>LEARN</span>
              {activeSection === 'learn' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeSection === 'learn' && (
              <ul className={styles.mobileList}>
                <li>About us</li>
                <li>Blog</li>
              </ul>
            )}
          </div>

          {/* Contact Us */}
          <div className={styles.mobileSection}>
            <button className={styles.mobileTitle} onClick={() => toggleSection('contact')}>
              <span>CONTACT US</span>
              {activeSection === 'contact' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeSection === 'contact' && (
              <ul className={styles.mobileContactList}>
                <li className={styles.contactItem}>
                  <MapPin className={styles.icon} />
                  <span>12 Tea street, Saint Petersburg, Russia</span>
                </li>
                <li className={styles.contactItem}>
                  <Mail className={styles.icon} />
                  <span>Email: leaf-n-lore@gmail.com</span>
                </li>
                <li className={styles.contactItem}>
                  <Phone className={styles.icon} />
                  <span>Tel: +7 812 123-45-67</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Desktop view */}
        <div className={styles.desktopView}>
          {/* Collections */}
          <div>
            <h3 className={styles.title}>COLLECTIONS</h3>
            <ul className={styles.list}>
              <li>Black teas</li>
              <li>Green teas</li>
              <li>White teas</li>
              <li>Herbal teas</li>
              <li>Matcha</li>
              <li>Puer</li>
              <li>Oolong</li>
              <li>Rooibos</li>
              <li>Teaware</li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className={styles.title}>LEARN</h3>
            <ul className={styles.list}>
              <li>About us</li>
              <li>Blog</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className={styles.title}>CONTACT US</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPin className={styles.icon} />
                <span>12 Tea street, Saint Petersburg, Russia</span>
              </li>
              <li className={styles.contactItem}>
                <Mail className={styles.icon} />
                <span>Email: leaf-n-lore@gmail.com</span>
              </li>
              <li className={styles.contactItem}>
                <Phone className={styles.icon} />
                <span>Tel: +7 812 123-45-67</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
