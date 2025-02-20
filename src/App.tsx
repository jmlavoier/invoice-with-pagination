import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import "./styles.css";
import { Pocs } from "./pages/pocs";

export default function App() {
  return (
    <div className="App">
      <ChakraProvider value={defaultSystem}>
        <Pocs />
      </ChakraProvider>
    </div>
  );
}
