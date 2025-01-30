import { useState, useEffect } from "react";
import "./TodoApp.css";

const TodoApp = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categories] = useState([
    "Pessoal",
    "Trabalho",
    "Estudos",
    "Compras",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState("");
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [todoToDelete, setTodoToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      inputValue.trim() !== "" &&
      (!dueDate || new Date(dueDate) >= new Date())
    ) {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        isCompleted: false,
        isEditing: false,
        category: selectedCategory,
        priority: priority,
        dueDate: dueDate ? new Date(dueDate + "T00:00:00") : null,
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInputValue("");
      setSelectedCategory("");
      setPriority("normal");
      setDueDate("");
    } else {
      alert("Por favor, selecione uma data futura.");
    }
  };

  const handleDelete = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    setTodoToDelete(null);
  };

  const handleEdit = (id, newText, newCategory, newPriority, newDueDate) => {
    if (!newDueDate || new Date(newDueDate) >= new Date()) {
      const adjustedDueDate = newDueDate
        ? new Date(newDueDate + "T00:00:00")
        : null;
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                text: newText,
                category: newCategory,
                priority: newPriority,
                dueDate: adjustedDueDate,
                isEditing: false,
              }
            : todo
        )
      );
      setTodoToEdit(null);
    } else {
      alert("Por favor, selecione uma data futura.");
    }
  };

  const toggleEditMode = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const toggleComplete = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "completed") return todo.isCompleted;
      if (filter === "pending") return !todo.isCompleted;
      return true;
    })
    .filter((todo) =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.text.localeCompare(b.text);
      return b.text.localeCompare(a.text);
    });

  return (
    <main className="app-container">
      <header>
        <h1 className="title">Lista de Tarefas</h1>
      </header>

      <section aria-labelledby="add-task-section">
        <h2 id="add-task-section" className="visually-hidden">
          Adicionar Tarefa
        </h2>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            className="input-field"
            placeholder="Adicione uma tarefa..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label="Adicione uma nova tarefa"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
            aria-label="Selecione uma categoria"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="priority-select"
            aria-label="Selecione a prioridade"
          >
            <option value="low">Baixa</option>
            <option value="normal">Normal</option>
            <option value="high">Alta</option>
          </select>
          <input
            type="date"
            className="due-date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Selecione a data de término"
            min={new Date().toISOString().split("T")[0]}
            max="9999-12-31"
          />
          <button type="submit" className="add-button">
            Adicionar
          </button>
        </form>
      </section>

      <section aria-labelledby="filter-section">
        <h2 id="filter-section" className="visually-hidden">
          Filtros
        </h2>
        <div className="filters">
          <button
            className={`filter-button ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>
          <button
            className={`filter-button ${
              filter === "completed" ? "active" : ""
            }`}
            onClick={() => setFilter("completed")}
          >
            Concluídas
          </button>
          <button
            className={`filter-button ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pendentes
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Pesquisar tarefas"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
            aria-label="Ordenar tarefas"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </section>

      <section aria-labelledby="task-list-section">
        <h2 id="task-list-section" className="visually-hidden">
          Lista de Tarefas
        </h2>
        {filteredTodos.length === 0 ? (
          <p className="empty-state">Nenhuma tarefa encontrada</p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${
                  todo.isCompleted ? "completed" : "pending"
                }`}
              >
                {todo.isEditing ? (
                  <div className="edit-container">
                    <input
                      type="text"
                      className="edit-input"
                      defaultValue={todo.text}
                      onChange={(e) => setInputValue(e.target.value)}
                      aria-label={`Editando tarefa ${todo.text}`}
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="category-select"
                      aria-label="Selecione uma categoria"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="priority-select"
                      aria-label="Selecione a prioridade"
                    >
                      <option value="low">Baixa</option>
                      <option value="normal">Normal</option>
                      <option value="high">Alta</option>
                    </select>
                    <input
                      type="date"
                      className="due-date-input"
                      value={
                        todo.dueDate
                          ? new Date(todo.dueDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => setDueDate(e.target.value)}
                      aria-label="Selecione a data de término"
                      min={new Date().toISOString().split("T")[0]}
                      max="9999-12-31"
                    />
                    <button
                      className="confirm-button"
                      onClick={() =>
                        handleEdit(
                          todo.id,
                          inputValue,
                          selectedCategory,
                          priority,
                          dueDate
                        )
                      }
                    >
                      Confirmar
                    </button>
                  </div>
                ) : (
                  <div>
                    <span
                      className={`todo-text ${
                        todo.isCompleted ? "completed-text" : ""
                      }`}
                      onClick={() => toggleComplete(todo.id)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${
                        todo.isCompleted
                          ? `Desmarcar tarefa ${todo.text} como concluída`
                          : `Marcar tarefa ${todo.text} como concluída`
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div className="todo-details">
                      <span className="todo-category">
                        Categoria: {todo.category}
                      </span>
                      <span className="todo-priority">
                        Prioridade:{" "}
                        {todo.priority === "low"
                          ? "Baixa"
                          : todo.priority === "normal"
                          ? "Normal"
                          : "Alta"}
                      </span>
                      <span className="todo-due-date">
                        Data de Término:{" "}
                        {todo.dueDate
                          ? new Date(todo.dueDate).toLocaleDateString("pt-BR")
                          : "Sem data"}
                      </span>
                    </div>
                  </div>
                )}
                <div className="actions">
                  <button
                    className="edit-button"
                    onClick={() => toggleEditMode(todo.id)}
                    aria-label={`Editar tarefa ${todo.text}`}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => setTodoToDelete(todo.id)}
                    aria-label={`Excluir tarefa ${todo.text}`}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {todoToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir esta tarefa?</p>
            <div className="modal-actions">
              <button
                className="modal-button cancel"
                onClick={() => setTodoToDelete(null)}
              >
                Cancelar
              </button>
              <button
                className="modal-button delete"
                onClick={() => handleDelete(todoToDelete)}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TodoApp;
