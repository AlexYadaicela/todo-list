import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import * as React from 'react';

function App() {
  const [todoList, setTodoList] = React.useState([]);

  const addTodo = (title) => {
    const newTodo = { title: `${title}`, id: Date.now(), isCompleted: false };
    setTodoList([...todoList, newTodo]);
  };

  const completeTodo = (todoID) => {
    console.log('helper function working');
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === todoID) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });

    setTodoList(updatedTodos);
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;
