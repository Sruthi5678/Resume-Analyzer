import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultAnalysisResult, mockUserProfile, sampleResumes } from '../data/mockData';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'resumeIQUser';
const ANALYSIS_STORAGE_KEY = 'resumeIQAnalysis';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Error parsing stored user:', e);
      return null;
    }
  });

  const [currentAnalysis, setCurrentAnalysis] = useState(() => {
    try {
      const savedAnalysis = localStorage.getItem(ANALYSIS_STORAGE_KEY);
      return savedAnalysis ? JSON.parse(savedAnalysis) : defaultAnalysisResult;
    } catch (e) {
      return defaultAnalysisResult;
    }
  });

  const [uploadedFile, setUploadedFile] = useState(null);

  // Sync analysis to localStorage whenever it changes
  useEffect(() => {
    if (currentAnalysis) {
      try {
        localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(currentAnalysis));
      } catch (e) {
        console.error('Failed to save analysis to localStorage:', e);
      }
    }
  }, [currentAnalysis]);

  const login = (email, password, rememberMe = true) => {
    const existingUser = user || mockUserProfile;
    const authenticatedUser = {
      ...existingUser,
      email: email || existingUser.email,
      name: existingUser.name || 'Alex Morgan',
      isLoggedIn: true,
      lastLogin: new Date().toISOString()
    };

    setUser(authenticatedUser);
    if (rememberMe) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
    }
    return authenticatedUser;
  };

  const demoLogin = () => {
    const demoUser = {
      ...mockUserProfile,
      isLoggedIn: true,
      lastLogin: new Date().toISOString()
    };
    setUser(demoUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
    return demoUser;
  };

  const signup = (fullName, email, password) => {
    const newUser = {
      ...mockUserProfile,
      name: fullName,
      email: email,
      isLoggedIn: true,
      joinedDate: 'Just now',
      stats: {
        resumesAnalyzed: 0,
        avgScore: 0,
        bestScore: 0,
        jobsMatched: 0
      },
      history: []
    };

    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setUploadedFile(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const loadSampleResume = (sampleId) => {
    const sample = sampleResumes.find((s) => s.id === sampleId) || sampleResumes[0];
    setUploadedFile({
      name: sample.name,
      size: sample.size,
      isSample: true,
      sampleData: sample.data
    });
    return sample;
  };

 const completeAnalysis = (customData = null) => {

  const dataToSave = customData || (
    uploadedFile?.sampleData
      ? uploadedFile.sampleData
      : {
          ...defaultAnalysisResult,
          resumeName:
            uploadedFile?.name ||
            defaultAnalysisResult.resumeName ||
            'Resume.pdf',

          fileSize:
            uploadedFile?.size ||
            defaultAnalysisResult.fileSize ||
            '',

          analyzedAt: 'Just now'
        }
  );

  // Make sure resumeName always exists
  const safeResumeName =
    dataToSave.resumeName ||
    uploadedFile?.name ||
    'Resume.pdf';

  // Make sure overallScore always exists
  const safeScore =
    Number(dataToSave.overallScore) ||
    0;

  // Create safe analysis data
  const safeDataToSave = {
    ...dataToSave,
    resumeName: safeResumeName,
    overallScore: safeScore,
    analyzedAt:
      dataToSave.analyzedAt || 'Just now'
  };

  // Save analysis
  setCurrentAnalysis(safeDataToSave);

  // Update user stats and history
  if (user) {

    const newHistoryItem = {
      id: 'hist-' + Date.now(),

      filename: safeResumeName,

      date: new Date().toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }
      ),

      score: safeScore,

      status:
        safeScore >= 80
          ? 'Excellent'
          : safeScore >= 70
          ? 'Good'
          : 'Needs Work',

      type:
        safeResumeName.includes('Lead')
          ? 'Frontend Lead'
          : 'Full Stack SE'
    };


    const updatedHistory = [
      newHistoryItem,
      ...(user.history || [])
    ];


    const scores = updatedHistory.map(
      (h) => Number(h.score) || 0
    );


    const avg = scores.length
      ? Math.round(
          scores.reduce((a, b) => a + b, 0) /
          scores.length
        )
      : 0;


    const best = scores.length
      ? Math.max(...scores)
      : 0;


    const updatedUser = {
      ...user,

      stats: {
        ...(user.stats || {}),

        resumesAnalyzed: updatedHistory.length,

        avgScore: avg,

        bestScore: best
      },

      history: updatedHistory
    };


    setUser(updatedUser);

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(updatedUser)
    );
  }


  return safeDataToSave;
};

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        demoLogin,
        signup,
        logout,
        updateProfile,
        uploadedFile,
        setUploadedFile,
        loadSampleResume,
        currentAnalysis,
        setCurrentAnalysis,
        completeAnalysis
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
