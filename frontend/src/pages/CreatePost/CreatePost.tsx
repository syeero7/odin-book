import { useRef, useState, type FormHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import type { FormAction, CreatePostQueries } from "@/types";
import { createPost } from "@/lib/api";
import SubmitButton from "@/components/SubmitButton";
import FormField from "@/components/FormField";
import styles from "./CreatePost.module.css";
import { ImagePlus } from "lucide-react";

function CreatePost() {
  const [fileAttached, setFileAttached] = useState<boolean>(false);
  const { errors, formAction } = useFormController();
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleSubmit: FormSubmit = (e) => {
    if (ref.current?.value.trim().length === 0 && !fileAttached) {
      e.preventDefault();
    }
  };

  return (
    <main className={styles.container}>
      <form action={formAction} onSubmit={handleSubmit}>
        <FormField
          fieldType="input"
          error={errors?.title}
          label="Title"
          type="text"
          name="title"
          required
          maxLength={80}
        />

        <FormField
          fieldType="textarea"
          error={errors?.content}
          label="Content"
          name="content"
          maxLength={1000}
          ref={ref}
        />

        <FormField
          fieldType="input"
          error={errors?.message}
          className={fileAttached ? styles.fileAttached : ""}
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => {
            const { files } = e.target;
            setFileAttached((files && files.length > 0) || false);
          }}>
          <ImagePlus />
        </FormField>

        <SubmitButton type="submit">Post</SubmitButton>
      </form>
    </main>
  );
}

const useFormController = () => {
  const [errors, setErrors] = useState<PostErrors>(null);
  const navigate = useNavigate();

  const formAction: FormAction = async (formData) => {
    const queries: CreatePostQueries = [];
    if (formData.has("image")) queries.push("image=true");
    if (formData.has("content")) queries.push("text=true");

    const res = await createPost(formData, queries);
    if (res.ok) return navigate("/", { viewTransition: true });

    const { errors, message } = await res.json();
    setErrors(errors || message);
  };

  return { errors, formAction } as const;
};

type PostErrors = {
  title?: string;
  content?: string;
  message?: string;
} | null;

type FormSubmit = FormHTMLAttributes<HTMLFormElement>["onSubmit"];

export default CreatePost;
