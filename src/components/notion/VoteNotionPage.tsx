import {
  NotionBlock,
  BlockComponentsMapperType,
  withContentValidation,
} from "@9gustin/react-notion-render";
import { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import NotionPage from "./NotionPage";

const NumberedListItem =
  (votes: number[], showVotes: boolean) =>
  ({ config }: DropedProps) => {
    if (config.block.notionType === "numbered_list_item") {
      const options = config.block.items
        .map(({ content: { text } }) => text.map(({ text }) => text))
        .flat();
      return (
        <form method="post">
          <hr className="mb-5"></hr>
          {options.map((text, index) => {
            const lines = text.content
              .split("\n")
              .map((text) => <div>{text}</div>);
            return (
              <div className="my-4 sm:flex items-start">
                {showVotes ? (
                  <input
                    className="m-2"
                    name="vote"
                    value={index}
                    id={`${index}`}
                    type="radio"
                  ></input>
                ) : (
                  <div className="text-sm border-2 border-black px-1 sm:mr-4 w-28">
                    {votes[index] ?? 0} votes
                  </div>
                )}
                <label htmlFor={`${index}`}>{lines}</label>
              </div>
            );
          })}
          {!showVotes && <button type="submit">Submit</button>}
        </form>
      );
    }
    throw new Error("What the fuck");
  };

export const VoteNotionPage = ({
  blocks,
  blockComponentsMapper,
  votes,
  showVotes,
}: {
  blocks: NotionBlock[];
  blockComponentsMapper?: BlockComponentsMapperType;
  votes: number[];
  showVotes: boolean;
}) => {
  return (
    <NotionPage
      blockComponentsMapper={{
        numbered_list_item: withContentValidation(
          NumberedListItem(votes, showVotes)
        ),
        ...blockComponentsMapper,
      }}
      blocks={blocks}
    />
  );
};
