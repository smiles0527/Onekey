import React from 'react';

const Squiggles: React.FC = () => {
  return (
    <div className="squiggles-container">
      {/* Floating Musical Notes */}
      <div className="floating-notes">
        <div className="note note-1">♪</div>
        <div className="note note-2">♫</div>
        <div className="note note-3">♬</div>
        <div className="note note-4">♩</div>
        <div className="note note-5">♪</div>
        <div className="note note-6">♫</div>
        <div className="note note-7">♬</div>
        <div className="note note-8">♩</div>
      </div>
      
      {/* Background Pattern Elements */}
      <div className="background-pattern">
        <div className="pattern-circle circle-1"></div>
        <div className="pattern-circle circle-2"></div>
        <div className="pattern-circle circle-3"></div>
        <div className="pattern-line line-1"></div>
        <div className="pattern-line line-2"></div>
        <div className="pattern-line line-3"></div>
      </div>
      
      {/* Decorative Flourishes */}
      <div className="decorative-elements">
        <div className="flourish flourish-1"></div>
        <div className="flourish flourish-2"></div>
        <div className="flourish flourish-3"></div>
        <div className="flourish flourish-4"></div>
      </div>
    </div>
  );
};

export default Squiggles; 