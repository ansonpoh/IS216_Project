export const customSelectStyles = {
  // The main input box
  control: (base, state) => ({
    ...base,
    fontFamily: '"Gill Sans MT", "Gill Sans", Calibri, sans-serif',
    backgroundColor: "#fff",
    borderRadius: "8px",
    borderColor: state.isFocused ? "#7494ec" : "#cfd8f7",
    boxShadow: state.isFocused
      ? "0 0 0 3px rgba(116,148,236,0.25)"
      : "0 2px 8px rgba(116,148,236,0.08)",
    padding: "2px",
    transition: "all 0.2s ease",
    "&:hover": { borderColor: "#7494ec" },
    transform: state.isFocused ? "translateY(-1px)" : "translateY(0)",
    minHeight: "44px", // ensures consistent height
  }),

  // Placeholder text
  placeholder: (base) => ({
    ...base,
    color: "#64748b",
    fontSize: "0.95rem",
    fontFamily: '"Gill Sans MT", "Gill Sans", Calibri, sans-serif',
  }),

  // Selected single value
  singleValue: (base) => ({
    ...base,
    color: "#0f172a",
    fontWeight: 500,
    fontFamily: '"Gill Sans MT", "Gill Sans", Calibri, sans-serif',
  }),

  // Dropdown options
  option: (base, state) => ({
    ...base,
    fontFamily: '"Gill Sans MT", "Gill Sans", Calibri, sans-serif',
    backgroundColor: state.isFocused ? "#eef2ff" : "#fff",
    color: "#0f172a",
    cursor: "pointer",
    padding: "10px 12px",
    transition: "background 0.15s ease",
  }),

  // Dropdown arrow
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#7494ec" : "#64748b",
    transition: "color 0.2s",
    "&:hover": { color: "#7494ec" },
  }),

  // Remove separator line between input and arrow
  indicatorSeparator: () => ({ display: "none" }),

  // Dropdown menu container
  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0 8px 20px rgba(15,23,42,0.15)",
    overflow: "hidden",
    zIndex: 9999, // ensures dropdown appears above modals
  }),

  // Use portal to render menu above all other elements (e.g., modals)
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),

  // Multi-value (tags)
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#eef2ff",
    borderRadius: "4px",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "#0f172a",
    fontSize: "14px",
    fontFamily: '"Gill Sans MT", "Gill Sans", Calibri, sans-serif',
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "#666",
    "&:hover": {
      backgroundColor: "#7494ec",
      color: "#fff",
    },
  }),

  // Input text inside the dropdown
  input: (base) => ({
    ...base,
    fontFamily: '"Gill Sans MT", "Gill Sans", Calibri, sans-serif',
    fontSize: "16px",
  }),
};
