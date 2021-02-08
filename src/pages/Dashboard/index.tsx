import 'react-day-picker/lib/style.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { DayModifiers, Modifier } from 'react-day-picker';
import { isToday, format, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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
  Appointment,
} from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/apiClient';
import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';

interface MonthAvailability {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  parsedDate: Date;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
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
  'Dezembro',
];

const WEEKDAY_NAMES = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const DEFAULT_DISABLED_DAYS: Modifier[] = [
  { before: new Date() },
  { daysOfWeek: [0, 6] },
];

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAppointments([]);
      api
        .get<Appointment[]>(`/appointments/me`, {
          params: {
            day: selectedDate.getDate(),
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
          },
        })
        .then(response => {
          const appointmentsFormatted = response.data.map(appointment => {
            appointment.parsedDate = parseISO(appointment.date);
            appointment.hourFormatted = format(appointment.parsedDate, 'HH:mm');
            return appointment;
          });
          setAppointments(appointmentsFormatted);
        });
    }, 1000);
    return () => clearInterval(timeout);
  }, [user.id, setAppointments, selectedDate]);

  const selectedDateAsText = useMemo(
    () =>
      format(selectedDate, "'Dia ' dd 'de' MMMM", {
        locale: ptBR,
      }),
    [selectedDate],
  );

  const selectedWeekDay = useMemo(
    () =>
      format(selectedDate, 'cccc', {
        locale: ptBR,
      }),
    [selectedDate],
  );

  const morningAppointments = useMemo(
    () =>
      appointments.filter(appointment => {
        return appointment.parsedDate.getHours() < 12;
      }),
    [appointments],
  );

  const afternoonAppointments = useMemo(
    () =>
      appointments.filter(appointment => {
        return appointment.parsedDate.getHours() >= 12;
      }),
    [appointments],
  );

  const nextAppointment = useMemo(
    () =>
      appointments.find(appointment =>
        isAfter(appointment.parsedDate, new Date()),
      ),
    [appointments],
  );

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
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
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>
          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}
          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento para nesse período</p>
            )}
            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento para nesse período</p>
            )}
            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={WEEKDAY_NAMES}
            months={MONTH_NAMES}
            fromMonth={new Date()}
            modifiers={{
              available: {
                daysOfWeek: [1, 2, 3, 4, 5],
              },
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            disabledDays={DEFAULT_DISABLED_DAYS}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
