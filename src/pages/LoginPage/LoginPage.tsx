import {Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row} from "reactstrap";
import React, {useEffect} from "react";


import {Link, useNavigate} from "react-router-dom"
import { handleLogin } from "../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../store";



export const LoginPage = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated)


    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement> ) => {
        e.preventDefault()

        const emailField = e.currentTarget.elements[0] as HTMLInputElement
        const passwordField = e.currentTarget.elements[1] as HTMLInputElement

        const data = {
            email: emailField.value,
            password: passwordField.value
        }

        console.log('login', data)

        const result = await dispatch(handleLogin(data))

        if (result.type == "login/fulfilled") {
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
        {/* <Breadcrumbs/> */}
        <div className="page__services _container">
        <Container>
            <Row className="justify-content-center">
                <Col md="4">
                    <Card>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <h3 className="text-center">
                                    Форма входа
                                </h3>
                                <FormGroup className="mt-4">
                                    <Label for="email-input">
                                        Введите email
                                    </Label>
                                    <Input placeholder="Email" type="text" id="email-input" required/>
                                </FormGroup>
                                <FormGroup className="mt-4">
                                    <Label for="password-input">
                                        Введите пароль
                                    </Label>
                                    <Input placeholder="Пароль" type="password" id="password-input" required/>
                                </FormGroup>
                                <Row className="justify-content-center mt-4">
                                    <Link to="/register/" style={{textAlign: "center"}}>
                                        Еще нет аккаунта? Зарегистрироваться
                                    </Link>
                                </Row>
                                <Row className="justify-content-center mt-4">
                                    <Button color="primary" className="w-50">
                                        Войти
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