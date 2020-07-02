import styled from 'styled-components';
import { shade } from 'polished';
import signInBackgroundImg from '../../assets/sign-in-background.png';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  place-content: center;

  width: 100%;
  max-width: 700px;

  a {
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;
  }

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    input {
      & + input {
        margin-top: 8px;
      }
      color: #f3ede8;
      width: 100%;
      padding: 16px;
      background: #232129;
      border: 2px solid #232129;
      border-radius: 10px;

      &::placeholder {
        color: #666360;
      }
    }

    button {
      width: 100%;
      height: 56px;
      padding: 16px;
      background: #ff9000;
      border: 0;
      border-radius: 10px;
      color: #312e38;
      font-weight: 500;
      margin-top: 16px;
      transition: background-color 0.2s;

      &:hover {
        background: ${shade(0.2, '#ff9000')};
      }
    }
    a {
      color: #f3ede8;
      &:hover {
        color: ${shade(0.2, '#f3ede8')};
      }
    }
  }

  > a {
    color: #ff9000;
    display: flex;
    align-items: center;

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }

    svg {
      margin-right: 16px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signInBackgroundImg}) no-repeat center;
  background-size: cover;
`;
