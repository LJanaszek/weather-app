import Weather from "@/components/weather";
import { useRouter } from "next/router";

export default function BlogPost() {
    const router = useRouter();
    const { index } = router.query;
    return <div>
        <Weather city={index.toString()} />
    </div>;
}