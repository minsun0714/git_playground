import QuizApp from "@/components/QuizApp";

interface PlayPageProps {
  searchParams?: Promise<{
    name?: string | string[];
  }>;
}

export default async function PlayPage({ searchParams }: PlayPageProps) {
  const resolvedSearchParams = await searchParams;
  const nameParam = resolvedSearchParams?.name;
  const initialName = Array.isArray(nameParam) ? nameParam[0] : nameParam;

  return (
    <div className="bg-white">
      <main className="container mx-auto px-4 py-8">
        <QuizApp initialName={initialName} />
      </main>
    </div>
  );
}
