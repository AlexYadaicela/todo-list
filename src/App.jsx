import './App.css';
import styles from './App.module.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import { useState, useCallback, useEffect, useReducer } from 'react';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

function App() {
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  // START: REFACTOR
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // END: REFACTOR

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [queryString, sortDirection, sortField]);

  const fetchOptions = (reqType, payload) => {
    return payload
      ? {
          method: reqType,
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      : {
          method: reqType,
          headers: {
            Authorization: `${token}`,
          },
        };
  };

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      ...fetchOptions('POST', payload),
    };

    try {
      dispatch({
        type: todoActions.startRequest,
      });

      const response = await fetch(encodeUrl(), options);

      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }

      const { records } = await response.json();

      dispatch({
        type: todoActions.addTodo,
        records: records,
      });
      // END: REFACTOR
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      dispatch({
        type: todoActions.endRequest,
      });
    }
  };

  const completeTodo = async (todoID) => {
    const originalTodo = todoList.find((todo) => todo.id === todoID);

    dispatch({
      type: todoActions.completeTodo,
      todoList: todoState.todoList,
      todoID: todoID,
    });

    const payload = {
      records: [
        {
          id: todoID,
          fields: {
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      ...fetchOptions('PATCH', payload),
    };

    try {
      const response = await fetch(encodeUrl(), options);
      if (!response.ok) throw new Error(`Response Status: ${response.status}`);
    } catch (error) {
      console.error(error.message);
      setErrorMessage(`${error.message}. Reverting todo...`);
      dispatch({
        type: todoActions.revertTodo,
        originalTodo: originalTodo,
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    dispatch({
      type: todoActions.updateTodo,
      todoList: todoState.todoList,
      editedTodo: editedTodo,
    });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      ...fetchOptions('PATCH', payload),
    };

    try {
      setIsSaving(true);
      const response = await fetch(encodeUrl(), options);
      if (!response.ok) throw new Error(`Response Status ${response.status}`);
    } catch (error) {
      console.error(error.message);
      setErrorMessage(`${error.message}. Reverting todo...`);
      dispatch({
        type: todoActions.revertTodo,
        originalTodo: originalTodo,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // loads current list of todos
  useEffect(() => {
    const fetchTodos = async () => {
      // use reducer
      dispatch({
        type: todoActions.fetchTodos,
      });
      const options = {
        ...fetchOptions('GET'),
      };
      try {
        const response = await fetch(encodeUrl(), options);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const { records } = await response.json();
        // use reducer
        dispatch({
          type: todoActions.loadTodos,
          records: records,
        });
      } catch (error) {
        dispatch({
          type: todoActions.setLoadError,
          error: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [sortDirection, sortField, queryString]);

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />
      <hr />
      <TodosViewForm
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {todoState.errorMessage && (
        <div className={styles.error}>
          <hr />
          <p>{todoState.errorMessage}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: todoActions.clearError })}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
