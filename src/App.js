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

const DELETE_TODO = gql`
  mutation deleteTodo($id: uuid!) {
    delete_todos(where: { id: { _eq: $id } }) {
      returning {
        done
        text
        id
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

  const [deleteTodo] = useMutation(DELETE_TODO);

  async function handleToggleTodo({ id, done }) {
    const result = await toggleTodo({ variables: { id: id, done: !done } });
    console.log("toggled todo", result.data.update_todos.returning);
  }

  async function handleAddTodo(event) {
    event.preventDefault();
    const result = await addTodo({
      variables: { text: todoText },
      //refetchQueries is not the way to refresh cache. Just did it for practice. Use cache update
      refetchQueries: [{ query: GET_TODOS }]
    });
    console.log("added todo", result.data.insert_todos.returning);
    // setTodoText("");
  }

  async function handleDeleteTodo({ id }) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this todo?"
    );

    if (isConfirmed) {
      const result = await deleteTodo({
        variables: { id },
        update: cache => {
          const prevCache = cache.readQuery({ query: GET_TODOS });
          const updatedTodos = prevCache.todos.filter(todo => todo.id !== id);
          cache.writeQuery({ query: GET_TODOS, data: { todos: updatedTodos } });
        }
      });

      console.log("deleted todo", result.data.delete_todos.returning);
    } else {
      return;
    }
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
              className="pointer pa2 f4"
            />
            <label htmlFor={todo.id}>
              <span className={`pointer pa1 f4 ${todo.done && "strike"}`}>
                {todo.text}
              </span>
            </label>
            <button
              className="bg-transparent bn f4"
              onClick={() => handleDeleteTodo(todo)}
            >
              <span className="red pa1 pointer hover-bg-blue">ⅹ</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
