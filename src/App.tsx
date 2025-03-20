import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }
  
  const { signOut } = useAuthenticator();

  return (
    <main>
      <button onClick={signOut}>Sign out</button>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <div>
         <FileUploader
            acceptedFileTypes={['*']}
            path="profile-pictures/"
            maxFileCount={120}
            isResumable
            bucket="amplifyTeamDriveNormanTest"
            useAccelerateEndpoint={false}
            onUploadSuccess={async ({ key }) => {
              console.log(`File [${key}] uploaded at: ${new Date().toISOString()}`);
            }}
            processFile={({ key, file }: { key: string, file: File }) => {
              // console.log("Processing Initial File: ", key)
              const keyId = crypto.randomUUID()
              const data = { key: keyId, file }
              // console.log("Processed File: ", data)
              return data;
            }}
          />
      </div>
    </main>
  );
}

export default App;
