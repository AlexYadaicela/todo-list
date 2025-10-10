import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';
import { useNavigate, useSearchParams } from 'react-router';
import { useEffect } from 'react';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  };

  const filteredTodoList = todoList.filter(
    (todo) => todo.isCompleted === false
  );

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = currentPage * itemsPerPage - itemsPerPage;
  console.log('this is printing', indexOfFirstTodo);
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  useEffect(() => {
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  const currentEntries = filteredTodoList.slice(
    indexOfFirstTodo,
    currentPage * itemsPerPage
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
            <div>
              <ul className={styles.ul}>
                {currentEntries.map((todo) => (
                  <TodoListItem
                    key={todo.id}
                    todo={todo}
                    onCompleteTodo={onCompleteTodo}
                    onUpdateTodo={onUpdateTodo}
                  />
                ))}
              </ul>
              <div className={styles.paginationControls}>
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TodoList;
