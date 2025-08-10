import Image from "next/image";
import img from "../assets/benefits-of-competency-based-learning.jpg";
import AuthButton from "@/components/AuthButton";

export default function HomePage() {
  return (
    <div className="">
      <div className="min-h-screen">
        <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 sm:px-6 lg:px-8 py-16 text-center lg:flex-row lg:text-left">
          <div className="flex-1 space-y-5">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl">
              Test School Competency Assessment
            </h1>
            <p className="text-muted-foreground">
              Assess digital skills through a secure, structured 3-step process.
              Earn certifications from A1 to C2.
            </p>
            <AuthButton />
            <div className="text-sm text-muted-foreground">
              Roles: Admin, Student, Supervisor.
            </div>
          </div>
          <div className="flex-1">
            <Image
              src={img}
              alt="Digital assessment"
              width={600}
              height={400}
              className="rounded-lg border"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
