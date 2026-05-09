import { Link } from "react-router-dom";
const Home = () => {
    return(
        <>
            <div>
                <h1>Home</h1>
                <ul>
                    <li><Link to={'/system-equipments'}>Hệ thống</Link></li>
                    <li><Link to={'/equipments'}>Thiết bị hệ thống</Link></li>
                    <li><Link to={'/equipment-types'}>Loại thiết bị</Link></li>

                </ul>
            </div>
        </>
    )
}
export default Home ;