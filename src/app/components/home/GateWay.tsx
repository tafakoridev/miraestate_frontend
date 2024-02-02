// components/GateWay.tsx

import React from 'react';

const GateWay: React.FC = () => {
  return (
    <div className="flex  justify-between gap-2 my-1">
      <GatewayButton title="درگاه بانکی" disabled={1} />
      <GatewayButton title="بارگذاری فیش" disabled={1}/>
      <GatewayButton title="کیف پول" disabled={0}/>
    </div>
  );
};

interface GatewayButtonProps {
  title: string;
  disabled: number;
}

const GatewayButton: React.FC<GatewayButtonProps> = ({ title, disabled }: any) => {
  return (
    <button
      className={`${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500' } w-20 h-20  text-white rounded-md`}
      // Add any additional styles or onClick handler as needed
    >
      {title}
    </button>
  );
};

export default GateWay;
