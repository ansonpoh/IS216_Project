import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthProvider";
import Title from "../../components/ui/Title";
import modalStyles from "../../styles/Modals.module.css";
import { customSelectStyles } from "../../styles/reactSelectStyles";
import Select from "react-select";

export default function OrganiserCreateForm() {
  const nav = useNavigate();
  const { auth } = useAuth?.() || {};

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState(null);
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [org, setOrg] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const location = useLocation();
  const republishData = location.state;
  const [form, setForm] = useState({
    org_id: "",
    title: "",
    category: "",
    description: "",
    location: "",
    region: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    capacity: "",
    hours: "",
    is_published: false,
    image: null, // optional image file
  });
  
  
  const API_BASE = process.env.REACT_APP_API_URL;
  const LOCAL_BASE = "http://localhost:3001"

  
  useEffect(() => {
    const fetch_regions = async () => {
      try {
        const res = await axios.get(`${API_BASE}/events/get_all_regions`);
        const data = Array.isArray(res.data.result) ? res.data.result : [];
        setRegions(data);
      } catch (err) {
        console.error(err);
      }
    }

    const fetch_categories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/events/get_all_categories`);
        const data = Array.isArray(res.data.result) ? res.data.result : [];
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    }

    const fetch_org = async () => {
      try {
        const res = await axios.get(`${API_BASE}/orgs/get_org_by_id`, {params: {id: auth.id}})
        const data = res.data.result?.[0];
        if (data) {
          setOrg(data);
          setForm(prev => ({ ...prev, org_id: data.org_id }));
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetch_regions();
    fetch_categories();
    fetch_org();
  }, [])

  useEffect(() => {
    if(republishData?.isRepublish) {
      setForm((prev) => ({
        ...prev,
        ...republishData,
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
      }))
    }
  }, [republishData])


  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((f) => ({ ...f, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.start_date || !form.end_date)
      return "Start and end dates are required.";
    if (new Date(form.end_date) < new Date(form.start_date))
      return "End date cannot be earlier than start date.";
    if (!form.start_time || !form.end_time)
      return "Start and end times are required.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr("");
    setSaving(true);

    try {
      await axios.post(`${API_BASE}/events/create_event`, form)
        .then((res) => {
          const data = res.data;
          if (data.status) {
            // Show success modal instead of alert
            setShowSuccessModal(true);
          } else {
            // Keep failure alert behavior for now
            alert("Event creation failed!");
            window.location.reload();
          }
        });
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to create event.");
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    nav("/organiser/dashboard");
  };
  
  const categoryOptions = categories.map(c => ({ value: c.category, label: c.category }));
  const regionOptions = regions.map(r => ({ value: r.region, label: r.region }));
  const handleSelectChange = (name) => (option) => {
  setForm(f => ({ ...f, [name]: option ? option.value : "" }));
};

   return (
    <>
      <Navbar />
      <div className="container py-4">
        <Title text="Create Event" size="56px" align="left" mb={12} />
        {err && <div className="alert alert-danger">{err}</div>}

        <form className="card p-3" onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label">Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Category *</label>
              <Select
                name="category"
                value={categoryOptions.find(opt => opt.value === form.category) || null}
                onChange={handleSelectChange("category")}
                options={categoryOptions}
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                placeholder="Select Category"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Region *</label>
              <Select
                name="region"
                value={regionOptions.find(opt => opt.value === form.region) || null}
                onChange={handleSelectChange("region")}
                options={regionOptions}
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                placeholder="Select Region"
              />
            </div>

            {/* Start / End Date */}
            <div className="col-md-6">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={onChange}
                className="form-control"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={onChange}
                className="form-control"
                required
                min={form.start_date || new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Start / End Time */}
            <div className="col-md-6">
              <label className="form-label">Start Time *</label>
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">End Time *</label>
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>

            {/* Remaining form fields... */}
          </div>

          <div className="mt-3 d-flex gap-2">
            <button
              type="submit"
              className="btn"
              style={{ background: '#7494ec', borderColor: '#7494ec', color: '#fff' }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Create Event"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => nav("/organiser/dashboard")}
              disabled={saving}
            >
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div
          className={modalStyles.overlay}
          onClick={() => handleSuccessOk()}
        >
          <div
            className={modalStyles.dialog}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={modalStyles.icon} style={{ color: "green" }}>✓</div>
            <div className={modalStyles.title}>Event Created Successfully!</div>
            <div className={modalStyles.body}>Your event is now live in your dashboard.</div>
            <div className={modalStyles.buttons}>
              <button className={modalStyles.btnPrimary} onClick={handleSuccessOk}>OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}