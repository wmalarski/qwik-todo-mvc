import { component$ } from "@builder.io/qwik";
import type { Todo } from "@prisma/client";

type Props = {
  todo: Omit<Todo, "userId" | "updatedAt">;
};

export const TodoItem = component$<Props>((props) => {
  return <pre>{JSON.stringify(props.todo, null, 2)}</pre>;
});
