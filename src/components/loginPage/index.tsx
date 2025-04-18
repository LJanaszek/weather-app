import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
// import { UserData } from "@/data/user";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/auth/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "username": email,
                "password": password
            }),
        });

        const data = await res.json();
        if (res.ok) {
            window.location.href = "/"; // Redirect on success
        } else {
            setError(data.message);
        }
    };

    return (

        <Container maxWidth="xs">
            <Box
                sx={{
                    mt: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant="h5">LoginPage</Typography>
                <Box sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoFocus
                        value={email}
                        sx={{
                            color: '#000',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 1)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#000',
                                }
                            },
                            '& .MuiOutlinedInput-input': {
                                color: '#393939',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
                                color: '#000',
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(0, 0, 0, 0.5)',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#000',
                            },
                        }}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        sx={{
                            color: '#000',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 1)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#000',
                                }
                            },
                            '& .MuiOutlinedInput-input': {
                                color: '#393939',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
                                color: '#000',
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(0, 0, 0, 0.5)',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#000',
                            },
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: 'rgba(0, 0, 0, 1)',
                            border: '1px solid #fff',
                            color: '#fff',
                            transition: 'all ease-in-out 0.3s',
                            '&:hover': {
                                backgroundColor: 'rgba(55, 55, 55, 0.9)',
                                border: '1px solid #000',
                                color: 'rgb(157, 157, 157)',
                            },
                            padding: '1.5em',

                        }}
                        onClick={handleSubmit}
                    >
                        Login
                    </Button>
                    <Link href="/register"
                        style={{
                            color: 'rgba(0, 0, 0, 0.5)',
                            textDecoration: 'none',
                            transition: 'all ease-in-out 0.3s',
                        }}
                    >
                        You don&apos;t have an account?
                    </Link>
                    {error && <Typography color="error">{error}</Typography>}
                </Box>
            </Box>
        </Container>

    );
};

export default LoginPage;