import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const options: ApexOptions = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#3C50E0', '#FF5733'], // Choisir des couleurs appropriées
  labels: ['Actifs', 'Non Actifs'], // Modifier les labels pour refléter les correcteurs
  legend: {
    show: true, // Afficher la légende
    position: 'bottom',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree: React.FC = () => {
  const [series, setSeries] = useState<number[]>([0, 0]); // Initialiser avec 0 pour actifs et non actifs
  const [loading, setLoading] = useState<boolean>(true); // État pour le chargement

  const fetchStats = async (session: number) => {
    try {
      const response = await axios.post('http://localhost:3000/api/correcteur/comptage', {
        session: session,
      });
      setSeries([response.data.actifs, response.data.nonActifs]); // Mettre à jour les séries
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques :", error);
    } finally {
      setLoading(false);
    }
  };

  const currentSession = new Date().getFullYear(); // Obtenir l'année actuelle
  useEffect(() => {
    fetchStats(currentSession); // Appeler la fonction avec l'année actuelle
  }, []); // Exécuter une seule fois lors du chargement du composant

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-13 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Statistiques des Correcteurs - Session: <span className='text-primary'>{currentSession}</span>
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          {loading ? (
            <p>Chargement...</p> // Message de chargement
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
            />
          )}
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Actifs :
              <span className='mx-6 text-primary'> {series[0]} </span>
              </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#FF5733]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Non Actifs :
              <span className='mx-6 text-[#FF5433]'> {series[1]} </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
