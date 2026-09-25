"use client";

import { useState, type FormEvent } from "react";
import { Button, FormError, IconButton, Modal, inputClass } from "@/components/ui";
import { AdminCardHead, FormActions, FormGroup } from "@/components/admin/parts";
import { api } from "@/lib/api";

export type FarmOption = { id: string; name: string; farmer: string; state: string | null };
export type DcoOption = { id: string; fullName: string; state: string | null };

function ModalHead(title: string, sub: string, onClose: () => void) {
  return (
    <AdminCardHead
      title={title}
      sub={sub}
      right={
        <IconButton label="Close" onClick={onClose}>
          ✕
        </IconButton>
      }
    />
  );
}

export function PlotModal({
  farms,
  onClose,
  onRegistered,
}: {
  farms: FarmOption[];
  onClose: () => void;
  onRegistered: () => void;
}) {
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setError("");
    try {
      await api("/api/admin/plots", { method: "POST", body: payload });
      onClose();
      form.reset();
      onRegistered();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Modal onClose={onClose}>
      {ModalHead("Register plot", "Add a plot under an existing farm", onClose)}
      <form onSubmit={submit} className="form-grid">
        <FormGroup full label="Farm *">
          <select name="farmId" className={inputClass} required>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} — {f.farmer}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup label="Plot name *">
          <input name="name" className={inputClass} required placeholder="e.g. AY - North field" />
        </FormGroup>
        <FormGroup label="Crop *">
          <input name="crop" className={inputClass} required placeholder="Maize" />
        </FormGroup>
        <FormGroup label="Area (ha)">
          <input name="areaHa" type="number" step="0.1" className={inputClass} />
        </FormGroup>
        <FormGroup label="Season">
          <input name="season" className={inputClass} placeholder="2026 Wet" />
        </FormGroup>
        <FormGroup label="Cluster">
          <input name="cluster" className={inputClass} placeholder="Maize belt" />
        </FormGroup>
        <FormGroup label="Soil moisture (%)">
          <input name="soilMoisture" type="number" step="1" className={inputClass} />
        </FormGroup>
        <FormGroup label="Stress level">
          <select name="stressLevel" className={inputClass}>
            <option value="">—</option>
            <option>Low</option>
            <option>Watch</option>
            <option>High</option>
          </select>
        </FormGroup>
        <FormGroup label="Latitude (optional)">
          <input name="lat" type="number" step="any" className={inputClass} />
        </FormGroup>
        <FormGroup label="Longitude (optional)">
          <input name="lng" type="number" step="any" className={inputClass} />
        </FormGroup>
        <FormActions>
          <Button type="submit">Register plot</Button>
          <FormError>{error}</FormError>
        </FormActions>
      </form>
    </Modal>
  );
}

export function AssignModal({
  farms,
  dcos,
  onClose,
}: {
  farms: FarmOption[];
  dcos: DcoOption[];
  onClose: () => void;
}) {
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      dcoUserId: fd.get("dcoUserId"),
      note: fd.get("note"),
      farmIds: fd.getAll("farmIds"),
    };
    setError("");
    try {
      await api("/api/admin/assignments", { method: "POST", body: payload });
      onClose();
      form.reset();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Modal onClose={onClose}>
      {ModalHead("Assign farms to DCO", "Select a DCO and farms for the next field visit", onClose)}
      <form onSubmit={submit} className="form-grid">
        <FormGroup full label="Data Collection Officer *">
          <select name="dcoUserId" className={inputClass} required>
            {dcos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName} — {d.state || ""}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup full label="Farms *">
          <select
            name="farmIds"
            multiple
            required
            className={`${inputClass} h-[140px] p-2 [&_option]:rounded-md [&_option]:px-2 [&_option]:py-1.5`}
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} — {f.state}
              </option>
            ))}
          </select>
          <small className="text-[#889189]">Ctrl / Cmd + click to select multiple</small>
        </FormGroup>
        <FormGroup full label="Note (optional)">
          <input name="note" className={inputClass} />
        </FormGroup>
        <FormActions>
          <Button type="submit">Assign farms</Button>
          <FormError>{error}</FormError>
        </FormActions>
      </form>
    </Modal>
  );
}
