import styled from 'styled-components';
import { useState, useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

const StyledButton = styled.button`
  &:disabled {
    font-style: italic;
  }
`;
const StyledForm = styled.form`
  padding-block: 0.5rem;
`;

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
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        ref={todoTitleInput}
        onChange={(event) => {
          setWorkingTodo(event.target.value);
        }}
      />
      <StyledButton type="submit" disabled={!workingTodoTitle}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
