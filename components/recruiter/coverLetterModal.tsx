import { FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Props {
  name: string;
  letter: string;
}

export function CoverLetterModal({ name, letter }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="bg-button-secondary-500/30 border-primary-500/30 text-white"
        >
          <FileText className="h-4 w-4 mr-1" /> Cover Letter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/30 text-white p-4 max-w-md w-auto">
        <h2 className="text-lg font-semibold mb-2">Cover Letter from {name}</h2>
        <p className="whitespace-pre-wrap">{letter}</p>
      </PopoverContent>
    </Popover>
  );
}
