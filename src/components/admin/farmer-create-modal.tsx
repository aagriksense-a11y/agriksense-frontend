"use client";

import { useState, type FormEvent } from "react";
import { Button, FormError, IconButton, Modal, inputClass } from "@/components/ui";
import { AdminCardHead, FormActions, FormGroup } from "@/components/admin/parts";
import { api } from "@/lib/api";

export default function FarmerCreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [role, setRole] = useState("FARMER");
  const [error, setError] = useState("");
  const isOrg = role === "ORGANIZATION";

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setError("");
    try {
      await api("/api/admin/farmers", { method: "POST", body: payload });
      onClose();
      form.reset();
      onCreated();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Modal onClose={onClose}>
      <AdminCardHead
        title="Create account"
        sub="Onboard a farmer, DCO or organization (starts as PENDING)"
        right={
          <IconButton label="Close" onClick={onClose}>
            ✕
          </IconButton>
        }
      />
      <form onSubmit={submit} className="form-grid">
        <FormGroup full label="Account type *">
          <select
            name="role"
            className={inputClass}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="FARMER">Farmer</option>
            <option value="DATA_COLLECTION_OFFICER">Data Collection Officer</option>
            <option value="ORGANIZATION">Organization</option>
          </select>
        </FormGroup>

        {/* Both branches stay mounted, like the legacy display toggles, so FormData
            always carries every field and the browser validates the right set. */}
        <div className={isOrg ? "hidden" : "contents"}>
          <FormGroup label="First name *">
            <input name="firstName" className={inputClass} required={!isOrg} />
          </FormGroup>
          <FormGroup label="Last name *">
            <input name="lastName" className={inputClass} required={!isOrg} />
          </FormGroup>
          <FormGroup label="Other name">
            <input name="otherName" className={inputClass} />
          </FormGroup>
        </div>

        <div className={isOrg ? "block" : "hidden"}>
          <FormGroup label="Organization name *">
            <input name="orgName" className={inputClass} required={isOrg} />
          </FormGroup>
          <FormGroup label="CAC number (optional)">
            <input name="cacNumber" className={inputClass} />
          </FormGroup>
        </div>

        <FormGroup label="Phone number *">
          <input name="phoneNumber" className={inputClass} required placeholder="2348012345678" />
        </FormGroup>
        <FormGroup label="Email">
          <input name="email" type="email" className={inputClass} />
        </FormGroup>
        <FormGroup label="Password *">
          <input name="password" type="password" className={inputClass} required minLength={8} />
        </FormGroup>
        <FormGroup label="State">
          <input name="state" className={inputClass} />
        </FormGroup>
        <FormGroup label="LGA">
          <input name="lga" className={inputClass} />
        </FormGroup>
        <FormGroup label="City / town">
          <input name="cityTown" className={inputClass} />
        </FormGroup>
        <FormGroup label="Address">
          <input name="address" className={inputClass} />
        </FormGroup>
        <FormGroup label="NIN (optional)">
          <input name="nin" className={inputClass} />
        </FormGroup>
        <FormActions>
          <Button type="submit">Create account</Button>
          <FormError>{error}</FormError>
        </FormActions>
      </form>
    </Modal>
  );
}
