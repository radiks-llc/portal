import "./rnr.css";

import {
  Render,
  NotionBlock,
  withContentValidation,
  BlockComponentsMapperType,
} from "@9gustin/react-notion-render";
import { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";

const Image = ({ media: { src, alt } }: DropedProps) => {
  return (
    <div className="my-10">
      <div className="flex flex-col items-center mx-auto">
        <img className="w-96" src={src} alt={alt}></img>
        <div className="w-96 my-4 text-xs">{alt}</div>
      </div>
    </div>
  );
};

const ToDo = ({
  config: {
    block: { items },
  },
}: DropedProps) => {
  return (
    <ul className="rnr-to_do">
      {items.map(({ content: { text, checked } }) => (
        <li>
          <label>
            {checked ? (
              `✔ ${text.map(({ text: { content } }) => content)}`
            ) : (
              <div className="ml-6">
                {text.map(({ text: { content } }) => content)}
              </div>
            )}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default ({
  blocks,
  blockComponentsMapper,
}: {
  blocks: NotionBlock[];
  blockComponentsMapper?: BlockComponentsMapperType;
}) => {
  return (
    <div className="my-4">
      <Render
        blockComponentsMapper={{
          to_do: withContentValidation(ToDo),
          image: withContentValidation(Image),
          ...blockComponentsMapper,
        }}
        blocks={blocks}
        classNames
      />
    </div>
  );
};
