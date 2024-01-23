import "../css/homenavbar.css"
function HomeNavbar() {
    return(
        <>
            <div className="Navbar">
                <ul className="logo">
                    <a href="/home">EHS</a>
                </ul>
                <ul className="Navigation">
                    <li><a href="/home">Home</a></li>
                    <li><a href="/Benefits">Benefits</a></li>
                    <li><a href="/Contact">Contact Us</a></li>
                    <li><a href="">Login</a></li>
                </ul>
            </div>
        </>
    );
}

export default HomeNavbar;