import { Initials } from '@/components/people/Initials';
import { CurtainImage } from '@/components/ui/CurtainImage';
import type { team as teamContent } from '@/content/team';
import { format } from '@/i18n/messages';
import type { Messages } from '@/i18n/messages';
import styles from './team.module.css';

type TeamMember = (typeof teamContent)[number];

interface TeamGridProps {
  members: TeamMember[];
  portraitOf: string;
  roles: Messages['team']['roles'];
}

/**
 * The ensemble roster: a credits list rather than a staff directory – small
 * torn-paper portraits (same device as the production cast list), Initials
 * standing in where there is no photo (e.g. Athanasios Karakantas).
 */
export function TeamGrid({ members, portraitOf, roles }: TeamGridProps) {
  return (
    <ul className={styles.roster}>
      {members.map((member, i) => (
        <li key={member.name} className={styles.member}>
          <div className={styles.portraitFrame}>
            {member.photo ? (
              <CurtainImage
                className={styles.fill}
                image={member.photo}
                alt={format(portraitOf, { name: member.name })}
                sizes="(min-width: 768px) 9rem, 6rem"
                delay={(i % 4) * 80}
              />
            ) : (
              <Initials name={member.name} />
            )}
          </div>
          <div className={styles.memberText}>
            <h3>{member.name}</h3>
            <p className={styles.role}>{roles[member.role]}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
