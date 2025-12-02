import secureLocalStorage from  "react-secure-storage";

export function roleAccess(code) {
    const role_access = secureLocalStorage.getItem('roleAccess') ? JSON.parse(secureLocalStorage.getItem('roleAccess')) : null
    return role_access.find((e) => e.code == code) ? 1 : 0
}