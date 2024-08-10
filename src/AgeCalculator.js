import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';
import './AgeCalculator.css';

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState(null);
  const [nextBirthday, setNextBirthday] = useState(null);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let interval = null;
    if (birthDate) {
      interval = setInterval(() => {
        const calculatedAge = calculateAge(birthDate);
        if (calculatedAge) {
          setAge(calculatedAge);
        }
        setNextBirthday(calculateNextBirthday(birthDate));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [birthDate]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      setError('Date of birth cannot be in the future.');
      return null;
    }

    setError('');

    const ageInMilliseconds = today - birthDate;
    const years = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    const months = today.getMonth() - birthDate.getMonth() + (years * 12);
    const days = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));

    const remainingMonths = months % 12;
    const remainingDays = Math.floor(
      (ageInMilliseconds % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24)
    );

    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();

    return {
      years,
      months: remainingMonths,
      days: remainingDays,
      totalMonths: months,
      totalDays: days,
      hours,
      minutes,
      seconds
    };
  };

  const calculateNextBirthday = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (today > nextBirthday) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const timeUntilBirthday = nextBirthday - today;
    const days = Math.floor(timeUntilBirthday / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilBirthday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilBirthday % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeUntilBirthday % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (birthDate) {
      const calculatedAge = calculateAge(birthDate);
      if (calculatedAge) {
        setAge(calculatedAge);
      }
      setNextBirthday(calculateNextBirthday(birthDate));
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? 'light-mode' : 'dark-mode';
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center">Age Calculator</h2>
            <Button variant="secondary" onClick={toggleTheme}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="birthDate">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">
              Calculate Age
            </Button>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          {age && !error && (
            <Alert variant="info" className="mt-3">
              {new Date().toLocaleDateString() === new Date(birthDate).toLocaleDateString()
                ? 'Happy Birthday! 🎉'
                : ''}
              <div>Your age is:</div>
              <div>{age.years} years, {age.months} months, {age.days} days</div>
              <div>{age.hours} hours, {age.minutes} minutes, {age.seconds} seconds</div>
              <div>Total: {age.totalMonths} months, {age.totalDays} days</div>
            </Alert>
          )}
          {nextBirthday && (
            <Alert variant="success" className="mt-3">
              Next Birthday in: {nextBirthday.days} days, {nextBirthday.hours} hours, {nextBirthday.minutes} minutes, {nextBirthday.seconds} seconds
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AgeCalculator;
