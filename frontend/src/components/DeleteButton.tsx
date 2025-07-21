import { Trash } from "lucide-react";
import { Form, useLocation } from "react-router-dom";

function DeleteButton({ itemId, itemName, disabled }: DeleteButtonProps) {
  const location = useLocation();

  return (
    <Form
      method="delete"
      action={`/${itemName}s/${itemId}/delete`}
      viewTransition
      onSubmit={(e) => {
        if (!confirm(`Are you sure you want to delete this ${itemName}?`)) {
          e.preventDefault();
          return;
        }
      }}
    >
      <button aria-label={`delete ${itemName}`} disabled={disabled}>
        <Trash />
      </button>
      <input type="hidden" name="redirectTo" value={location.pathname} />
    </Form>
  );
}

type DeleteButtonProps = {
  itemId: number;
  itemName: "post" | "comment";
  disabled: boolean;
};

export default DeleteButton;
