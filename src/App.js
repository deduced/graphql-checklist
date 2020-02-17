import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_TODOS = gql`
  query getAllTodos {
    todos {
      done
      id
      text
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos(objects: { text: $text }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText("")
  });
  const [todoText, setTodoText] = useState("");

  async function handleToggleTodo({ id, done }) {
    const result = await toggleTodo({ variables: { id: id, done: !done } });
    console.log("toggled todo", result.data.update_todos.returning);
  }

  async function handleAddTodo(event) {
    event.preventDefault();
    const result = await addTodo({
      variables: { text: todoText },
      refetchQueries: [{ query: GET_TODOS }]
    });
    console.log("added todo", result.data.insert_todos.returning);
    // setTodoText("");
  }

  if (loading) return <div>Loading todos...</div>;
  if (error) return <div>Error fetching todos!</div>;

  return (
    <div className="vh-100 bg-lightest-blue dark-blue pa3 georgia flex flex-column items-center">
      <h1 className="f3">
        GraphQL Checklist{" "}
        <span role="img" aria-label="Checkmark">
          ✅
        </span>
      </h1>

      {/* Todo Form */}
      <form className="mb3" onSubmit={handleAddTodo}>
        <input
          className="pa2 f4"
          onChange={event => setTodoText(event.target.value)}
          placeholder="Write your todo"
          type="text"
          value={todoText}
        />
        <button
          className="pa2 f4 bg-dark-blue white"
          type="submit"
          disabled={!todoText}
        >
          Create
        </button>
      </form>
      {/* Todo List */}
      <div className="flex items-center justify-center flex-column">
        {data.todos.map(todo => (
          <p key={todo.id} onDoubleClick={() => handleToggleTodo(todo)}>
            <input
              checked={todo.done}
              name={todo.id}
              onChange={() => handleToggleTodo(todo)}
              type="checkbox"
            />
            <label htmlFor={todo.id}>
              <span className={`pointer pa1 f4 ${todo.done && "strike"}`}>
                {todo.text}
              </span>
            </label>
            <button className="bg-transparent bn f4">
              <span className="red">ⅹ</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
