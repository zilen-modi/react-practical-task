import { ClientRecord } from '../types';

export const generateId = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const isIdUnique = (id: string, records: ClientRecord[]): boolean => {
  return !records.some(record => record.id === id);
};

export const generateUniqueId = (records: ClientRecord[]): string => {
  let id = generateId();
  while (!isIdUnique(id, records)) {
    id = generateId();
  }
  return id;
};

const validateRecord = (record: ClientRecord): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!record.name || typeof record.name !== 'string' || record.name.trim() === '') {
    errors.push('Name is required');
  }

  if (!record.email || typeof record.email !== 'string' || record.email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const parseJSON = (
  jsonString: string
): {
  records: ClientRecord[];
  errors: { record: unknown; errors: string[] }[];
  duplicates: number;
} => {
  try {
    const parsedData = JSON.parse(jsonString);
    const records: ClientRecord[] = [];
    const errors: { record: unknown; errors: string[] }[] = [];
    const duplicates = 0;

    if (!Array.isArray(parsedData)) {
      throw new Error('JSON data must be an array');
    }

    parsedData.forEach(item => {
      const validation = validateRecord(item);

      if (!validation.isValid) {
        errors.push({
          record: item,
          errors: validation.errors,
        });
        return;
      }

      const now = new Date().toISOString();
      const processedRecord: ClientRecord = {
        id: item.id || generateId(),
        name: item.name.trim(),
        email: item.email.trim().toLowerCase(),
        phone: item.phone || '',
        address: item.address || '',
        company: item.company || '',
        notes: item.notes || '',
        createdAt: item.createdAt || now,
        updatedAt: item.updatedAt || now,
      };

      records.push(processedRecord);
    });

    return {
      records,
      errors,
      duplicates,
    };
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return {
      records: [],
      errors: [
        {
          record: null,
          errors: ['Invalid JSON format'],
        },
      ],
      duplicates: 0,
    };
  }
};

export const removeDuplicatesByEmail = (records: ClientRecord[]): ClientRecord[] => {
  const uniqueEmails = new Set<string>();
  return records.filter(record => {
    if (uniqueEmails.has(record.email.toLowerCase())) {
      return false;
    }
    uniqueEmails.add(record.email.toLowerCase());
    return true;
  });
};

export const mergeRecords = (
  existingRecords: ClientRecord[],
  newRecords: ClientRecord[]
): {
  records: ClientRecord[];
  mergedCount: number;
} => {
  const emailMap = new Map<string, ClientRecord>();
  let mergedCount = 0;

  existingRecords.forEach(record => {
    emailMap.set(record.email.toLowerCase(), record);
  });

  newRecords.forEach(newRecord => {
    const email = newRecord.email.toLowerCase();
    const existingRecord = emailMap.get(email);

    if (existingRecord) {
      const merged = {
        ...existingRecord,
        name: newRecord.name || existingRecord.name,
        phone: newRecord.phone || existingRecord.phone,
        address: newRecord.address || existingRecord.address,
        company: newRecord.company || existingRecord.company,
        notes: newRecord.notes || existingRecord.notes,
        updatedAt: new Date().toISOString(),
      };
      emailMap.set(email, merged);
      mergedCount++;
    } else {
      emailMap.set(email, newRecord);
    }
  });

  return {
    records: Array.from(emailMap.values()),
    mergedCount,
  };
};

export const filterRecords = (records: ClientRecord[], searchTerm: string): ClientRecord[] => {
  if (!searchTerm) return records;

  const term = searchTerm.toLowerCase().trim();
  return records.filter(record => {
    const id = String(record.id || '');
    const name = (record.name || '').toLowerCase();
    const email = (record.email || '').toLowerCase();

    return id.includes(term) || name.includes(term) || email.includes(term);
  });
};

export const sortRecords = (
  records: ClientRecord[],
  sortKey: keyof ClientRecord,
  sortDirection: 'asc' | 'desc'
): ClientRecord[] => {
  return [...records].sort((a, b) => {
    const valueA = String(a[sortKey] || '').toLowerCase();
    const valueB = String(b[sortKey] || '').toLowerCase();

    const comparison = valueA.localeCompare(valueB);
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};

export const isEmailUnique = (
  email: string,
  records: ClientRecord[],
  currentId?: string
): boolean => {
  return !records.some(
    record => record.email.toLowerCase() === email.toLowerCase() && record.id !== currentId
  );
};
