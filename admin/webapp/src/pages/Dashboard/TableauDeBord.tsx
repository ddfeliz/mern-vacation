import React, { useEffect, useState } from 'react';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import TablePayment from '../Administrateur/Vacation/CorrecteurVacation/TablePayment';
import CardDataStats from '../../components/CardDataStats';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const TableauDeBord: React.FC = () => {
  const [totalCorrecteurs, setTotalCorrecteurs] = useState('0');
  const [totalPayments, setTotalPayments] = useState('0');
  const [totalVacations, setTotalVacations] = useState('0');
  const [totalArchives, setTotalArchives] = useState('0');

  const fetchCorrecteursCount = async () => {
    try {
      const response = await axios.get(
        'https://gestion-vacation.onrender.com/api/correcteur/count',
      );
      setTotalCorrecteurs(response.data.totalCorrecteurs.toString());
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPaymentsCount = async () => {
    try {
      const responsePayment = await axios.get(
        'https://gestion-vacation.onrender.com/api/payment/count',
      );
      setTotalPayments(responsePayment.data.totalPayments.toString());
    } catch (err) {
      console.log(err);
    }
  };

  const fetchArchiveCount = async () => {
    try {
      const responseArchive = await axios.get(
        'https://gestion-vacation.onrender.com/api/archive/count',
      );
      setTotalArchives(responseArchive.data.totalArchives.toString());
    } catch (err) {
      console.log(err);
    }
  };

  const fetchVacationCount = async () => {
    try {
      const responseVacation = await axios.get(
        'https://gestion-vacation.onrender.com/api/vacation/count',
      );
      setTotalVacations(responseVacation.data.totalVacation.toString());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCorrecteursCount();
    fetchPaymentsCount();
    fetchVacationCount();
    fetchArchiveCount();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-4">
        <NavLink to="correcteur">
          <CardDataStats
            title="Nombre totale des correcteurs"
            titleColor="#007BFF"
            total={totalCorrecteurs}
          >
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                fill=""
              />
              <path
                d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                fill=""
              />
              <path
                d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                fill=""
              />
            </svg>
          </CardDataStats>
        </NavLink>
        <NavLink to="vacation">
          <CardDataStats
            title="Total des correcteurs vacataires"
            titleColor="#007BFF"
            total={totalVacations}
          >
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2ZM12 10C9.79086 10 8 11.7909 8 14V18C8 18.5523 8.44772 19 9 19H15C15.5523 19 16 18.5523 16 18V14C16 11.7909 14.2091 10 12 10Z"
                fill=""
              />

              <path
                d="M18 8H6C5.44772 8 5 8.44772 5 9V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V9C19 8.44772 18.5523 8 18 8ZM7 10H17V12H7V10ZM7 14H14V16H7V14Z"
                fill=""
              />
            </svg>
          </CardDataStats>
        </NavLink>
        <NavLink to="paiement-liste">
          <CardDataStats
            title="Totale des paiements du correcteur"
            titleColor="#007BFF"
            total={totalPayments}
          >
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2ZM12 10C9.79086 10 8 11.7909 8 14V18C8 18.5523 8.44772 19 9 19H15C15.5523 19 16 18.5523 16 18V14C16 11.7909 14.2091 10 12 10Z"
                fill=""
              />

              <path
                d="M18 12C16.3431 12 15 13.3431 15 15C15 16.6569 16.3431 18 18 18C19.6569 18 21 16.6569 21 15C21 13.3431 19.6569 12 18 12ZM18 16C17.4477 16 17 15.5523 17 15C17 14.4477 17.4477 14 18 14C18.5523 14 19 14.4477 19 15C19 15.5523 18.5523 16 18 16Z"
                fill=""
              />
            </svg>
          </CardDataStats>
        </NavLink>
        <NavLink to="archivage-paiement">
          <CardDataStats
            title="Totale des paiements du correcteur Archivé"
            titleColor="#007BFF"
            total={totalArchives}
          >
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 2H4C3.44772 2 3 2.44772 3 3V5C3 5.55228 3.44772 6 4 6H20C20.5523 6 21 5.55228 21 5V3C21 2.44772 20.5523 2 20 2Z"
                fill=""
              />
              <path
                d="M6 8V20C6 20.5523 6.44772 21 7 21H17C17.5523 21 18 20.5523 18 20V8H6Z"
                fill=""
              />
              <path d="M9 11H15V13H9V11Z" fill="" />
            </svg>
          </CardDataStats>
        </NavLink>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-6">
          {/* 6 colonnes sur 12, soit la moitié */}
          <ChartThree />
        </div>
        <div className="col-span-12 md:col-span-6">
          {/* 6 colonnes sur 12, soit la moitié */}
          <ChartTwo />
        </div>
        <div className="col-span-12 xl:col-span-12">
          <TablePayment />
        </div>
      </div>
    </>
  );
};

export default TableauDeBord;
