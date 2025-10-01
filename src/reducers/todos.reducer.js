const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.loadTodos: {
      const mappedTodos = action.records.map((record) => {
        const todo = {
          id: record.id,
          ...record.fields,
        };
        if (!todo.isCompleted) {
          todo.isCompleted = false;
        }
        return todo;
      });
      return {
        ...state,
        todoList: mappedTodos,
        isLoading: false,
      };
    }
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error,
        isLoading: false,
      };
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };
    case actions.addTodo: {
      const savedTodo = {
        id: action.records[0].id,
        ...action.records[0].fields,
      };

      if (!action.records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }
    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };
    case actions.updateTodo: {
      const updatedTodos = action.todoList.map((todo) => {
        if (todo.id === action.editedTodo.id) {
          return { ...action.editedTodo };
        } else {
          return todo;
        }
      });

      return {
        ...state,
        todoList: updatedTodos,
      };
    }
    case actions.completeTodo: {
      const updatedTodos = action.todoList.map((todo) => {
        if (todo.id === action.todoID) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      });

      return {
        ...state,
        todoList: updatedTodos,
      };
    }
    case actions.revertTodo: {
      const revertedTodos = action.todoList.map((todo) => {
        if (todo.id === action.originalTodo.id) {
          return action.originalTodo;
        }
        return todo;
      });

      return {
        ...state,
        todoList: revertedTodos,
      };
    }
    case actions.clearError:
      return {
        ...state,
      };
  }
}

export { initialState, actions, reducer };
