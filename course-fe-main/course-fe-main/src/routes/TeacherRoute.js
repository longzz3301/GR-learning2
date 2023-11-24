import { Navigate, Outlet } from "react-router-dom";

function useAuth() {
    const level = localStorage.getItem('level');
    return level
}


function TeacherRoute() {
    const isAuth = useAuth();
    return (isAuth == '2') ? <Outlet /> : <Navigate to='/login' />

}
export default TeacherRoute;