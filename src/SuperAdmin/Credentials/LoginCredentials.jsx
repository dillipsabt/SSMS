import { CalendarDays, MoreVertical, Pencil, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

const initialCredentials = [
  {
    date: "02/01/2026",
    schoolName: "Chaitanya School",
    schoolCode: "Code-001",
    adminName: "Naresh Kumar",
    userName: "chaitanyaschool",
    password: "chaitanya_2006",
    phone: "9876543210",
    email: "chatinay@gmail.com",
  },
  {
    date: "02/01/2026",
    schoolName: "E-Technol School",
    schoolCode: "Code-002",
    adminName: "Reena Singh",
    userName: "etechnoschool",
    password: "etechno_2026",
    phone: "8765231011",
    email: "etechno@gmail.com",
  },
  {
    date: "02/01/2026",
    schoolName: "Narayana School",
    schoolCode: "Code-003",
    adminName: "Akshay",
    userName: "narayanaschool",
    password: "narayana_2026",
    phone: "9817263540",
    email: "narayana@gmail.com",
  },
  {
    date: "02/01/2026",
    schoolName: "Edify School",
    schoolCode: "Code-004",
    adminName: "Kumar Yadav",
    userName: "edifyschool",
    password: "edify_2026",
    phone: "8901726354",
    email: "edify@gmail.com",
  },
];

const emptyForm = {
  adminName: "",
  schoolName: "",
  userName: "",
  schoolCode: "",
  password: "",
  confirmPassword: "",
  phone: "",
  email: "",
};

const fields = [
  ["Admin Name", "adminName"],
  ["User Name", "userName"],
  ["Password", "password", "password"],
  ["Confirm Password", "confirmPassword", "password"],
  ["School Name", "schoolName"],
  ["School Code", "schoolCode"],
  ["Phone No.", "phone", "tel"],
  ["Email Id", "email", "email"],
];

export default function LoginCredentials() {
  const [form, setForm] = useState(emptyForm);
  const [credentials, setCredentials] = useState(initialCredentials);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  const onChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const save = (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) return;

    const entry = {
      ...form,
      date: editingIndex === null ? new Date().toLocaleDateString("en-GB") : credentials[editingIndex].date,
    };

    setCredentials((current) => {
      if (editingIndex === null) return [...current, entry];
      return current.map((item, index) => (index === editingIndex ? entry : item));
    });
    setForm(emptyForm);
    setEditingIndex(null);
  };

  const edit = (index) => {
    const item = credentials[index];
    setForm({ ...item, confirmPassword: item.password });
    setEditingIndex(index);
    setOpenMenu(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = (index) => {
    setCredentials((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setOpenMenu(null);
  };

  const visibleCredentials = credentials.filter((item) => {
    const matchesSearch = `${item.schoolName} ${item.schoolCode}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (!date || item.date === date);
  });

  return (
    <div className="sa-page">
      <h1>Login Credentials</h1>
      <p className="sa-breadcrumb">Home / Login Credentials</p>

      <form onSubmit={save}>
        <section className="sa-card sa-form-card">
          <h2>{editingIndex === null ? "Add Login Credentials" : "Edit Login Credentials"}</h2>
          <div className="sa-fields">
            {fields.map(([label, name, type = "text"]) => (
              <label className="sa-field" key={name}>
                <span>{label}</span>
                <input name={name} type={type} value={form[name]} onChange={onChange} required />
              </label>
            ))}
          </div>
          <div className="sa-form-actions">
            {editingIndex !== null && (
              <button type="button" className="sa-secondary-button" onClick={() => { setForm(emptyForm); setEditingIndex(null); }}>
                <X size={18} /> Cancel
              </button>
            )}
            <button className="sa-primary-button" type="submit"><Save size={19} /> Save</button>
          </div>
        </section>
      </form>

      <section className="sa-card sa-list-card">
        <h2>Login Credentials Lists</h2>
        <div className="sa-list-tools">
          <input placeholder="Search School Name" value={search} onChange={(event) => setSearch(event.target.value)} />
          <label>
            <input placeholder="dd/mm/yyyy" value={date} onChange={(event) => setDate(event.target.value)} />
            <CalendarDays size={20} />
          </label>
        </div>

        <div className="sa-table-wrap">
          <table>
            <thead>
              <tr>{["S.No.", "Date", "School Name", "School Code", "Admin Name", "User Name", "Password", "Confirm Password", "Phone No.", "Email ID", "Action"].map((header) => <th key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {visibleCredentials.map((item, index) => (
                <tr key={`${item.schoolCode}-${item.userName}`}>
                  <td>{index + 1}</td><td>{item.date}</td><td>{item.schoolName}</td><td>{item.schoolCode}</td><td>{item.adminName}</td><td>{item.userName}</td><td>{item.password}</td><td>{item.password}</td><td>{item.phone}</td><td>{item.email}</td>
                  <td className="sa-action-cell">
                    <button aria-label={`Actions for ${item.schoolName}`} onClick={() => setOpenMenu(openMenu === index ? null : index)}><MoreVertical /></button>
                    {openMenu === index && <div className="sa-row-menu"><button onClick={() => edit(index)}><Pencil size={18} /> Edit</button><button className="danger" onClick={() => remove(index)}><Trash2 size={18} /> Delete</button></div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sa-pagination"><button disabled>Prev</button><button className="active" disabled>Next</button><span>Page: 1 of 1</span><select defaultValue="10" aria-label="Rows per page"><option>10</option></select></div>
      </section>
    </div>
  );
}
