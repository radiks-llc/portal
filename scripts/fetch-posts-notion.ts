import dotenv from "dotenv";
import fetch from "node-fetch";
import { NotionBlock } from "@9gustin/react-notion-render";
import { writeFile, mkdir } from "fs/promises";
import { Client } from "@notionhq/client";
import {
  ListBlockChildrenResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

dotenv.config();

const hashString = (str: string) => {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
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

export const getBlocks = async (blockId: string) => {
  const blocks = [];
  let cursor;
  while (true) {
    const { results, next_cursor } = (await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
      // I'm sorry
    })) as ListBlockChildrenResponse;
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks as NotionBlock[];
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

const db = process.env.NOTION_DB;
if (!db) throw new Error("Missing token");

const fetchPages = async () => {
  const pages = await notion.databases.query({
    database_id: db,
  });

  if (!pages.results) {
    return [];
  }

  if (!pages.results.find((page) => (page as PageObjectResponse).properties)) {
    throw new Error("Expected properties for page object response");
  }

  return pages.results as PageObjectResponse[];
};

const handleAttachment = async (url: string) => {
  const splits = url.split(".");
  const ext = splits[splits.length - 1];

  const newUrl = `/wp-content/${hashString(url)}.${ext}`;
  await fetch(url)
    .then((x) => x.arrayBuffer())
    .then((x) => writeFile(`../public${newUrl}`, Buffer.from(x)));

  return { url, newUrl };
};

export const getPages = async () => {
  const pages = await Promise.all((await fetchPages()).map(toNotionPage));
  const isAttachment = /http(s?):\/\/.*\.(gif|png|mp4)/g;
  const urls: string[] = [];

  const entries = (obj: object) => {
    Object.entries(obj).forEach(([_, v]) => {
      if (typeof v === "string" && v.match(isAttachment) !== null) {
        urls.push(v);
      }
      if (v !== null && typeof v === "object") {
        entries(v);
      }
    });
  };

  entries(pages);

  mkdir("./data", { recursive: true });
  mkdir("../public/wp-content/", { recursive: true });
  // Lord,
  // I apologize for the sins I have committed and I am willing to change.
  let json = JSON.stringify(pages);
  (await Promise.all(urls.map(handleAttachment))).forEach(({ url, newUrl }) => {
    json = json.replace(url, newUrl);
  });
  writeFile("./data/pages.json", json);
};

getPages();
