import { Outlet } from "react-router-dom";
import { SmallSidebar, BigSidebar, MenuAppBar, Copyright } from "../components";
import Wrapper from "../assets/wrappers/SharedLayout";
const SharedLayout = () => {
  return (
    <Wrapper>
      <main className="principal">
        <SmallSidebar />
        <BigSidebar />
        <div>
          <MenuAppBar />
          <div className="principal-page">
            <Outlet />
            <Copyright />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};
export default SharedLayout;
