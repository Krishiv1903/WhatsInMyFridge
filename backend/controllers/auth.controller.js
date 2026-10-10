import { saveUser, validateUser, emailExists } from "../services/auth.service.js";

export const signup = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.redirect("/signUp.html?error=required");
    }
    if (password !== confirmPassword) {
        return res.redirect('/signUp.html?error=password');
    }
    if (await emailExists(email)) {
        return res.redirect('/signUp.html?error=exists');
    }

    await saveUser(req.body);

    return res.redirect("/home.html");
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.redirect("/signIn.html?error=invalid");
    }

    const isValid = await validateUser(email, password);

    if (isValid) {
        return res.redirect("/home.html");
    }

    // If email not found, prompt user to sign up first
    if (!await emailExists(email)) {
        return res.redirect("/signIn.html?error=notfound");
    }

    // Redirect back to sign-in page with an error flag so the UI can show a message
    return res.redirect("/signIn.html?error=invalid");
};