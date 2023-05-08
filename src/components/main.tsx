import { useEffect } from "react";
import { useRouter } from "next/router";

const Main = () => {
    const router = useRouter();

    useEffect(() => {
        const storedData = localStorage.getItem('data');
        if (storedData) {
            router.push('/global-chat');
        }else{
            router.push('/signup');
        }

    }, [])

    return <div>Loading.... </div>;
};

export default Main;