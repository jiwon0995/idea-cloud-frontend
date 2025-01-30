import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MeetingNoteItem } from "@/types/meeting_notes.type";

type MeetingNoteListCardProps = {
  meetingNote: MeetingNoteItem;
};

export default function MeetingNoteListCard({ meetingNote }: MeetingNoteListCardProps) {
  return (
    <Card className={cn("w-[300px]")}>
      <CardHeader>
        <CardTitle>{meetingNote.title}</CardTitle>
        <CardDescription>
          <div className="flex flex-col gap-1 mt-2">
            <div>작성자: {meetingNote.userName}</div>
            <div>마지막 수정: {meetingNote.created.split(" ")[0]}</div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {meetingNote.keywords.map((keyword) => (
            <span key={keyword} className="bg-blue-200 text-sm rounded-full px-2 py-1">
              {keyword}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
