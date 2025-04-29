'use client';
import LogoutButton from "@/components/logoutButton";
import Weather from "@/components/weather";

export default function BlogPost() {
    return <div>
        <LogoutButton main={false} />
        <Weather />
    </div>;
}