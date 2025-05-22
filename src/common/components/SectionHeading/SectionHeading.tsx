import styles from './sectionheading.module.css';

interface SectionHeadingProps {
  title: string;
  className?: string;
}

const SectionHeading = ({ title, className }: SectionHeadingProps) => {
  return (
    <div>
      <h2 className={`${styles.title} ${className}`}>{title}</h2>
    </div>
  );
};

export default SectionHeading;
