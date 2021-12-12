import { Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { formatEther } from '@ethersproject/units';
import { Injected } from './Connectors';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { Spinner } from './utils/Spinner';
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';

export default function PopupModal() {
  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef(null);

  const { active, account, library, activate, deactivate, chainId, error } =
    useWeb3React();

  async function connect() {
    try {
      await activate(Injected);
    } catch (err) {
      console.log(err);
    }
  }

  async function disconnect() {
    deactivate();
  }

  function getErrorMessage(error: Error) {
    if (error instanceof NoEthereumProviderError) {
      return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
    } else if (error instanceof UnsupportedChainIdError) {
      return "You're connected to an unsupported network.";
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect ||
      error instanceof UserRejectedRequestErrorFrame
    ) {
      return 'Please authorize this website to access your Ethereum account.';
    } else {
      return 'An unknown error occurred. Check the console for more details.';
    }
  }

  function Account() {
    return (
      <span>
        {account === null
          ? '-'
          : account
          ? `${account.substring(0, 4)}...${account.substring(
              account.length - 4
            )}`
          : ''}
      </span>
    );
  }

  function Balance() {
    const [balance, setBalance] = useState<string | undefined>(undefined);

    useEffect((): any => {
      if (!!account && !!library) {
        let stale = false;

        library.eth
          .getBalance(account)
          .then((balance: any) => {
            if (!stale) {
              setBalance(balance);
            }
          })
          .catch(() => {
            if (!stale) {
              setBalance(undefined);
            }
          });

        return () => {
          stale = true;
          setBalance(undefined);
        };
      }
    }, []);

    return (
      <span>
        {balance === null ? (
          'Error'
        ) : balance ? (
          `Ξ ${formatEther(balance)}`
        ) : (
          <Spinner color="violet" />
        )}
      </span>
    );
  }

  return (
    <Fragment>
      <p
        className="text-center text-sm py-5 text-indigo-600 cursor-pointer hover:underline hover:text-indigo-900"
        onClick={() => setOpen(true)}
      >
        Check Wallet Details
      </p>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <div className="flex items-center mt-8 sm:mt-0 sm:items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span
              aria-hidden="true"
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Wallet details
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="mt-2">
                    {!!error ? (
                      <p className="text-sm text-gray-500 sm:pl-4">
                        {getErrorMessage(error)}
                      </p>
                    ) : (
                      <>
                        {!active ? (
                          <p className="text-sm text-gray-500 sm:pl-4">
                            Wallet not connected. Please click the &apos;Connect
                            Now&apos; button below.
                          </p>
                        ) : (
                          <table className="w-full divide-y">
                            <thead>
                              <tr>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  scope="col"
                                >
                                  Key
                                </th>
                                <th
                                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  scope="col"
                                >
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-500">
                                  Account
                                </td>
                                <td className="px-6 py-4 text-right text-sm whitespace-nowrap font-medium text-gray-500">
                                  {account ? (
                                    <Account />
                                  ) : (
                                    <Spinner color="violet" />
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-500">
                                  Chain ID
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap font-medium text-sm text-gray-500">
                                  {chainId ? (
                                    chainId
                                  ) : (
                                    <Spinner color="violet" />
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-500">
                                  Balance
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end items-end whitespace-nowrap font-medium text-sm text-gray-500">
                                  {active && <Balance />}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}

                        {!active && (
                          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => setOpen(false)}
                              ref={cancelButtonRef}
                              type="button"
                            >
                              Cancel
                            </button>

                            <button
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm mt-2 sm:mt-0 px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => {
                                connect();
                              }}
                              type="button"
                            >
                              Connect Now
                            </button>
                          </div>
                        )}

                        {active && (
                          <div className="flex justify-center">
                            <p className="px-6 py-4 whitespace-nowrap font-small text-sm text-gray-500">
                              Wallet Details
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {(active || error) && (
                  <div className="flex items-center justify-center py-3">
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        disconnect();
                      }}
                      type="button"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  );
}
