"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/server/db";
import { requireSession } from "@/server/actions/auth";

const pageSchema = z.object({ slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/), title: z.string().min(1).max(80), enabled: z.boolean() });
const studioSchema = z.object({ templateKey: z.string().min(1).max(60), pages: z.array(pageSchema).min(1).max(20) });

const templateDefaultContent: Record<string, Record<string, Record<string, string>>> = {
  editorial: {
    home: { heading: "I help leaders turn complexity into momentum.", subheading: "Strategy, narrative, and execution for ambitious businesses.", cta: "Book a consultation" },
    about: { heading: "A strategic operator with a sharp eye for clarity.", subheading: "I build trust through deep thinking, clear messaging, and measurable outcomes.", cta: "Learn more" },
    experience: { heading: "Experience that creates leverage.", subheading: "Cross-functional leadership, growth strategy, and execution across ambitious brands.", cta: "View work" },
    projects: { heading: "Selected work.", subheading: "A snapshot of the projects and outcomes I’ve shaped.", cta: "See case studies" },
    education: { heading: "Academic foundation.", subheading: "Well-rounded experience supported by rigorous learning and practical application.", cta: "View credentials" },
    contact: { heading: "Let’s build what’s next.", subheading: "Available for advisory, leadership, and portfolio collaborations.", cta: "Get in touch" },
  },
  developer: {
    home: { heading: "I design products that feel fast, clear, and useful.", subheading: "Full-stack product thinking with technical depth and product strategy.", cta: "Explore projects" },
    about: { heading: "Engineer with a product lens.", subheading: "I translate business needs into maintainable systems and thoughtful experiences.", cta: "Read more" },
    skills: { heading: "Core stack.", subheading: "Product engineering, systems design, frontend craft, and analytics.", cta: "View skillset" },
    projects: { heading: "Product case studies.", subheading: "A practical view of the products, systems, and experiments I’ve shipped.", cta: "Open projects" },
    experience: { heading: "Work and leadership.", subheading: "Built and scaled digital products across teams, user journeys, and growth loops.", cta: "View timeline" },
    resume: { heading: "Resume and background.", subheading: "A concise view of my technical career, outcomes, and responsibilities.", cta: "Download CV" },
    contact: { heading: "Let’s build something meaningful.", subheading: "Open to product engineering, platform, and digital transformation work.", cta: "Contact me" },
  },
  analyst: {
    home: { heading: "I turn complexity into clear decisions.", subheading: "Insights, dashboards, and measurement systems that improve business performance.", cta: "See insights" },
    about: { heading: "Data-driven problem solver.", subheading: "I blend analysis, storytelling, and experimentation to create better decisions.", cta: "Learn about my approach" },
    skills: { heading: "Analytical toolkit.", subheading: "SQL, Python, experimentation, dashboards, and communication.", cta: "Explore skills" },
    projects: { heading: "Impact in numbers.", subheading: "Projects centered on clarity, optimization, and business transformation.", cta: "View projects" },
    education: { heading: "Training and foundation.", subheading: "A grounded analytical background with a focus on evidence and applied learning.", cta: "View education" },
    certifications: { heading: "Certifications and proof.", subheading: "Analytical capability supported by layered learning and applied real-world work.", cta: "View credentials" },
    contact: { heading: "Let’s talk data.", subheading: "Available for analytics, research, and strategic decision support.", cta: "Contact me" },
  },
  designer: {
    home: { heading: "I create design systems with clarity and emotion.", subheading: "Design direction, visual storytelling, and thoughtful product experiences.", cta: "View work" },
    about: { heading: "Designer with a strong visual point of view.", subheading: "I combine strategic thinking, craft, and systems to create memorable experiences.", cta: "Read my story" },
    projects: { heading: "Selected case studies.", subheading: "A portfolio of focused design decisions and visual systems.", cta: "Open portfolio" },
    experience: { heading: "Design leadership and craft.", subheading: "Guiding product stories through structure, quality, and visual communication.", cta: "View timeline" },
    resume: { heading: "Experience and credentials.", subheading: "A concise view of my design journey and capabilities.", cta: "See résumé" },
    contact: { heading: "Let’s design something memorable.", subheading: "Open to brand, product, and visual storytelling collaborations.", cta: "Get in touch" },
  },
  minimal: {
    home: { heading: "Thoughtful work, clearly presented.", subheading: "A calm, professional portfolio for learning, research, and early-stage growth.", cta: "View profile" },
    about: { heading: "Focused and curious.", subheading: "I build a clear academic and professional story grounded in evidence and craft.", cta: "About me" },
    education: { heading: "Education and training.", subheading: "Academic background and learning milestones aligned to my field.", cta: "View education" },
    projects: { heading: "Key work.", subheading: "Selected project work with a strong emphasis on clarity and execution.", cta: "See projects" },
    certifications: { heading: "Credentials.", subheading: "A record of professional development, learning, and applied skill-building.", cta: "View all" },
    resume: { heading: "Professional profile.", subheading: "A compact summary of academic and work experience.", cta: "Open profile" },
    contact: { heading: "Let’s connect.", subheading: "Open to opportunities, collaborations, and early-stage conversations.", cta: "Contact me" },
  },
  bold: {
    home: { heading: "I create momentum for brands, founders, and independent work.", subheading: "A high-impact portfolio focused on trust, conversion, and clear value.", cta: "Book a call" },
    about: { heading: "Independent operator with a bias for action.", subheading: "I help people and businesses stand out through sharp positioning and quality execution.", cta: "Read my story" },
    services: { heading: "What I do.", subheading: "Offerings designed for businesses, founders, and people who need premium execution.", cta: "View services" },
    projects: { heading: "Recent outcomes.", subheading: "A look at meaningful work, transformations, and client-facing results.", cta: "See examples" },
    resume: { heading: "Professional background.", subheading: "A concise picture of my capabilities, experience, and approach.", cta: "Open résumé" },
    contact: { heading: "Let’s make it happen.", subheading: "Available for freelance work, strategic consulting, and premium visibility.", cta: "Start a conversation" },
  },
};

export async function saveTemplateStudio(input: z.input<typeof studioSchema>) {
  const user = await requireSession();
  if (!user) return { ok: false, message: "Sign in to update your portfolio." };
  const studio = studioSchema.parse(input);
  const enabledPages = studio.pages.filter((page) => page.enabled);
  if (!enabledPages.some((page) => page.slug === "home")) return { ok: false, message: "Home is required for every portfolio." };

  const defaultContent = templateDefaultContent[studio.templateKey] ?? templateDefaultContent.editorial;
  const home = await db.sitePage.findUnique({ where: { tenantId_slug: { tenantId: user.tenantId, slug: "home" } } });
  const currentContent = (home?.content as Record<string, unknown> | null) ?? {};

  await db.sitePage.upsert({
    where: { tenantId_slug: { tenantId: user.tenantId, slug: "home" } },
    update: { title: "Home", content: { ...currentContent, templateKey: studio.templateKey, pageStructure: studio.pages, ...defaultContent.home, template: studio.templateKey } },
    create: { tenantId: user.tenantId, title: "Home", slug: "home", status: "DRAFT", content: { templateKey: studio.templateKey, pageStructure: studio.pages, ...defaultContent.home, template: studio.templateKey } },
  });

  await Promise.all(enabledPages.filter((page) => page.slug !== "home").map((page) => {
    const defaultPageContent = defaultContent[page.slug] ?? {
      heading: `${page.title} section`,
      subheading: `A dedicated ${page.title.toLowerCase()} section for your portfolio.`,
      cta: "Learn more",
    };

    return db.sitePage.upsert({
      where: { tenantId_slug: { tenantId: user.tenantId, slug: page.slug } },
      update: {
        title: page.title,
        content: {
          ...defaultPageContent,
          title: page.title,
          slug: page.slug,
          template: studio.templateKey,
          sectionType: page.slug,
        },
      },
      create: {
        tenantId: user.tenantId,
        title: page.title,
        slug: page.slug,
        status: "DRAFT",
        content: {
          ...defaultPageContent,
          title: page.title,
          slug: page.slug,
          template: studio.templateKey,
          sectionType: page.slug,
        },
      },
    });
  }));

  await db.sitePage.deleteMany({
    where: { tenantId: user.tenantId, slug: { notIn: enabledPages.map((page) => page.slug) } },
  });
  revalidatePath("/dashboard"); revalidatePath("/dashboard/my-portfolio"); revalidatePath(`/p/${user.tenant.slug}`);
  return { ok: true, message: "Template and page structure saved." };
}
