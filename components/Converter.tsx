import React from 'react';
import { useState } from 'react';

import PopupModal from './PopupModal';

interface CurrencyProps {
  nepaliCurrency: number | string;
  busdCurrency: number | string;
}

export default function Converter() {
  const [currency, setCurrency] = useState<CurrencyProps>({
    nepaliCurrency: '',
    busdCurrency: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;

    switch (e.target.id) {
      case 'NEP':
        setCurrency({
          nepaliCurrency: currentValue,
          busdCurrency: (parseFloat(currentValue) * 3).toFixed(2),
        });
        break;
      case 'BUSD':
        setCurrency({
          busdCurrency: currentValue,
          nepaliCurrency: (parseFloat(currentValue) / 3).toFixed(2),
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
              htmlFor="NEP"
              className="block text-xs font-medium text-gray-500"
            >
              NEP
            </label>
            <input
              id="NEP"
              type="number"
              className="focus:ring-gray-900 focus:border-gray-900 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
              value={currency.nepaliCurrency}
              placeholder="0.00"
              onChange={handleChange}
            />
          </div>

          <div className="py-3">
            <label
              htmlFor="BUSD"
              className="pb-1 block text-xs font-medium text-gray-500"
            >
              BUSD
            </label>
            <input
              id="BUSD"
              type="number"
              className="focus:ring-gray-900 focus:border-gray-900 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
              value={currency.busdCurrency}
              placeholder="0.00"
              onChange={handleChange}
            />
          </div>
        </form>
        <PopupModal />
      </div>
    </section>
  );
}
