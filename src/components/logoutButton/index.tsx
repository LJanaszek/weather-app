
import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
type Props = {
    main: boolean
};
export default function LogoutButton({ main }: Props) {
    const [userName, setUserName] = useState(false);
    useEffect(() => {
        fetch("/api/auth/user")
            .then(res => {
                if (res.status === 401) {
                    console.log("Unauthorized");
                }
                if (res.status === 401){
                    console.log("Invalid token");
                }
                if(res.status === 200){
                    return res.json();
                }
            })
            .then(data => {
                if (data.user) {
                    setUserName(data.user.username);
                }
                else {
                    window.location.href = "/login"
                }
            })
            .catch(error => { console.error(error); window.location.href = "/login" });
            
    }, [])
    return <div className="logout"
        style={
            main ?
                {
                    
                }
                :
                {
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                }
        }
    >
        <h1>Hello <span>{userName}</span> </h1>
        <Button
            sx={{
                color: "black",
                transition: "all 0.3s ease-in-out",
                ":hover": {
                    backgroundColor: "unset",
                    color: "rgba(0, 0, 0, 0.6)",
                }
            }}
            variant="text"
            onClick={() => {
                fetch("/api/auth/logout")
                    .then(res => res.json())
                    .then(data => {
                        if (data.message) {
                            window.location.href = "/login"
                        }
                    })
                    .catch(error => { console.error(error); window.location.href = "/login" });
            }}
            startIcon={<Logout
                sx={{
                    // color: "black",
                }}>
            </Logout>}
        >

        </Button>
    </div>
}