import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);

  return (
    <LinkList title="History">
      {historyItems.map((item) => {
        const label = `History / ${months[item.month]}, ${item.year}`;

        return (
          <SummaryItem
            key={`${item.year}-${item.month}`}
            name={label}
            count={item.count} 
            isSelected={
              selectedYear === String(item.year) &&
              selectedMonth === String(item.month)
            }
            href={`/history/${item.year}/${item.month}`}
            title={label}
          />
        );
      })}
    </LinkList>
  );
}

export default HistoryList;