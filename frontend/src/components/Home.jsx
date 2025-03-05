import React, { useEffect } from 'react';
import { TimelineLite } from 'gsap';
import { ReactTyped } from 'react-typed';

const Home = () => {
  useEffect(() => {
    const tl = new TimelineLite();

    tl.fromTo(
      "#welcomemessage",
      { y: '-100%', opacity: 0 },
      { y: '100%', opacity: 1, duration: 1.5, ease: "back.out(1.0)" },
    );

    tl.fromTo(
      "#datetimecard",
      { y: '-100%', opacity: 0 },
      { y: '50%', opacity: 1, duration: 1.5, ease: "back.out(1.0)" },
      "-=0.5"
    );
  }, []);

  return (

    <div className='flex flex-col justify-center items-center h-screen z-1 ' style={{ backgroundImage: "url('https://t3.ftcdn.net/jpg/03/55/60/70/360_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg')", backgroundSize: "cover" }}>
      <div className='mb-4'>
        <WelcomeMessage />
      </div>
      <div className='flex justify-center items-center mt-4'>
        <DateTimeCard />
      </div>
    </div>
  );
};

const WelcomeMessage = () => {
  return (
    <div id="welcomemessage" className="text-center opacity-0 ">
      <h1 className="text-2xl font-bold text-gray-800">Developed By{' '}
        <ReactTyped
          strings={['IITS', 'Integrated IT Solution']}
          typeSpeed={50}
          backSpeed={50}
          loop
          className=""
        />
      </h1> 
    </div>
  );
}

const DateTimeCard = () => {
  const [currentDateTime, setCurrentDateTime] = React.useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDateTime = currentDateTime.toLocaleString();

  return (
    <div id="datetimecard" className="opacity-0">
      <div className='bg-teal-800 w-64 rounded-lg'>
        <div className='p-4'>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Current Date & Time</h2>
            <p className="text-gray-600">{formattedDateTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
