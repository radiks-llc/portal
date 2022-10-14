import { NotionBlock } from "@9gustin/react-notion-render";
import pagesSrc from "../../scripts/data/pages.json";

export type NotionPage = {
  title: string;
  subtitle: string;
  slug: string;
  slugLink: string;
  createdTime: string;
  formattedCreatedTime: string;
  blocks: NotionBlock[];
};

const pages = pagesSrc as NotionPage[];
export { pages };
