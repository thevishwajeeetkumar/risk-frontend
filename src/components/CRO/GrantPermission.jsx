// src/components/CRO/GrantPermission.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function GrantPermission() {
  const { api, isCRO } = useAuth();
  const [userId, setUserId] = useState("");
  const [segment, setSegment] = useState("loan_intent");

  if (!isCRO) return null;

  const grant = async () => {
    try {
      await api.post("/auth/permissions", {
        user_id: Number(userId),
        permissions: [{ segment_name: segment, permission_type: "read" }],
      }, { headers: { "Content-Type": "application/json" }});
      toast.success("Permission granted");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-3">Grant Permission</h3>
      <div className="grid md:grid-cols-3 gap-3">
        <input className="border rounded px-3 py-2" placeholder="User ID"
               value={userId} onChange={(e) => setUserId(e.target.value)} />
        <select className="border rounded px-3 py-2" value={segment} onChange={(e) => setSegment(e.target.value)}>
          <option value="loan_intent">loan_intent</option>
          <option value="person_gender">person_gender</option>
          <option value="person_education">person_education</option>
          <option value="person_home_ownership">person_home_ownership</option>
          <option value="age_group">age_group</option>
        </select>
        <button onClick={grant} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Grant</button>
      </div>
    </div>
  );
}
