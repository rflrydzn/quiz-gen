import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FlashcardBW,
  ExamModeIcon,
  PracticeModeIcon,
} from "@/components/Illustrations";
import { Card, CardTitle } from "./ui/card";

const CreateQuiz = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create Quiz</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select a quiz style</DialogTitle>
          <DialogDescription>
            Choose your preferred quiz format. You can change this later.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="flex flex-col items-center justify-center p-4 border hover:shadow-lg cursor-pointer ">
            <FlashcardBW className="w-12 h-12 mb-2" />
            <CardTitle className="text-center text-sm font-medium">
              Flashcard
            </CardTitle>
          </Card>

          <Card className="flex flex-col items-center justify-center p-4 border hover:shadow-lg cursor-pointer transition">
            <PracticeModeIcon className="w-12 h-12 mb-2" />
            <CardTitle className="text-center text-sm font-medium">
              Practice
            </CardTitle>
          </Card>

          <Card className="flex flex-col items-center justify-center p-4 border hover:shadow-lg cursor-pointer transition">
            <ExamModeIcon className="w-12 h-12 mb-2" />
            <CardTitle className="text-center text-sm font-medium">
              Exam
            </CardTitle>
          </Card>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuiz;
