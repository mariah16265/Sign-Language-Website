import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useApiErrorHandler,
  useCheckTokenValid,
} from '../utils/apiErrorHandler';
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
        const response = await fetch(
          'http://localhost:5000/api/signs/dictionary',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  const filteredSigns = allSigns
    .filter((sign) => {
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

        <div className="flex-1 flex justify-center items-start p-6 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full md:w-3/4 max-w-4xl"
          >
            {/* Centered main heading */}
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">
                Sign Dictionary
              </h2>
              <div className="w-24 h-1 bg-purple-500 rounded-full mx-auto"></div>
            </div>

            {/* Search and Dropdown */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 relative">
              <input
                type="text"
                placeholder="🔍 Search for a sign..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-4 w-full text-base border border-purple-500 rounded-xl shadow ring-1 ring-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              />

              <div className="relative w-full md:w-1/3 z-30" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="w-full p-4 text-base border border-purple-500 rounded-xl shadow bg-white text-gray-700 text-left flex justify-between items-center ring-1 ring-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
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
                          className={`px-4 py-3 cursor-pointer hover:bg-purple-100 text-base ${
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

            {/* Dictionary Table with colored entries */}
            {loading ? (
              <p className="text-center text-lg text-gray-500 py-10">
                Loading signs...
              </p>
            ) : filteredSigns.length === 0 ? (
              <p className="text-center text-lg text-gray-500 py-10">
                No matching signs found.
              </p>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-h-[650px] overflow-y-auto">
                <ul className="text-base">
                  {Object.keys(groupedSigns)
                    .sort()
                    .map((letter) => (
                      <div key={letter} className="relative">
                        {/* Section header */}
                        <div className="py-3 flex">
                          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-400 rounded-lg shadow-lg text-white text-xl font-bold ml-6">
                            {letter}
                          </div>
                        </div>

                        {groupedSigns[letter].map((sign, idx) => (
                          <motion.li
                            key={sign.title + idx}
                            onClick={() =>
                              navigate(
                                `/sign/${sign.subject}/${encodeURIComponent(
                                  sign.title
                                )}`
                              )
                            }
                            className="px-8 py-4 mx-4 mb-3 rounded-lg cursor-pointer transition text-lg font-medium text-gray-800"
                            style={{
                              background:
                                'linear-gradient(90deg, rgba(245, 243, 255, 0.8), rgba(250, 240, 255, 0.8))',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                              border: '1px solid rgba(200, 180, 255, 0.3)',
                            }}
                            whileHover={{
                              background:
                                'linear-gradient(90deg, rgba(235, 230, 255, 0.9), rgba(240, 220, 255, 0.9))',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                              scale: 1.02,
                              transition: { duration: 0.2 },
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.01 }}
                          >
                            <div className="flex items-center">
                              <span className="ml-4">{sign.title}</span>
                            </div>
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
