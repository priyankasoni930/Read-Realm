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
import { useToast } from "@/components/ui/use-toast";

interface CreateChallengeDialogProps {
  onChallengeCreate: (challenge: {
    name: string;
    startDate: string;
    endDate: string;
    targetBooks: number;
  }) => void;
}

export function CreateChallengeDialog({
  onChallengeCreate,
}: CreateChallengeDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    startDate: "",
    endDate: "",
    targetBooks: 0,
  });

  const handleCreateChallenge = () => {
    if (
      !newChallenge.name.trim() ||
      !newChallenge.startDate ||
      !newChallenge.endDate ||
      newChallenge.targetBooks <= 0
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields correctly",
        variant: "destructive",
      });
      return;
    }

    onChallengeCreate(newChallenge);

    setNewChallenge({
      name: "",
      startDate: "",
      endDate: "",
      targetBooks: 0,
    });

    // Close the dialog after creating the challenge
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Challenge</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Reading Challenge</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Challenge Name"
            value={newChallenge.name}
            onChange={(e) =>
              setNewChallenge((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <Input
                type="date"
                value={newChallenge.startDate}
                onChange={(e) =>
                  setNewChallenge((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Date</label>
              <Input
                type="date"
                value={newChallenge.endDate}
                onChange={(e) =>
                  setNewChallenge((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Target Number of Books</label>
            <Input
              type="number"
              min="1"
              value={newChallenge.targetBooks}
              onChange={(e) =>
                setNewChallenge((prev) => ({
                  ...prev,
                  targetBooks: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
          <Button onClick={handleCreateChallenge}>Create Challenge</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
