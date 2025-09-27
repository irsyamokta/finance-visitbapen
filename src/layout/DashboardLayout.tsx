import { Outlet } from "react-router";
import AppHeader from "./AppHeader";

const LayoutContent: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div
      >
        <AppHeader />
        <div className="mx-auto max-w-(--breakpoint-2xl) px-24">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const FinanceLayout: React.FC = () => {
  return (
    <LayoutContent />
  );
};

export default FinanceLayout;
