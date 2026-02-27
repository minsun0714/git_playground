import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch } from "lucide-react";
import Rankings from "@/components/Rankings";

export default function Home() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 md:flex-row md:items-start md:justify-center">
          <div className="order-2 w-full md:order-1 md:w-[34rem] md:shrink-0">
            <Rankings showResultCard={false} />
          </div>

          <div className="order-1 flex w-full items-center justify-center md:order-2 md:w-[28rem] md:shrink-0">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <GitBranch className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold">
                  Git 학습 퀴즈
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/play" className="block">
                  <Button className="w-full" size="lg">
                    응시하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
