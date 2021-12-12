import React from 'react';
import { useState } from 'react';

import PopupModal from './PopupModal';

interface CurrencyProps {
  busd: number | string;
  nepali: number | string;
}

export default function Converter() {
  const [currency, setCurrency] = useState<CurrencyProps>({
    busd: '',
    nepali: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;

    switch (e.target.id) {
      case 'NEP':
        setCurrency({
          nepali: currentValue,
          busd: (parseFloat(currentValue) * 3).toFixed(2),
        });
        break;
      case 'BUSD':
        setCurrency({
          busd: currentValue,
          nepali: (parseFloat(currentValue) / 3).toFixed(2),
        });
        break;
      default:
        break;
    }
  };

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="w-5/6 h-auto sm:w-1/3 xl:w-1/4 bg-white rounded-lg p-7">
        <h2 className="text-gray-700 font-bold">Crypto converter</h2>
        <form>
          <div className="py-3">
            <label
              className="block text-xs font-medium text-gray-500"
              htmlFor="NEP"
            >
              NEP
            </label>
            <input
              className="focus:ring-gray-900 focus:border-gray-300 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
              id="NEP"
              onChange={handleChange}
              placeholder="0.00"
              type="number"
              value={currency.nepali}
            />
          </div>

          <div className="py-3">
            <label
              className="pb-1 block text-xs font-medium text-gray-500"
              htmlFor="BUSD"
            >
              BUSD
            </label>
            <input
              className="focus:ring-gray-900 focus:border-gray-300 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
              id="BUSD"
              onChange={handleChange}
              placeholder="0.00"
              type="number"
              value={currency.busd}
            />
          </div>
        </form>
        <PopupModal />
      </div>
    </section>
  );
}
