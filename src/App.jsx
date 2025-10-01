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

  // this was moved to reducer file
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

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
    console.log(newTodo);

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

    console.log(payload);

    const options = {
      ...fetchOptions('POST', payload),
    };

    console.log(options);

    try {
      setIsSaving(true);

      const response = await fetch(encodeUrl(), options);

      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }

      const { records } = await response.json();

      // this was moved to reducer
      // const savedTodo = {
      //   id: records[0].id,
      //   ...records[0].fields,
      // };

      // if (!records[0].fields.isCompleted) {
      //   savedTodo.isCompleted = false;
      // }

      dispatch({
        type: todoActions.setTodoList,
        records,
      });

      // setTodoList([...todoList, savedTodo]);
    } catch (error) {
      dispatch({
        type: todoActions.setLoadError,
        errorMessage: error.message,
      });
      // setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (todoID) => {
    const originalTodo = todoList.find((todo) => todo.id === todoID);

    // this was moved to reducer

    const updatedTodos = todoList.map((todo) => {
      if (todo.id === todoID) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });

    dispatch({
      type: todoActions.loadTodos,
    });
    setTodoList(action.id);

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
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return originalTodo;
        }
        return todo;
      });
      setTodoList(revertedTodos);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    // this was moved to reducer
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return todo;
      }
    });
    setTodoList(action.updatedTodos);

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
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return originalTodo;
        }
        return todo;
      });
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      // setIsLoading(true);
      const options = {
        ...fetchOptions('GET'),
      };

      try {
        const response = await fetch(encodeUrl(), options);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const { records } = await response.json();
        console.log(records);
        // move into a todo
        const todo = action.records.map((record) => {
          const todo = {
            todoList: todo,
            isLoading: false,
            id: record.id,
            ...record.fields,
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });

        setTodoList(todo);
      } catch (error) {
        setErrorMessage(error.message);
        console.error(error.message);
      } finally {
        dispatch({
          type: todoActions.fetchTodos,
        });
      }
    };

    fetchTodos();
  }, [sortDirection, sortField, queryString]);

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      <hr />
      <TodosViewForm
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {errorMessage && (
        <div className={styles.error}>
          <hr />
          <p>{errorMessage}</p>
          <button type="button" onClick={() => setErrorMessage('')}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
