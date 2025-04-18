// import CityGallery from "@/components/cityTemplate";
import SelectCity from "@/components/selectCity";
import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const [userName, setUserName] = useState(false);
  useEffect(() => {
    fetch("/api/auth/user")
      .then(res => res.json())
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
  return (
    <>
      <div className="logout">
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
      <SelectCity />
      {/* <CityGallery city="warsaw" /> */}
    </>
  );
}
