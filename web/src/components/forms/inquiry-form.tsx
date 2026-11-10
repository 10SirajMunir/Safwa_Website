"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { fieldErrors, inquirySchema, MIN_ORDER_METERS, type InquiryFieldErrors } from "@/lib/validation/inquiry";
import { whatsappUrl } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/button-link";
import { CheckIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Field, describedBy, inputClasses } from "./form-field";

export interface FabricChoice {
  slug: string;
  code: string;
  label: string;
  colours: { name: string; code: string }[];
}

type FabricInquiryProps = { variant: "fabric"; fabrics: FabricChoice[]; defaultFabric?: string };
type ContactInquiryProps = { variant: "contact" };
type InquiryFormProps = FabricInquiryProps | ContactInquiryProps;
type Mode = "quote" | "sample" | "contact";
type Status = { state: "idle" | "submitting" } | { state: "sent"; name: string } | { state: "failed"; message: string };

const ORDER_SAMPLE_HASH = "#order-sample";

/**
 * FR-07 quote, FR-08 sample and FR-09 contact form. Validates with the same schema
 * as the server and posts JSON to /api/inquiries.
 */
export function InquiryForm(props: InquiryFormProps) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);

  const fabrics = props.variant === "fabric" ? props.fabrics : [];
  const [mode, setMode] = useState<Mode>(props.variant === "contact" ? "contact" : "quote");
  const [fabricSlug, setFabricSlug] = useState(props.variant === "fabric" ? (props.defaultFabric ?? "") : "");
  const [colours, setColours] = useState<string[]>([]);
  const [errors, setErrors] = useState<InquiryFieldErrors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const selectedFabric = fabrics.find((f) => f.slug === fabricSlug);

  // The "Order sample" button links to #order-sample; switch the form to sample mode.
  useEffect(() => {
    if (props.variant !== "fabric") return;
    const syncWithHash = () => {
      if (window.location.hash === ORDER_SAMPLE_HASH) setMode("sample");
      else if (window.location.hash === "#request-quote") setMode("quote");
    };
    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
    return () => window.removeEventListener("hashchange", syncWithHash);
  }, [props.variant]);

  function focusFirstError(found: InquiryFieldErrors) {
    const first = Object.keys(found)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const read = (name: string) => String(data.get(name) ?? "");

    const payload: Record<string, string> = {
      type: mode,
      name: read("name"),
      city: read("city"),
      phone: read("phone"),
      company_website: read("company_website"),
    };
    const business = read("business").trim();
    if (business) payload.business = business;
    if (mode === "contact") {
      payload.message = read("message");
    } else {
      payload.fabric = selectedFabric ? `${selectedFabric.code} ${selectedFabric.label}` : "";
      payload.colours = colours.join(", ");
      if (mode === "quote") payload.meters = read("meters");
    }

    const parsed = inquirySchema.safeParse(payload);
    if (!parsed.success) {
      const found = fieldErrors(parsed.error);
      setErrors(found);
      focusFirstError(found);
      return;
    }

    setErrors({});
    setStatus({ state: "submitting" });
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setStatus({ state: "sent", name: parsed.data.name });
        return;
      }
      const body = (await response.json().catch(() => ({}))) as { error?: string; fields?: InquiryFieldErrors };
      if (body.fields) {
        setErrors(body.fields);
        focusFirstError(body.fields);
      }
      setStatus({ state: "failed", message: body.error ?? "Something went wrong. Please try again." });
    } catch {
      setStatus({ state: "failed", message: "We could not send your request. Please check your connection and try again." });
    }
  }

  if (status.state === "sent") {
    return (
      <div role="status" className="border border-gold-500/60 bg-gold-200/40 p-6">
        <p className="flex items-center gap-2 font-display text-[1.75rem] text-maroon-800">
          <CheckIcon className="text-whatsapp" width={26} height={26} /> Thank you, {status.name}.
        </p>
        <p className="mt-2 text-ink">
          {mode === "sample"
            ? "We have your sample request and will contact you to arrange delivery."
            : mode === "quote"
              ? "We have your quote request and will reply with prices soon."
              : "We have your message and will reply soon."}{" "}
          For a faster answer, message us on WhatsApp.
        </p>
        <a
          href={whatsappUrl(selectedFabric && { code: selectedFabric.code, label: selectedFabric.label })}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("whatsapp", "mt-5")}
        >
          <WhatsAppIcon /> Continue on WhatsApp
        </a>
      </div>
    );
  }

  const error = (name: string) => errors[name];
  const aria = (name: string, hint = false) => ({
    "aria-invalid": error(name) ? true : undefined,
    "aria-describedby": describedBy(id(name), { hint, error: error(name) }),
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} method="post" action="/api/inquiries" noValidate className="space-y-5">
      <noscript>
        <p className="border border-line bg-sand p-4">
          This form needs JavaScript. You can also reach us on WhatsApp or by phone using the buttons on this page.
        </p>
      </noscript>

      {props.variant === "fabric" && (
        <fieldset>
          <legend className="font-semibold text-ink">What do you need?</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              [
                ["quote", "A price quote"],
                ["sample", "A sample"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-sm border border-line bg-white px-3 has-[:checked]:border-maroon-800 has-[:checked]:bg-maroon-800/[0.04]"
              >
                <input
                  type="radio"
                  name="type"
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                  className="size-5 accent-maroon-800"
                />
                <span className="font-semibold">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("name")} label="Your name" error={error("name")}>
          <input id={id("name")} name="name" autoComplete="name" className={inputClasses} {...aria("name")} />
        </Field>
        <Field id={id("phone")} label="Phone or WhatsApp" error={error("phone")}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0300 1234567"
            className={inputClasses}
            {...aria("phone")}
          />
        </Field>
        <Field id={id("business")} label="Business name" optional error={error("business")}>
          <input id={id("business")} name="business" autoComplete="organization" className={inputClasses} {...aria("business")} />
        </Field>
        <Field id={id("city")} label="City" error={error("city")}>
          <input id={id("city")} name="city" autoComplete="address-level2" className={inputClasses} {...aria("city")} />
        </Field>
      </div>

      {props.variant === "fabric" && (
        <>
          <Field id={id("fabric")} label="Fabric" error={error("fabric")}>
            <select
              id={id("fabric")}
              name="fabric"
              value={fabricSlug}
              onChange={(e) => {
                setFabricSlug(e.target.value);
                setColours([]);
              }}
              className={inputClasses}
              {...aria("fabric")}
            >
              <option value="">Choose a fabric</option>
              {fabrics.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.code} · {f.label}
                </option>
              ))}
            </select>
          </Field>

          <fieldset aria-describedby={describedBy(id("colours"), { error: error("colours") })}>
            <legend className="font-semibold text-ink">Colours</legend>
            {selectedFabric ? (
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {selectedFabric.colours.map((colour) => {
                  const value = `${colour.name} (${colour.code})`;
                  return (
                    <label
                      key={colour.code}
                      className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-sm border border-line bg-white px-3 has-[:checked]:border-maroon-800"
                    >
                      <input
                        type="checkbox"
                        name="colours"
                        value={value}
                        checked={colours.includes(value)}
                        onChange={(e) =>
                          setColours((current) =>
                            e.target.checked ? [...current, value] : current.filter((c) => c !== value),
                          )
                        }
                        className="size-5 accent-maroon-800"
                      />
                      <span className="leading-tight">
                        {colour.name}
                        <span className="block text-[0.8125rem] text-muted">{colour.code}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="mt-1.5 text-muted">Choose a fabric first to see its colours.</p>
            )}
            {error("colours") && (
              <p id={`${id("colours")}-error`} className="mt-1.5 text-[0.9375rem] font-semibold text-danger">
                Please choose at least one colour.
              </p>
            )}
          </fieldset>

          {mode === "quote" && (
            <Field
              id={id("meters")}
              label="Meters per colour"
              hint={`Minimum ${MIN_ORDER_METERS} meters per colour.`}
              error={error("meters")}
            >
              <input
                id={id("meters")}
                name="meters"
                type="number"
                inputMode="numeric"
                min={MIN_ORDER_METERS}
                step={1}
                placeholder={String(MIN_ORDER_METERS)}
                className={`${inputClasses} tabular sm:max-w-[12rem]`}
                {...aria("meters", true)}
              />
            </Field>
          )}
        </>
      )}

      {props.variant === "contact" && (
        <Field id={id("message")} label="Your message" error={error("message")}>
          <textarea id={id("message")} name="message" rows={5} className={`${inputClasses} py-2.5`} {...aria("message")} />
        </Field>
      )}

      {/* Spam trap: hidden from people and screen readers (NFR-06). */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={id("company_website")}>Leave this empty</label>
        <input id={id("company_website")} name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      {status.state === "failed" && (
        <p role="alert" className="border-l-4 border-danger bg-danger/[0.06] p-3 font-semibold text-danger">
          {status.message}
        </p>
      )}

      <button type="submit" disabled={status.state === "submitting"} className={buttonClasses("primary", "w-full sm:w-auto disabled:opacity-70")}>
        {status.state === "submitting"
          ? "Sending…"
          : mode === "sample"
            ? "Request sample"
            : mode === "quote"
              ? "Request quote"
              : "Send message"}
      </button>
    </form>
  );
}
