import * as React from 'react';
function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodo] = React.useState('');
  const todoTitleInput = React.useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodo('');
    todoTitleInput.current.focus();
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        ref={todoTitleInput}
        type="text"
        value={workingTodoTitle}
        name="title"
        id="todoTitle"
        onChange={(event) => {
          setWorkingTodo(event.target.value);
        }}
      />
      <button type="submit" disabled={!workingTodoTitle}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
