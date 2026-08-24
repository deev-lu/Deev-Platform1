# Founder portraits

Drop the two files here and the About section ("10 / Who you'll work with")
appears on the homepage, along with its "About" link in the navbar. Nothing
else has to change: they are discovered by filename.

    fabio.webp  Fabio Falchero, Founder & CEO
    sven.webp   Sven Kettel,    Founder & CEO

`.jpg`, `.jpeg`, `.png` and `.webp` all work. Both files have to be present:
`TEAM_READY` in `src/lib/team.ts` keeps the section out of the page until they
are, because one portrait beside an empty frame reads worse than no section.

The photographs are cutouts on a transparent ground, so they are rendered
`object-contain` and bottom-aligned on a surface panel rather than cropped into
a square. Keep them that way:

  - transparent background, not white, or they will paint a white box on the
    dark theme
  - an upper-body crop, square, cropped from the same region of both canvases
    so the two of them stay a matched pair and the crop edge reads as one line
    across both cards
  - resized to display size before committing. The card is 353px wide at the
    1440px container, so 800px covers it at 2x and the container is capped, so
    it never grows past that. See the performance rules in CLAUDE.md.

Only one file per founder may sit in this folder: the two are found by
basename, so leaving both `fabio.png` and `fabio.webp` here makes which one
wins depend on glob order.

The 1024x1536 PNG originals are in the history if they are ever needed again
at a larger size or for print:

    git show 11ee3234:src/assets/team/fabio.png > fabio.png
    git show 11ee3234:src/assets/team/sven.png  > sven.png
