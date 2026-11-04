"use client";

import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Plus, Trash2, Upload } from "lucide-react";
import { useId, useRef, useState } from "react";
import { cn } from "../../../lib/cn";
import { uploadFile } from "../_lib/api";
import { toLocalInput } from "../_lib/format";
import type { UploadFolder } from "../_lib/types";
import { useFeedback } from "./Feedback";
import { Button, Field, IconButton, Input, Select, Switch, Textarea } from "./ui";

/**
 * Declarative form fields. A resource page lists its fields once; this module
 * renders them, converts records to form values and builds the API payload.
 */

export type Values = Record<string, unknown>;
export interface Option {
  value: string;
  label: string;
}

interface BaseField {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  /** Fields are half width on wide screens unless they hold long content. */
  wide?: boolean;
}

export type FieldDef = BaseField &
  (
    | { type: "text" | "email" | "url" | "tel" | "password"; placeholder?: string; maxLength?: number; autoComplete?: string }
    | { type: "textarea"; rows?: number; maxLength?: number; placeholder?: string }
    | { type: "number"; min?: number; max?: number; step?: number }
    | { type: "date" | "datetime"; nullable?: boolean }
    | { type: "switch"; description?: string }
    | { type: "select"; options: Option[]; placeholder?: string; nullable?: boolean }
    | { type: "image" | "images"; folder: UploadFolder }
    | { type: "list"; inputType?: "text" | "email" | "tel"; placeholder?: string; addLabel?: string }
    | { type: "group"; fields: FieldDef[]; itemLabel: string; addLabel: string; min?: number }
  );

const isWide = (field: FieldDef) => field.wide ?? ["textarea", "images", "list", "group"].includes(field.type);

/* ---------- Value conversion ---------- */

function emptyValue(field: FieldDef): unknown {
  switch (field.type) {
    case "switch":
      return true;
    case "images":
    case "list":
      return [];
    case "group":
      return Array.from({ length: field.min ?? 0 }, () => emptyValues(field.fields));
    default:
      return "";
  }
}

export const emptyValues = (fields: FieldDef[]): Values => Object.fromEntries(fields.map((f) => [f.name, emptyValue(f)]));

/** API record -> form values (numbers and dates become input strings). */
export function toValues(fields: FieldDef[], record: Record<string, unknown>): Values {
  return Object.fromEntries(
    fields.map((field) => {
      const raw = record[field.name];
      if (raw === undefined || raw === null) return [field.name, emptyValue(field)];
      switch (field.type) {
        case "number":
          return [field.name, String(raw)];
        case "datetime":
          return [field.name, toLocalInput(String(raw))];
        case "date":
          return [field.name, String(raw).slice(0, 10)];
        case "group":
          return [field.name, Array.isArray(raw) ? raw.map((item) => toValues(field.fields, (item ?? {}) as Record<string, unknown>)) : []];
        case "images":
        case "list":
          return [field.name, Array.isArray(raw) ? raw.map(String) : []];
        default:
          return [field.name, raw];
      }
    }),
  );
}

/** Form values -> request body in the types the API validates. */
export function toPayload(fields: FieldDef[], values: Values): Values {
  const out: Values = {};
  for (const field of fields) {
    const value = values[field.name];
    switch (field.type) {
      case "number":
        if (value !== "" && value !== undefined) out[field.name] = Number(value);
        break;
      case "date":
      case "select":
        if (value) out[field.name] = value;
        else if (field.nullable) out[field.name] = null;
        break;
      case "datetime":
        if (value) out[field.name] = new Date(String(value)).toISOString();
        else if (field.nullable) out[field.name] = null;
        break;
      case "list":
        out[field.name] = ((value as string[]) ?? []).map((v) => v.trim()).filter(Boolean);
        break;
      case "group":
        out[field.name] = ((value as Values[]) ?? []).map((item) => toPayload(field.fields, item));
        break;
      case "text":
      case "email":
      case "url":
      case "tel":
      case "password":
      case "textarea":
        out[field.name] = typeof value === "string" ? value.trim() : value;
        break;
      default:
        out[field.name] = value;
    }
  }
  return out;
}

/* ---------- Rendering ---------- */

export function FormFields({ fields, values, onChange }: { fields: FieldDef[]; values: Values; onChange: (values: Values) => void }) {
  return (
    <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={cn(isWide(field) && "sm:col-span-2")}>
          <FieldInput field={field} value={values[field.name]} onChange={(value) => onChange({ ...values, [field.name]: value })} />
        </div>
      ))}
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (value: unknown) => void }) {
  const id = useId();
  const text = typeof value === "string" ? value : value == null ? "" : String(value);
  const common = { label: field.label, htmlFor: id, hint: field.hint, required: field.required };

  switch (field.type) {
    case "switch":
      return <Switch id={id} checked={!!value} onChange={onChange} label={field.label} description={field.description ?? field.hint} />;

    case "textarea":
      return (
        <Field {...common} counter={field.maxLength ? { value: text.length, max: field.maxLength } : undefined}>
          <Textarea id={id} rows={field.rows} value={text} required={field.required} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );

    case "number":
      return (
        <Field {...common}>
          <Input id={id} type="number" inputMode="decimal" value={text} required={field.required} min={field.min} max={field.max} step={field.step ?? 1} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );

    case "date":
    case "datetime":
      return (
        <Field {...common}>
          <Input id={id} type={field.type === "date" ? "date" : "datetime-local"} value={text} required={field.required} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );

    case "select":
      return (
        <Field {...common}>
          <Select id={id} value={text} required={field.required} onChange={(e) => onChange(e.target.value)}>
            <option value="">{field.placeholder ?? "Select…"}</option>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      );

    case "image":
      return (
        <Field {...common}>
          <ImageInput id={id} folder={field.folder} value={text} onChange={onChange} />
        </Field>
      );

    case "images":
      return (
        <Field {...common}>
          <ImagesInput id={id} folder={field.folder} value={(value as string[]) ?? []} onChange={onChange} />
        </Field>
      );

    case "list":
      return (
        <Field {...common}>
          <ListInput id={id} field={field} value={(value as string[]) ?? []} onChange={onChange} />
        </Field>
      );

    case "group":
      return <GroupInput field={field} value={(value as Values[]) ?? []} onChange={onChange} />;

    default:
      return (
        <Field {...common} counter={field.maxLength ? { value: text.length, max: field.maxLength } : undefined}>
          <Input
            id={id}
            type={field.type}
            value={text}
            required={field.required}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete ?? "off"}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      );
  }
}

/* ---------- Uploads ---------- */

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function useUpload(folder: UploadFolder) {
  const { toast } = useFeedback();
  const [busy, setBusy] = useState(false);
  const run = async (files: File[]): Promise<string[]> => {
    setBusy(true);
    const urls: string[] = [];
    try {
      for (const file of files) urls.push(await uploadFile(file, folder));
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(false);
    }
    return urls;
  };
  return { busy, run };
}

function ImageInput({ id, folder, value, onChange }: { id: string; folder: UploadFolder; value: string; onChange: (value: string) => void }) {
  const picker = useRef<HTMLInputElement>(null);
  const { busy, run } = useUpload(folder);

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => picker.current?.click()}
        className="group relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line-strong bg-paper text-muted transition-colors hover:border-accent hover:text-accent-ink"
        aria-label={value ? "Replace image" : "Upload image"}
      >
        {busy ? (
          <LoaderCircle className="size-5 animate-spin" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <ImagePlus className="size-6" />
        )}
      </button>
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" icon={<Upload className="size-3.5" />} loading={busy} onClick={() => picker.current?.click()}>
            {value ? "Replace" : "Upload"}
          </Button>
          {value && (
            <Button size="sm" variant="ghost" onClick={() => onChange("")}>
              Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-muted">JPEG, PNG, WebP or GIF.</p>
      </div>
      <input
        id={id}
        ref={picker}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        tabIndex={-1}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const [url] = await run([file]);
          if (url) onChange(url);
        }}
      />
    </div>
  );
}

function ImagesInput({ id, folder, value, onChange }: { id: string; folder: UploadFolder; value: string[]; onChange: (value: string[]) => void }) {
  const picker = useRef<HTMLInputElement>(null);
  const { busy, run } = useUpload(folder);
  const move = (from: number, to: number) => {
    const next = [...value];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {value.map((url, index) => (
        <div key={url + index} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={`Image ${index + 1}`} className="size-full object-cover" />
          {index === 0 && <span className="absolute top-1.5 left-1.5 rounded-md bg-ink/80 px-1.5 py-0.5 text-[10px] font-medium text-white">Cover</span>}
          <div className="absolute inset-x-1.5 bottom-1.5 flex justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
            {index > 0 && (
              <IconButton label="Move left" className="size-7 bg-white/95 shadow-sm" onClick={() => move(index, index - 1)}>
                <ArrowUp className="size-3.5 -rotate-90" />
              </IconButton>
            )}
            <IconButton label="Remove image" tone="danger" className="size-7 bg-white/95 shadow-sm" onClick={() => onChange(value.filter((_, i) => i !== index))}>
              <Trash2 className="size-3.5" />
            </IconButton>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => picker.current?.click()}
        disabled={busy}
        className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line-strong bg-paper text-xs text-muted transition-colors hover:border-accent hover:text-accent-ink"
      >
        {busy ? <LoaderCircle className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
        {busy ? "Uploading" : "Add images"}
      </button>
      <input
        id={id}
        ref={picker}
        type="file"
        accept={ACCEPT}
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (!files.length) return;
          const urls = await run(files);
          if (urls.length) onChange([...value, ...urls]);
        }}
      />
    </div>
  );
}

/* ---------- Repeaters ---------- */

function ListInput({ id, field, value, onChange }: { id: string; field: Extract<FieldDef, { type: "list" }>; value: string[]; onChange: (value: string[]) => void }) {
  const rows = value.length ? value : [""];
  return (
    <div className="flex flex-col gap-2">
      {rows.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            id={index === 0 ? id : undefined}
            type={field.inputType ?? "text"}
            value={item}
            placeholder={field.placeholder}
            aria-label={`${field.label} ${index + 1}`}
            onChange={(e) => onChange(rows.map((v, i) => (i === index ? e.target.value : v)))}
          />
          <IconButton label="Remove" tone="danger" disabled={rows.length === 1 && !item} onClick={() => onChange(rows.filter((_, i) => i !== index))}>
            <Trash2 className="size-4" />
          </IconButton>
        </div>
      ))}
      <Button size="sm" variant="ghost" className="self-start" icon={<Plus className="size-3.5" />} onClick={() => onChange([...rows, ""])}>
        {field.addLabel ?? "Add another"}
      </Button>
    </div>
  );
}

function GroupInput({ field, value, onChange }: { field: Extract<FieldDef, { type: "group" }>; value: Values[]; onChange: (value: Values[]) => void }) {
  const min = field.min ?? 0;
  const move = (from: number, to: number) => {
    const next = [...value];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 text-[13px] font-medium text-ink">
        {field.label}
        {field.required && <span className="ml-0.5 text-accent-ink">*</span>}
        {field.hint && <span className="ml-2 font-normal text-muted">{field.hint}</span>}
      </legend>
      {value.map((item, index) => (
        <div key={index} className="rounded-xl border border-line bg-paper/50 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
              {field.itemLabel} {index + 1}
            </span>
            <div className="flex items-center">
              <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}>
                <ArrowUp className="size-4" />
              </IconButton>
              <IconButton label="Move down" disabled={index === value.length - 1} onClick={() => move(index, index + 1)}>
                <ArrowDown className="size-4" />
              </IconButton>
              <IconButton label={`Remove ${field.itemLabel.toLowerCase()}`} tone="danger" disabled={value.length <= min} onClick={() => onChange(value.filter((_, i) => i !== index))}>
                <Trash2 className="size-4" />
              </IconButton>
            </div>
          </div>
          <FormFields fields={field.fields} values={item} onChange={(next) => onChange(value.map((v, i) => (i === index ? next : v)))} />
        </div>
      ))}
      <Button variant="secondary" size="sm" className="self-start" icon={<Plus className="size-3.5" />} onClick={() => onChange([...value, emptyValues(field.fields)])}>
        {field.addLabel}
      </Button>
    </fieldset>
  );
}
