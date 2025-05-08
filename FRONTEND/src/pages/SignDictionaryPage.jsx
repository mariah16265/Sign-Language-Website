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
  });

  const groupedSigns = filteredSigns.reduce((acc, sign) => {
    const firstLetter = sign.title[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(sign);
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
        <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                📙 Sign Dictionary
              </h2>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 relative">
              <input
                type="text"
                placeholder="🔍 Search for a sign..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 text-base border border-purple-500 ring-2 rounded-xl shadow ring-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 md:basis-3/4 transition"
              />

                <div className="relative md:basis-1/4 z-20" ref={dropdownRef}>
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
                    className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-30"
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

            {loading ? (
              <p className="text-center text-lg text-gray-500">Loading...</p>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl overflow-x-auto border border-gray-200 max-h-[650px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 text-base">
                  <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
                    <tr>
                      <th 
                        scope="col"
                        className="px-6 py-4 text-left font-bold text-purple-700 uppercase tracking-wide"
                      >
                        Sign
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {Object.keys(groupedSigns).sort().map((letter) => (
                        <React.Fragment key={letter}>
                          <motion.tr
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <td
                              colSpan="1"
                              className="bg-purple-100 px-6 py-3 text-lg font-bold text-purple-700 sticky top-0 z-10"
                            >
                              {letter}
                            </td>
                          </motion.tr>
                          {groupedSigns[letter].map((sign, idx) => (
                            <motion.tr
                              key={sign.title + idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                              onClick={() =>
                                navigate(`/sign/${sign.subject}/${encodeURIComponent(sign.title)}`)
                              }
                              className="hover:bg-purple-50 cursor-pointer transition"
                            >
                              <td className="px-6 py-4 font-medium text-purple-800">{sign.title}</td>
                            </motion.tr>
                          ))}
                        </React.Fragment>
                      ))}

                      {filteredSigns.length === 0 && (
                        <motion.tr
                          key="no-results"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <td colSpan="1" className="px-6 py-5 text-center text-gray-500">
                            No matching signs found.
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </tbody>


                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignDictionary;
