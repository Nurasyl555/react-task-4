export function ItemDetails({
  selectedId,
  item,
  loading,
  error,
  isBusy,
  onReload,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  if (selectedId === null) {
    return (
      <div className="panel state-box">
        <p>Select an item from the list to load its details.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="panel state-box">
        <div className="spinner"></div>
        <p>Loading details for item #{selectedId}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel state-box error-box">
        <p>Failed to load details: {error}</p>
        <button className="btn btn-primary" onClick={onReload}>
          Retry
        </button>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="panel">
      <div className="detail-header">
        <div>
          <h2>
            #{item.id} — {item.name}
          </h2>
          <p className="item-sub">{item.role}</p>
        </div>
        <span className={`badge ${item.completed ? "done" : "active"}`}>
          {item.status || (item.completed ? "Completed" : "Active")}
        </span>
      </div>

      <div className="fields-grid">
        <div className="field-box">
          <span>1. Role</span>
          <strong>{item.role}</strong>
        </div>
        <div className="field-box">
          <span>2. Department</span>
          <strong>{item.department}</strong>
        </div>
        <div className="field-box">
          <span>3. Location</span>
          <strong>{item.location}</strong>
        </div>
        <div className="field-box">
          <span>4. Priority</span>
          <strong>{item.priority}</strong>
        </div>
        <div className="field-box">
          <span>5. Clearance</span>
          <strong>{item.clearanceLevel}</strong>
        </div>
        <div className="field-box">
          <span>6. Efficiency</span>
          <strong>{item.efficiency}%</strong>
        </div>
        <div className="field-box full">
          <span>7. Assigned Task</span>
          <p>{item.assignedTask}</p>
        </div>
        <div className="field-box full">
          <span>8. Description</span>
          <p>{item.description}</p>
        </div>
      </div>

      <div className="actions-row">
        <button
          className="btn btn-success"
          disabled={isBusy}
          onClick={() => onToggleComplete(item)}
        >
          {isBusy
            ? "Updating..."
            : item.completed
            ? "Mark as Active"
            : "Mark as Completed"}
        </button>

        <button className="btn btn-secondary" disabled={isBusy} onClick={onEdit}>
          Edit
        </button>

        <button
          className="btn btn-danger"
          disabled={isBusy}
          onClick={() => onDelete(item.id)}
        >
          {isBusy ? "Working..." : "Remove"}
        </button>
      </div>
    </div>
  );
}
