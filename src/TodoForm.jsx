import * as React from 'react';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = React.useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    onAddTodo(title);
    event.target.title.value = '';
    todoTitleInput.current.focus();
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input ref={todoTitleInput} type="text" name="title" id="todoTitle" />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
