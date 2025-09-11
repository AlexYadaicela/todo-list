import { useState, useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodo] = useState('');
  const todoTitleInput = useRef();

  const handleAddTodo = (event) => {
    console.log(workingTodoTitle);
    event.preventDefault();
    onAddTodo({
      title: workingTodoTitle,
      isCompleted: false,
    });
    setWorkingTodo('');
    todoTitleInput.current.focus();
  };

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        ref={todoTitleInput}
        onChange={(event) => {
          setWorkingTodo(event.target.value);
        }}
      />
      <button type="submit" disabled={!workingTodoTitle}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
}

export default TodoForm;
