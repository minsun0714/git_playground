import Rankings from "@/components/Rankings";
import HomeNameEntry from "@/components/HomeNameEntry";

export default function Home() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
          <div className="order-2 w-full lg:order-1 lg:w-[32rem] lg:shrink-0">
            <Rankings showResultCard={false} />
          </div>

          <div className="order-1 flex w-full items-center justify-center lg:order-2 lg:w-[32rem] lg:shrink-0">
            <HomeNameEntry />
          </div>
        </div>
      </main>
    </div>
  );
}
