import React from 'react';

interface SceneShellProps {
  /** Short chapter marker rendered above the title (e.g. "Chapitre III"). */
  chapter: string;
  /** Scene title — rendered as the section heading. */
  title: string;
  /** Optional explanatory line under the title. */
  lede?: string;
  /** Id given to the heading so the section can be labelled by it. */
  titleId: string;
  /** Optional decorative or functional content aligned with the title. */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

/**
 * SceneShell — the investigation is presented as a succession of scenes
 * rather than one long, dense page. Each scene announces its chapter, its
 * title and (optionally) a short lede, then hosts a single focused panel.
 */
export const SceneShell: React.FC<SceneShellProps> = ({
  chapter,
  title,
  lede,
  titleId,
  aside,
  children,
  className,
  testId,
}) => {
  return (
    <section
      aria-labelledby={titleId}
      data-testid={testId}
      className={`scene animate-entry${className ? ` ${className}` : ''}`}
    >
      <header className="scene__header">
        <p className="scene__chapter">
          <span aria-hidden="true">✦</span>
          {chapter}
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          <h2 id={titleId} className="scene__title" style={{ margin: 0 }}>
            {title}
          </h2>
          {aside}
        </div>
        {lede && <p className="scene__lede">{lede}</p>}
      </header>
      {children}
    </section>
  );
};

export default SceneShell;
