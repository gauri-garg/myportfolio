import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

const experienceData = [
  {
    role: "Creative Developer",
    company: "Freelance",
    duration: "2021 - Present",
    description: "Building beautiful and functional web experiences for a variety of clients. Specializing in React, Next.js, and crafting engaging user interfaces.",
  },
  {
    role: "Web Developer",
    company: "Innovate Co.",
    duration: "2019 - 2021",
    description: "Developed and maintained web applications, working across the full stack with technologies like Node.js and Vue.js. Contributed to API design and third-party service integrations.",
  },
  {
    role: "Web Development Intern",
    company: "Startup Hub",
    duration: "2018 - 2019",
    description: "Gained foundational experience in web development, contributing to projects from conception to deployment using HTML, CSS, JavaScript, and PHP.",
  },
];

export function About() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge className="bg-primary text-primary-foreground">Experience</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">My Professional Journey</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I thrive on building elegant solutions to complex problems. Here's a look at my journey so far.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-1">
          {experienceData.map((exp, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <CardHeader className="grid grid-cols-[auto_1fr_auto] items-start gap-4 space-y-0">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <CardTitle className="font-headline">{exp.role}</CardTitle>
                  <CardDescription>{exp.company}</CardDescription>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {exp.duration}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-left">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
