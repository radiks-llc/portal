import {
  NotionBlock,
  BlockComponentsMapperType,
  withContentValidation,
} from "@9gustin/react-notion-render";
import { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import NotionPage from "./NotionPage";

const NumberedListItem =
  (getIndex: () => number, votes: number[], showVotes: boolean) =>
  ({ config }: DropedProps) => {
    if (config.block.notionType === "numbered_list_item") {
      const options = config.block.items.map(({ content: { text } }) =>
        text.map(({ text }, i) => <div key={i}>{text.content}</div>)
      );
      return (
        <div>
          <hr className="mb-5"></hr>
          {options.map((text) => {
            const index = getIndex();
            return (
              <div key={index} className="my-4 sm:flex items-start">
                {showVotes && (
                  <input
                    className="m-2"
                    name="vote"
                    value={index}
                    id={`${index}`}
                    type="radio"
                  ></input>
                )}
                <div className="text-sm border-2 border-black px-1 sm:mr-4 w-32">
                  {votes[index] ?? 0} votes
                </div>
                <label htmlFor={`${index}`}>{text}</label>
              </div>
            );
          })}
        </div>
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
  let voteOption = 0;
  const getIndex = () => (voteOption += 1);
  return (
    <form method="post">
      <NotionPage
        blockComponentsMapper={{
          numbered_list_item: withContentValidation(
            NumberedListItem(getIndex, votes, showVotes)
          ),
          ...blockComponentsMapper,
        }}
        blocks={blocks}
      />
      {showVotes && (
        <button
          className="py-1 px-2 bg-gray-200 border-l-gray-500 border-b-gray-500 border-t-gray-100 border-r-gray-100 border-2 hover:bg-gray-300 active:bg-gray-400 active:border-l-gray-100 active:border-b-gray-100 active:border-t-gray-500 active:border-r-gray-500"
          type="submit"
        >
          Submit
        </button>
      )}
    </form>
  );
};
