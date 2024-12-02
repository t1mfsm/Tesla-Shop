
import React, {useEffect} from "react";

import {Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row} from "reactstrap";
import {Link, useNavigate} from "react-router-dom";

import { handleRegister } from "../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../store";

export const RegisterPage = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement> ) => {
        e.preventDefault()

        const loginField = e.currentTarget.elements[0] as HTMLInputElement
        const passwordField = e.currentTarget.elements[1] as HTMLInputElement

        const data = {
            email: loginField.value,
            password: passwordField.value
        }

        const result = await dispatch(handleRegister(data))

        if (result.type == "register/fulfilled") {
            navigate('/')
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/403/")
        }
    }, [isAuthenticated]);

    return (
        <main id="main" className="page">
            <div className="page__services _container">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <Card>
                                <CardBody>
                                    <Form onSubmit={handleSubmit}>
                                        <h3 className="text-center">Форма регистрации</h3>

                                        <FormGroup className="mt-4">
                                            <Label for="name-input">Введите email</Label>
                                            <Input
                                                placeholder="email"
                                                type="text"
                                                id="name-input"
                                                required
                                               
                                            />
                                        </FormGroup>


                                        <FormGroup className="mt-4">
                                            <Label for="password-input">Введите пароль</Label>
                                            <Input
                                                placeholder="Пароль"
                                                type="password"
                                                id="password-input"
                                                required
                                               
                                            />
                                        </FormGroup>

                                        <Row className="justify-content-center mt-4">
                                            <Link to="/login/" style={{ textAlign: "center" }}>
                                                Уже есть аккаунт? Войти
                                            </Link>
                                        </Row>

                                        <Row className="justify-content-center mt-4">
                                            <Button color="primary" className="w-75">
                                                Зарегистрироваться
                                            </Button>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </main>
    );
};