import { site } from "./site";
import { home } from "./home";
import { pages } from "./pages";
import { consent } from "./consent";
import { builder } from "./builder";
import { legal } from "./legal";
import { news } from "./news";

export const en = { site, home, pages, consent, builder, legal, news };
export type Dict = typeof en;
