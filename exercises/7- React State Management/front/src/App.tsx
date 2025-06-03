import "./App.css";
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes';
import {Toaster} from "react-hot-toast";

export function App() {

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
      <RouterProvider router={router} />
    </>
  );
}

export default App;
