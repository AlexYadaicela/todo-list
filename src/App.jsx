import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import * as React from 'react';

function App() {
  const [newTodo, setNewTodo] = React.useState('Learning React State');
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList />
    </div>
  );
}

export default App;
