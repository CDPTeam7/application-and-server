import { TransitionGroup, CSSTransition } from "react-transition-group";

export interface RouteTransitionProps {
  location:URL,
  children:React.ReactNode
}

const RouteTransition = ({ location, children }: RouteTransitionProps) => {
  const pathname = location.pathname;
  
  return (
    <TransitionGroup className={'transition-wrapper'}>
      <CSSTransition
        key={pathname}
        timeout={300}
        classNames={'navigate-push'}
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default RouteTransition;