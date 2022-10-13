import { NotionBlock } from "@9gustin/react-notion-render";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: import.meta.env.NOTION_TOKEN,
});

export type NotionPage = {
  title: string;
  subtitle: string;
  slug: string;
  slugLink: string;
  createdTime: string;
  formattedCreatedTime: string;
  blocks: NotionBlock[];
};

const monthNames = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

export const getBlocks = async (blockId) => {
  const blocks = [];
  let cursor;
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};

const toNotionPage = async (
  pageObject: PageObjectResponse
): Promise<NotionPage> => {
  const name = pageObject.properties.Name;
  if (name === null) throw new Error("No name in page");
  if (name.type !== "title") throw new Error("No title in page");
  const title = name.title[0]!;
  if (title.type !== "text") throw new Error("Expected title to be plain text");

  const subtitle = pageObject.properties.Subtitle;
  if (subtitle === null) throw new Error("No subtitle in page");
  if (subtitle.type !== "rich_text") throw new Error("No text in subtitle");
  const subtitleText = subtitle.rich_text[0]!;
  if (subtitleText.type !== "text")
    throw new Error("Expected subtitle to be plain text");

  const slug = pageObject.properties.Slug;
  if (slug === null) throw new Error("No slug in page");
  if (slug.type !== "rich_text") throw new Error("No text in slug");
  const slugText = slug.rich_text[0]!;
  if (slugText.type !== "text")
    throw new Error("Expected slug to be plain text");

  const createdTime = new Date(pageObject.created_time);
  const formattedCreatedTime = `${
    dayNames[createdTime.getDay()]
  }, ${createdTime.getDate()} ${monthNames[createdTime.getMonth()]}`;

  return {
    title: title.text.content,
    subtitle: subtitleText.text.content,
    slug: slugText.text.content,
    slugLink: `blog/${slugText.text.content}`,
    createdTime: pageObject.created_time,
    formattedCreatedTime,
    blocks: await getBlocks(pageObject.id),
  };
};

const fetchPages = async () => {
  const pages = await notion.databases.query({
    database_id: import.meta.env.NOTION_DB,
  });

  if (!pages.results) {
    return [];
  }

  if (!pages.results.find((page) => (page as PageObjectResponse).properties)) {
    throw new Error("Expected properties for page object response");
  }

  return pages.results as PageObjectResponse[];
};

export const getPages = async () => {
  return Promise.all((await fetchPages()).map(toNotionPage));
};

export default notion;
