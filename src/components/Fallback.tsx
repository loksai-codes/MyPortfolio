import Image from "next/image";
import {
  about,
  assetUrl,
  contact,
  experience,
  gallery,
  profile,
  projects,
  quests,
  renPanel,
  sections,
  sectionMeta,
  skills,
  ui,
  type PanelHead,
  type SectionKey,
} from "@/content";
import { Bi } from "./Bi";
import { LanguageToggle } from "./LanguageToggle";

function Head({ id, head }: { id: SectionKey; head: PanelHead }) {
  return (
    <header>
      <div className="p-kicker">
        <Bi v={head.kicker} />
      </div>
      <h2 className="p-title" id={`fb-${id}-title`}>
        <Bi v={head.title} />
      </h2>
      <div className="p-sub">
        <Bi v={head.sub} />
      </div>
      <div className="rule" />
    </header>
  );
}

/**
 * Text version of the whole room, rendered on the server in both languages (CSS shows the active one).
 * Shown when JavaScript is off or WebGL is unavailable; always in the HTML for search engines.
 */
export function Fallback() {
  return (
    <main id="content" className="fallback" aria-label={profile.name}>
      <div className="fb-top">
        <div className="brand">
          <div className="hanko" aria-hidden="true">
            {profile.seal}
          </div>
          <div>
            <b>{profile.name}</b>
            <small>{profile.roles.join(" · ")}</small>
          </div>
        </div>
        <LanguageToggle />
      </div>
      <h1 className="fb-h1">
        {profile.name}
        <span lang="ja">{profile.nameKana}</span>
      </h1>
      <p className="fb-note">
        <Bi v={ui.fallbackNote} />
      </p>
      <nav aria-label="Sections" className="fb-nav">
        {sections.map((s) => (
          <a key={s.key} href={`#${s.key}`}>
            <Bi v={s.label} />
          </a>
        ))}
      </nav>

      <section id="about" aria-labelledby="fb-about-title" className="fb-sec body">
        <Head id="about" head={about} />
        <div className="portrait">
          <Image src={profile.portrait} alt={profile.name} width={224} height={224} sizes="112px" />
          <div className="meta">
            <b>{profile.name}</b>
            <Bi v={about.now} />
            <br />
            <Bi v={about.edu} />
          </div>
        </div>
        <p>
          <Bi v={about.intro} />
        </p>
        <h3>
          <Bi v={about.pathsHeading} />
        </h3>
        <div className="paths">
          {about.paths.map((p) => (
            <div className="path" key={p.abbr}>
              <div className="ab">{p.abbr}</div>
              <div className="nm">
                <Bi v={p.name} />
              </div>
              <p>
                <Bi v={p.text} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" aria-labelledby="fb-projects-title" className="fb-sec body">
        <Head id="projects" head={projects} />
        {projects.list.map((p) => (
          <article className="card" key={p.name}>
            <h3>{p.name}</h3>
            <div className="sub">
              <Bi v={p.sub} />
            </div>
            <p>
              <Bi v={p.text} />
            </p>
            <ul className="chips">
              {p.stats.map((x) => (
                <li className="chip stat" key={x.en}>
                  <Bi v={x} />
                </li>
              ))}
              {p.stack.map((x) => (
                <li className="chip" key={x}>
                  {x}
                </li>
              ))}
            </ul>
            <div className="links">
              {p.links.map((l, j) => (
                <a key={l.href} className={`btn${j ? " ghost" : ""}`} href={l.href} rel="noopener">
                  <Bi v={l.label} /> ↗
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section id="experience" aria-labelledby="fb-experience-title" className="fb-sec body">
        <Head id="experience" head={experience} />
        <div className="tl">
          {experience.list.map((e) => (
            <div className="it" key={e.when}>
              <div className="when">{e.when}</div>
              <h3 className="role">
                <Bi v={e.role} />
              </h3>
              <div className="co">{e.org}</div>
              <ul className="l-en" lang="en">
                {e.bullets.en.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <ul className="l-ja" lang="ja">
                {e.bullets.ja.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <h3>
          <Bi v={experience.honoursHeading} />
        </h3>
        <ul className="honours">
          {experience.honours.map((h) => (
            <li key={h.en}>
              <Bi v={h} />
            </li>
          ))}
        </ul>
      </section>

      <section id="skills" aria-labelledby="fb-skills-title" className="fb-sec body">
        <Head id="skills" head={skills} />
        {skills.groups.map((g) => (
          <div className="sk" key={g.heading.en}>
            <h3 className="h">
              <b>
                <Bi v={g.heading} />
              </b>
            </h3>
            <ul className="chips">
              {g.items.map((x) => (
                <li className="chip" key={x}>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section id="quests" aria-labelledby="fb-quests-title" className="fb-sec body">
        <Head id="quests" head={quests} />
        <div className="quests">
          {quests.list.map((q) => (
            <div className="quest" key={q.kanji}>
              <div className="qk" aria-hidden="true">
                {q.kanji}
              </div>
              <div>
                <h3 className="qt">
                  <Bi v={q.title} />
                </h3>
                <p>
                  <Bi v={q.text} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" aria-labelledby="fb-gallery-title" className="fb-sec body">
        <Head id="gallery" head={gallery} />
        <div className="gstats">
          {gallery.stats.map((x) => (
            <div key={x.n}>
              <b>{x.n}</b>
              <span>
                <Bi v={x.label} />
              </span>
            </div>
          ))}
        </div>
        <h3>
          <Bi v={gallery.featureHeading} />
        </h3>
        <p>
          <Bi v={gallery.featureText} />
        </p>
        {gallery.tabs.map((tab) => (
          <div key={tab.key}>
            <h3>
              <Bi v={tab.label} />
            </h3>
            <div className="ggrid">
              {tab.items.map((it) => (
                <figure key={it.src}>
                  <Image
                    src={assetUrl(it.src)}
                    alt={it.caption.en}
                    width={480}
                    height={360}
                    sizes="(max-width: 900px) 45vw, 300px"
                  />
                  <figcaption>
                    <Bi v={it.caption} />
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section id="contact" aria-labelledby="fb-contact-title" className="fb-sec body">
        <Head id="contact" head={contact} />
        <p>
          <Bi v={contact.text} />
        </p>
        <div className="contact">
          {contact.rows.map((r) => (
            <a className="row" key={r.label} href={r.href} rel="noopener">
              <span>
                <small>{r.label}</small>
                <b>{r.display}</b>
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section id="ren" aria-labelledby="fb-ren-title" className="fb-sec body">
        <Head id="ren" head={renPanel} />
        <p>
          <Bi v={renPanel.text} />
        </p>
      </section>
      <footer className="fb-foot">
        <span lang="ja">{sectionMeta("ren").kanji}</span> {profile.name}
      </footer>
    </main>
  );
}
