import { useLoaderData } from "react-router";
import axios from "axios";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export async function loader() {
  const res = await axios.get<Student[]>("http://localhost:3000/students");

  return res.data;
}

export default function StudentsPage() {
  const data = useLoaderData();

  return <pre>{JSON.stringify(data, null, 4)}</pre>;
}
