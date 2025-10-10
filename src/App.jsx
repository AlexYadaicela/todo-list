import './App.css';
import styles from './App.module.css';
import Header from './shared/Header';
import TodosPage from './pages/TodosPage';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { useState, useCallback, useEffect, useReducer } from 'react';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';
import { Route, Routes, useLocation } from 'react-router';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

function usePageViews({ setTitle }) {
  const location = useLocation();
  useEffect(() => {
    console.log(location.pathname);
    switch (location.pathname) {
      case '/':
        setTitle('Todo List');
        break;
      case '/about':
        setTitle('About');
        break;
      default:
        setTitle('Not Found');
    }
  }, [location]);
}
function App() {
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [title, setTitle] = useState('My Todos');

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
    } catch (error) {
      console.error(error);
      dispatch({
        type: todoActions.setLoadError,
        error: error,
      });
    } finally {
      dispatch({
        type: todoActions.endRequest,
      });
    }
  };

  const completeTodo = async (todoID) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === todoID);

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
      dispatch({
        type: todoActions.setLoadError,
        error: error,
      });
      // setErrorMessage(`${error.message}. Reverting todo...`);
      dispatch({
        type: todoActions.revertTodo,
        todoList: todoState.todoList,
        originalTodo: originalTodo,
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === editedTodo.id
    );

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
      dispatch({
        type: todoActions.startRequest,
      });
      const response = await fetch(encodeUrl(), options);
      if (!response.ok) throw new Error(`Response Status ${response.status}`);
    } catch (error) {
      console.error(error.message);
      dispatch({
        type: todoActions.setLoadError,
        error: error,
      });
      dispatch({
        type: todoActions.revertTodo,
        todoList: todoState.todoList,
        originalTodo: originalTodo,
      });
    } finally {
      dispatch({
        type: todoActions.endRequest,
      });
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
          error: error,
        });
      } finally {
        dispatch({
          type: todoActions.endRequest,
        });
      }
    };

    fetchTodos();
  }, [sortDirection, sortField, queryString]);

  usePageViews({ setTitle });
  return (
    <div className={styles.main}>
      {/* replaced with component header */}
      <Header title={title} />
      {/* replaced with component TodosPage */}
      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              addTodo={addTodo}
              todoState={todoState}
              completeTodo={completeTodo}
              updateTodo={updateTodo}
              setSortDirection={setSortDirection}
              sortField={sortField}
              setSortField={setSortField}
              queryString={queryString}
              setQueryString={setQueryString}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

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
