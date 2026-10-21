import { useState, useEffect } from "react";

const INITIAL_FORM = {
  name: "",
  role: "Guardian",
  department: "Orbital Defense",
  location: "Sector 7-G",
  priority: "Medium",
  clearanceLevel: "Level 3 - Beta",
  efficiency: 90,
  assignedTask: "",
  description: "",
};

export function ItemForm({ mode, initialItem, isSubmitting, onSubmit, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (mode === "edit" && initialItem) {
      setForm({
        name: initialItem.name || "",
        role: initialItem.role || "",
        department: initialItem.department || "",
        location: initialItem.location || "",
        priority: initialItem.priority || "Medium",
        clearanceLevel: initialItem.clearanceLevel || "Level 3 - Beta",
        efficiency: initialItem.efficiency ?? 90,
        assignedTask: initialItem.assignedTask || "",
        description: initialItem.description || "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [mode, initialItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "efficiency" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return;
    onSubmit(form);
  };

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <h3>{mode === "edit" ? "Edit Crew Member" : "New Crew Member"}</h3>

      <div className="form-grid">
        <input
          name="name"
          placeholder="Name *"
          value={form.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="number"
          name="efficiency"
          placeholder="Efficiency %"
          value={form.efficiency}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <input
          className="full"
          name="assignedTask"
          placeholder="Assigned Task *"
          value={form.assignedTask}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        <textarea
          className="full"
          name="description"
          placeholder="Description *"
          rows="2"
          value={form.description}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="actions-row">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
