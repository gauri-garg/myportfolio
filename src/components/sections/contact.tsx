import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { name: "GitHub", icon: Github, url: "https://github.com" },
  { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/gauri-garg-582011290" },
];

export function Contact() {
  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-4">
          <Badge className="bg-primary text-primary-foreground">Contact</Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Get in Touch
          </h2>
          <p className="text-muted-foreground">
            Have a project in mind, a question, or just want to say hi? My inbox is always open.
          </p>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Find me on social media</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button asChild key={social.name} variant="outline" size="icon" className="transition-all hover:scale-110 hover:shadow-md">
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full max-w-md">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
