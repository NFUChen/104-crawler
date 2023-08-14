import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { DashBoard } from "./components/DashBoard";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1f2732"
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DashBoard />
    </ThemeProvider>
  );
}

export default App;
