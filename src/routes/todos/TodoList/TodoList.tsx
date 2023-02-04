import { component$ } from "@builder.io/qwik";
import { todosLoader } from "..";
import { TodoItem } from "./TodoItem/TodoItem";

export const TodoList = component$(() => {
  const todos = todosLoader.use();

  return (
    <div>
      {todos.value?.map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </div>
  );
});
