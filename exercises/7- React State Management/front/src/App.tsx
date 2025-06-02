import "./App.css";
import { TaskFilters } from "./components/TaskFilters";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import {Toaster} from "react-hot-toast";

function App() {

  return (
    <>
    <Toaster
      position="top-right"
      toastOptions={{
        className: "bg-gray-800 text-white",
        duration: 3000,
        style: {
          padding: "16px",
          borderRadius: "8px",
          fontSize: "16px",
        },
      }}
    />
      <div className="bg-gray-200 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-4 mx-auto max-w-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-4xl font-semibold text-center text-gray-800 mb-4 p-4">
            TODO - REACT Tarea 7
          </h1>
          <TaskForm />
          <TaskFilters />
          <TaskList />
          <p className="text-center text-gray-300 mt-4">
            Kevin Stivala {"30928"}
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
