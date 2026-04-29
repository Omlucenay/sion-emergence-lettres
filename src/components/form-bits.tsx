import type {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import type { FieldError } from "react-hook-form";

export function FormSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <header className="mb-6 pb-3 border-b border-[#E8E2D8]">
        {eyebrow ? (
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--accent)] mb-1">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-2xl">{title}</h2>
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: FieldError | string;
  hint?: string;
};

export function Input({ label, error, hint, id, ...rest }: InputProps) {
  const errorText = typeof error === "string" ? error : error?.message;
  const inputId = id ?? rest.name;
  return (
    <div>
      <label htmlFor={inputId} className="label">
        {label}
      </label>
      <input id={inputId} className="input" aria-invalid={!!errorText} {...rest} />
      {hint && !errorText ? (
        <p className="text-xs text-[var(--muted)] mt-1">{hint}</p>
      ) : null}
      {errorText ? <p className="field-error">{errorText}</p> : null}
    </div>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: FieldError | string;
  hint?: string;
};

export function Textarea({ label, error, hint, id, ...rest }: TextareaProps) {
  const errorText = typeof error === "string" ? error : error?.message;
  const inputId = id ?? rest.name;
  return (
    <div>
      <label htmlFor={inputId} className="label">
        {label}
      </label>
      <textarea
        id={inputId}
        className="textarea"
        rows={3}
        aria-invalid={!!errorText}
        {...rest}
      />
      {hint && !errorText ? (
        <p className="text-xs text-[var(--muted)] mt-1">{hint}</p>
      ) : null}
      {errorText ? <p className="field-error">{errorText}</p> : null}
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-5">{children}</div>;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: FieldError | string;
  hint?: string;
};

export function Select({ label, error, hint, id, children, ...rest }: SelectProps) {
  const errorText = typeof error === "string" ? error : error?.message;
  const inputId = id ?? rest.name;
  return (
    <div>
      <label htmlFor={inputId} className="label">
        {label}
      </label>
      <select id={inputId} className="input" aria-invalid={!!errorText} {...rest}>
        {children}
      </select>
      {hint && !errorText ? (
        <p className="text-xs text-[var(--muted)] mt-1">{hint}</p>
      ) : null}
      {errorText ? <p className="field-error">{errorText}</p> : null}
    </div>
  );
}

export function ConsentBlock({
  termsProps,
  rgpdProps,
  termsError,
  rgpdError,
}: {
  termsProps: InputHTMLAttributes<HTMLInputElement>;
  rgpdProps: InputHTMLAttributes<HTMLInputElement>;
  termsError?: string;
  rgpdError?: string;
}) {
  return (
    <div className="space-y-3">
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="checkbox mt-1" {...termsProps} />
        <span className="text-sm leading-relaxed">
          Je comprends que la présente lettre constitue une manifestation d&apos;intention et
          ne vaut pas engagement ferme. L&apos;inscription définitive ou le partenariat ferme
          fera l&apos;objet d&apos;un dossier distinct.
        </span>
      </label>
      {termsError ? <p className="field-error">{termsError}</p> : null}

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="checkbox mt-1" {...rgpdProps} />
        <span className="text-sm leading-relaxed">
          J&apos;accepte que mes données soient traitées par Sion Émergence aux seules fins de
          l&apos;instruction du projet. Aucune cession à des tiers.{" "}
          <a className="underline" href="mailto:contact@sion-emergence.fr">
            Droits d&apos;accès, rectification, effacement.
          </a>
        </span>
      </label>
      {rgpdError ? <p className="field-error">{rgpdError}</p> : null}
    </div>
  );
}
