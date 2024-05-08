import useAuthStore from "@/stores/useAuthStore";
import { Navigate } from "react-router-dom";

interface LoginCheckContainerProps {
  shouldLogin: boolean;
  children: React.ReactNode;
}

export default function LoginCheckContainer(props: LoginCheckContainerProps) {
  const user = useAuthStore((state) => state.currentUser);
  if (props.shouldLogin && user === null) {
    return <Navigate replace to="/login" />;
  }

  if (!props.shouldLogin && user !== null) {
    return <Navigate replace to="/" />;
  }

  return <>{props.children}</>;
}
