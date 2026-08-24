# Founder portraits

Drop the two files here and the About section ("10 / Who you'll work with")
appears on the homepage, along with its "About" link in the navbar. Nothing
else has to change: they are discovered by filename.

    fabio.png   Fabio Falchero, Founder & CEO
    sven.png    Sven Kettel,    Founder & CEO

`.jpg`, `.jpeg`, `.png` and `.webp` all work. Both files have to be present:
`TEAM_READY` in `src/lib/team.ts` keeps the section out of the page until they
are, because one portrait beside an empty frame reads worse than no section.

The photographs are cutouts on a transparent ground, so they are rendered
`object-contain` and bottom-aligned on a surface panel rather than cropped into
a square. Keep them that way:

  - transparent background, not white, or they will paint a white box on the
    dark theme
  - the full standing figure, roughly 2:3, feet at the bottom edge of the
    canvas, so both founders share one baseline
  - resized to display size before committing (about 1024px wide is plenty).
    See the performance rules in CLAUDE.md.
