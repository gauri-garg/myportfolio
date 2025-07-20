import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileCode, Server, Database, Code, Box } from "lucide-react";

const skillsData = [
  { name: "HTML", level: 95, icon: <FileCode className="h-8 w-8 text-primary" />, color: "hsl(var(--chart-1))" },
  { name: "CSS", level: 90, icon: <FileCode className="h-8 w-8 text-primary" />, color: "hsl(var(--chart-2))" },
  { name: "JavaScript", level: 85, icon: <Code className="h-8 w-8 text-primary" />, color: "hsl(var(--chart-5))" },
  { name: "Bootstrap", level: 88, icon: <Box className="h-8 w-8 text-primary" />, color: "hsl(var(--chart-3))" },
  { name: "PHP", level: 82, icon: <Server className="h-8 w-8 text-primary" />, color: "hsl(var(--chart-4))" },
  { name: "Laravel", level: 80, icon: <Server className="h-8 w-8 text-primary" />, color: "hsl(var(--chart-1))" },
  { name: "SQL & MySQL", level: 85, icon: <Database className="h-8 w-8 text-primary" />, color: "hsl(var(--chart-2))" },
];

export function Skills() {
  return (
    <section id="skills" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge className="bg-primary text-primary-foreground">Skills</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Technologies I Use</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I have experience with a wide range of technologies for building modern web applications.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {skillsData.map((skill, index) => (
            <Card key={skill.name} className="p-4 transition-all duration-300 hover:shadow-xl hover:scale-105 fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                {skill.icon}
                <h3 className="text-lg font-bold font-headline">{skill.name}</h3>
                <div className="w-full">
                  <Progress value={skill.level} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">{skill.level}% Proficient</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
