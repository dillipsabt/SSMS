import {
  Eye,
  MoreVertical,
  Pencil,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import {
  clearError,
  clearSuccess,
  deleteSuperAdminSchoolAsync,
  fetchSuperAdminSchoolsAsync,
} from "../../features/SuperAdmin/Schools/superAdminSchoolSlice";
import useToastMessage from "../../utils/useToastMessage";

const getSchoolLogoUrl = (school) => {
  const schoolId = school?.id ?? school?.schoolId;
  const apiBaseUrl = import.meta.env.VITE_SUPER_ADMIN_API_BASE_URL?.trim();

  if (schoolId && apiBaseUrl) {
    return `${apiBaseUrl.replace(/\/$/, "")}/master/school/media/${schoolId}/logo`;
  }

  return school?.schoolLogoUrl || "";
};

const detailGroups = [
  [
    "School Information",
    [
      ["School Name", "schoolName"],
      ["School Code", "schoolCode"],
      ["Branch Name", "branchName"],
      ["School Type", "schoolType"],
      ["School Website", "website"],
      ["Number of Students", "numberOfStudents"],
      ["Number of Teachers", "numberOfTeachers"],
      ["School Logo URL", "schoolLogoUrl"],
    ],
  ],
  [
    "Contact Information",
    [
      ["Contact Person Name", "contactPersonName"],
      ["Designation", "designation"],
      ["Phone No", "phoneNumber"],
      ["Alternate Phone No", "alternatePhoneNumber"],
      ["Email", "email"],
      ["Alternate Email", "alternateEmail"],
    ],
  ],
  [
    "Address",
    [
      ["Address", "address"],
      ["Country ID", "countryId"],
      ["State ID", "stateId"],
      ["City ID", "cityId"],
      ["Pin code", "pinCode"],
    ],
  ],
  [
    "Tenant Details",
    [
      ["Sub Domain Name", "subdomain"],
      ["Tenant Status", "tenantStatus"],
      ["Subscription Plan", "subscriptionPlan"],
      ["Billing Cycle", "billingCycle"],
    ],
  ],
  [
    "Settings",
    [
      ["Online Payment", "onlinePaymentEnabled"],
      ["Payment Gateway", "paymentGatewayType"],
      ["Academic Year", "academicYear"],
      ["Time Zone", "timeZone"],
      ["Curriculum", "curriculum"],
      ["Two Factor Authentication", "twoFactorAuthentication"],
    ],
  ],
];

export default function SchoolDetailsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    schools,
    page,
    size,
    totalPages,
    totalElements,
    loading,
    success,
    error,
    successMessage,
  } = useSelector((state) => state.superAdminSchools);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [openMenu, setOpenMenu] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const query = useMemo(
    () => ({
      page: currentPage,
      size: rowsPerPage,
      search: search || undefined,
    }),
    [currentPage, rowsPerPage, search]
  );

  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(fetchSuperAdminSchoolsAsync(query)),
      search ? 300 : 0
    );

    return () => clearTimeout(timer);
  }, [dispatch, query, search]);

  useToastMessage({
    success,
    error,
    successMessage,
    clearSuccess,
    clearError,
    onSuccess: () => dispatch(fetchSuperAdminSchoolsAsync(query)),
  });

  const confirmDelete = () => {
    const id = deleting?.id ?? deleting?.schoolId;

    if (id !== undefined) {
      dispatch(deleteSuperAdminSchoolAsync(id));
    }

    setDeleting(null);
  };

  return (
    <div className="sa-page">
      <h1>School Details Lists</h1>

      <p className="sa-breadcrumb">
        Home / School Details Lists
      </p>

      <section className="sa-card sa-list-card">
        <h2>School Detail Lists</h2>

        <div className="sa-list-tools">
          <input
            placeholder="Search School Name/code"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />

          <button
            className="sa-link-button"
            type="button"
            aria-label="Refresh schools"
            onClick={() => dispatch(fetchSuperAdminSchoolsAsync(query))}
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="sa-table-wrap">
          <table>
            <thead>
              <tr>
                <th>S.No.</th>

                <th>Created Date</th>

                <th>
                  <button
                    type="button"
                    onClick={() => changeSort("schoolName")}
                  >
                    School Name
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    onClick={() => changeSort("schoolCode")}
                  >
                    School Code
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    onClick={() => changeSort("branchName")}
                  >
                    Branch Name
                  </button>
                </th>

                <th>School Logo</th>
                <th>School Types</th>
                <th>Phone No.</th>
                <th>Email ID</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && !schools.length ? (
                <tr>
                  <td colSpan="10">Loading schools...</td>
                </tr>
              ) : !schools.length ? (
                <tr>
                  <td colSpan="10">No schools found.</td>
                </tr>
              ) : (
                schools.map((school, index) => (
                  <tr
                    key={
                      school.id ??
                      school.schoolId ??
                      school.schoolCode
                    }
                  >
                    <td>{(page - 1) * size + index + 1}</td>

                    <td>
                      {school.createdDate ||
                        school.createdAt ||
                        "-"}
                    </td>

                    <td>{school.schoolName || "-"}</td>

                    <td>{school.schoolCode || "-"}</td>

                    <td>{school.branchName || "-"}</td>

                    <td>
                      {school.schoolLogoUrl ? (
                        <a
                          className="sa-link-button"
                          href={getSchoolLogoUrl(school)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>{school.schoolType || "-"}</td>

                    <td>{school.phoneNumber || "-"}</td>

                    <td>{school.email || "-"}</td>

                    <td className="sa-action-cell">
                      <button
                        aria-label={`Actions for ${school.schoolName}`}
                        onClick={() =>
                          setOpenMenu(
                            openMenu === index ? null : index
                          )
                        }
                      >
                        <MoreVertical />
                      </button>

                      {openMenu === index && (
                        <div className="sa-row-menu">
                          <button
                            onClick={() => {
                              setViewing(school);
                              setOpenMenu(null);
                            }}
                          >
                            <Eye size={18} />
                            View
                          </button>

                          <button
                            onClick={() =>
                              navigate("/school-details", {
                                state: { school },
                              })
                            }
                          >
                            <Pencil size={18} />
                            Edit
                          </button>

                          <button
                            className="danger"
                            onClick={() => {
                              setDeleting(school);
                              setOpenMenu(null);
                            }}
                          >
                            <Trash2 size={18} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="sa-pagination">
          <button
            disabled={currentPage <= 1 || loading}
            onClick={() =>
              setCurrentPage((value) => value - 1)
            }
          >
            Prev
          </button>

          <button
            className="active"
            disabled={
              currentPage >= totalPages || loading
            }
            onClick={() =>
              setCurrentPage((value) => value + 1)
            }
          >
            Next
          </button>

          <span>
            Page: {page} of {totalPages || 1} (
            {totalElements})
          </span>

          <select
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </section>

      {viewing && (
        <div className="sa-modal-backdrop">
          <section className="sa-modal">
            <header>
              <h2>View Details</h2>

              <button
                aria-label="Close"
                onClick={() => setViewing(null)}
              >
                <X />
              </button>
            </header>

            <div className="sa-modal-body">
              {detailGroups.map(([title, values]) => (
                <section
                  key={title}
                  className="sa-card sa-view-card"
                >
                  <h3>{title}</h3>

                  <div>
                    {values.map(([label, key]) => (
                      <dl key={key}>
                        <dt>{label}</dt>

                        <dd>
                          {key === "schoolLogoUrl" && viewing[key] ? (
                            <a
                              href={getSchoolLogoUrl(viewing)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View
                            </a>
                          ) : typeof viewing[key] === "boolean" ? (
                            viewing[key] ? "Enabled" : "Disabled"
                          ) : (
                            viewing[key] || "-"
                          )}
                        </dd>
                      </dl>
                    ))}
                  </div>
                </section>
              ))}

              <div className="sa-modal-actions">
                <button
                  onClick={() => setViewing(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={Boolean(deleting)}
        title="Delete school"
        message="Are you sure you want to delete this school?"
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
