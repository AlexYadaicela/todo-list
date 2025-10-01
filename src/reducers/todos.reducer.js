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
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };
    case actions.loadTodos:
      return {
        ...state,
      };
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.errorMessage,
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
      //   if (!records[0].fields.isCompleted) {
      //     savedTodo.isCompleted = false;
      //   }
      //   };
      return {
        ...state,
        todoList: {
          newArr: [...state.todoList, savedTodo],
        },
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
      const updatedTodos = todoList.map((todo) => {
        if (todo.id === editedTodo.id) {
          return { ...editedTodo };
        } else {
          return todo;
        }
      });

      const updatedState = {
        ...state,
        ...updatedTodos,
      };
      return {
        ...state,
        updatedState,
      };
    }
    case actions.completeTodo: {
      const updatedTodos = todoList.map((todo) => {
        if (action.todo.id === todoID) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      });
      return {
        ...state,
        todoList: {
          ...updatedTodos,
        },
      };
    }
    case actions.revertTodo: {
      const revertedTodos = todoList.map((todo) => {
        if (action.todo.id === originalTodo.id) {
          return originalTodo;
        }
        return todo;
      });
      return {
        ...state,
        todoList: {
          ...revertedTodos,
        },
      };
    }
    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };
  }
}

export { initialState, actions };
