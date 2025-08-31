function TodosViewForm({
  sortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const preventRefresh = (e) => {
    e.preventDeafult();
  };
  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label htmlFor="search">Search todos:</label>
        <input
          type="text"
          id="search"
          value={queryString}
          onChange={(e) => {
            setQueryString(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="sortBy">Sort by</label>
        <select
          name=""
          id="sortBy"
          value={sortField}
          onChange={(e) => {
            setSortField(e.target.value);
          }}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>
        {/* Select using direction */}
        <label htmlFor="sortDir">Direction</label>
        <select
          name=""
          id="sortDir"
          onChange={(e) => {
            sortDirection(e.target.value);
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm;
