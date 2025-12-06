import React, { useEffect, useState } from "react";
import { appwriteBackend } from "../api/appwrite-backend";
import { useAuth } from "../hooks/useAuth";

export default function TemplateEditor() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [body, setBody] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const tpls = await appwriteBackend.getTemplates();
    setTemplates(tpls);
  };

  const pick = (t) => {
    setSelected(t);
    setBody(JSON.parse(t.versions[t.versions.length - 1]).body);
  };

  const save = async () => {
    await appwriteBackend.saveTemplateEdit(selected.$id, body, user.email);
    await loadTemplates();
    alert("Saved (versioned)");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">
        Template Editor (Privileged Only)
      </h2>
      <div className="mt-3 grid grid-cols-3 gap-4">
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <ul className="space-y-2">
            {templates.map((t) => (
              <li key={t.id}>
                <button className="w-full text-left" onClick={() => pick(t)}>
                  {t.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 bg-white p-4 rounded shadow">
          {!selected && (
            <div className="text-sm text-gray-500">Select a template</div>
          )}
          {selected && (
            <div>
              <div className="text-sm text-gray-500">
                Editing: {selected.name}
              </div>
              <textarea
                className="w-full h-40 border p-2 mt-2"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <div className="mt-2">
                <button className="px-3 py-1 bg-sky-100 rounded" onClick={save}>
                  Save Version
                </button>
              </div>
              <div className="mt-4 text-xs text-gray-500">Versions:</div>
              <ul className="mt-2 text-xs">
                {selected.versions.map((v) => {
                  v = JSON.parse(v);
                  return (
                    <li key={v.v}>
                      v{v.v} • {new Date(v.createdAt).toString()} •{" "}
                      {v.editor || "system"}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
