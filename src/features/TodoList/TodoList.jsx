import TodoListItem from './TodoListItem';
function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter(
    (todo) => todo.isCompleted === false
  );
  return (
    <div>
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <div>
          {isLoading ? (
            <p>Todo list loading...</p>
          ) : (
            <ul>
              {filteredTodoList.map((todo) => (
                <TodoListItem
                  key={todo.id}
                  todo={todo}
                  onCompleteTodo={onCompleteTodo}
                  onUpdateTodo={onUpdateTodo}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default TodoList;
