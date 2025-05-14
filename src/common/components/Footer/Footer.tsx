import styles from './footer.module.css';
import Collections from './FooterElements/Collections/Collections';
import Learn from './FooterElements/Learn/Learn';
import Contact from './FooterElements/Contact/Contact';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Collections />
        <Learn />
        <Contact />
      </div>
    </footer>
  );
};

export default Footer;
