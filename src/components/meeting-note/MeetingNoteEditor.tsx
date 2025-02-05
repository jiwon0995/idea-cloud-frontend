import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@/components/meeting-note/MarkdownEditor";
import useMeetingNoteWrite from "@/hook/meeting_note/useMeetingNoteWrite";
import { slateToMarkdown } from "@/components/meeting-note/markdown_editor_util";

const formSchema = z.object({
  title: z.string(),
});

type Keywords = { keyword: string; count: number }[];

type MeetingNoteEditorProps = {
  defaultTitle?: string;
  defaultBody?: string;
  defaultKeywords?: string[];
};

export default function MeetingNoteEditor({
  defaultTitle = "",
  defaultBody = "",
  defaultKeywords = [],
}: MeetingNoteEditorProps) {
  const [keywords, setKeywords] = useState<Keywords>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [body, setBody] = useState<string>(defaultBody);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultTitle,
    },
    mode: "onChange",
  });

  useEffect(() => {
    setBody(defaultBody);
    setKeywords(defaultKeywords.map((k) => ({ keyword: k, count: 1 })));
  }, [defaultBody, defaultKeywords]);

  const { mutate: meetingNoteWriteMutate } = useMeetingNoteWrite();

  const meetingNoteWrite = async (title: string, body: string, keywords: Keywords) => {
    meetingNoteWriteMutate(
      { title, body, keywords },
      {
        onSuccess: async (data) => {
          console.log("success");
        },
      }
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.title === "") {
      console.log("title");
      return;
    }
    const result = slateToMarkdown(body);

    const plainTextBody = result
      .replace(/[#>*_`~\-]/g, "") // Markdown 구문 제거 (#, *, etc.)
      .replace(/\n+/g, " ") // 줄바꿈 제거
      .trim();

    // 정규식을 위한 이스케이프 처리 함수
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // 각 키워드의 등장 횟수를 plainTextBody에서 계산
    const updatedKeywords = keywords.map((keyword) => {
      const regex = new RegExp(escapeRegExp(keyword.keyword), "gi"); // 단순 포함 매칭
      const matches = plainTextBody.match(regex);
      const keywordCountInBody = matches ? matches.length : 0;

      return { ...keyword, count: keywordCountInBody };
    });

    await meetingNoteWrite(values.title, result, updatedKeywords);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 Enter 동작 방지
      if (e.nativeEvent.isComposing) {
        return;
      }

      const trimmedValue = inputValue.trim(); // 최신 상태 값 사용
      if (trimmedValue !== "") {
        const newKeyword = { keyword: trimmedValue, count: 1 };
        setKeywords((prev) => [...prev, newKeyword]); // 상태 업데이트
        setInputValue(""); // 입력창 초기화
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="p-20 flex flex-col h-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      {...field}
                      className="flex-none outline-none border-b-2 w-full pb-2 text-2xl placeholder:text-gray-400"
                      placeholder="제목을 입력하세요"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex-1 overflow-y-aut">
              <MarkdownEditor body={body} setBody={setBody} />
            </div>
            <div className="flex-1 p-4 fixed bottom-0 left-0 w-full border-t border-gray-200">
              <div className="min-h-[50px]">
                {keywords.map((item, index) => (
                  <span key={index} className="mr-2 mb-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-full shadow">
                    {item.keyword}
                  </span>
                ))}
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="outline-none"
                  placeholder="키워드"
                />
              </div>
              <Button type="submit" className="w-full">
                저장
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
