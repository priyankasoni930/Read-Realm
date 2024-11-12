import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface CreateBooklistDialogProps {
  onCreateBooklist: (name: string) => void;
}

const CreateBooklistDialog = ({ onCreateBooklist }: CreateBooklistDialogProps) => {
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (name.trim()) {
      onCreateBooklist(name.trim());
      setName("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Booklist</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Booklist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter booklist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBooklistDialog;