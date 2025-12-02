import { useEffect, useState } from "react";
import secureLocalStorage from  "react-secure-storage";

const getLoggedinUser = () => {
    const user = secureLocalStorage.getItem('authUser') ? 
        JSON.parse(secureLocalStorage.getItem('authUser')) : null

    if (!user) return null;
    return user;
};

const useProfile = () => {
    const userProfileSession = getLoggedinUser();
    var token =
        userProfileSession &&
        userProfileSession["access_token"];
    const [loading, setLoading] = useState(userProfileSession ? false : true);
    const [userProfile, setUserProfile] = useState(
        userProfileSession ? userProfileSession : null
    );

    useEffect(() => {
        const userProfileSession = getLoggedinUser();
        var token =
            userProfileSession &&
            userProfileSession["access_token"];
        setUserProfile(userProfileSession ? userProfileSession : null);
        setLoading(token ? false : true);
    }, []);

    return { userProfile, loading, token };
};

export { useProfile };