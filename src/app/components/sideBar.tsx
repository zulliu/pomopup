import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faBagShopping, faClipboard, faBook, faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import LogList from './logList';
import ItemIndex from './itemIndex';
import Shop from './shop';
import {
  useGlobalState,
} from '../globalContext';

function CustomButton({
  icon, onClick, primary = false, transparent = false,
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center mx-12 text-3xl tracking-widest font-semibold relative "
      onClick={onClick}
    >
      <div className={`w-16 h-16 flex z-20 items-center justify-center rounded-2xl ${transparent ? '' : 'border-8'}`}>
        <FontAwesomeIcon icon={icon} className={`${primary ? 'text-primary' : 'text-yellow'} text-4xl hover:text-dark`} />
      </div>
      <div
        className={`z-10 rounded-lg ${primary ? 'w-7 h-7 bg-yellow end-3 bottom-3' : 'w-10 h-10 bg-primary end-1 bottom-1'}`}
        style={{
          position: 'absolute',

        }}
      />
    </button>
  );
}

function SideBar({ setIsLoggedIn }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogList, setShowLogList] = useState(false);
  const [showItemIndex, setShowItemIndex] = useState(false);
  const [showShop, setShowShop] = useState(false);

  const handleLogout = () => {
    Cookies.remove('userId');
    setIsLoggedIn(false);
  };

  return (
    <div className="h-full flex flex-col justify-end items-center space-y-6 pb-4">
      <div className="relative">
        { showShop && (
        <div className="absolute left-full top-0 z-20 ">
          <Shop onClose={() => setShowShop(false)} />
        </div>
        )}
        { showLogList && (
        <div className="absolute left-full top-0 z-20 ">
          <LogList onClose={() => setShowLogList(false)} />
        </div>
        )}
        { showItemIndex && (
        <div className="absolute left-full top-0 z-20 ">
          <ItemIndex onClose={() => setShowItemIndex(false)} />
        </div>
        )}
      </div>

      {isExpanded && (
        <div className="h-5/12 bg-white w-4/5 rounded-lg flex flex-col items-center space-y-6 py-4">
          <CustomButton
            icon={faBagShopping}
            onClick={() => {
              setShowShop(!showShop);
              setShowItemIndex(false);
              setShowLogList(false);
            }}
            primary
            transparent
          />
          <CustomButton
            icon={faClipboard}
            onClick={() => {
              setShowLogList(!showLogList);
              setShowItemIndex(false);
              setShowShop(false);
            }}
            primary
            transparent
          />

          <CustomButton
            icon={faBook}
            onClick={() => {
              setShowItemIndex(!showItemIndex);
              setShowLogList(false);
              setShowShop(false);
            }}
            primary
            transparent
          />
          <CustomButton icon={faArrowRightFromBracket} onClick={handleLogout} primary transparent />
        </div>
      )}
      <CustomButton icon={faHome} onClick={() => setIsExpanded(!isExpanded)} />
    </div>
  );
}

export default SideBar;
