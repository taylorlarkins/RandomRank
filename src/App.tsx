import RankPage from "./pages/RankPage";
import LoginPage from "./pages/LoginPage";

const todayItems = [
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Elderberry",
    "Fig",
    "Grape",
    "Honeydew",
    "Ice Cream",
    "Jackfruit",
  ];

export const App = () => {
  //return <LoginPage />
  return <RankPage dailyItems={todayItems}/>;
}