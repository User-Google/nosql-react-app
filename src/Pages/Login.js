import React, {useState} from "react";
import Axios from "axios";
import { Button, Checkbox, Form, Input, Modal, message } from 'antd';
import moment from 'moment';



function Login(props) {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    // const [exception, setException] = useState();

    const warning = () => {
        message.warning('Неверный логин или пароль!');
    };

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        // setModalText('The modal will be closed after two seconds');
        // setConfirmLoading(true);
        // setTimeout(() => {
        //     setVisible(false);
        //     setConfirmLoading(false);
        // }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        Axios.get("http://localhost:3001/login", {
            params: {
                login: values.username,
                pw: values.password
            }
        }).then((response) => {
            console.log(response.data)
            props.setUserState(response.data)
            response.data ? console.log('Вход') : warning();
        });
    };

    const onFinishReg = (values) => {
        console.log('Success:', values);
        setConfirmLoading(true);
        Axios.get("http://localhost:3001/addNewUser", {
            params: {
                email: values.email,
                phone: values.phone,
                surname: values.surname,
                name: values.name,
                lastname: values.lastname,
                login: values.username,
                password: values.password
            }
        }).then((response) => {
            setConfirmLoading(false);
            setVisible(false);
            console.log(response.data)
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinishRegFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className={"registrationFrom"}>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Логин"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Логин не введен!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Пароль не введен!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" style={{marginRight: 7}}>
                        Вход
                    </Button>
                    <Button onClick={showModal}>
                        Регистрация
                    </Button>
                </Form.Item>
            </Form>
            <Modal
                title="Регистрация в системе"
                centered
                visible={visible}
                onOk={handleOk}
                okText = 'Зарегистрироваться'
                okButtonProps={{ form: 'registration', key: 'submit', htmlType: 'submit'}}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                cancelText={'Отмена'}
            >
                <Form
                    name="registration"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinishReg}
                    onFinishFailed={onFinishRegFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'Адрес почты некорректен!',
                            },
                            {
                                required: true,
                                message: 'Введите адрес эл.почты!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Номер телефона"
                    >
                        <Input
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="surname"
                        label="Фамилия"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Имя"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="lastname"
                        label="Отчество"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Логин"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Введите логин!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[
                            {
                                required: true,
                                message: 'Введите пароль!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Подтверждение"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Подтвердите пароль!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(new Error('Пароли не совпадают!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}


export default Login;
