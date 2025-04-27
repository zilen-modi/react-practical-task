/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { ClientRecord, SortConfig } from '../types';
import {
  parseJSON,
  removeDuplicatesByEmail,
  mergeRecords,
  filterRecords,
  sortRecords,
  isEmailUnique,
  generateUniqueId
} from '../utils/recordUtils';

const STORAGE_KEYS = {
  RECORDS: 'client_records',
  SORT_CONFIG: 'sort_config',
  ITEMS_PER_PAGE: 'items_per_page',
};

interface ClientContextType {
  records: ClientRecord[];
  filteredRecords: ClientRecord[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  sortConfig: SortConfig;
  uploadJSON: (jsonString: string) => void;
  addRecord: (record: Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecord: (id: string, record: Partial<ClientRecord>) => void;
  deleteRecord: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setSortConfig: (config: SortConfig) => void;
  checkEmailUnique: (email: string, currentId?: string) => boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};

interface ClientProviderProps {
  children: ReactNode;
}

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const ClientProvider = ({ children }: ClientProviderProps) => {
  const [records, setRecords] = useState<ClientRecord[]>(() => 
    getFromStorage<ClientRecord[]>(STORAGE_KEYS.RECORDS, [])
  );
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => 
    getFromStorage<number>(STORAGE_KEYS.ITEMS_PER_PAGE, 10)
  );
  
  const [sortConfig, setSortConfig] = useState<SortConfig>(() => 
    getFromStorage<SortConfig>(STORAGE_KEYS.SORT_CONFIG, {
      key: 'name',
      direction: 'asc',
    })
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RECORDS, records);
  }, [records]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SORT_CONFIG, sortConfig);
  }, [sortConfig]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ITEMS_PER_PAGE, itemsPerPage);
  }, [itemsPerPage]);

  const uploadJSON = useCallback((jsonString: string) => {
    try {
      const parsedRecords = parseJSON(jsonString);
      const uniqueRecords = removeDuplicatesByEmail(parsedRecords.records);
      
      setRecords(prevRecords => {
        if (prevRecords.length === 0) {
          return uniqueRecords;
        }
        const { records: mergedRecords } = mergeRecords(prevRecords, uniqueRecords);
        return mergedRecords;
      });
    } catch (error) {
      console.error('Error uploading JSON:', error);
    }
  }, []);

  const addRecord = useCallback((record: Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    setRecords(prevRecords => {
      const newId = generateUniqueId(prevRecords);
      const newRecord: ClientRecord = {
        ...record,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };
      return [...prevRecords, newRecord];
    });
  }, []);

  const updateRecord = useCallback((id: string, updatedFields: Partial<ClientRecord>) => {
    setRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === id
          ? {
              ...record,
              ...updatedFields,
              updatedAt: new Date().toISOString(),
            }
          : record
      )
    );
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
  }, []);

  const checkEmailUnique = useCallback(
    (email: string, currentId?: string) => {
      return isEmailUnique(email, records, currentId);
    },
    [records]
  );

  const sortedRecords = sortRecords(records, sortConfig.key, sortConfig.direction);
  const filteredRecords = filterRecords(sortedRecords, searchTerm);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  return (
    <ClientContext.Provider
      value={{
        records,
        filteredRecords,
        searchTerm,
        currentPage,
        itemsPerPage,
        totalPages,
        sortConfig,
        uploadJSON,
        addRecord,
        updateRecord,
        deleteRecord,
        setSearchTerm,
        setCurrentPage,
        setItemsPerPage,
        setSortConfig,
        checkEmailUnique,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}; 