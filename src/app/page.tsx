import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center md:flex-row md:text-left">
        <div className="flex-1 space-y-5">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Test_School Competency Assessment
          </h1>
          <p className="text-muted-foreground">
            Assess digital skills through a secure, structured 3-step process.
            Earn certifications from A1 to C2.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Roles: Admin, Student, Supervisor.
          </div>
        </div>
        <div className="flex-1">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Digital assessment"
            width={600}
            height={400}
            className="rounded-lg border"
          />
        </div>
      </section>
    </main>
  );
}
