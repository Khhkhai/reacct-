import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";

function useLocalStorageState<T>(
  localStorageKey: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const valueInLocalStorage = localStorage.getItem(localStorageKey);

      if (!valueInLocalStorage) {
        return initialValue;
      }

      // This will throw if the value in localStorage isn't a JSON string
      const parsedValueFromLocalStorage = JSON.parse(valueInLocalStorage);

      return parsedValueFromLocalStorage as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  }, [state, localStorageKey]);

  return [state, setState];
}

function App() {
  const [todos, setTodos] = useLocalStorageState("todos", [
    { text: "Make dinner", done: true },
    { text: "Walk dog", done: false },
  ]);
  const [newTodo, setNewTodo] = useLocalStorageState("new-todo", "");

  function toggleTodo(index: number) {
    // we cannot directly modify array state; we have to duplicate it and then update the state with the duplicate
    const copy = [...todos];
    copy[index].done = !copy[index].done;
    setTodos([...copy]);
  }

  function handleFormSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (newTodo) {
      setTodos([...todos, { text: newTodo, done: false }]);
      setNewTodo("");
    }
  }

  function handleNewTodoChange(event: ChangeEvent<HTMLInputElement>) {
    setNewTodo(event.target.value);
  }

  return (
    <>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            <label>
              <input
                onChange={() => toggleTodo(i)}
                type="checkbox"
                checked={todo.done}
              />
              {todo.text}
            </label>
          </li>
        ))}
      </ul>

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="newTodo"
          placeholder="New Todo..."
          value={newTodo}
          onChange={handleNewTodoChange}
          required
        />
        <button type="submit">Add Todo</button>
      </form>
    </>
  );
}

export default App;
