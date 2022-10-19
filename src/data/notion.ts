import { NotionBlock } from "@9gustin/react-notion-render";
import pagesSrc from "../../scripts/data/pages.json";
import type { NotionPage } from "../../scripts/fetch-posts-notion";

const pages = pagesSrc as unknown as NotionPage[];
export { pages };
