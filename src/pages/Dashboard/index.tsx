import React, { useCallback, useState } from 'react';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { Modifier, DayModifiers } from "react-day-picker";
import 'react-day-picker/lib/style.css';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment
} from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];

const WEEKDAY_NAMES = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const DISABLED_DAYS: (Modifier | Modifier[]) = [{
  daysOfWeek: [0, 6]
}]

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 06</span>
            <span>Segunda-feira</span>
          </p>
          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img
                src="https://avatars1.githubusercontent.com/u/17498851?s=460&u=cafa0799ff1932aff4f2d9a770126bee08759001&v=4"
                alt="João Giovanni"
              />
              <strong>João Giovanni</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>
          <Section>
            <strong>Manhã</strong>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img
                  src="https://avatars1.githubusercontent.com/u/17498851?s=460&u=cafa0799ff1932aff4f2d9a770126bee08759001&v=4"
                  alt="João Giovanni"
                />
                <strong>João Giovanni</strong>
              </div>
            </Appointment>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img
                  src="https://avatars1.githubusercontent.com/u/17498851?s=460&u=cafa0799ff1932aff4f2d9a770126bee08759001&v=4"
                  alt="João Giovanni"
                />
                <strong>João Giovanni</strong>
              </div>
            </Appointment>
          </Section>
          <Section>
            <strong>Tarde</strong>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img
                  src="https://avatars1.githubusercontent.com/u/17498851?s=460&u=cafa0799ff1932aff4f2d9a770126bee08759001&v=4"
                  alt="João Giovanni"
                />
                <strong>João Giovanni</strong>
              </div>
            </Appointment>
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={WEEKDAY_NAMES}
            months={MONTH_NAMES}
            fromMonth={new Date()}
            modifiers={{
              available: {
                daysOfWeek: [1, 2, 3, 4, 5]
              }
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            disabledDays={DISABLED_DAYS}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
