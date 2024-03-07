import './Sidenav.css'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { darkmodeAtom } from '../../store/darkmode/darkAtom';
import { userAtom } from '../../store/user/userAtom';

// Component for individual menu item
const MenuItem = ({ icon, title, classNames, href }) => (
    <li>
        <Link to={href} className={classNames}>
            {icon}
            <span className="link-name">{title}</span>
        </Link>
    </li>
);

const Sidenav = () => {

    const [user, setUser] = useRecoilState(userAtom);
    const [status, setStatus] = useState(() => localStorage.getItem('status') || 'open');
    const path = useLocation().pathname;
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('status', status);
    }, [status]);


    const toggleSidebar = () => {
        setStatus(prevStatus => (prevStatus === 'open' ? 'close' : 'open'));
    };

    const logout = () => {
        localStorage.removeItem("token"); // Remove the token from localStorage
        setUser(null); // Reset the user state in the Recoil atom
        navigate("/login"); // Redirect to the login page
    };

    const mode = useRecoilValue(darkmodeAtom);
    const setDarkmode = useSetRecoilState(darkmodeAtom);

    return (
        <>
            <nav className={status === 'close' ? 'close' : ''}>
                <div className="logo-name flex">
                    <div className="logo-image">
                        <img src="https://i.pinimg.com/736x/73/99/de/7399de1107c7f8cd95591f3755c1e07a.jpg" alt />
                    </div>
                    <span className="logo_name">Textile</span>
                </div>
                <div className="menu-items">
                    <ul className="nav-links">
                        <MenuItem
                            href="/"
                            classNames={`${path == '/' && 'active-tab'}`}
                            title="Home"
                            icon={(
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                    <g id="SVGRepo_iconCarrier">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274ZM9.44661 15.3975C9.11385 15.1508 8.64413 15.2206 8.39747 15.5534C8.15082 15.8862 8.22062 16.3559 8.55339 16.6025C9.5258 17.3233 10.715 17.75 12 17.75C13.285 17.75 14.4742 17.3233 15.4466 16.6025C15.7794 16.3559 15.8492 15.8862 15.6025 15.5534C15.3559 15.2206 14.8862 15.1508 14.5534 15.3975C13.825 15.9373 12.9459 16.25 12 16.25C11.0541 16.25 10.175 15.9373 9.44661 15.3975Z" fill="#000" />
                                    </g>
                                </svg>
                            )}
                        />
                        <MenuItem
                            href="/inventory"
                            title="Inventory"
                            classNames={`${path == '/inventory' && 'active-tab'}`}
                            icon={(
                                <svg viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.93417 2H17.0658C17.9523 1.99995 18.7161 1.99991 19.3278 2.08215C19.9833 2.17028 20.6117 2.36902 21.1213 2.87868C21.631 3.38835 21.8297 4.0167 21.9179 4.67221C22.0001 5.28388 22.0001 6.0477 22 6.9342V13.0658C22.0001 13.9523 22.0001 14.7161 21.9179 15.3278C21.8297 15.9833 21.631 16.6117 21.1213 17.1213C20.6117 17.631 19.9833 17.8297 19.3278 17.9179C18.7161 18.0001 17.9523 18.0001 17.0658 18L13 18V20H17C17.5523 20 18 20.4477 18 21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21C6 20.4477 6.44772 20 7 20H11V18L6.93417 18C6.04769 18.0001 5.28387 18.0001 4.67221 17.9179C4.0167 17.8297 3.38835 17.631 2.87868 17.1213C2.36902 16.6117 2.17028 15.9833 2.08215 15.3278C1.99991 14.7161 1.99995 13.9523 2 13.0658V6.93417C1.99995 6.04769 1.99991 5.28387 2.08215 4.67221C2.17028 4.0167 2.36902 3.38835 2.87868 2.87868C3.38835 2.36902 4.0167 2.17028 4.67221 2.08215C5.28387 1.99991 6.04769 1.99995 6.93417 2Z" fill="#000" />
                                </svg>
                            )}
                        />
                        <MenuItem
<<<<<<< HEAD
                            href="/chalan"
                            title="Chalan"
                            classNames={`${path == '/chalan' && 'active-tab'}`}
=======
                            href="/challan"
                            title="Challan"
                            classNames={`${path == '/challan' && 'active-tab'}`}
>>>>>>> 9e1f146d6db5f7312bcd314f12ded9969b2b1faa
                            icon={(
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="bevel"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" /></svg>
                            )}
                        />
                        <MenuItem
                            title="OverView"
                            icon={(
                                <svg fill="#000000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                    <g id="SVGRepo_iconCarrier">
                                        <g id="overview_1_">
                                            <path d="M23.6,14.3l-3.7-10l0,0C19.3,3,18,2,16.5,2C14.6,2,13,3.6,13,5.5V6h-2V5.5C11,3.6,9.4,2,7.5,2C6,2,4.7,3,4.2,4.4l0,0 l-3.7,10C0.2,15,0,15.7,0,16.5c0,3,2.5,5.5,5.5,5.5c2.9,0,5.2-2.2,5.5-5H13c0.3,2.8,2.6,5,5.5,5c3,0,5.5-2.5,5.5-5.5 C24,15.7,23.8,15,23.6,14.3z M5.5,20C3.6,20,2,18.4,2,16.5S3.6,13,5.5,13S9,14.6,9,16.5S7.4,20,5.5,20z M9,8.6v3.6 C8,11.5,6.8,11,5.5,11c-0.6,0-1.2,0.1-1.8,0.3l2.1-5.5l0.3-0.7l0,0c0,0,0,0,0,0c0.1-0.3,0.3-0.6,0.5-0.8c0,0,0,0,0,0 C6.7,4.2,6.8,4.1,7,4.1c0,0,0,0,0.1,0C7.2,4,7.3,4,7.5,4C8.3,4,9,4.7,9,5.5V8.6z M13,8v7h-2V8H13z M15,8.6V5.5 C15,4.7,15.7,4,16.5,4c0.2,0,0.3,0,0.4,0.1c0,0,0,0,0.1,0c0.1,0,0.3,0.1,0.4,0.2c0,0,0,0,0,0c0.2,0.2,0.4,0.5,0.5,0.8c0,0,0,0,0,0 l0,0l0.3,0.7l2.1,5.5c-0.6-0.2-1.2-0.3-1.8-0.3c-1.3,0-2.5,0.5-3.5,1.3V8.6z M18.5,20c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5 s3.5,1.6,3.5,3.5S20.4,20,18.5,20z">
                                            </path>
                                        </g>
                                    </g>
                                </svg>
                            )}
                        />
                        <MenuItem
                            title="Activity"
                            icon={(
                                <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                    <g id="SVGRepo_iconCarrier">
                                        <title>activity-solid</title>
                                        <g id="Layer_2" data-name="Layer 2">
                                            <g id="invisible_box" data-name="invisible box">
                                                <rect width={48} height={48} fill="none" />
                                            </g>
                                            <g id="Q3_icons" data-name="Q3 icons">
                                                <path d="M29,42a1.9,1.9,0,0,1-1.9-1.4L20.9,21.9l-5,12.8A1.9,1.9,0,0,1,14.1,36a2.1,2.1,0,0,1-1.9-1.1L8.6,27.6,5.5,31.3a2,2,0,0,1-2.8.2,2,2,0,0,1-.2-2.8l5-6A1.9,1.9,0,0,1,9.2,22a2.1,2.1,0,0,1,1.6,1.1l3,6,5.3-13.8a2,2,0,0,1,3.8.1L28.8,33,36.1,5.5A1.9,1.9,0,0,1,37.9,4a2,2,0,0,1,2,1.4l6,18a2,2,0,0,1-3.8,1.2L38.2,13,30.9,40.5A1.9,1.9,0,0,1,29.1,42Z">
                                                </path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            )}
                        />
                        <MenuItem
                            title="Schedule"
                            icon={(
                                <svg fill="#000000" viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M11,13.723a1.984,1.984,0,0,1,0-3.446V7a1,1,0,0,1,2,0v3.277a1.984,1.984,0,0,1,0,3.446V16a1,1,0,0,1-2,0ZM12,0a1,1,0,0,0,0,2,10,10,0,0,1,0,20,1,1,0,0,0,0,2A12,12,0,0,0,12,0ZM1.827,6.784a1,1,0,1,0,1,1A1,1,0,0,0,1.827,6.784ZM2,12a1,1,0,1,0-1,1A1,1,0,0,0,2,12ZM4.221,3.207a1,1,0,1,0,1,1A1,1,0,0,0,4.221,3.207ZM7.779.841a1,1,0,1,0,1,1A1,1,0,0,0,7.779.841ZM1.827,15.216a1,1,0,1,0,1,1A1,1,0,0,0,1.827,15.216Zm2.394,3.577a1,1,0,1,0,1,1A1,1,0,0,0,4.221,18.793Zm3.558,2.366a1,1,0,1,0,1,1A1,1,0,0,0,7.779,21.159Z" /></g></svg>

                            )}
                        />
                        <MenuItem
                            title="Settings"
                            icon={(
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM7.67 5.5C7.67 5.09 8.01 4.75 8.42 4.75C8.83 4.75 9.17 5.09 9.17 5.5V9.4C9.17 9.81 8.83 10.15 8.42 10.15C8.01 10.15 7.67 9.81 7.67 9.4V5.5ZM9.52282 16.4313C9.31938 16.5216 9.17 16.7132 9.17 16.9358V18.5C9.17 18.91 8.83 19.25 8.42 19.25C8.01 19.25 7.67 18.91 7.67 18.5V16.9358C7.67 16.7132 7.5206 16.5216 7.31723 16.4311C6.36275 16.0064 5.7 15.058 5.7 13.95C5.7 12.45 6.92 11.22 8.42 11.22C9.92 11.22 11.15 12.44 11.15 13.95C11.15 15.0582 10.4791 16.0066 9.52282 16.4313ZM16.33 18.5C16.33 18.91 15.99 19.25 15.58 19.25C15.17 19.25 14.83 18.91 14.83 18.5V14.6C14.83 14.19 15.17 13.85 15.58 13.85C15.99 13.85 16.33 14.19 16.33 14.6V18.5ZM15.58 12.77C14.08 12.77 12.85 11.55 12.85 10.04C12.85 8.93185 13.5209 7.98342 14.4772 7.55873C14.6806 7.46839 14.83 7.27681 14.83 7.05421V5.5C14.83 5.09 15.17 4.75 15.58 4.75C15.99 4.75 16.33 5.09 16.33 5.5V7.06421C16.33 7.28681 16.4794 7.47835 16.6828 7.56885C17.6372 7.9936 18.3 8.94195 18.3 10.05C18.3 11.55 17.08 12.77 15.58 12.77Z" fill="#292D32" />
                                    </g>
                                </svg>
                            )}
                        />
                    </ul>
                    <ul className="logout-mode">
                        <li>
                            <a onClick={logout} href="#">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L21.6201 12.7941C21.6351 12.7791 21.6497 12.7637 21.6637 12.748C21.87 12.5648 22 12.2976 22 12C22 11.7024 21.87 11.4352 21.6637 11.252C21.6497 11.2363 21.6351 11.2209 21.6201 11.2059L18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289C16.9024 8.68342 16.9024 9.31658 17.2929 9.70711L18.5858 11H13C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H18.5858L17.2929 14.2929Z" fill="#000" />
                                        <path d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.8519 16.647 16.7125 16.5409 16.5858 16.4142C15.9314 15.7598 15.8253 14.7649 16.2674 14H13C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10H16.2674C15.8253 9.23514 15.9314 8.24015 16.5858 7.58579C16.7125 7.4591 16.8519 7.35296 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z" fill="#000" />
                                    </g>
                                </svg>
                                <span className="link-name">Logout</span>
                            </a>
                        </li>
                        <li className="mode">
                            <a href="#">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                    <g id="SVGRepo_iconCarrier">
                                        <rect width={24} height={24} fill="none" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.23129 2.24048C9.24338 1.78695 10.1202 2.81145 9.80357 3.70098C8.72924 6.71928 9.38932 10.1474 11.6193 12.3765C13.8606 14.617 17.3114 15.2755 20.3395 14.1819C21.2206 13.8637 22.2173 14.7319 21.7817 15.7199C21.7688 15.7491 21.7558 15.7782 21.7427 15.8074C20.9674 17.5266 19.7272 19.1434 18.1227 20.2274C16.4125 21.3828 14.3957 22.0001 12.3316 22.0001H12.3306C9.93035 21.9975 7.6057 21.1603 5.75517 19.6321C3.90463 18.1039 2.64345 15.9797 2.18793 13.6237C1.73241 11.2677 2.11094 8.82672 3.2586 6.71917C4.34658 4.72121 6.17608 3.16858 8.20153 2.25386L8.23129 2.24048Z" fill="#323232" />
                                    </g>
                                </svg>
                                <span className="link-name">Dark Mode</span>
                            </a>
                            <div onClick={() => setDarkmode(!mode)} className="mode-toggle">
                                <span className="switch" />
                            </div>
                        </li>
                    </ul>
                </div>
                <Header toggleSidebar={toggleSidebar} />
            </nav>
        </>
    )
}

export default Sidenav
