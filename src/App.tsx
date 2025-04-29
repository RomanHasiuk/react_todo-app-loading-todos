/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const loadTodos = async () => {
      setIsLoading(true);
      setIsErrorHidden(true);

      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');
        setIsErrorHidden(false);
        setTimeout(() => setIsErrorHidden(true), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilter(newFilter);
  };

  const closeError = () => {
    setIsErrorHidden(true);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${
              activeTodosCount === 0 ? 'active' : ''
            }`}
            data-cy="ToggleAllButton"
          />

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
            />
          </form>
        </header>

        {isLoading && (
          <div className="todoapp__loading">
            <div className="loader" />
          </div>
        )}

        {!isLoading && todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <div
                  data-cy="Todo"
                  className={`todo ${todo.completed ? 'completed' : ''}`}
                  key={todo.id}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      readOnly
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay">
                    {/* eslint-disable-next-line max-len */}
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              ))}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${activeTodosCount} item${activeTodosCount !== 1 ? 's' : ''} left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={`filter__link ${
                    filter === 'all' ? 'selected' : ''
                  }`}
                  data-cy="FilterLinkAll"
                  onClick={() => handleFilterChange('all')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={`filter__link ${
                    filter === 'active' ? 'selected' : ''
                  }`}
                  data-cy="FilterLinkActive"
                  onClick={() => handleFilterChange('active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={`filter__link ${
                    filter === 'completed' ? 'selected' : ''
                  }`}
                  data-cy="FilterLinkCompleted"
                  onClick={() => handleFilterChange('completed')}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={completedTodosCount === 0}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          isErrorHidden ? 'hidden' : ''
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
