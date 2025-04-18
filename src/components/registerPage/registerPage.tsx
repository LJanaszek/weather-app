import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';


export default function SignUp() {
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [repeatPasswordError, setRepeatPasswordError] = React.useState(false);
    const [repeatPasswordErrorMessage, setRepeatPasswordErrorMessage] = React.useState('');
    const [isValid, setIsValid] = React.useState(false);
    const [error, setError] = React.useState("");
    const validateInputs = async () => {
        const password = document.getElementById('password') as HTMLInputElement;
        const name = document.getElementById('name') as HTMLInputElement;
        const repeatPassword = document.getElementById('repeatPassword') as HTMLInputElement;

        if (!password.value || password.value.length < 8) {
            // wielka litera
            //znak specjalny 
            //cyfra
            //mała litera
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            setIsValid(false);
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
        if (password.value !== repeatPassword.value) {
            console.log(password.value);
            console.log(repeatPassword.value);
            setRepeatPasswordError(true);
            setRepeatPasswordErrorMessage('Passwords do not match.');
            setIsValid(false);
        }

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage('Name is required.');
            setIsValid(false);
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateInputs()) {
            return;
        };
        const password = document.getElementById('password') as HTMLInputElement;
        const name = document.getElementById('name') as HTMLInputElement;
        const repeatPassword = document.getElementById('repeatPassword') as HTMLInputElement;
        try {
            const res = await fetch("/api/auth/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: name.value,
                    password: password.value,
                    secPassword: repeatPassword.value
                })
            });

            if (res.status === 201) {
                window.location.href = '/';

            }
            else if (res.status === 409) {
                // username TAKEN 
                console.log("username TAKEN")
                setError("Username is taken");
            }
            else {
                console.log("Bad Request ergo coś jest źle z danymi")
            }
        }
        catch (er) {
            // Coś się grubo wywaliło
            console.log("Error:", er)
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
                }}>



                <Typography variant="h5">Sign up</Typography>

                <Box
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}>


                    <TextField
                        autoComplete="name"
                        name="name"
                        required
                        fullWidth
                        id="name"
                        placeholder="Jon Snow"
                        error={nameError}
                        helperText={nameErrorMessage}
                        color={nameError ? 'error' : 'primary'}
                        label="name"
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

                    <TextField
                        required
                        fullWidth
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        variant="outlined"
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        color={passwordError ? 'error' : 'primary'}
                        margin="normal"
                        label="password"
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


                    <TextField
                        required
                        fullWidth
                        id="repeatPassword"
                        placeholder="••••••"
                        name="repeatPassword"
                        type='password'
                        autoComplete="new-password"
                        variant="outlined"
                        label="Repeat password"
                        error={repeatPasswordError}
                        helperText={repeatPasswordErrorMessage}
                        color={passwordError ? 'error' : 'primary'}
                        margin="normal"
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
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
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
                    >
                        Sign up
                    </Button>
                    <Link href="/login"
                        style={{
                            color: 'rgba(0, 0, 0, 0.5)',
                            textDecoration: 'none',
                        }}>
                        Already have an account?
                    </Link>
                    {error && <Typography color="error">{error}</Typography>}
                </Box>



            </Box>
        </Container>
    );
}
