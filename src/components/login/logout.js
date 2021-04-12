import { useHistory } from "react-router-dom";
import Movies from '../movies/index'

function Logout() {
    const history = useHistory();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('logged_in');
    history.push(`/`);
    window.location.reload(false);
    return (
        <Movies />
    )
}

export default Logout;
