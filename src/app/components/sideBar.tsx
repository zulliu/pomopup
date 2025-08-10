import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faBagShopping, faClipboard, faBook, faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useAppActions } from '../contexts/AppContext';
import LogList from './logList';
import ItemIndex from './itemIndex';
import Shop from './shop';

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

interface SideBarProps {
  mobile?: boolean;
}

function SideBar({ mobile = false }: SideBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogList, setShowLogList] = useState(false);
  const [showItemIndex, setShowItemIndex] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const { logout } = useAppActions();

  const handleLogout = () => {
    logout();
  };

  // Mobile layout - horizontal with proper colors
  if (mobile) {
    return (
      <div className="flex justify-center items-center gap-3">
        <button
          onClick={() => setShowShop(!showShop)}
          className="p-2 bg-primary hover:bg-dark active:bg-dark rounded-lg transition-colors"
          style={{ boxShadow: '0 0.2rem #A3869C' }}
        >
          <FontAwesomeIcon icon={faBagShopping} className="text-white text-lg" />
        </button>
        <button
          onClick={() => setShowLogList(!showLogList)}
          className="p-2 bg-primary hover:bg-dark active:bg-dark rounded-lg transition-colors"
          style={{ boxShadow: '0 0.2rem #A3869C' }}
        >
          <FontAwesomeIcon icon={faClipboard} className="text-white text-lg" />
        </button>
        <button
          onClick={() => setShowItemIndex(!showItemIndex)}
          className="p-2 bg-primary hover:bg-dark active:bg-dark rounded-lg transition-colors"
          style={{ boxShadow: '0 0.2rem #A3869C' }}
        >
          <FontAwesomeIcon icon={faBook} className="text-white text-lg" />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 bg-red rounded-lg transition-colors"
          style={{ boxShadow: '0 0.2rem #b85c50' }}
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-white text-lg" />
        </button>
        
        {/* Mobile Modals */}
        {showShop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-4 rounded-lg max-w-sm w-full max-h-[80vh] overflow-y-auto">
              <Shop onClose={() => setShowShop(false)} />
            </div>
          </div>
        )}
        {showLogList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-4 rounded-lg max-w-sm w-full max-h-[80vh] overflow-y-auto">
              <LogList onClose={() => setShowLogList(false)} />
            </div>
          </div>
        )}
        {showItemIndex && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-4 rounded-lg max-w-sm w-full max-h-[80vh] overflow-y-auto">
              <ItemIndex onClose={() => setShowItemIndex(false)} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop layout - vertical
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
