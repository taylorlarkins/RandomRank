import RankPage from "./pages/RankPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import FriendsPage from "./pages/FriendsPage";
import ComparisonPage from "./pages/ComparisonPage";

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

const rankingOne = [
      "Pizza",
      "The Moon",
      "Running",
      "Hot Showers",
      "Quantum Tunneling",
      "Birds",
      "Blueberries",
      "Friendship",
      "Fireworks",
      "Pine Trees",
]

const rankingTwo = [
      "Friendship",
      "Pizza",
      "Blueberries",
      "Birds",
      "The Moon",
      "Running",
      "Hot Showers",
      "Pine Trees",
      "Fireworks",
      "Quantum Tunneling",
]

export const App = () => {
  //return <LoginPage />
  //return <RankPage dailyItems={todayItems}/>;
  //return <SignUpPage/>;
  return <HomePage/>;
  //return <FriendsPage/>;
  //return <ComparisonPage date="November 14th, 2025" friendName="John Smith" yourRanking={rankingOne} friendRanking={rankingTwo}/>
}