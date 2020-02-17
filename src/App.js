import React from "react";
import { useQuery } from "@apollo/react-hooks";
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

function App() {
  const { data, loading, error } = useQuery(GET_TODOS);

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
      <form className="mb3">
        <input className="pa2 f4" type="text" placeholder="Write your todo" />
        <button className="pa2 f4 bg-dark-blue white" type="submit">
          Create
        </button>
      </form>
      {/* Todo List */}
      <div className="flex items-center justify-center flex-column">
        {data.todos.map(todo => (
          <p key={todo.id}>
            <span className="pointer pa1 f4">{todo.text}</span>
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
