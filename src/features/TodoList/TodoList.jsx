import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';
function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter(
    (todo) => todo.isCompleted === false
  );
  return (
    <div>
      {isLoading ? (
        <p>Loading todo list...</p>
      ) : (
        <div>
          {filteredTodoList.length === 0 ? (
            <p>Add todo above to get started</p>
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
