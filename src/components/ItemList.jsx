export function ItemList({
  items,
  loading,
  error,
  selectedId,
  busyIds,
  onSelect,
  onReload,
}) {
  if (loading) {
    return (
      <div className="panel state-box">
        <div className="spinner"></div>
        <p>Loading list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel state-box error-box">
        <p>Error: {error}</p>
        <button className="btn btn-primary" onClick={onReload}>
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="panel state-box">
        <p>List is empty.</p>
        <button className="btn btn-secondary" onClick={onReload}>
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>Crew List ({items.length})</h3>
      <ul className="items-list">
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          const isBusy = busyIds.includes(item.id);

          return (
            <li
              key={item.id}
              className={`item-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(item.id)}
            >
              <div>
                <strong>
                  #{item.id} {item.name}
                </strong>
                <p className="item-sub">{item.role}</p>
              </div>
              <span className={`badge ${item.completed ? "done" : "active"}`}>
                {isBusy ? "Saving..." : item.completed ? "Completed" : "Active"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
