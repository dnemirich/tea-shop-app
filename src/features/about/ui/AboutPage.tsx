import logo from '/icons/rs_school.svg';
import dashaPic from '/img/about-page/dasha.jpg';
import alinaPic from '/img/about-page/alina.jpg';
import evaPic from '/img/about-page/eva.jpg';
import s from './AboutPage.module.scss';

const AUTHORS = [
  {
    name: 'Eva Alisultanova',
    title: 'developer',
    github: 'evalion8',
    implementedFeatures: ['home page', 'catalog page', 'routing'],
    bio: 'From teaching English to coding with passion — I bridge gaps between people and tech. A team player who believes in collaborative magic, clean solutions, and the power of lifelong learning. Turning complex into clear, one line at a time.',
    avatar: evaPic,
  },
  {
    name: 'Alina Iulbaeva',
    title: 'developer',
    github: 'alinidi',
    implementedFeatures: ['login page', 'user profile page', 'cart page', 'project configuration'],
    bio: 'I spent over six years as a design engineer before shifting my focus to frontend development. Every project is an opportunity to grow, and I’m constantly learning to become a better developer and teammate.',
    avatar: alinaPic,
  },
  {
    name: 'Daria Nemirich',
    title: 'team-lead',
    github: 'dnemirich',
    implementedFeatures: ['registration page', 'product page', 'about us page', 'routing'],
    bio: 'Biologist turned frontend developer — I’m fascinated by how code becomes something users can interact with. Leading a team for the first time taught me how much I enjoy helping others grow while learning alongside them.',
    avatar: dashaPic,
  },
];

export const AboutPage = () => {
  return (
    <div>
      <section className={s.section}>
        <h2 className={s.sectionHeader}>About the project</h2>
        <div className={s.aboutText}>
          <p>
            This tea store project was created as a final assignment for the JavaScript/Front-end
            2024Q4 course at Rolling Scope School{' '}
            <a href={'https://rs.school'}>
              <img src={logo} alt={'Rolling scopes school logo'} className={s.logo} />
            </a>
            . The main task was to create an online store based on the commercetools platform. Our
            team built the store using a lightweight tech stack: React, Zustand, React Router,
            Swiper, React Hook Form, and Zod. With no final UI mockups, we relied on open
            communication, shared ideas, and each teammate’s creative input to shape the product
            collaboratively.
          </p>
        </div>
      </section>
      <section className={`${s.section} ${s.authorsSection}`}>
        <h2 className={s.sectionHeader}>About the team</h2>
        <ul className={s.authorsList}>
          {AUTHORS.map((author, index) => (
            <li key={index} className={s.authorCard}>
              <img className={s.photo} src={author.avatar} alt={author.name} />
              <h3 className={s.name}>{author.name}</h3>
              <p className={s.title}>{author.title}</p>
              <p className={s.bio}>{author.bio}</p>
              <a href={`https://github.com/${author.github}`}>
                github: <span className={s.accentText}>{author.github}</span>
              </a>
              <h4>Contribution to the project </h4>
              <p>{author.implementedFeatures.join(', ')}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
