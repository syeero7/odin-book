import type { InputHTMLAttributes, Ref, TextareaHTMLAttributes } from "react";
import styles from "./FormField.module.css";

function FormField({
  label,
  fieldType,
  error,
  children,
  ...props
}: FormFieldProps) {
  const input = <input {...(props as InputHTMLAttributes<HTMLInputElement>)} />;
  const textarea = (
    <textarea
      {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}></textarea>
  );

  return (
    <div className={styles.container}>
      {label ? (
        <label>
          <span>{label}</span>
          {fieldType === "input" ? input : textarea}
        </label>
      ) : (
        <>
          {fieldType === "input" ? input : textarea}
          {children}
        </>
      )}
      <span className={styles.error} aria-live="polite">
        {error && `* ${error}`}
      </span>
    </div>
  );
}

type FormFieldProps =
  | (InputHTMLAttributes<HTMLInputElement> & {
      fieldType: "input";
      label?: string;
      error?: string;
      ref?: Ref<HTMLInputElement>;
    })
  | (TextareaHTMLAttributes<HTMLTextAreaElement> & {
      fieldType: "textarea";
      label?: string;
      error?: string;
      ref?: Ref<HTMLTextAreaElement>;
    });

export default FormField;
