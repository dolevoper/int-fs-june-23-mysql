import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "./StudentsPage.module.css";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { search } = new URL(request.url);
  const res = await axios.get<Student[]>(
    `http://localhost:3000/students${search}`
  );

  return res.data;
}

export default function StudentsPage() {
  const data = useLoaderData() as Student[];

  if (!data.length) {
    return (
      <div className={styles.wrapper}>
        <Search />
        <p>No students to show.</p>
        <Pagination disableNext />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Search />
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Last Name</td>
            <td>First Name</td>
            <td>Email</td>
          </tr>
        </thead>
        <tbody>
          {data.map((student) => (
            <tr key={student.id}>
              <td>{student.lastName}</td>
              <td>{student.firstName}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <form className={styles.search}>
      <label htmlFor="search">Search</label>
      <input
        id="search"
        type="search"
        value={searchParams.get("search") ?? ""}
        onInput={(e) => {
          const nextSearchParams = new URLSearchParams(searchParams);

          nextSearchParams.set("search", e.currentTarget.value);

          setSearchParams(nextSearchParams);
        }}
      />
    </form>
  );
}

type PaginationProps = {
  disableNext?: boolean;
};

function Pagination({ disableNext }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = searchParams.has("page")
    ? Number(searchParams.get("page"))
    : 1;

  function nextPage() {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("page", `${currentPage + 1}`);

    setSearchParams(nextSearchParams);
  }

  function previousPage() {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("page", `${currentPage - 1}`);

    setSearchParams(nextSearchParams);
  }

  return (
    <article className={styles.pagination}>
      <button
        disabled={currentPage === 1}
        title="Previous page"
        onClick={previousPage}
      >
        ⬅️
      </button>
      <p>Showing page {currentPage}</p>
      <button disabled={disableNext} title="Next page" onClick={nextPage}>
        ➡️
      </button>
    </article>
  );
}
