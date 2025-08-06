import LoginButton from "./LoginLogoutButton";
const Header = () => {
  return (
    <header className="border-b p-4 w-full flex justify-between">
      <h1>Quiz Application</h1>
      <LoginButton />
      {/* Additional header content can go here */}
    </header>
  );
};

export default Header;
