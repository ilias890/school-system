import React, { useEffect, useState } from "react";

interface CRUDComponentProps<T extends { id: string }> {
  title: string;
  fields: {
    key: keyof Omit<T, "id">;
    label: string;
    type: string;
    optionsService?: {
      fetchOptions: () => Promise<{ id: string; name: string }[]>;
      idField: string;
      nameField: string;
    };
  }[];
  service: {
    readAll: () => Promise<T[]>;
    create: (data: Omit<T, "id">) => Promise<void>;
    update: (id: string, data: T) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
  getId: (item: T) => string;
  emptyItem: Omit<T, "id">;
}

const CRUDComponent = <T extends { id: string }>(props: CRUDComponentProps<T>) => {
  const { title, fields, service, getId, emptyItem } = props;

  const [items, setItems] = useState<T[]>([]);
  const [newItem, setNewItem] = useState<Omit<T, "id">>(emptyItem);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, { id: string; name: string }[]>>({});

  useEffect(() => {
    fetchItems();
    fetchDropdownOptions();
  }, []);

  const fetchItems = async () => {
    const data = await service.readAll();
    setItems(data);
  };

  const fetchDropdownOptions = async () => {
    const options: Record<string, { id: string; name: string }[]> = {};
    for (const field of fields) {
      if (field.type === "dropdown" && field.optionsService) {
        const fetchedOptions = await field.optionsService.fetchOptions();
        options[field.key as string] = fetchedOptions;
      }
    }
    setDropdownOptions(options);
  };

  const handleAddItem = async () => {
    const isValid = fields.every(({ key }) => {
      const value = newItem[key];
      if (typeof value === "string" || typeof value === "number") {
        return value !== undefined && value !== "";
      }
      return false;
    });

    if (!isValid) {
      alert("Vul alle velden in!");
      return;
    }

    await service.create(newItem);
    setNewItem(emptyItem);
    fetchItems();
  };

  const handleUpdateItem = async () => {
    if (editingItem) {
      await service.update(getId(editingItem), editingItem);
      setEditingItem(null);
      fetchItems();
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Weet je zeker dat je dit item wilt verwijderen?")) {
      await service.delete(id);
      fetchItems();
    }
  };

  return (
    <div className="container mt-5">
      <h1>{title}</h1>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Nieuw item toevoegen</h5>
          {fields.map(({ key, label, type, optionsService }) => (
            <div className="mb-3" key={String(key)}>
              <label htmlFor={String(key)} className="form-label">
                {label}
              </label>
              {type === "dropdown" && optionsService ? (
                <select
                  id={String(key)}
                  className="form-select"
                  value={newItem[key] as string}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      [key]: e.target.value,
                    })
                  }
                >
                  <option value="">Selecteer een optie</option>
                  {dropdownOptions[key as string]?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  id={String(key)}
                  className="form-control"
                  value={(newItem[key] as string) || ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      [key]: type === "number" ? +e.target.value : e.target.value,
                    })
                  }
                />
              )}
            </div>
          ))}
          <button className="btn btn-primary" onClick={handleAddItem}>
            Toevoegen
          </button>
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            {fields.map(({ key, label }) => (
              <th key={String(key)}>{label}</th>
            ))}
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={getId(item)}>
              {fields.map(({ key, type, optionsService }) => (
                <td key={String(key)}>
                  {editingItem && getId(editingItem) === getId(item) ? (
                    type === "dropdown" && optionsService ? (
                      <select
                        className="form-select"
                        value={(editingItem[key] as string) || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            [key]: e.target.value,
                          })
                        }
                      >
                        <option value="">Selecteer een optie</option>
                        {dropdownOptions[key as string]?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        className="form-control"
                        value={(editingItem[key] as string | number) || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            [key]: type === "number" ? +e.target.value : e.target.value,
                          })
                        }
                      />
                    )
                  ) : type === "dropdown" && optionsService ? (
                    dropdownOptions[key as string]?.find(
                      (option) => option.id === item[key]
                    )?.name || "N/A"
                  ) : (
                    item[key] as string | number
                  )}
                </td>
              ))}
              <td>
                {editingItem && getId(editingItem) === getId(item) ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={handleUpdateItem}
                    >
                      Opslaan
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingItem(null)}
                    >
                      Annuleren
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => setEditingItem(item)}
                    >
                      Bewerken
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteItem(getId(item))}
                    >
                      Verwijderen
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CRUDComponent;
