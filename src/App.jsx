import { useState, useEffect } from "react";
import {
  getItemsList,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "./api/fakeApi.js";
import { ItemList } from "./components/ItemList.jsx";
import { ItemDetails } from "./components/ItemDetails.jsx";
import { ItemForm } from "./components/ItemForm.jsx";
import "./App.css";

export default function App() {
  const [items, setItems] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  const [selectedId, setSelectedId] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const [busyIds, setBusyIds] = useState([]);
  const [formMode, setFormMode] = useState(null);
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setListLoading(true);
    setListError(null);

    getItemsList("?limit=50")
      .then((res) => {
        if (!ignore) {
          setItems(res.data);
          setListLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setListError(err.message);
          setListLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [reloadCount]);

  useEffect(() => {
    if (selectedId === null) {
      setSelectedItem(null);
      setDetailError(null);
      setDetailLoading(false);
      return;
    }

    let ignore = false;
    setDetailLoading(true);
    setDetailError(null);

    getItem(selectedId)
      .then((data) => {
        if (!ignore) {
          setSelectedItem(data);
          setDetailLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setDetailError(err.message);
          setDetailLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedId, reloadCount]);

  const handleReload = () => {
    setActionError(null);
    setReloadCount((prev) => prev + 1);
  };

  const handleToggleComplete = async (item) => {
    const targetId = item.id;
    const nextCompleted = !item.completed;

    if (busyIds.includes(targetId)) return;

    setBusyIds((prev) => [...prev, targetId]);
    setActionError(null);

    try {
      const updated = await updateItem(targetId, {
        completed: nextCompleted,
        status: nextCompleted ? "Completed" : "Active",
      });

      setItems((prev) =>
        prev.map((el) => (el.id === targetId ? updated : el))
      );
      setSelectedItem((prev) =>
        prev && prev.id === targetId ? updated : prev
      );
    } catch (err) {
      setActionError(`Update failed for #${targetId}: ${err.message}`);
    } finally {
      setBusyIds((prev) => prev.filter((id) => id !== targetId));
    }
  };

  const handleDelete = async (id) => {
    const targetId = Number(id);

    if (busyIds.includes(targetId)) return;

    setBusyIds((prev) => [...prev, targetId]);
    setActionError(null);

    try {
      await deleteItem(targetId);

      setItems((prev) => prev.filter((el) => el.id !== targetId));
      setSelectedId((prev) => (prev === targetId ? null : prev));
      setSelectedItem((prev) => (prev && prev.id === targetId ? null : prev));
    } catch (err) {
      setActionError(`Delete failed for #${targetId}: ${err.message}`);
    } finally {
      setBusyIds((prev) => prev.filter((itemId) => itemId !== targetId));
    }
  };

  const handleFormSubmit = async (formData) => {
    setActionError(null);

    if (formMode === "create") {
      setIsSavingForm(true);
      try {
        const created = await createItem(formData);
        setItems((prev) => [...prev, created]);
        setSelectedId(created.id);
        setFormMode(null);
      } catch (err) {
        setActionError(`Create failed: ${err.message}`);
      } finally {
        setIsSavingForm(false);
      }
      return;
    }

    if (formMode === "edit" && selectedItem) {
      const targetId = selectedItem.id;
      if (busyIds.includes(targetId)) return;

      setIsSavingForm(true);
      setBusyIds((prev) => [...prev, targetId]);

      try {
        const updated = await updateItem(targetId, formData);
        setItems((prev) =>
          prev.map((el) => (el.id === targetId ? updated : el))
        );
        setSelectedItem((prev) =>
          prev && prev.id === targetId ? updated : prev
        );
        setFormMode(null);
      } catch (err) {
        setActionError(`Edit failed for #${targetId}: ${err.message}`);
      } finally {
        setIsSavingForm(false);
        setBusyIds((prev) => prev.filter((id) => id !== targetId));
      }
    }
  };

  return (
    <div className="app-shell">
      <header className="top-header">
        <div>
          <h1>Orbital Crew Manager</h1>
          <p>Task 4 — Async React: Effects & API</p>
        </div>
        <div className="header-controls">
          <button
            className="btn btn-primary"
            onClick={() => setFormMode("create")}
          >
            + Add Member
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleReload}
            disabled={listLoading}
          >
            {listLoading ? "Loading..." : "Reload List"}
          </button>
        </div>
      </header>

      {actionError && (
        <div className="error-banner">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)}>✕</button>
        </div>
      )}

      {formMode && (
        <ItemForm
          mode={formMode}
          initialItem={formMode === "edit" ? selectedItem : null}
          isSubmitting={isSavingForm}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormMode(null)}
        />
      )}

      <main className="workspace-grid">
        <ItemList
          items={items}
          loading={listLoading}
          error={listError}
          selectedId={selectedId}
          busyIds={busyIds}
          onSelect={setSelectedId}
          onReload={handleReload}
        />

        <ItemDetails
          selectedId={selectedId}
          item={selectedItem}
          loading={detailLoading}
          error={detailError}
          isBusy={selectedId !== null && busyIds.includes(selectedId)}
          onReload={handleReload}
          onToggleComplete={handleToggleComplete}
          onEdit={() => setFormMode("edit")}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
