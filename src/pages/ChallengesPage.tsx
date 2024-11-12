import { useChallenges } from "@/hooks/useChallenges";
import { CreateChallengeDialog } from "@/components/challenges/CreateChallengeDialog";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { useNavigate } from "react-router-dom";
import { Book } from "@/lib/types";

const ChallengesPage = () => {
  const navigate = useNavigate();
  const { challenges, isLoading, createChallenge, addBookToChallenge } =
    useChallenges();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-rose-100 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Reading Challenges</h1>

        <div className="mb-8">
          <CreateChallengeDialog onChallengeCreate={createChallenge.mutate} />
        </div>

        <div className="grid grid-cols-1 gap-8">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onAddBook={(book: Book) =>
                addBookToChallenge.mutate({ challengeId: challenge.id, book })
              }
              onBookClick={(bookId) => navigate(`/book/${bookId}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
