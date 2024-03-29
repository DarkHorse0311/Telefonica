import Routes from "../config"

export async function Login(username: string, password: string) {
    const response = fetch(Routes.signin, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    });
    return response;
}

export async function Logout() {
    const response = fetch(Routes.logout, { method: "POST" });
    return response;
}

export async function ChangePassword(current_password: string, new_password: string) {
    const response = fetch(Routes.changePassword, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "current_password": current_password,
            "new_password": new_password
        })
    });

    return response;
}

export async function ForgotPassword(email: string) {
    const response = fetch(Routes.forgotPassword, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "email": email
        })
    });

    return response;
}

export async function ResetPassword(token: string, password: string) {
    const response = fetch(Routes.resetPassword, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "token": token,
            "password": password
        })
    });

    return response;
}