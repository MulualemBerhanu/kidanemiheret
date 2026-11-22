"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { SacredBorder } from "@/components/ui/SacredBorder";
import { brandImages } from "@/data/images";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const INITIAL_CHILD_ROWS = 1;
const INITIAL_DEPENDENT_ROWS = 1;
const STEPS = ["personal", "contact", "family", "contribution"] as const;
type StepId = (typeof STEPS)[number];

const inputClass =
  "w-full rounded-[2px] border border-gold/15 bg-cream/60 px-4 py-3.5 text-sm text-charcoal shadow-[inset_0_1px_2px_rgba(24,18,10,0.04)] outline-none transition placeholder:text-charcoal/30 focus:border-gold/45 focus:bg-ivory focus:shadow-[0_0_0_3px_rgba(212,175,55,0.12)]";

const tableInputClass = cn(inputClass, "py-2.5");

function FieldLabel({
  am,
  en,
  required,
}: {
  am: string;
  en: string;
  required?: boolean;
}) {
  return (
    <span className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
      <span className="font-amharic text-sm text-charcoal/90" lang="am">
        {am}
        {required && <span className="text-bronze"> *</span>}
      </span>
      <span className="text-[10px] uppercase tracking-[0.18em] text-charcoal/40">{en}</span>
    </span>
  );
}

function FormSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gold/12 pb-5">
        <h3 className="font-display text-xl text-charcoal md:text-2xl">{title}</h3>
        {subtitle && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-charcoal/55">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function SelectCard({
  selected,
  onSelect,
  children,
  className,
}: {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex w-full flex-col items-start rounded-[2px] border p-4 text-left transition-all duration-200 md:p-5",
        selected
          ? "border-gold bg-gradient-to-br from-gold/12 to-amber/5 shadow-[0_10px_28px_rgba(212,175,55,0.14)]"
          : "border-gold/15 bg-ivory/50 hover:border-gold/35 hover:bg-cream/80",
        className
      )}
    >
      {selected && (
        <span
          className="absolute right-3 top-3 h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
}

function AddRowButton({
  label,
  onClick,
  fullWidth = false,
}: {
  label: string;
  onClick: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[2px] border border-gold/45 bg-gradient-to-r from-gold/15 to-amber/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-bronze shadow-[0_4px_14px_rgba(212,175,55,0.12)] transition hover:border-gold hover:from-gold/25 hover:to-amber/15 hover:text-charcoal",
        fullWidth && "mt-4 w-full py-3"
      )}
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4 text-gold" fill="none" aria-hidden>
        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {label}
    </button>
  );
}

function useDynamicRows(initialCount: number) {
  const nextIdRef = useRef(initialCount);
  const [rowIds, setRowIds] = useState(() =>
    Array.from({ length: initialCount }, (_, i) => i)
  );

  const addRow = () => {
    setRowIds((prev) => [...prev, nextIdRef.current++]);
  };

  const removeRow = (id: number) => {
    setRowIds((prev) => (prev.length > 1 ? prev.filter((rowId) => rowId !== id) : prev));
  };

  return { rowIds, addRow, removeRow };
}

function StepIndicator({
  current,
  labels,
}: {
  current: number;
  labels: Record<StepId, string>;
}) {
  return (
    <div className="mb-10">
      <div className="hidden md:block">
        <div className="flex items-center">
          {STEPS.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div key={step} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-medium transition-all duration-300",
                      active &&
                        "border-gold bg-gradient-to-br from-gold to-amber text-charcoal shadow-[0_4px_16px_rgba(212,175,55,0.35)]",
                      done && !active && "border-gold/50 bg-gold/15 text-bronze",
                      !done && !active && "border-gold/20 bg-ivory text-charcoal/40"
                    )}
                  >
                    {done && !active ? "✓" : i + 1}
                  </span>
                  <span
                    className={cn(
                      "max-w-[5.5rem] text-center text-[9px] uppercase leading-tight tracking-[0.14em]",
                      active ? "text-bronze" : "text-charcoal/40"
                    )}
                  >
                    {labels[step]}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 mb-5 h-px flex-1 transition-colors duration-300",
                      i < current ? "bg-gold/50" : "bg-gold/15"
                    )}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] uppercase tracking-[0.28em] text-bronze">
            {labels[STEPS[current]]}
          </span>
          <span className="text-[10px] text-charcoal/45">
            {current + 1} / {STEPS.length}
          </span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-gold/10">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-amber"
            animate={{ width: `${((current + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

export function MembershipRegistrationForm() {
  const t = useTranslations("membershipForm");
  const tButtons = useTranslations("buttons");
  const reduced = usePrefersReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [feeOption, setFeeOption] = useState<"100" | "75" | "50" | "other" | "">("");
  const [paymentPreference, setPaymentPreference] = useState<"monthly" | "onetime" | "">("");
  const {
    rowIds: childRowIds,
    addRow: addChildRow,
    removeRow: removeChildRow,
  } = useDynamicRows(INITIAL_CHILD_ROWS);
  const {
    rowIds: dependentRowIds,
    addRow: addDependentRow,
    removeRow: removeDependentRow,
  } = useDynamicRows(INITIAL_DEPENDENT_ROWS);

  const stepLabels: Record<StepId, string> = {
    personal: t("steps.personal"),
    contact: t("steps.contact"),
    family: t("steps.family"),
    contribution: t("steps.contribution"),
  };

  const validateStep = (index: number) => {
    const form = formRef.current;
    if (!form) return false;
    const panel = form.querySelector<HTMLElement>(`[data-step-panel="${index}"]`);
    if (!panel) return false;
    const fields = panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea"
    );
    let valid = true;
    fields.forEach((field) => {
      if (!field.checkValidity()) {
        valid = false;
        field.reportValidity();
      }
    });
    return valid;
  };

  const goNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (step >= STEPS.length - 1) return;
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    setStep((s) => Math.max(s - 1, 0));
  };

  const submitRegistration = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (step !== STEPS.length - 1) return;
    if (!validateStep(step)) return;

    const form = formRef.current;
    if (!form) return;

    setStatus("sending");
    setError(null);

    const data = new FormData(form);
    const payload: Record<string, string> = {};
    data.forEach((value, key) => {
      if (typeof value === "string") payload[key] = value;
    });
    if (feeOption) payload.membershipFeeOption = feeOption;
    if (paymentPreference) payload.paymentPreference = paymentPreference;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Could not submit registration");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not submit registration");
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter" || (e.target as HTMLElement).tagName === "TEXTAREA") return;
    e.preventDefault();
    if (step < STEPS.length - 1) goNext();
    else submitRegistration();
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2px] border border-gold/25 bg-gradient-to-br from-cream via-ivory to-cream px-6 py-12 text-center md:px-10 md:py-14"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_55%)]"
          aria-hidden
        />
        <SacredBorder className="mb-6" theme="light" size={52} />
        <h2 className="font-display text-2xl text-charcoal md:text-3xl">{t("thankYouTitle")}</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-charcoal/65">{t("thankYou")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/contact" variant="gold">
            {t("thankYouContact")}
          </Button>
          <Button href="/" variant="ivory">
            {tButtons("returnHome")}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={(e) => e.preventDefault()}
      onKeyDown={handleFormKeyDown}
      noValidate
      className="relative space-y-8"
    >
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <header className="text-center">
        <p className="font-amharic text-sm leading-relaxed text-charcoal/75 md:text-base" lang="am">
          {t("churchNameAm")}
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-bronze md:text-xs">
          {t("churchNameEn")}
        </p>
        <h2 className="mt-5 font-display text-2xl text-charcoal md:text-3xl">
          <span className="font-amharic block text-lg md:text-xl" lang="am">
            {t("formTitleAm")}
          </span>
          <span className="mt-1 block text-base font-light text-charcoal/75 md:text-lg">
            {t("formTitleEn")}
          </span>
        </h2>
      </header>

      <StepIndicator current={step} labels={stepLabels} />

      <AnimatePresence mode="sync">
        <motion.div
          key={step}
          data-step-panel={step}
          initial={reduced ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 && (
            <FormSection title={t("personalSection")} subtitle={t("steps.personalHint")}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <FieldLabel am={t("fullNameAm")} en={t("fullName")} required />
                  <input required name="fullName" type="text" className={inputClass} />
                </label>
                <label className="block">
                  <FieldLabel am={t("baptismNameAm")} en={t("baptismName")} />
                  <input name="baptismName" type="text" className={inputClass} />
                </label>
                <label className="block">
                  <FieldLabel am={t("registrationNoAm")} en={t("registrationNo")} />
                  <input name="registrationNo" type="text" className={inputClass} />
                </label>
                <label className="block">
                  <FieldLabel am={t("spouseNameAm")} en={t("spouseName")} />
                  <input name="spouseName" type="text" className={inputClass} />
                </label>
                <label className="block">
                  <FieldLabel am={t("spouseBaptismNameAm")} en={t("spouseBaptismName")} />
                  <input name="spouseBaptismName" type="text" className={inputClass} />
                </label>
              </div>
            </FormSection>
          )}

          {step === 1 && (
            <FormSection title={t("steps.contact")} subtitle={t("steps.contactHint")}>
              <label className="block">
                <FieldLabel am={t("addressAm")} en={t("address")} required />
                <input required name="address" type="text" className={inputClass} />
              </label>
              <div className="grid gap-5 sm:grid-cols-3">
                <label className="block">
                  <FieldLabel am={t("cityAm")} en={t("city")} required />
                  <input required name="city" type="text" className={inputClass} />
                </label>
                <label className="block">
                  <FieldLabel am={t("stateAm")} en={t("state")} required />
                  <input required name="state" type="text" className={inputClass} />
                </label>
                <label className="block">
                  <FieldLabel am={t("zipAm")} en={t("zip")} required />
                  <input required name="zip" type="text" className={inputClass} />
                </label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <FieldLabel am={t("phoneAm")} en={t("phone")} required />
                  <input required name="phone" type="tel" className={inputClass} />
                </label>
                <label className="block">
                  <FieldLabel am={t("mobilePhoneAm")} en={t("mobilePhone")} />
                  <input name="mobilePhone" type="tel" className={inputClass} />
                </label>
                <label className="block sm:col-span-2">
                  <FieldLabel am={t("emailAm")} en={t("email")} />
                  <input name="email" type="email" className={inputClass} />
                </label>
              </div>
            </FormSection>
          )}

          {step === 2 && (
            <FormSection title={t("familySection")} subtitle={t("steps.familyHint")}>
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <h4 className="text-[10px] uppercase tracking-[0.28em] text-bronze">
                    {t("childrenSection")}
                  </h4>
                  <span className="rounded-full border border-gold/20 bg-gold/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-bronze">
                    {t("rowCount", { count: childRowIds.length })}
                  </span>
                </div>
                <div className="overflow-x-auto rounded-[2px] border border-gold/15">
                  <table className="w-full min-w-[38rem] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gold/15 bg-gradient-to-r from-cream to-ivory">
                        <th className="w-10 px-3 py-3.5 font-normal text-[10px] text-charcoal/40">#</th>
                        <th className="px-4 py-3.5 font-normal">
                          <span className="font-amharic block text-sm text-charcoal/85" lang="am">
                            {t("childNameAm")}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-charcoal/45">
                            {t("childName")}
                          </span>
                        </th>
                        <th className="px-4 py-3.5 font-normal">
                          <span className="font-amharic block text-sm text-charcoal/85" lang="am">
                            {t("childBaptismNameAm")}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-charcoal/45">
                            {t("childBaptismName")}
                          </span>
                        </th>
                        <th className="w-40 px-4 py-3.5 font-normal">
                          <span className="font-amharic block text-sm text-charcoal/85" lang="am">
                            {t("birthDateAm")}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-charcoal/45">
                            {t("birthDate")}
                          </span>
                        </th>
                        <th className="w-12 px-2 py-3.5" aria-hidden />
                      </tr>
                    </thead>
                    <tbody>
                      {childRowIds.map((rowId, index) => (
                        <tr key={rowId} className="border-b border-gold/8 last:border-0">
                          <td className="px-3 py-2.5 text-center text-[10px] text-charcoal/35">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              name={`childName_${rowId}`}
                              className={tableInputClass}
                              aria-label={`${t("childName")} ${index + 1}`}
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              name={`childBaptismName_${rowId}`}
                              className={tableInputClass}
                              aria-label={`${t("childBaptismName")} ${index + 1}`}
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              name={`childBirthDate_${rowId}`}
                              type="date"
                              className={tableInputClass}
                              aria-label={`${t("birthDate")} ${index + 1}`}
                            />
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            {childRowIds.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeChildRow(rowId)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-[2px] text-charcoal/35 transition hover:bg-maroon/5 hover:text-maroon"
                                aria-label={t("removeRow", { index: index + 1 })}
                              >
                                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                                  <path
                                    d="M4 4l8 8M12 4l-8 8"
                                    stroke="currentColor"
                                    strokeWidth="1.25"
                                  />
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <AddRowButton label={t("addChild")} onClick={addChildRow} fullWidth />
              </div>

              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <h4 className="text-[10px] uppercase tracking-[0.28em] text-bronze">
                    {t("dependentsSection")}
                  </h4>
                  <span className="rounded-full border border-gold/20 bg-gold/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-bronze">
                    {t("rowCount", { count: dependentRowIds.length })}
                  </span>
                </div>
                <div className="overflow-x-auto rounded-[2px] border border-gold/15">
                  <table className="w-full min-w-[38rem] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gold/15 bg-gradient-to-r from-cream to-ivory">
                        <th className="w-10 px-3 py-3.5 font-normal text-[10px] text-charcoal/40">#</th>
                        <th className="px-4 py-3.5 font-normal">
                          <span className="font-amharic block text-sm text-charcoal/85" lang="am">
                            {t("dependentNameAm")}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-charcoal/45">
                            {t("dependentName")}
                          </span>
                        </th>
                        <th className="px-4 py-3.5 font-normal">
                          <span className="font-amharic block text-sm text-charcoal/85" lang="am">
                            {t("dependentBaptismNameAm")}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-charcoal/45">
                            {t("dependentBaptismName")}
                          </span>
                        </th>
                        <th className="px-4 py-3.5 font-normal">
                          <span className="font-amharic block text-sm text-charcoal/85" lang="am">
                            {t("relationshipAm")}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-charcoal/45">
                            {t("relationship")}
                          </span>
                        </th>
                        <th className="w-12 px-2 py-3.5" aria-hidden />
                      </tr>
                    </thead>
                    <tbody>
                      {dependentRowIds.map((rowId, index) => (
                        <tr key={rowId} className="border-b border-gold/8 last:border-0">
                          <td className="px-3 py-2.5 text-center text-[10px] text-charcoal/35">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              name={`dependentName_${rowId}`}
                              className={tableInputClass}
                              aria-label={`${t("dependentName")} ${index + 1}`}
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              name={`dependentBaptismName_${rowId}`}
                              className={tableInputClass}
                              aria-label={`${t("dependentBaptismName")} ${index + 1}`}
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              name={`dependentRelationship_${rowId}`}
                              className={tableInputClass}
                              aria-label={`${t("relationship")} ${index + 1}`}
                            />
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            {dependentRowIds.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeDependentRow(rowId)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-[2px] text-charcoal/35 transition hover:bg-maroon/5 hover:text-maroon"
                                aria-label={t("removeRow", { index: index + 1 })}
                              >
                                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                                  <path
                                    d="M4 4l8 8M12 4l-8 8"
                                    stroke="currentColor"
                                    strokeWidth="1.25"
                                  />
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <AddRowButton label={t("addDependent")} onClick={addDependentRow} fullWidth />
              </div>
            </FormSection>
          )}

          {step === 3 && (
            <FormSection title={t("steps.contribution")} subtitle={t("steps.contributionHint")}>
              <div>
                <h4 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-bronze">
                  <span className="font-amharic normal-case tracking-normal" lang="am">
                    {t("membershipFeeAm")}
                  </span>
                  {" · "}
                  {t("membershipFee")}
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {(["100", "75", "50"] as const).map((amount) => (
                    <SelectCard
                      key={amount}
                      selected={feeOption === amount}
                      onSelect={() => setFeeOption(amount)}
                    >
                      <span className="font-display text-2xl text-charcoal">${amount}</span>
                      <span className="mt-1 text-[10px] uppercase tracking-wider text-charcoal/45">
                        {t("membershipFee")}
                      </span>
                      <input
                        type="radio"
                        name="membershipFee"
                        value={amount}
                        checked={feeOption === amount}
                        onChange={() => setFeeOption(amount)}
                        className="sr-only"
                      />
                    </SelectCard>
                  ))}
                  <SelectCard
                    selected={feeOption === "other"}
                    onSelect={() => setFeeOption("other")}
                    className="sm:col-span-2 lg:col-span-1"
                  >
                    <span className="font-amharic text-sm text-charcoal/85" lang="am">
                      {t("feeOtherAm")}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal/45">
                      {t("feeOther")}
                    </span>
                    <div className="mt-3 flex w-full items-center gap-2">
                      <span className="text-charcoal/50">$</span>
                      <input
                        name="membershipFeeOther"
                        type="number"
                        min="0"
                        step="1"
                        disabled={feeOption !== "other"}
                        className={cn(tableInputClass, "flex-1")}
                        onFocus={() => setFeeOption("other")}
                      />
                    </div>
                    <input
                      type="radio"
                      name="membershipFee"
                      value="other"
                      checked={feeOption === "other"}
                      onChange={() => setFeeOption("other")}
                      className="sr-only"
                    />
                  </SelectCard>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-bronze">
                  <span className="font-amharic normal-case tracking-normal" lang="am">
                    {t("paymentPreferenceAm")}
                  </span>
                  {" · "}
                  {t("paymentPreference")}
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      { value: "monthly" as const, am: t("paymentMonthlyAm"), en: t("paymentMonthly") },
                      { value: "onetime" as const, am: t("paymentOnetimeAm"), en: t("paymentOnetime") },
                    ] as const
                  ).map(({ value, am, en }) => (
                    <SelectCard
                      key={value}
                      selected={paymentPreference === value}
                      onSelect={() => setPaymentPreference(value)}
                    >
                      <span className="font-amharic text-sm text-charcoal/90" lang="am">
                        {am}
                      </span>
                      <span className="mt-1 text-sm text-charcoal/60">{en}</span>
                      <input
                        type="radio"
                        name="paymentPreference"
                        value={value}
                        checked={paymentPreference === value}
                        onChange={() => setPaymentPreference(value)}
                        className="sr-only"
                      />
                    </SelectCard>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 border-t border-gold/12 pt-6 sm:grid-cols-2">
                <label className="block">
                  <FieldLabel am={t("signatureAm")} en={t("signature")} required />
                  <input required name="signature" type="text" className={inputClass} />
                </label>
                <label className="block">
                  <FieldLabel am={t("dateAm")} en={t("date")} required />
                  <input
                    required
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="flex items-start gap-3 rounded-[2px] border border-gold/12 bg-cream/50 p-4">
                <Image
                  src={brandImages.cross}
                  alt=""
                  width={20}
                  height={28}
                  className="mt-0.5 h-7 w-auto shrink-0 opacity-70"
                />
                <p className="text-xs leading-relaxed text-charcoal/55">{t("officeNote")}</p>
              </div>
            </FormSection>
          )}
        </motion.div>
      </AnimatePresence>

      {error && (
        <p className="rounded-[2px] border border-red-300/50 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gold/12 pt-8">
        <Button
          type="button"
          variant="ivory"
          onClick={goBack}
          className={cn(step === 0 && "invisible pointer-events-none")}
          disabled={status === "sending"}
        >
          {t("prevStep")}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button type="button" variant="gold" onClick={goNext}>
            {t("nextStep")}
          </Button>
        ) : (
          <Button
            type="button"
            variant="gold"
            onClick={submitRegistration}
            disabled={status === "sending"}
          >
            {status === "sending" ? "Submitting…" : tButtons("submitRegistration")}
          </Button>
        )}
      </div>
    </form>
  );
}
