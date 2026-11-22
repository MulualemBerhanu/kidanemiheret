"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SacredBorder } from "@/components/ui/SacredBorder";
import { brandImages } from "@/data/images";
import {
  boardMembers,
  boardTiers,
  membersByTier,
  type BoardMember,
  type BoardTier,
} from "@/data/board-members";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface BoardMembersShowcaseProps {
  locale: string;
}

function LeadershipCard({
  member,
  index,
  isAm,
  reduced,
}: {
  member: BoardMember;
  index: number;
  isAm: boolean;
  reduced: boolean;
}) {
  const t = useTranslations("governance.board");
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[2px] border border-gold/40 bg-gradient-to-br from-[#2a231c] via-[#1c1712] to-[#14110e] p-7 shadow-[0_28px_64px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 md:p-9"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.16),transparent_70%)] transition-transform duration-500 group-hover:scale-110"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-4">
        <span className="font-display text-3xl text-gold/45 md:text-4xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Image
          src={brandImages.cross}
          alt=""
          width={22}
          height={31}
          className="h-8 w-auto opacity-55 transition-opacity group-hover:opacity-80"
        />
      </div>
      <div className="relative mt-6">
        <p className="font-amharic text-xl leading-snug text-ivory md:text-2xl" lang="am">
          {member.nameAm}
        </p>
        {!isAm && (
          <p className="mt-2 font-display text-base text-ivory/75">{member.nameEn}</p>
        )}
        <div className="mt-5 h-px w-16 bg-gradient-to-r from-gold to-transparent" />
        <p className="mt-4 font-amharic text-sm text-[#e9d5a7] md:text-base" lang="am">
          {member.roleAm}
        </p>
        {!isAm && (
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-ivory/55">
            {t(`roles.${member.id}`)}
          </p>
        )}
      </div>
    </motion.article>
  );
}

function MemberCard({
  member,
  index,
  isAm,
  reduced,
  accent,
}: {
  member: BoardMember;
  index: number;
  isAm: boolean;
  reduced: boolean;
  accent?: boolean;
}) {
  const t = useTranslations("governance.board");
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[2px] border p-5 transition-all duration-300 hover:-translate-y-1 md:p-6",
        accent
          ? "border-gold/30 bg-[#2a231c]/80 hover:border-gold/50"
          : "border-gold/25 bg-[#241e18]/90 hover:border-gold/45 hover:bg-[#2c241c]"
      )}
    >
      <div
        className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-transparent via-gold/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
      <div className="flex items-start gap-4">
        <span className="mt-0.5 font-display text-lg text-gold/50">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-amharic text-base leading-relaxed text-ivory md:text-lg" lang="am">
            {member.nameAm}
          </p>
          {!isAm && <p className="mt-1 text-sm text-ivory/70">{member.nameEn}</p>}
          <p
            className="mt-3 inline-flex rounded-[2px] border border-gold/35 bg-gold/15 px-3 py-1.5 font-amharic text-[11px] text-[#e9d5a7] md:text-xs"
            lang="am"
          >
            {member.roleAm}
          </p>
          {!isAm && (
            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ivory/50">
              {t(`roles.${member.id}`)}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function TierBlock({
  tier,
  isAm,
  reduced,
  tierLabel,
}: {
  tier: BoardTier;
  isAm: boolean;
  reduced: boolean;
  tierLabel: string;
}) {
  const members = membersByTier(tier);
  if (members.length === 0) return null;

  if (tier === "leadership") {
    return (
      <div>
        <p className="mb-5 text-[10px] uppercase tracking-[0.32em] text-gold/80">{tierLabel}</p>
        <div className="grid gap-5 md:grid-cols-2">
          {members.map((member, i) => (
            <LeadershipCard
              key={member.id}
              member={member}
              index={i}
              isAm={isAm}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    );
  }

  const gridClass =
    tier === "committee"
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div
      className={cn(
        tier === "committee" &&
          "rounded-[2px] border border-gold/20 bg-ivory/[0.03] p-5 md:p-6"
      )}
    >
      <div className="mb-5 flex items-center gap-4">
        <p className="text-[10px] uppercase tracking-[0.32em] text-gold/80">{tierLabel}</p>
        <span className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
        <span className="text-[10px] text-ivory/45">{members.length}</span>
      </div>
      <div className={gridClass}>
        {members.map((member, i) => (
          <MemberCard
            key={member.id}
            member={member}
            index={i}
            isAm={isAm}
            reduced={reduced}
            accent={tier === "committee"}
          />
        ))}
      </div>
    </div>
  );
}

export function BoardMembersShowcase({ locale }: BoardMembersShowcaseProps) {
  const t = useTranslations("governance.board");
  const reduced = usePrefersReducedMotion();
  const isAm = locale === "am";

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/4 font-amharic text-[clamp(4rem,12vw,9rem)] leading-none text-ivory/[0.04] select-none"
        lang="am"
        aria-hidden
      >
        ሰበካ
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <SacredBorder className="mb-8" theme="dark" size={52} />
          <p className="text-[10px] uppercase tracking-[0.38em] text-gold/85">{t("eyebrow")}</p>
          <h3
            className="mx-auto mt-5 max-w-4xl font-amharic text-2xl leading-relaxed text-ivory md:text-3xl lg:text-[2rem]"
            lang="am"
          >
            {t("titleAm")}
          </h3>
          {!isAm && (
            <p className="mx-auto mt-4 max-w-2xl font-display text-xl font-light text-ivory/80 md:text-2xl">
              {t("titleEn")}
            </p>
          )}
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ivory/60">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="mt-14 space-y-12 md:mt-16 md:space-y-14">
          {boardTiers.map((tier) => (
            <TierBlock
              key={tier}
              tier={tier}
              isAm={isAm}
              reduced={reduced}
              tierLabel={t(`tiers.${tier}`)}
            />
          ))}
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-gold/15 pt-8 md:mt-14"
        >
          <div className="flex items-center gap-3">
            <Image
              src={brandImages.cross}
              alt=""
              width={20}
              height={28}
              className="h-7 w-auto opacity-70"
            />
            <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/55">
              {t("memberCount", { count: boardMembers.length })}
            </p>
          </div>
          <p className="text-center text-xs leading-relaxed text-ivory/50">{t("footnote")}</p>
        </motion.div>
      </div>
    </div>
  );
}
