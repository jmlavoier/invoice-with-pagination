import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import InvoicePage from "./pages/invoice-page";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <ChakraProvider value={defaultSystem}>
        <InvoicePage />
      </ChakraProvider>
    </div>
  );
}
