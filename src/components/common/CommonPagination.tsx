import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CommonPaginationProps {
  totalPage: number;
  currentPage: number;
  handleMovePage: (page: number) => void;
}

const GROUP_SIZE = 5;

export default function CommonPagination({ totalPage = 1, currentPage = 1, handleMovePage }: CommonPaginationProps) {
  const currentGroup = Math.ceil(currentPage / GROUP_SIZE);
  const groupStartPage = (currentGroup - 1) * GROUP_SIZE + 1;
  const groupEndPage = Math.min(groupStartPage + GROUP_SIZE - 1, totalPage);

  const handleMovePrev = () => {
    if (currentPage === 1) return;
    handleMovePage(currentPage - 1);
  };

  const handleMoveNext = () => {
    if (currentPage === totalPage) return;
    handleMovePage(currentPage + 1);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handleMovePrev} />
        </PaginationItem>
        <PaginationItem className="flex gap-3">
          {Array.from({ length: groupEndPage - groupStartPage + 1 }, (_, idx) => {
            const page = groupStartPage + idx;
            return (
              <PaginationLink
                key={page}
                className={`px-3 py-1 border rounded ${currentPage === page ? "bg-blue-500 text-white" : ""}`}
                onClick={() => handleMovePage(page)}
              >
                {page}
              </PaginationLink>
            );
          })}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={handleMoveNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
