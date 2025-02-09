import { FaTasks } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";

const Side = () => {
  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-neutral-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/todo"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaTasks />
                <span className="ms-3">Todo</span>
              </a>
            </li>
            <li>
              <a
                href="/timer"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <IoIosTimer />
                <span className="flex-1 ms-3 whitespace-nowrap">Timer</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Side;
