import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { DayModifiers, Modifier } from "react-day-picker";
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
import api from '../../services/apiClient';

interface MonthAvailability {
  day: number;
  available: boolean;
}

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

const DEFAULT_DISABLED_DAYS: Modifier[] = [{ before: new Date() }, { daysOfWeek: [0, 6] }];

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailability[]>([]);

  const { signOut, user } = useAuth();

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      api.get<MonthAvailability[]>(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      }).then(response => {
        setMonthAvailability(response.data);
      })
    }, 1000);
    return () => clearInterval(timeout);
  }, [user.id, currentMonth]);

  const disabledDays = useMemo(() => monthAvailability.filter(monthDay => !monthDay.available).map(monthDay => {
    const date = new Date();
    date.setMonth(currentMonth.getMonth());
    date.setDate(monthDay.day);
    return date;
  }), [currentMonth, monthAvailability]);

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
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            disabledDays={[...DEFAULT_DISABLED_DAYS, ...disabledDays]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
