"use client";

import { visibleInputClass, visibleTextareaClass } from "@/lib/form-input-styles";

type Props = {
    id: string;
    label: string;
    required?: boolean;
    optional?: boolean;
    error?: string;
    children?: React.ReactNode;
} & (
    | {
          as?: "input";
          value: string;
          onChange: (value: string) => void;
          placeholder?: string;
          type?: string;
      }
    | {
          as: "textarea";
          value: string;
          onChange: (value: string) => void;
          placeholder?: string;
          rows?: number;
      }
);

export default function CreateFormField(props: Props) {
    const { id, label, required, optional, error, children } = props;
    const invalid = !!error;

    const inputClass = `${props.as === "textarea" ? visibleTextareaClass : visibleInputClass} ${
        invalid ? "border-red-400/70 ring-1 ring-red-400/30" : ""
    }`;

    return (
        <div>
            <div className="flex items-center gap-2 mb-1.5">
                <label htmlFor={id} className="text-sm font-medium text-gray-200">
                    {label}
                </label>
                {required && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-pink-heart">
                        Required
                    </span>
                )}
                {optional && (
                    <span className="text-[10px] font-medium text-gray-500">Optional</span>
                )}
            </div>
            {children ??
                (props.as === "textarea" ? (
                    <textarea
                        id={id}
                        rows={props.rows ?? 4}
                        value={props.value}
                        onChange={(e) => props.onChange(e.target.value)}
                        onInput={(e) =>
                            props.onChange((e.target as HTMLTextAreaElement).value)
                        }
                        placeholder={props.placeholder}
                        className={inputClass}
                    />
                ) : (
                    <input
                        id={id}
                        type={props.type ?? "text"}
                        value={props.value}
                        onChange={(e) => props.onChange(e.target.value)}
                        onInput={(e) =>
                            props.onChange((e.target as HTMLInputElement).value)
                        }
                        placeholder={props.placeholder}
                        className={inputClass}
                    />
                ))}
            {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
        </div>
    );
}
