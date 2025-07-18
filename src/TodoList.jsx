function TodoList() {
  const todos = [
    { id: 1, title: 'review resources' },
    { id: 2, title: 'take notes' },
    { id: 3, title: 'code out app' },
  ];
  return (
    <ul>
      {todos.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}

export default TodoList;
