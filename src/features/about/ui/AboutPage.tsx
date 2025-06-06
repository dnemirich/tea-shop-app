import logo from '/icons/rss-logo.svg';
import dashaPic from '/img/about-page/dasha.jpeg';
import s from './AboutPage.module.scss';

const AUTHORS = [
  {
    name: 'Eva Alisultanova',
    title: 'developer',
    github: 'evalion8',
    implementedFeatures: ['home page', 'catalog page', 'routing'],
    bio: '',
    avatar: null,
  },
  {
    name: 'Alina Iulbaeva',
    title: 'developer',
    github: 'alinidi',
    implementedFeatures: ['login page', 'user profile page', 'cart page', 'project configuration'],
    bio: '',
    avatar: null,
  },
  {
    name: 'Daria Nemirich',
    title: 'team-lead',
    github: 'dnemirich',
    implementedFeatures: ['registration page', 'product page', 'about us page', 'routing'],
    bio: '',
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
            2024Q4 course at Rolling Scope School. The main task was to create an online store based
            on the commercetools platform. The project was implemented in React.{' '}
          </p>
          <a href={'https://rs.school'}>
            <img src={logo} alt={'Rolling scopes school logo'} className={s.logo} />
          </a>
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
              <p>
                <span>Contribution to the project:</span> {author.implementedFeatures.join(', ')}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
