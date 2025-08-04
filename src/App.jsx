import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import * as React from 'react';

function App() {
  const [todoList, setTodoList] = React.useState([]);

  const addTodo = (title) => {
    const newTodo = { title: `${title}`, id: Date.now() };
    setTodoList([...todoList, newTodo]);
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
