import { useAuthContext } from "../../context/AuthContext";
import { MessageContextProvider } from "../../context/MessageContext";
import { Dashboard } from "../dashboard/Dashboard";

export function DashboardWrap() {
  const { user } = useAuthContext();
  return (
    <>
      <MessageContextProvider user={user}>
        <Dashboard />
      </MessageContextProvider>
    </>
  );
}
