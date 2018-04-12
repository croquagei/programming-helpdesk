import React from 'react';

const Header = () => {
  const renderTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes =
      now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`;
    return `${hours}:${minutes}`;
  };

  return (
    <header>
      <h1 className="header-panel">
        Programming Help Desk
        <span className="currentTime">{renderTime()}</span>
      </h1>
    </header>
  );
};

export default Header;
