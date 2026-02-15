import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 border-b  bg-white shadow-md w-full px-5">
      <div className="px-20 h-14 flex items-center justify-between">
        <Link to="/" className="gap-3 items-center hidden md:flex">
          <div className="font-semibold">Taskify</div>
        </Link>
      </div>
    </div>
  );
};
