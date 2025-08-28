import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import * as React from 'react';

function App() {
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [todoList, setTodoList] = React.useState([]);
  const [isSaving, setIsSaving] = React.useState(false);

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

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }

      const { records } = await response.json();

      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (todoID) => {
    const originalTodo = todoList.find((todo) => todo.id === todoID);

    const updatedTodos = todoList.map((todo) => {
      if (todo.id === todoID) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });

    setTodoList(updatedTodos);

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
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Reponse Status: ${response.status}`);
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

    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodos);

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
      const response = await fetch(url, options);
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

  React.useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        ...fetchOptions('GET'),
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const { records } = await response.json();
        console.log(records);
        setTodoList(
          records.map((record) => {
            const todo = {
              id: record.id,
              ...record.fields,
            };
            if (!todo.isCompleted) {
              todo.isCompleted = false;
            }
            return todo;
          })
        );
      } catch (error) {
        setErrorMessage(error.message);
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

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
      {errorMessage && (
        <div>
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
