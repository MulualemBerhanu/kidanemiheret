import { BoardMembersShowcase } from "@/components/sections/BoardMembersShowcase";

interface BoardMembersSectionProps {
  locale: string;
}

export function BoardMembersSection({ locale }: BoardMembersSectionProps) {
  return (
    <section className="relative bg-charcoal py-20 md:py-28" id="parish-council">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(212,175,55,0.06)_0%,transparent_38%,rgba(212,175,55,0.04)_100%)]"
        aria-hidden
      />
      <BoardMembersShowcase locale={locale} />
    </section>
  );
}
