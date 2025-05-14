import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useApiErrorHandler, useCheckTokenValid } from '../utils/apiErrorHandler';
import { useNavigate } from 'react-router-dom';

const subjects = ['English', 'Arabic'];

const SignDictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('English');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signData, setSignData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const sectionRefs = useRef({});
  const navigate = useNavigate();

  const { handleApiError } = useApiErrorHandler();
  const { checkTokenValid } = useCheckTokenValid();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!checkTokenValid()) return;
  }, []);

  useEffect(() => {
    const fetchSigns = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/signs/dictionary', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSignData(data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSigns();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allSigns = signData.flatMap((group) =>
    group.signs.map((sign) => ({
      title: sign.title,
      subject: group.subject,
    }))
  );

  const filteredSigns = allSigns.filter((sign) => {
    const matchesSubject = sign.subject === subjectFilter;
    const matchesSearch = sign.title
    .toLowerCase()
    .startsWith(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  })
    .sort((a, b) => a.title.localeCompare(b.title));

  const groupedSigns = filteredSigns.reduce((acc, sign) => {
    const firstChar = sign.title[0].toUpperCase();
    acc[firstChar] = acc[firstChar] || [];
    acc[firstChar].push(sign);
    return acc;
  }, {});

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 
        'linear-gradient(-180deg, rgba(255, 229, 202, 0.9), rgba(255, 206, 250, 0.9))',
        color: '#333',
      }}
    >
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar />
        
        <div className="flex-1 flex justify-center items-start p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full md:w-7/12" // Change to w-3/4 for 3/4 width on medium and larger screens
          >

            <h2 className="text-6xl font-extrabold text-gray-800 mb-6 text-center">
                📙 Sign Dictionary
              </h2>

            {/* Search and Dropdown */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
              <input
                type="text"
                placeholder="🔍 Search for a sign..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 w-full text-base border border-purple-500 ring-2 rounded-xl shadow ring-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              />

            <div className="relative w-full md:w-1/3 z-30" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="w-full p-3 text-base border border-purple-500 rounded-xl shadow bg-white text-gray-700 text-left flex justify-between items-center ring-2 ring-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                >
                  {subjectFilter}
                  <span className="ml-2 text-gray-500">▼</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                    >
                      {subjects.map((subject) => (
                        <li
                          key={subject}
                          onClick={() => {
                            setSubjectFilter(subject);
                            setDropdownOpen(false);
                          }}
                          className={`px-4 py-2 cursor-pointer hover:bg-purple-100 text-base ${
                            subject === subjectFilter 
                            ? 'bg-purple-50 font-semibold text-purple-700' 
                            : ''
                          }`}
                        >
                          {subject}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Dictionary Table */}
            {loading ? (
              <p className="text-center text-lg text-gray-500">Loading...</p>
            ) : filteredSigns.length === 0 ? (
              <p className="text-center text-lg text-gray-500">
                No matching signs found.
              </p>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-h-[650px] overflow-y-auto">
                <ul className="divide-y divide-gray-100 text-base">
                    {Object.keys(groupedSigns).sort().map((letter) => (
                    <div key={letter}>
                      <li className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-300 text-white text-xl font-bold sticky top-0 z-10 shadow">
                        {letter}
                      </li>
                      {groupedSigns[letter].map((sign, idx) => (
                        <motion.li
                          key={sign.title + idx}
                          onClick={() =>
                            navigate(`/sign/${sign.subject}/${encodeURIComponent(sign.title)}`)
                          }
                          className="px-6 py-5 hover:bg-purple-100 cursor-pointer transition text-lg md:text-l font-medium text-gray-800"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.01 }}
                      >
                          {sign.title}
                      </motion.li>

                      ))}
                  </div>
                  ))}
                </ul>
              </div>            
            )}
          </motion.div>
         </div>
      </div>
    </div>
  );
};

export default SignDictionary;
