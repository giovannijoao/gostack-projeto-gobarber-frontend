import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { ChangeEvent, useCallback, useRef } from 'react';
import { FiArrowLeft, FiCamera, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import api from '../../services/apiClient';
import getValidationErrors from '../../utils/getValidationErrors';
import { AvatarInput, Container, Content } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }).oneOf(
            [Yup.ref('password')],
            'Confirmação incorreta',
          ),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        const response = await api.put('/profile', data);
        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
        });
        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro ao atualizar perfil',
          description: 'Ocorreu um erro ao atualizar perfil, tente novamente.',
        });
      }
    },
    [addToast, history],
  );

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
      formData.append('avatar', e.target.files[0]);
      api.patch('/users/avatar', formData).then(response => {
        updateUser(response.data);
        addToast({
          type: 'success', title: 'Avatar atualizado!'
        })
      });
    }
  }, [addToast]);

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard"><FiArrowLeft /></Link>
        </div>
      </header>
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit} initialData={{
          name: user.name,
          email: user.email,
        }}>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <h1>Meu perfil</h1>
          <Input name="name" placeholder="Nome" icon={FiUser} />
          <Input name="email" placeholder="E-mail" icon={FiMail} />
          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            type="password"
            placeholder="Senha atual"
            icon={FiLock}
          />
          <Input
            name="password"
            type="password"
            placeholder="Nova senha"
            icon={FiLock}
          />
          <Input
            name="password_confirmation"
            type="password"
            placeholder="Confirmar senha"
            icon={FiLock}
          />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
