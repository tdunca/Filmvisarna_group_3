import { Link } from 'react-router-dom';
import LogoImg from '../../assets/img/logo-text-side.png';
import './Logo.scss';


function Logo() {
    return (
        <Link to="/">
            <img src={LogoImg} alt="Logo" className="logo" />
        </Link>
    );
}

export default Logo;