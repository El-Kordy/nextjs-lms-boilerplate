import Link from "next/link";
import {
  BookOpen,
  CircleHelp,
  Lock,
  PlayCircle,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const courses = [
  {
    id: "ai-augmented-engineering",
    title: "AI-Augmented Software Engineering",
    description:
      "Practical software engineering workflows that use AI as part of the development process.",
    videoCount: 12,
  },
  {
    id: "deep-nodejs",
    title: "Deep Node.js",
    description:
      "Explore Node.js internals, the event loop, streams, and production-oriented concepts.",
    videoCount: 8,
  },
  {
    id: "software-architecture",
    title: "Software Architecture Fundamentals",
    description:
      "Learn architecture concepts, design patterns, trade-offs, and how systems fit together.",
    videoCount: 6,
    inProgress: true,
  },
];

const benefits = [
  {
    icon: BookOpen,
    title: "Structured Courses",
    description:
      "Learn through organized courses built from chapters and focused lessons.",
  },
  {
    icon: PlayCircle,
    title: "Video Lessons",
    description:
      "Watch focused lessons and continue learning at your own pace.",
  },
  {
    icon: Route,
    title: "Learning Progress",
    description:
      "Keep track of your progress as you move through your courses and lessons.",
  },
  {
    icon: CircleHelp,
    title: "Course Q&A",
    description:
      "Ask questions about lessons and keep discussions connected to the learning material.",
  },
];

const faqs = [
  {
    question: "What is WNM?",
    answer:
      "WNM is an online learning platform focused on structured technical courses and practical software engineering education.",
  },
  {
    question: "How are courses organized?",
    answer:
      "Courses are organized into chapters and lessons. Lessons can include written content, video, and learning resources.",
  },
  {
    question: "Can I track my learning progress?",
    answer:
      "Yes. The platform is designed to track lesson and course progress so you can continue where you left off.",
  },
  {
    question: "Can I ask questions about a lesson?",
    answer:
      "Yes. Courses include a Q&A flow where questions can stay connected to the relevant lesson.",
  },
  {
    question: "Are all courses free?",
    answer:
      "Course access can vary. Paid course functionality is planned for a later stage of the platform.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            WNM
          </Link>

          <Button size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">
              WNM Learning Platform
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Learn practical software engineering, one lesson at a time.
            </h1>

            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              Structured courses, focused lessons, video content, progress
              tracking, and course-based Q&A — all in one place.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button size="lg" className="text-base" asChild>
                <Link href="/login">Start learning</Link>
              </Button>

              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="/courses">Browse courses</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/40">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Built for focused learning
            </h2>

            <p className="mt-2 text-muted-foreground">
              Everything you need to learn from structured technical content.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <Card
                  key={benefit.title}
                  className="border-0 bg-background shadow-none"
                >
                  <CardHeader>
                    <benefit.icon className="size-5 text-muted-foreground" />
                    <CardTitle className="text-base">
                      {benefit.title}
                    </CardTitle>
                    <CardDescription>
                      {benefit.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Course library
            </h2>

            <p className="mt-2 text-muted-foreground">
              Explore the available courses and continue your learning journey.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group"
                >
                  <Card className="h-full transition-colors group-hover:border-foreground/20">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <CardTitle className="text-base">
                          {course.title}
                        </CardTitle>

                        <Lock className="size-4 shrink-0 text-muted-foreground" />
                      </div>

                      <CardDescription>
                        {course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PlayCircle className="size-4" />
                        <span>
                          {course.videoCount} lessons
                          {course.inProgress && " · In progress"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Lock className="mb-0.5 inline size-3" /> Sign in to access
              protected course content.
            </p>
          </div>
        </section>

        <section className="border-t bg-muted/40">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Learning that grows with the platform
              </h2>

              <p className="mt-4 text-muted-foreground leading-relaxed">
                WNM is being built as a focused learning platform first. The
                foundation supports structured courses, lesson content,
                progress, instructors, and course discussions while leaving
                room for future features as the platform grows.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-md text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Start learning
              </h2>

              <p className="mt-2 text-muted-foreground">
                Create an account and explore the learning platform.
              </p>

              <Card className="mt-8">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">
                    Your learning space
                  </CardTitle>

                  <CardDescription>
                    Access courses, lessons, progress, and course Q&A from one
                    place.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Button className="w-full text-base" size="lg" asChild>
                    <Link href="/login">Sign in to WNM</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/40">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Frequently asked questions
            </h2>

            <div className="mt-8 max-w-2xl">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>

                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 WNM
          </p>

          <p className="text-sm text-muted-foreground">
            Learning platform
          </p>
        </div>
      </footer>
    </div>
  );
}
