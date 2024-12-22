import { Button, Form } from "reactstrap";
import { FormEvent, useEffect, useState } from "react";
import { handleLogout, handleUpdateProfile, setValidationError } from "../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import CustomInput from "../../components/CustomInput";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
    const { email="",  password="", validation_error, validation_success, checked } = useAppSelector((state) => state.user);

    // Инициализация состояния с данными из Redux
    const [inputEmail, setInputEmail] = useState(email);

    const [inputPassword, setInputPassword] = useState('');

    const [isemailValid, setIsemailValid] = useState(true);
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const dispatch = useAppDispatch();

    // Слежение за изменениями в Redux-данных и обновление локальных состояний
    useEffect(() => {
        // Проверяем значения при монтировании компонента и синхронизируем их
        setInputEmail(email);

    }, [email]); // Эта зависимость обновит локальные состояния при изменении данных в Redux

    useEffect(() => {
        const isemailValid = inputEmail.length !== 0;
        const isPasswordValid = inputPassword.length !== 0;

        setIsemailValid(isemailValid);
        setIsFirstNameValid(isFirstNameValid);
        setIsLastNameValid(isLastNameValid);
        setIsPasswordValid(isPasswordValid);

        const isValid = isemailValid && isFirstNameValid && isLastNameValid;
        dispatch(setValidationError(!isValid));
    }, [inputEmail, inputPassword, dispatch]);

    const navigate = useNavigate();

    const handleSaveProfile = async (e: FormEvent) => {
        e.preventDefault();

        if (validation_error) {
            return;
        }

        const data = {
            email: inputEmail,
            password: inputPassword,
        };

        await dispatch(handleUpdateProfile(data));
        dispatch(handleLogout);
        navigate("/");
    };

    // Если данные еще не загружены (checked === false), можно отобразить загрузку или пустую форму
    if (!checked) {
        return <div>Loading...</div>;
    }



    return (
        <main id="main" className="page">
            <div className="page__services _container">
                <Form onSubmit={handleSaveProfile} className="w-25">
                    <CustomInput
                        label="Email"
                        placeholder="Введите новый email"
                        value={inputEmail}
                        setValue={setInputEmail}
                        error={validation_error}
                        valid={isemailValid}
                        required={false}
                        disabled={false}
                    />

                    <CustomInput
                        label="Пароль"
                        placeholder="Введите новый пароль"
                        value={inputPassword}
                        setValue={setInputPassword}
                        error={validation_error}
                        valid={isPasswordValid}
                        required={false}
                        disabled={false}
                    />
                    <Button type="submit" color="primary" className="mt-3">
                        Сохранить
                    </Button>
                </Form>
            </div>
        </main>
    );
};
