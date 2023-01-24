import axios from "axios";
import { useRouter } from "next/router";
import { Button, Form } from "semantic-ui-react";

export default function Login() {
  const router = useRouter();
  async function submit(e :any) {
    try {
      e.preventDefault();
      const id: string = e.target.id.value;
      const password: string = e.target.password.value;
      const option = {
        header: { "Content-Type": "application/json" },
        data: { id, password },
        withCredentials: true,
      }
      const result = await axios.post("/api/login", option);
      console.log("login")
      if (result.status === 200) router.push("/admin");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div style={{ padding: "100px 0", textAlign: "center" }}>
      <Form onSubmit={submit}>
        <Form.Field inline>
          <input name="id" placeholder="ID" />
        </Form.Field>
        <Form.Field inline>
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
          />
        </Form.Field>
        <Button color="blue">Login</Button>
      </Form>
    </div>
  )
}